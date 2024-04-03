import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  Redirect,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ForgotPwdDTO, LoginDTO } from './dto/auth.dto';
import { IAuthToken } from 'src/interfaces/auth.interface';
import HashUtil from 'src/utils/hash.util';
import { ValidateMessages } from 'src/enum/validateMessages';
import { JwtService } from '@nestjs/jwt';
import OauthService from '../oauth/oauth.service';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly oauthService: OauthService,
  ) {}

  async validateUser(data: LoginDTO): Promise<string> {
    let authTokenPayload: IAuthToken;
    const user = await this.userRepo.findOneBy({ username: data.username });

    if (user === null) {
      throw new NotFoundException(ValidateMessages.USER_USERNAME_NOT_EXISTS);
    }

    if (!(await HashUtil.compare(data.password, user.password))) {
      throw new UnauthorizedException(ValidateMessages.USER_PASSWORD_WRONG);
    }

    authTokenPayload = {
      ...user,
    };

    return await this.jwtService.signAsync(authTokenPayload);
  }

  checkAndSending() {
    return this.oauthService.getRedirectURL();
  }
}
