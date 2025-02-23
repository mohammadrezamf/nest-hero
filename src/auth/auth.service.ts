import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuthCredentialDto,
  UserLoginRs,
  UserRole,
} from './dto/auth-credential.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './jwt-payload.interface';
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
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'; // Default to 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin_password'; // Default to 'admin_password'

    const adminExists = await this.usersRepository.findOne({
      where: { role: UserRole.ADMIN },
    });

    if (adminExists) {
      this.logger.log('Admin user already exists. Skipping creation.');
      return;
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = this.usersRepository.create({
      username: adminUsername,
      password: hashPassword,
      role: UserRole.ADMIN,
    });

    await this.usersRepository.save(adminUser);
    this.logger.log('Admin user created successfully.');
  }

  async onModuleInit() {
    await this.seedAdmin();
  }

  // ------------------------
  async createUser(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialDto;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      username,
      password: hashPassword,
    });

    try {
      // Save the new user to the database
      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // Handle duplicate username error (unique constraint violation)
        throw new ConflictException('username already exists');
      } else {
        // Handle unexpected errors
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
    return this.createUser(authCredentialsDto);
  }

  async singIN(authCredentialsDto: AuthCredentialDto): Promise<UserLoginRs> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JWTPayload = { username };
      const accessToken = await this.jwtService.sign(payload);
      return {
        accessToken,
        userName: user.username,
        userRole: user.role,
        id: user.id,
      };
    } else {
      throw new UnauthorizedException();
    }
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
}
