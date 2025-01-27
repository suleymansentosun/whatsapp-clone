import { IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  newPassword: string;

  @IsString()
  resetToken: string;
} 