import { Controller, Get, Post } from '@nestjs/common';
import AuthService from './auth.service';

@Controller('/auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login() {}

  @Post('/register')
  async register() {}

  @Get('/oauth/google')
  async handleGoogleOauth() {}

  @Post('/oauth/google/callback')
  async handleGoogleOauthCallback() {}
}
