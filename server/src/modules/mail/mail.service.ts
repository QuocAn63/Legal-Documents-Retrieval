import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import { resetPwdEmailTemplate } from './templates/resetpwd.template';
@Injectable()
export default class MailService {
  protected transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      service: 'Gmail',
      auth: {
        user: this.configService.getOrThrow('EMAIL_USERNAME'),
        pass: this.configService.getOrThrow('EMAIL_PASSWORD'),
      },
    });
  }

  async sendResetPasswordLinkToMails(to: string[], token: string) {
    const info = await this.transporter.sendMail({
      to,
      subject: 'Reset password',
      html: resetPwdEmailTemplate.replace('[TOKEN]', token),
    });

    return info;
  }
}
