import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private messagesService: MessagesService,
    private usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Get user from token
      const userId = client.handshake.auth.userId;
      if (!userId) {
        client.disconnect();
        return;
      }

      // Join user's personal room
      client.join(`user_${userId}`);
      
      // Update user's online status
      await this.usersService.updateOnlineStatus(userId, true);
      
      // Notify others that user is online
      this.server.emit('userStatus', { userId, isOnline: true });
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const userId = client.handshake.auth.userId;
      if (userId) {
        // Update user's online status
        await this.usersService.updateOnlineStatus(userId, false);
        
        // Notify others that user is offline
        this.server.emit('userStatus', { userId, isOnline: false });
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    try {
      const userId = client.handshake.auth.userId;
      
      // Create and save the message
      const message = await this.messagesService.create({
        ...createMessageDto,
        sender: userId,
      });

      // Populate sender information
      const populatedMessage = await message.populate('sender', 'name profilePicture');

      // Emit to appropriate room based on receiver type
      if (createMessageDto.receiverType === 'User') {
        // Emit to sender and receiver
        this.server.to(`user_${userId}`).emit('newMessage', populatedMessage);
        this.server.to(`user_${createMessageDto.receiver}`).emit('newMessage', populatedMessage);
      } else {
        // Emit to group room
        this.server.to(`group_${createMessageDto.receiver}`).emit('newMessage', populatedMessage);
      }

      // Emit typing stopped
      this.emitTypingStopped(userId, createMessageDto.receiver, createMessageDto.receiverType);

      return populatedMessage;
    } catch (error) {
      console.error('Message error:', error);
      client.emit('messageError', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('joinGroup')
  handleJoinGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() groupId: string,
  ) {
    client.join(`group_${groupId}`);
  }

  @SubscribeMessage('leaveGroup')
  handleLeaveGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() groupId: string,
  ) {
    client.leave(`group_${groupId}`);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverId: string; receiverType: string },
  ) {
    const userId = client.handshake.auth.userId;
    if (data.receiverType === 'User') {
      this.server.to(`user_${data.receiverId}`).emit('userTyping', { userId });
    } else {
      this.server.to(`group_${data.receiverId}`).emit('userTyping', { userId });
    }
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverId: string; receiverType: string },
  ) {
    const userId = client.handshake.auth.userId;
    this.emitTypingStopped(userId, data.receiverId, data.receiverType);
  }

  private emitTypingStopped(userId: string, receiverId: string, receiverType: string) {
    if (receiverType === 'User') {
      this.server.to(`user_${receiverId}`).emit('userStoppedTyping', { userId });
    } else {
      this.server.to(`group_${receiverId}`).emit('userStoppedTyping', { userId });
    }
  }
} 