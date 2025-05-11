import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendBookingNotification } from './dto/sendBookingNotificationDto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendBookingNotification(
    sendBookingNotificationDto: SendBookingNotification,
  ) {
    try {
      await this.mailerService.sendMail({
        to: sendBookingNotificationDto.to,
        subject: 'رزرو جدید مشاوره',
        template: './booking-notification', // matches booking-notification.hbs
        context: {
          coachName: sendBookingNotificationDto.coachName,
          bookedByName: sendBookingNotificationDto.bookedByName,
          email: sendBookingNotificationDto.email,
          phone: sendBookingNotificationDto.phone,
          clock: sendBookingNotificationDto.clock,
          date: sendBookingNotificationDto.date,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
