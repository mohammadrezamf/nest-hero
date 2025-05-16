import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUser, UserRole } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CounselingTimeSlot } from '../general-counseling-times/general.counseling.times.entity';
import { FrontEndTimeSlot } from '../front-end-counseling/front-end-counseling-entity';
import { LegalTimeSlot } from '../legal-counseling/legal-counseling-entity';
import { PsychologyTimeSlot } from '../psychology-counseling/psychoogy-counseling-entity';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectRepository(CounselingTimeSlot)
    private counselingTimeSlotRepository: Repository<CounselingTimeSlot>,
    @InjectRepository(FrontEndTimeSlot)
    private frontEndTimeSlotRepository: Repository<FrontEndTimeSlot>,
    @InjectRepository(LegalTimeSlot)
    private legalTimesSlotRepository: Repository<LegalTimeSlot>,
    @InjectRepository(PsychologyTimeSlot)
    private psychologyTimeslotRepository: Repository<PsychologyTimeSlot>,
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
    const bookedGeneralSlots = await this.counselingTimeSlotRepository.find({
      where: { user: { id: userId }, booked: true },
      relations: ['generalCounselingTimes'],
    });

    // Fetch all FrontEnd Counseling Booked Slots
    const bookedFrontEndSlots = await this.frontEndTimeSlotRepository.find({
      where: { user: { id: userId }, booked: true },
      relations: ['frontEndCounselingTimes'],
    });

    // Fetch all legal Counseling Booked Slots
    const bookedLegalSlots = await this.legalTimesSlotRepository.find({
      where: { user: { id: userId }, booked: true },
      relations: ['legalCounselingTimes'],
    });

    const bookedPsychologySlots = await this.psychologyTimeslotRepository.find({
      where: { user: { id: userId }, booked: true },
      relations: ['psychologyCounselingTimes'],
    });

    // Transform General Counseling Data
    const generalData = bookedGeneralSlots.map((slot) => ({
      id: slot.id,
      category: 'general', // Indicate it's from General Counseling
      clock: slot.clock,
      day: slot.generalCounselingTimes?.day,
      date: slot.generalCounselingTimes?.date,
    }));

    // Transform FrontEnd Counseling Data
    const frontEndData = bookedFrontEndSlots.map((slot) => ({
      id: slot.id,
      category: 'frontend', // Indicate it's from FrontEnd Counseling
      clock: slot.clock,
      day: slot.frontEndCounselingTimes?.day,
      date: slot.frontEndCounselingTimes?.date,
    }));

    // Transform legal Counseling Data
    const legalData = bookedLegalSlots.map((slot) => ({
      id: slot.id,
      category: 'legal', // Indicate it's from FrontEnd Counseling
      clock: slot.clock,
      day: slot.legalCounselingTimes?.day,
      date: slot.legalCounselingTimes?.date,
    }));

    // Transform legal Counseling Data
    const psychologyData = bookedPsychologySlots.map((slot) => ({
      id: slot.id,
      category: 'psychology', // Indicate it's from FrontEnd Counseling
      clock: slot.clock,
      day: slot.psychologyCounselingTimes?.day,
      date: slot.psychologyCounselingTimes?.date,
    }));

    // Combine both lists and return
    return {
      data: [...generalData, ...frontEndData, ...legalData, ...psychologyData],
    };
  }

  async getUserInformation(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    return {
      data: user,
    };
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
}
