import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, trim: true, unique: true, lowercase: true, index: true })
  username: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true, index: true, maxLength: 120 })
  email: string;

  @Prop({ select: false }) passwordHash: string;

  @Prop() avaarUrl?: string;

  @Prop({ select: false }) resetTokenHash?: string;
  @Prop({ select: false }) resetTokenExp?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
