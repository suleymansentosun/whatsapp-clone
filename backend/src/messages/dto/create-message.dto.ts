import { IsString, IsEnum, IsOptional, IsMongoId } from 'class-validator';
import { MessageType } from '../schemas/message.schema';
import { Types } from 'mongoose';

export class CreateMessageDto {
    @IsString()
    content: string;

    @IsMongoId()
    receiver: Types.ObjectId;

    @IsString()
    @IsEnum(['User', 'Group'])
    receiverType: string;

    @IsEnum(MessageType)
    messageType: MessageType;

    @IsString()
    @IsOptional()
    media?: string;
} 