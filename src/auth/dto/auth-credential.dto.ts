import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @MinLength(5, { message: 'Password must be at least 6 characters' })
  @MaxLength(20, {
    message: 'username must max length be at least 20 characters',
  })
  username: string;

  @IsString()
  @MinLength(5, { message: 'Password must be at least 5 characters' })
  @MaxLength(20, {
    message: 'username must max length be at least 20 characters',
  })
  password: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GENERAL = 'general',
  FRONT_END = 'frontEnd',
  PSYCHOLOGY = 'psychology',
  LEGAL = 'legal',
}

export type UserLoginRs = {
  accessToken: string;
  userName: string;
  userRole: UserRole;
  id: string;
};
