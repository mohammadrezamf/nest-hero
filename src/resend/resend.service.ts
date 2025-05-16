import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ResendService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend('re_QLrAXx7e_FYR4kbyAfzHaG2pFh4aYZ8dN');
  }

  async sendEmail(to: string, subject: string, Html: string) {
    const { error } = await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [to],
      subject,
      html: Html,
    });

    if (error) {
      console.log('fail to send email', error);
      throw new Error(error.message);
    }
  }
}
