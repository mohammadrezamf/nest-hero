import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UpdateUser, UserRole } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('request-otp')
  async requestOtp(@Body('phoneNumber') phoneNumber: string) {
    return this.authService.requestOtp(phoneNumber);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('phoneNumber') phoneNumber: string,
    @Body('otp') otp: string,
  ) {
    return this.authService.verifyOtp(phoneNumber, otp);
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async getUserInformation(@GetUser() user: User) {
    const { id } = user;
    return this.authService.getUserInformation(id);
  }

  @Put('user')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(@GetUser() user: User, @Body('data') data: UpdateUser) {
    const { id } = user;
    return this.authService.updateUserData(id, data);
  }

  @Get('all-users')
  @UseGuards(AuthGuard('jwt'))
  getAllUser(@GetUser() user: User): Promise<User[]> {
    return this.authService.getAllUsers(user);
  }

  //   -------------------------
  @Patch('update-role/:targetUserId')
  @UseGuards(AuthGuard('jwt'))
  async updateUserRole(
    @Param('targetUserId') targetUserId: string,
    @Body('newRole') newRole: UserRole,
    @GetUser() adminUser: User,
  ): Promise<void> {
    return this.authService.updateUserRole(adminUser, targetUserId, newRole);
  }

  //   ---get list time that booked of slot for each user

  @Get('users-general-bookings')
  @UseGuards(AuthGuard('jwt'))
  async getUserAllBooking(@GetUser() user: User) {
    console.log('user data :', user);
    const { id } = user;
    return this.authService.getUserAllCounselingBookings(id);
  }
}
