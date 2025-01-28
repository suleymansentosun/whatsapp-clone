import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './schemas/message.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Post()
    async create(
        @Request() req,
        @Body() createMessageDto: CreateMessageDto
    ): Promise<Message> {
        // Add the authenticated user as the sender
        return this.messagesService.create({
            ...createMessageDto,
            sender: req.user._id
        });
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