import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignee?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Task' })
  parentTask?: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Tag' }])
  tags: Types.ObjectId[];

  @Prop({ default: null })
  deadline?: Date;

  @Prop()
  country?: string;

  @Prop({ default: 0 })
  order: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({ title: 'text', description: 'text' });
TaskSchema.index({ country: 1 });
TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ project: 1, deadline: 1 });
TaskSchema.index({ parentTask: 1 });
TaskSchema.index({ assignee: 1 });
TaskSchema.index({ creator: 1 });
