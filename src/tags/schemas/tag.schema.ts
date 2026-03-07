import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TagDocument = Tag & Document;

@Schema({ timestamps: true })
export class Tag {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '#6B7280' })
  color: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;
}

export const TagSchema = SchemaFactory.createForClass(Tag);

TagSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const tagId = this._id;
  await this.model('Task')
    .updateMany(
      {
        tags: tagId,
      },
      {
        $pull: { tags: tagId },
      },
    )
    .exec();
});
TagSchema.index({ project: 1, name: 1 }, { unique: true });
