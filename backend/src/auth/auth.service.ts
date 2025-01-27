import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByPhoneNumber(createUserDto.phoneNumber);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.usersService.create(createUserDto);
    const token = this.generateToken(user._id.toString());

    return {
      user: {
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByPhoneNumber(loginDto.phoneNumber);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user._id.toString());

    return {
      user: {
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
      },
      token,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // In a real application, you would verify the reset token
    // For now, we'll just update the password
    const user = await this.usersService.findByPhoneNumber(resetPasswordDto.phoneNumber);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    // Add updatePassword method to UsersService
    await this.usersService.updatePassword(user._id.toString(), hashedPassword);

    return { message: 'Password reset successful' };
  }

  private generateToken(userId: string): string {
    return this.jwtService.sign({ sub: userId });
  }
} 