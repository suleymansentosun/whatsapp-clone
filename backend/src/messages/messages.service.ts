import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument, MessageStatus } from './schemas/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {}

  async create(createMessageDto: Partial<Message>): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  async findUserMessages(userId: string): Promise<Message[]> {
    return this.messageModel.find({
      $or: [
        { sender: userId, receiverType: 'User' },
        { receiver: userId, receiverType: 'User' }
      ]
    })
    .populate('sender', 'name profilePicture')
    .sort({ createdAt: -1 })
    .exec();
  }

  async findGroupMessages(groupId: string): Promise<Message[]> {
    return this.messageModel.find({
      receiver: groupId,
      receiverType: 'Group'
    })
    .populate('sender', 'name profilePicture')
    .sort({ createdAt: 1 })
    .exec();
  }

  async updateMessageStatus(messageId: string, status: MessageStatus): Promise<Message> {
    return this.messageModel.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    ).exec();
  }
} 