import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import AuthService from './auth.service';
import { SaveUserWithUsernameDTO } from '../user/dto/save.dto';
import { UserService } from '../user';
import {
  ForgotPwdDTO,
  LoginWithUsernameDTO,
  ResetPwdDTO,
} from './dto/auth.dto';
import OauthService from '../oauth/oauth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authenticate')
@Controller('/auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly oauthService: OauthService,
  ) {}

  @HttpCode(200)
  @Post('/login')
  async login(@Body() data: LoginWithUsernameDTO) {
    return await this.authService.validateUser(data);
  }

  @Post('/register')
  async register(@Body() data: SaveUserWithUsernameDTO) {
    return await this.userService.save(data);
  }

  @Get('/oauth/google')
  async handleGoogleOauth() {
    return this.oauthService.getRedirectURL();
  }

  @Get('/oauth/google/callback')
  async handleGoogleOauthCallback(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException();
    }

    return await this.authService.handleGoogleCallback(code);
  }

  @Post('/pwdforgot')
  async auth_forgot(@Body() data: ForgotPwdDTO) {
    return await this.authService.handleResetPwdRequest(data);
  }

  @HttpCode(204)
  @Patch('/pwdreset')
  async auth_pwd_reset(@Body() data: ResetPwdDTO) {
    return await this.authService.resetUserPassword(data);
  }
}
