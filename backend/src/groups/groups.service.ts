import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './schemas/group.schema';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>
  ) {}

  async create(createGroupDto: Partial<Group>): Promise<Group> {
    const createdGroup = new this.groupModel({
      ...createGroupDto,
      admins: [createGroupDto.createdBy]
    });
    return createdGroup.save();
  }

  async findAll(): Promise<Group[]> {
    return this.groupModel.find()
      .populate('participants', 'name profilePicture')
      .populate('admins', 'name profilePicture')
      .populate('createdBy', 'name profilePicture')
      .exec();
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupModel.findById(id)
      .populate('participants', 'name profilePicture')
      .populate('admins', 'name profilePicture')
      .populate('createdBy', 'name profilePicture')
      .exec();
    
    if (!group) {
      throw new NotFoundException(`Group #${id} not found`);
    }
    return group;
  }

  async addParticipant(groupId: string, userId: string): Promise<Group> {
    return this.groupModel.findByIdAndUpdate(
      groupId,
      { $addToSet: { participants: userId } },
      { new: true }
    ).exec();
  }

  async removeParticipant(groupId: string, userId: string): Promise<Group> {
    return this.groupModel.findByIdAndUpdate(
      groupId,
      { 
        $pull: { 
          participants: userId,
          admins: userId 
        } 
      },
      { new: true }
    ).exec();
  }
} 