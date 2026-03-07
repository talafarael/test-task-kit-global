import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  members: Types.ObjectId[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function () {
    const taskIds = (
      await this.model('Task')
        .find({ project: this._id })
        .select('_id')
        .lean()
        .exec()
    ).map((t) => t._id as Types.ObjectId);

    await Promise.all([
      this.model('Comment').deleteMany({ task: { $in: taskIds } }),
      this.model('Task').deleteMany({ project: this._id }),
      this.model('Tag').deleteMany({ project: this._id }),
    ]);
  },
);
ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ members: 1 });
