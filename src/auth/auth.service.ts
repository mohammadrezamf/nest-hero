import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUser, UserRole } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MentorOneCounselingService } from '../mentor-one/mentor-one-counseling.service';
import { MentorTwoCounselingService } from '../mentor-two/mentor-two-counseling.service';
import { MentorThreeCounselingService } from '../mentor-three/mentor-three-counseling.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,

    @Inject(forwardRef(() => MentorOneCounselingService))
    private readonly mentorOneCounselingService: MentorOneCounselingService,

    @Inject(forwardRef(() => MentorTwoCounselingService))
    private readonly mentorTwoCounselingService: MentorTwoCounselingService,

    @Inject(forwardRef(() => MentorThreeCounselingService))
    private readonly mentorThreeCounselingService: MentorThreeCounselingService,
  ) {}

  async seedAdmin() {
    const adminPhoneNumber = process.env.PHONE_NUMBER || '09375332212'; // Default to 'admin'

    const adminExists = await this.usersRepository.findOne({
      where: { role: UserRole.ADMIN },
    });

    if (!adminExists) {
      const admin = this.usersRepository.create({
        phoneNumber: adminPhoneNumber,
        role: UserRole.ADMIN,
      });
      await this.usersRepository.save(admin);
      console.log('Admin user created!');
    }
  }

  async onModuleInit() {
    await this.seedAdmin();
  }

  // -------------- otp ---------------
  async requestOtp(
    phoneNumber: string,
  ): Promise<{ message: string; otp: string }> {
    let user = await this.usersRepository.findOne({ where: { phoneNumber } });

    if (!user) {
      // If the user does not exist, create a new one
      console.log('No user found. now we create that');
      user = this.usersRepository.create({ phoneNumber });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    user.otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    await this.usersRepository.save(user);

    // Simulate sending OTP (In real-world, use Twilio, Firebase, etc.)
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    return {
      message: `OTP sent successfully:code:${otp}`,
      otp: otp,
    };
  }

  // Step 2: Verify OTP (Sign in or Sign up)
  async verifyOtp(phoneNumber: string, otp: string) {
    const user = await this.usersRepository.findOne({ where: { phoneNumber } });

    if (!user) {
      throw new UnauthorizedException('user does not exist!');
    }
    if (user.otp !== otp) {
      throw new UnauthorizedException('otp does not match');
    }

    if (new Date() > user.otpExpiration) {
      throw new UnauthorizedException('expired otp');
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiration = null;

    // Assign role if user is just being created
    if (!user.role) {
      user.role = UserRole.USER; // Default role
    }

    await this.usersRepository.save(user);

    // Generate JWT token
    const payload = {
      phoneNumber: user.phoneNumber,
      role: user.role,
      id: user.id,
    };
    const accessToken = this.jwtService.sign(payload);
    console.log('user data', {
      accessToken,
      phoneNumber: user.phoneNumber,
      role: user.role,
      id: user.id,
    });
    return {
      accessToken,
      phoneNumber: user.phoneNumber,
      role: user.role,
      id: user.id,
    };
  }

  async getAllUsers(user: User): Promise<User[]> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Access denied: Only admins can view all users.',
      );
    }

    return this.usersRepository.find();
  }

  //   ----------- UPDATE ROLE --------------
  async updateUserRole(
    adminUser: User, // ID of the user making the request
    targetUserId: string, // ID of the user to update
    newRole: UserRole,
  ): Promise<void> {
    // Ensure the requesting user is an admin
    if (adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update roles');
    }

    // Block updating any user to the ADMIN role
    if (newRole === UserRole.ADMIN) {
      throw new ForbiddenException('Cannot assign the ADMIN role');
    }

    // Find the target user
    const targetUser = await this.usersRepository.findOne({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Update the target user's role
    targetUser.role = newRole;
    await this.usersRepository.save(targetUser);
  }

  async getUserAllCounselingBookings(userId: string) {
    // Fetch all General Counseling Booked Slots

    const mentorOneSlots =
      await this.mentorOneCounselingService.getSlotByUserID(userId);

    const mentorTwoSlots =
      await this.mentorTwoCounselingService.getSlotByUserID(userId);

    const mentorThreeSlots =
      await this.mentorThreeCounselingService.getSlotByUserID(userId);

    const mentorOneSlotsData = mentorOneSlots.map((slot) => ({
      id: slot.id,
      category: 'mentor-one', // Indicate it's from General Counseling
      clock: slot.clock,
      day: slot.mentorOneCounselingTimes?.day,
      date: slot.mentorOneCounselingTimes?.date,
    }));

    const mentorTwoSlotsData = mentorTwoSlots.map((slot) => ({
      id: slot.id,
      category: 'mentor-two', // Indicate it's from General Counseling
      clock: slot.clock,
      day: slot.mentorTwoCounselingTimes?.day,
      date: slot.mentorTwoCounselingTimes?.date,
    }));

    const mentorThreeSlotsData = mentorThreeSlots.map((slot) => ({
      id: slot.id,
      category: 'mentor-two', // Indicate it's from General Counseling
      clock: slot.clock,
      day: slot.mentorThreeCounselingTimes?.day,
      date: slot.mentorThreeCounselingTimes?.date,
    }));

    return {
      data: [
        ...mentorOneSlotsData,
        ...mentorTwoSlotsData,
        mentorThreeSlotsData,
      ],
    };
  }

  async getUserInformation(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    return {
      data: user,
    };
  }

  async getUserInformationByPhoneNumber(phoneNumber: string) {
    const user = await this.usersRepository.findOne({ where: { phoneNumber } });
    return { data: user };
  }

  async updateUserData(userId: string, data: UpdateUser) {
    const { email, displayName } = data;
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.email = email;
    user.displayName = displayName;
    await this.usersRepository.save(user);
    return {
      message: 'User updated successfully',
    };
  }

  async createUser(role: UserRole, data: CreateUserDto) {
    if (role === UserRole.USER) {
      throw new ForbiddenException(`you don't have access to create user`);
    }
    const { phoneNumber, email, displayName } = data;
    const userExists = await this.usersRepository.findOne({
      where: { phoneNumber },
    });
    if (userExists) {
      throw new ForbiddenException('User already exists');
    }
    const user = this.usersRepository.create({
      phoneNumber,
      email,
      displayName,
    });
    await this.usersRepository.save(user);
    return { data: user };
  }
}
