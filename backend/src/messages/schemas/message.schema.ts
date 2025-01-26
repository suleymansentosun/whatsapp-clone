import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type MessageDocument = Message & Document;

export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    VIDEO = 'video',
    AUDIO = 'audio',
    DOCUMENT = 'document'
}

export enum MessageStatus {
    SENT = 'sent',
    DELIVERED = 'delivered',
    READ = 'read'
}

@Schema({ timestamps: true })
export class Message {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender: User;

    @Prop({ type: Types.ObjectId, required: true, refPath: 'receiverType' })
    receiver: Types.ObjectId;

    @Prop({ required: true, enum: ['User', 'Group'] })
    receiverType: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true, enum: MessageType, default: MessageType.TEXT })
    messageType: MessageType;

    @Prop()
    media?: string;

    @Prop({ enum: MessageStatus, default: MessageStatus.SENT })
    status: MessageStatus;
}

export const MessageSchema = SchemaFactory.createForClass(Message); 