import { IsString, IsArray, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
export class CreateGroupDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    profilePicture?: string;

    @IsArray()
    @IsMongoId({ each: true })
    participants: Types.ObjectId[];
} 