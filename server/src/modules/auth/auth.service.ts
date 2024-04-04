import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  Redirect,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ForgotPwdDTO, LoginWithUsernameDTO } from './dto/auth.dto';
import { IAuthToken } from 'src/interfaces/auth.interface';
import HashUtil from 'src/utils/hash.util';
import { ValidateMessages } from 'src/enum/validateMessages';
import { JwtService } from '@nestjs/jwt';
import OauthService from '../oauth/oauth.service';
import { SaveUserWithEmailDTO } from '../user/dto/save.dto';
import MailService from '../mail/mail.service';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly oauthService: OauthService,
    private readonly mailService: MailService,
  ) {}

  async validateUser<T extends LoginWithUsernameDTO | SaveUserWithEmailDTO>(
    data: T,
  ): Promise<string> {
    let user: UserEntity;
    let authTokenPayload: IAuthToken;

    if ('username' in data) {
      user = await this.userRepo.findOneBy({ username: data.username });
    } else if ('email' in data) {
      user = await this.userRepo.findOneBy({
        email: data.email,
        googleID: data.googleID,
      });
    }

    if (user === null) {
      throw new NotFoundException(ValidateMessages.USER_USERNAME_NOT_EXISTS);
    }

    if (
      'username' in data &&
      !(await HashUtil.compare(data.password, user.password))
    ) {
      throw new UnauthorizedException(ValidateMessages.USER_PASSWORD_WRONG);
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
      await this.userRepo.save({ email, googleID, isBOT: 0, isADMIN: 0 });
    }

    return await this.validateUser({ email, googleID });
  }

  async handleResetPwdRequest(data: ForgotPwdDTO) {
    const { email } = data;

    const token = await this.jwtService.signAsync(
      {
        email,
      },
      { expiresIn: '5 minutes' },
    );

    const user = await this.userRepo.update(
      { email },
      { resetPwdToken: token },
    );

    if (!user.affected) {
      throw new BadRequestException();
    }

    const info = await this.mailService.sendResetPasswordLinkToMails(
      [email],
      token,
    );
    return info;
  }
}
