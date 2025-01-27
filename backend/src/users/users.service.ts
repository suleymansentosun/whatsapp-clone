import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.userModel.findOne({ phoneNumber }).exec();
  }

  async updateOnlineStatus(id: string, isOnline: boolean): Promise<User> {
    const updates = {
      isOnline,
      lastSeen: isOnline ? undefined : new Date()
    };
    return this.userModel.findByIdAndUpdate(id, updates, { new: true }).exec();
  }

  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    ).exec();
  }
} 