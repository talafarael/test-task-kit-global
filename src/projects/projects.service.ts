import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, type ProjectDocument } from './schemas/project.schema';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) { }

  async findAll(userId: string): Promise<ProjectDocument[]> {
    const id = new Types.ObjectId(userId);
    return this.projectModel
      .find({
        $or: [{ owner: id }, { members: id }],
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    this.assertAccessToProject(project, userId);
    return project;
  }

  async create(
    dto: CreateProjectDto,
    userId: string,
  ): Promise<ProjectDocument> {
    const project = new this.projectModel({
      ...dto,
      owner: new Types.ObjectId(userId),
      members: [],
    });
    return project.save();
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    userId: string,
  ): Promise<ProjectDocument> {
    const project = await this.findOne(id, userId);
    this.assertOwner(project, userId);
    Object.assign(project, dto);
    return project.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId);
    this.assertOwner(project, userId);
    await project.deleteOne();
  }

  async hasAccess(projectId: string, userId: string): Promise<boolean> {
    const project = await this.projectModel.findById(projectId).exec();
    if (!project) return false;
    return this.checkAccess(project, userId);
  }

  async assertAccess(projectId: string, userId: string): Promise<void> {
    const hasAccess = await this.hasAccess(projectId, userId);
    if (!hasAccess) {
      throw new ForbiddenException('Access denied to project');
    }
  }

  private assertAccessToProject(
    project: ProjectDocument,
    userId: string,
  ): void {
    if (!this.checkAccess(project, userId)) {
      throw new ForbiddenException('Access denied');
    }
  }

  private assertOwner(project: ProjectDocument, userId: string): void {
    if (project.owner.toString() !== userId) {
      throw new ForbiddenException('Only owner can perform this action');
    }
  }

  private checkAccess(project: ProjectDocument, userId: string): boolean {
    const id = userId;
    return (
      project.owner.toString() === id ||
      project.members.some((m) => m.toString() === id)
    );
  }
}
