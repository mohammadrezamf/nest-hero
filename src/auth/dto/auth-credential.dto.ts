import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  phoneNumber: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GENERAL = 'general',
  FRONT_END = 'frontEnd',
  MENTOR_ONE = 'mentorOne',
  SECURITY = 'security',
  PRODUCT_MANAGER = 'productManager',
  DESIGN = 'design',
  BACK_END = 'backEnd',
  PSYCHOLOGY = 'psychology',
  LEGAL = 'legal',
}

export type UserLoginRs = {
  id: string;
  accessToken: string;
  phoneNumber: string;
  role: UserRole;
};

export type UpdateUser = {
  displayName: string;
  email: string;
};

export class CreateUserDto {
  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  displayName: string;

  @IsString()
  email: string;
}
