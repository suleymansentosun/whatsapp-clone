import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './schemas/message.schema';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Post()
    async create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
        return this.messagesService.create(createMessageDto);
    }

    @Get('user/:userId')
    async findUserMessages(@Param('userId') userId: string): Promise<Message[]> {
        return this.messagesService.findUserMessages(userId);
    }

    @Get('group/:groupId')
    async findGroupMessages(@Param('groupId') groupId: string): Promise<Message[]> {
        return this.messagesService.findGroupMessages(groupId);
    }

    @Post(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: string
    ): Promise<Message> {
        return this.messagesService.updateMessageStatus(id, status);
    }
} 