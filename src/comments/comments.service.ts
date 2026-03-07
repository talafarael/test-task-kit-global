import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, type CommentDocument } from './schemas/comment.schema';
import type { CreateCommentDto } from './dto/create-comment.dto';
import type { UpdateCommentDto } from './dto/update-comment.dto';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @Inject(forwardRef(() => TasksService))
    private readonly tasksService: TasksService,
  ) {}

  async findAll(taskId: string, userId: string): Promise<CommentDocument[]> {
    await this.tasksService.findOne(taskId, userId);
    return this.commentModel
      .find({ task: new Types.ObjectId(taskId) })
      .sort({ createdAt: 1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.tasksService.findOne(comment.task.toString(), userId);
    return comment;
  }

  async create(
    dto: CreateCommentDto,
    userId: string,
  ): Promise<CommentDocument> {
    await this.tasksService.findOne(dto.task, userId);
    const comment = new this.commentModel({
      content: dto.content,
      task: new Types.ObjectId(dto.task),
      author: new Types.ObjectId(userId),
    });
    return comment.save();
  }

  async update(
    id: string,
    dto: UpdateCommentDto,
    userId: string,
  ): Promise<CommentDocument> {
    const comment = await this.assertCommentAuthor(id, userId);
    Object.assign(comment, dto);
    return comment.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.assertCommentAuthor(id, userId);
    await this.commentModel.findByIdAndDelete(id).exec();
  }

  async removeByTaskId(taskId: string): Promise<void> {
    await this.commentModel
      .deleteMany({ task: new Types.ObjectId(taskId) })
      .exec();
  }

  async removeByTaskIds(taskIds: Types.ObjectId[]): Promise<void> {
    if (taskIds.length === 0) return;
    await this.commentModel.deleteMany({ task: { $in: taskIds } }).exec();
  }

  private async assertCommentAuthor(
    id: string,
    userId: string,
  ): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.author.toString() !== userId) {
      throw new ForbiddenException('Only author can edit comment');
    }
    return comment;
  }
}
