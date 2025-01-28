import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './schemas/group.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('groups')
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @Post()
    async create(
        @Request() req,
        @Body() createGroupDto: CreateGroupDto
    ): Promise<Group> {
        // Add the authenticated user as the creator
        return this.groupsService.create({
            ...createGroupDto,
            createdBy: req.user._id,
            participants: [...createGroupDto.participants, req.user._id]
        });
    }

    @Get()
    async findAll(): Promise<Group[]> {
        return this.groupsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Group> {
        return this.groupsService.findOne(id);
    }

    @Put(':id/participants')
    async addParticipant(
        @Param('id') id: string,
        @Body('userId') userId: string
    ): Promise<Group> {
        return this.groupsService.addParticipant(id, userId);
    }

    @Delete(':id/participants/:userId')
    async removeParticipant(
        @Param('id') id: string,
        @Param('userId') userId: string
    ): Promise<Group> {
        return this.groupsService.removeParticipant(id, userId);
    }
} 