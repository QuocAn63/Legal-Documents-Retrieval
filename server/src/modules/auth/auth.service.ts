import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import {
  ForgotPwdDTO,
  LoginWithPasswordDTO,
  ResetPwdDTO,
} from './dto/auth.dto';
import { IAuthToken } from 'src/interfaces/auth.interface';
import HashUtil from 'src/utils/hash.util';
import { ValidateMessages } from 'src/enum/validateMessages';
import { JwtService } from '@nestjs/jwt';
import OauthService from '../oauth/oauth.service';
import { SaveUserWithGoogleIDDTO } from '../user/dto/save.dto';
import MailService from '../mail/mail.service';
import SystemMessageService from '../system-message/system-message.service';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly oauthService: OauthService,
    private readonly mailService: MailService,
    private readonly sysMessageService: SystemMessageService,
  ) {}

  async validateUser<T extends LoginWithPasswordDTO | SaveUserWithGoogleIDDTO>(
    data: T,
  ): Promise<string> {
    let user: UserEntity;
    let authTokenPayload: IAuthToken;

    if ('password' in data) {
      user = await this.userRepo.findOne({
        where: { email: data.email, isBOT: false, password: Not(IsNull()) },
        select: ['id', 'email', 'isBOT', 'isADMIN', 'password'],
      });
    } else {
      user = await this.userRepo.findOneBy({
        email: data.email,
        googleID: data.googleID,
        isBOT: false,
      });
    }

    if (user === null) {
      await this.sysMessageService.getSysMessageAndThrowHttpException(
        'USER_USERNAME_NOT_EXISTS',
        403,
      );
    }

    if (
      'password' in data &&
      !(await HashUtil.compare(data.password, user.password))
    ) {
      await this.sysMessageService.getSysMessageAndThrowHttpException(
        'USER_PASSWORD_WRONG',
        401,
      );
    }

    authTokenPayload = {
      ...user,
    };

    return await this.jwtService.signAsync(authTokenPayload);
  }

  async handleGoogleCallback(code: string) {
    const { email, googleID } = await this.oauthService.getUserProfile(code);

    const user = await this.userRepo.findOneBy({ email, googleID });

    if (user === null) {
      await this.userRepo.save({
        email,
        googleID,
        isBOT: false,
        isADMIN: false,
      });
    }

    return await this.validateUser({ email, googleID });
  }

  async handleResetPwdRequest(data: ForgotPwdDTO) {
    const { email } = data;

    const resetPwdToken = await this.jwtService.signAsync(
      {
        email,
      },
      { expiresIn: '5 minutes' },
    );

    const user = await this.userRepo.update(
      { email },
      {
        resetPwdToken,
      },
    );

    if (!user.affected) {
      await this.sysMessageService.getSysMessageAndThrowHttpException(
        'UPDATE_ERROR',
      );
    }

    const info = await this.mailService.sendResetPasswordLinkToMails(
      [email],
      resetPwdToken,
    );
    return info;
  }

  async resetUserPassword(data: ResetPwdDTO) {
    try {
      const tokenPayload: { email: string } = await this.jwtService.verifyAsync(
        data.token,
      );
      const { email } = tokenPayload;

      const encryptedPassword = await HashUtil.hash(data.password);

      const updateUserResponse = await this.userRepo.update(
        { email },
        { password: encryptedPassword },
      );

      if (!updateUserResponse.affected) {
        await this.sysMessageService.getSysMessageAndThrowHttpException(
          'UPDATE_ERROR',
        );
      }

      return 'Cập nhật mật khẩu thành công';
    } catch (err) {
      await this.sysMessageService.getSysMessageAndThrowHttpException(
        'SYS_ERROR',
      );
    }
  }
}
