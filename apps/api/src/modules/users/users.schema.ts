import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, trim: true }) name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true, index: true }) email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
