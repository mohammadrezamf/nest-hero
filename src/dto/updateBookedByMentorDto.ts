import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBookedByUserDto {
  booked: boolean;
  timeSlotID: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  displayName: string;

  @IsString()
  email: string;
}
