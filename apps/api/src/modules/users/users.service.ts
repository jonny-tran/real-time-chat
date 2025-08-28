import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  create(dto: { name: string; email: string }) {
    return this.userModel.create(dto);
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).lean();
  }
}
