import { IsString, IsPhoneNumber, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsPhoneNumber()
    phoneNumber: string;

    @IsString()
    @MinLength(6)
    password: string;
} 