import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import AuthService from './auth.service';
import { SaveUserWithUsernameDTO } from '../user/dto/save.dto';
import { UserService } from '../user';
import { ForgotPwdDTO, LoginDTO } from './dto/auth.dto';
import OauthService from '../oauth/oauth.service';

@Controller('/auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly oauthService: OauthService,
  ) {}

  @Post('/login')
  async login(@Body() data: LoginDTO) {
    return await this.authService.validateUser(data);
  }

  @Post('/register')
  async register(@Body() data: SaveUserWithUsernameDTO) {
    return await this.userService.save(data);
  }

  @Get('/oauth/google')
  async handleGoogleOauth() {
    const url = this.authService.checkAndSending();

    return url;
  }

  @Get('/oauth/google/callback')
  async handleGoogleOauthCallback(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException();
    }

    return await this.oauthService.getUserProfile(code);
  }

  @Post('/pwdforgot')
  async auth_forgot(@Body() data: ForgotPwdDTO) {}
}
