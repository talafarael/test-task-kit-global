import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tag, type TagDocument } from './schemas/tag.schema';
import type { CreateTagDto } from './dto/create-tag.dto';
import type { UpdateTagDto } from './dto/update-tag.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
    private readonly projectsService: ProjectsService,
  ) {}

  async findAll(projectId: string, userId: string): Promise<TagDocument[]> {
    const hasAccess = await this.projectsService.hasAccess(projectId, userId);
    if (!hasAccess) {
      throw new ForbiddenException('Access denied to project');
    }
    return this.tagModel.find({ project: new Types.ObjectId(projectId) }).exec();
  }

  async findOne(id: string, userId: string): Promise<TagDocument> {
    const tag = await this.tagModel.findById(id).exec();
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    const hasAccess = await this.projectsService.hasAccess(
      tag.project.toString(),
      userId,
    );
    if (!hasAccess) {
      throw new ForbiddenException('Access denied');
    }
    return tag;
  }

  async create(dto: CreateTagDto, userId: string): Promise<TagDocument> {
    const hasAccess = await this.projectsService.hasAccess(
      dto.project,
      userId,
    );
    if (!hasAccess) {
      throw new ForbiddenException('Access denied to project');
    }
    const existing = await this.tagModel
      .findOne({
        project: dto.project,
        name: { $regex: new RegExp(`^${dto.name}$`, 'i') },
      })
      .exec();
    if (existing) {
      throw new ConflictException('Tag with this name already exists');
    }
    const tag = new this.tagModel({
      ...dto,
      project: new Types.ObjectId(dto.project),
    });
    return tag.save();
  }

  async update(
    id: string,
    dto: UpdateTagDto,
    userId: string,
  ): Promise<TagDocument> {
    const tag = await this.findOne(id, userId);
    if (dto.name !== undefined) {
      const existing = await this.tagModel
        .findOne({
          project: tag.project,
          name: { $regex: new RegExp(`^${dto.name}$`, 'i') },
          _id: { $ne: id },
        })
        .exec();
      if (existing) {
        throw new ConflictException('Tag with this name already exists');
      }
      tag.name = dto.name;
    }
    if (dto.color !== undefined) tag.color = dto.color;
    return tag.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);
    await this.tagModel.findByIdAndDelete(id).exec();
  }
}
