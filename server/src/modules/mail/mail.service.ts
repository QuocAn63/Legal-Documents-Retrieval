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
      tls: {
        rejectUnauthorized: false,
      },
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
      text: 'Reset password',
      html: resetPwdEmailTemplate
        .replaceAll('[$TOKEN$]', token)
        .replaceAll(
          '[$CLIENT_URL$]',
          this.configService.getOrThrow('CLIENT_URL'),
        ),
    });

    return info;
  }
}
