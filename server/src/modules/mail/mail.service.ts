import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import { resetPwdEmailTemplate } from './templates/resetpwd.template';
import SystemMessageService from '../system-message/system-message.service';
@Injectable()
export default class MailService {
  protected transporter: Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly sysMsgService: SystemMessageService,
  ) {
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
    try {
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
    } catch (err) {
      console.log(err);
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'MAIL_SEND_FAILED',
        500,
      );
    }
  }
}
