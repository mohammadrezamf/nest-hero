import { IsString } from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  phoneNumber: string;
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
  id: string;
  accessToken: string;
  phoneNumber: string;
  role: UserRole;
};

export type UserData = {
  id: string;
  phoneNumber: string;
  role: UserRole;
};

export type UserList = {
  data: UserData[];
};
