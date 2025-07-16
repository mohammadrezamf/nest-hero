import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workshop } from './workshop.entity';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.entity';

@Injectable()
export class WorkshopsService {
  constructor(
    @InjectRepository(Workshop)
    private workshopRepo: Repository<Workshop>,

    private readonly authService: AuthService,
  ) {}

  findAll() {
    return this.workshopRepo.find({ relations: ['users'] });
  }

  findOne(id: number) {
    return this.workshopRepo.findOne({ where: { id }, relations: ['users'] });
  }

  async create(data: Partial<Workshop>, creator: User) {
    const workshop = this.workshopRepo.create({
      ...data,
      phoneNumber: creator.phoneNumber,
      createdBy: creator,
    });
    return this.workshopRepo.save(workshop);
  }

  async update(id: number, data: Partial<Workshop>) {
    const workshop = await this.workshopRepo.findOneBy({ id });
    if (!workshop) throw new NotFoundException('Workshop not found');
    Object.assign(workshop, data);
    return this.workshopRepo.save(workshop);
  }

  async delete(id: number) {
    const result = await this.workshopRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Workshop not found');
  }

  async addUserToWorkshop(workshopId: number, userId: string) {
    // پیدا کردن ورکشاپ همراه با کاربران فعلی
    const workshop = await this.workshopRepo.findOne({
      where: { id: workshopId },
      relations: ['users'],
    });

    if (!workshop) throw new NotFoundException('Workshop not found');

    // گرفتن اطلاعات کاربر از سرویس کاربر
    const userResult = await this.authService.getUserInformation(userId);
    const user = userResult.data;

    if (!user) throw new NotFoundException('User not found');

    // بررسی تکراری نبودن کاربر
    const alreadyJoined = workshop.users.some((u) => u.id === userId);

    if (alreadyJoined) {
      return {
        message: 'User is already a participant in this workshop.',
        data: workshop,
      };
    }

    // اضافه کردن کاربر جدید
    workshop.users.push(user);
    const updatedWorkshop = await this.workshopRepo.save(workshop);

    return {
      message: 'User successfully added to the workshop.',
      data: updatedWorkshop,
    };
  }
}
