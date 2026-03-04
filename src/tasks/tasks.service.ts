import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, type TaskDocument } from './schemas/task.schema';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';
import type { QueryTaskDto } from './dto/query-task.dto';
import { ProjectsService } from '../projects/projects.service';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    private readonly projectsService: ProjectsService,
    private readonly tagsService: TagsService,
  ) {}

  async findAll(userId: string, query: QueryTaskDto): Promise<TaskDocument[]> {
    const filter: Record<string, unknown> = {};
    if (query.project) {
      const hasAccess = await this.projectsService.hasAccess(
        query.project,
        userId,
      );
      if (!hasAccess) {
        throw new ForbiddenException('Access denied to project');
      }
      filter.project = new Types.ObjectId(query.project);
    } else {
      const projects = await this.projectsService.findAll(userId);
      const projectIds = projects.map((p) => p._id);
      filter.project = { $in: projectIds };
    }
    if (query.status) {
      filter.status = query.status;
    }
    if (query.country) {
      filter.country = query.country;
    }
    const sort: Record<string, 1 | -1> = {
      [query.sortBy ?? 'createdAt']: query.sortOrder === 'asc' ? 1 : -1,
    };
    return this.taskModel.find(filter).sort(sort).exec();
  }

  async findOne(id: string, userId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    const hasAccess = await this.projectsService.hasAccess(
      task.project.toString(),
      userId,
    );
    if (!hasAccess) {
      throw new ForbiddenException('Access denied');
    }
    return task;
  }

  async create(
    dto: CreateTaskDto,
    userId: string,
  ): Promise<TaskDocument> {
    const hasAccess = await this.projectsService.hasAccess(
      dto.project,
      userId,
    );
    if (!hasAccess) {
      throw new ForbiddenException('Access denied to project');
    }
    if (dto.parentTask) {
      const parent = await this.taskModel.findById(dto.parentTask).exec();
      if (!parent || parent.project.toString() !== dto.project) {
        throw new BadRequestException('Invalid parent task');
      }
    }
    if (dto.tags?.length) {
      for (const tagId of dto.tags) {
        const tag = await this.tagsService.findOne(tagId, userId);
        if (tag.project.toString() !== dto.project) {
          throw new BadRequestException('Tag must belong to task project');
        }
      }
    }
    const task = new this.taskModel({
      title: dto.title,
      description: dto.description,
      status: dto.status ?? 'todo',
      project: new Types.ObjectId(dto.project),
      creator: new Types.ObjectId(userId),
      parentTask: dto.parentTask
        ? new Types.ObjectId(dto.parentTask)
        : undefined,
      tags: dto.tags?.map((id) => new Types.ObjectId(id)) ?? [],
      deadline: dto.deadline ? new Date(dto.deadline) : undefined,
      country: dto.country,
    });
    return task.save();
  }

  async update(
    id: string,
    dto: UpdateTaskDto,
    userId: string,
  ): Promise<TaskDocument> {
    const task = await this.findOne(id, userId);
    if (dto.project && dto.project !== task.project.toString()) {
      const hasAccess = await this.projectsService.hasAccess(
        dto.project,
        userId,
      );
      if (!hasAccess) {
        throw new ForbiddenException('Access denied to project');
      }
      task.project = new Types.ObjectId(dto.project);
    }
    if (dto.parentTask) {
      const parent = await this.taskModel.findById(dto.parentTask).exec();
      const projectId = dto.project ?? task.project.toString();
      if (!parent || parent.project.toString() !== projectId) {
        throw new BadRequestException('Invalid parent task');
      }
      task.parentTask = new Types.ObjectId(dto.parentTask);
    }
    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.deadline !== undefined) task.deadline = new Date(dto.deadline);
    if (dto.tags !== undefined) {
      const projectId = task.project.toString();
      for (const tagId of dto.tags) {
        const tag = await this.tagsService.findOne(tagId, userId);
        if (tag.project.toString() !== projectId) {
          throw new BadRequestException('Tag must belong to task project');
        }
      }
      task.tags = dto.tags.map((id) => new Types.ObjectId(id));
    }
    if (dto.country !== undefined) task.country = dto.country;
    return task.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);
    await this.taskModel.findByIdAndDelete(id).exec();
  }

  async findSubtasks(id: string, userId: string): Promise<TaskDocument[]> {
    await this.findOne(id, userId);
    return this.taskModel
      .find({ parentTask: new Types.ObjectId(id) })
      .sort({ order: 1, createdAt: 1 })
      .exec();
  }
}
