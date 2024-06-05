import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import AuthService from './auth.service';
import { SaveUserWithPasswordDTO } from '../user/dto/save.dto';
import { UserService } from '../user';
import {
  ForgotPwdDTO,
  LoginWithPasswordDTO,
  ResetPwdDTO,
} from './dto/auth.dto';
import OauthService from '../oauth/oauth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthToken } from 'src/commons/decorators/auth.decorator';
import { IAuthToken } from 'src/interfaces/auth.interface';
import { AuthGuard } from 'src/commons/guards';
import { PublicRoute } from 'src/commons/decorators/public.decorator';

@UseGuards(AuthGuard)
@ApiTags('Authenticate')
@Controller('/auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly oauthService: OauthService,
  ) {}

  @PublicRoute()
  @HttpCode(200)
  @Post('/login')
  async login(@Body() data: LoginWithPasswordDTO) {
    return await this.authService.validateUser(data);
  }

  @PublicRoute()
  @Post('/register')
  async register(@Body() data: SaveUserWithPasswordDTO) {
    const newUser = await this.userService.save(data);

    if (newUser.id) {
      return 'Đăng ký thành công';
    }
  }

  @PublicRoute()
  @Get('/oauth/google')
  async handleGoogleOauth() {
    return this.oauthService.getRedirectURL();
  }

  @PublicRoute()
  @Post('/oauth/google/callback')
  async handleGoogleOauthCallback(@Body('code') code: string) {
    if (!code) {
      throw new BadRequestException();
    }

    return await this.authService.handleGoogleCallback(code);
  }

  @PublicRoute()
  @Post('/pwdforgot')
  async auth_forgot(@Body() data: ForgotPwdDTO) {
    return await this.authService.handleResetPwdRequest(data);
  }

  @PublicRoute()
  @Patch('/pwdreset')
  async auth_pwd_reset(@Body() data: ResetPwdDTO) {
    return await this.authService.resetUserPassword(data);
  }

  @Delete('/self')
  async auth_self_delete(@AuthToken() token: IAuthToken) {
    return await this.authService.deleteAccount(token);
  }
}
