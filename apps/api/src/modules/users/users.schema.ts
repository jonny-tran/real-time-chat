/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, trim: true, unique: true, lowercase: true, index: true })
  username: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true, index: true, maxlength: 120 })
  email: string;

  @Prop({ required: true, select: false }) passwordHash: string;

  @Prop() avatarUrl?: string;

  @Prop({ select: false }) resetTokenHash?: string;
  @Prop({ select: false }) resetTokenExp?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  if (this.isModified('email') && this.get('email')) {
    this.set('email', this.get('email').toLowerCase().trim());
  }
  if (this.isModified('username') && this.get('username')) {
    this.set('username', this.get('username').toLowerCase().trim());
  }
  next();
});

UserSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.passwordHash;
    delete ret.resetTokenHash;
    delete ret.resetTokenExp;
    return ret;
  },
});
