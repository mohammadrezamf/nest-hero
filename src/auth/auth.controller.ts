import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  AuthCredentialDto,
  UserLoginRs,
  UserRole,
} from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() authCredentialDto: AuthCredentialDto): Promise<void> {
    return this.authService.signUp(authCredentialDto);
  }

  @Post('signin')
  signIn(@Body() authCredentialDto: AuthCredentialDto): Promise<UserLoginRs> {
    return this.authService.singIN(authCredentialDto);
  }

  @Get()
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
    const { id } = user;
    return this.authService.getUserAllCounselingBookings(id);
  }

  @Get('user-information')
  @UseGuards(AuthGuard('jwt'))
  async getUserInformation(@GetUser() user: User) {
    const { id } = user;
    return this.authService.getUserInformation(id);
  }
}
