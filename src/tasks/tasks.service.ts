import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
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
    await this.projectsService.assertAccess(query.project, userId);

    const filter: FilterQuery<TaskDocument> = {
      project: new Types.ObjectId(query.project),
      ...(query.status && { status: query.status }),
      ...(query.country && { country: query.country }),
    };

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
    await this.projectsService.assertAccess(task.project.toString(), userId);
    return task;
  }

  async create(dto: CreateTaskDto, userId: string): Promise<TaskDocument> {
    await this.validateTaskContext(dto.project, userId, {
      parentTaskId: dto.parentTask,
      tagIds: dto.tags,
    });

    const task = new this.taskModel({
      ...this.mapDtoToTaskData(dto),
      creator: new Types.ObjectId(userId),
    });
    return task.save();
  }

  async update(
    id: string,
    dto: UpdateTaskDto,
    userId: string,
  ): Promise<TaskDocument> {
    const task = await this.findOne(id, userId);
    const projectId = task.project.toString();
    await this.validateTaskContext(projectId, userId, {
      parentTaskId: dto.parentTask,
      tagIds: dto.tags,
    });

    Object.assign(task, this.mapDtoToTaskData(dto));
    return task.save();
  }

  private async validateTaskContext(
    projectId: string,
    userId: string,
    options?: { parentTaskId?: string; tagIds?: string[] },
  ): Promise<void> {
    await this.projectsService.assertAccess(projectId, userId);
    if (options?.parentTaskId) {
      await this.validateParentTask(options.parentTaskId, projectId);
    }
    await this.tagsService.validateTagsBelongToProject(
      options?.tagIds ?? [],
      userId,
      projectId,
    );
  }

  private mapDtoToTaskData(
    dto: CreateTaskDto | UpdateTaskDto,
  ): Partial<TaskDocument> {
    const result: Record<string, unknown> = { ...dto };
    if ('project' in dto && dto.project != null) {
      result['project'] = new Types.ObjectId(dto.project);
    }
    result['parentTask'] = dto.parentTask
      ? new Types.ObjectId(dto.parentTask)
      : undefined;
    result['tags'] = (dto.tags ?? []).map((id) => new Types.ObjectId(id));
    return result as Partial<TaskDocument>;
  }

  private async validateParentTask(parentTask: string, project: string) {
    const parent = await this.taskModel.findById(parentTask).exec();
    if (!parent || parent.project.toString() !== project) {
      throw new BadRequestException('Invalid parent task');
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await task.deleteOne();
  }

  async findSubtasks(id: string, userId: string): Promise<TaskDocument[]> {
    await this.findOne(id, userId);
    return this.taskModel
      .find({ parentTask: new Types.ObjectId(id) })
      .sort({ order: 1, createdAt: 1 })
      .exec();
  }
}
