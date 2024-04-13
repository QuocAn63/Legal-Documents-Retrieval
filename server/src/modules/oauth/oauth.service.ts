import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';

@Injectable()
export default class OauthService {
  protected oauth2Client: Auth.OAuth2Client;
  private scopes = ['email', 'profile'];

  constructor(private readonly configService: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2({
      clientId: configService.getOrThrow('OAUTH_GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('OAUTH_GOOGLE_CLIENT_SECRET'),
      redirectUri: configService.getOrThrow('OAUTH_REDIRECT_URL'),
    });
  }

  getRedirectURL(): string {
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
    });

    return url;
  }

  async getUserProfile(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    const user = google.oauth2({
      version: 'v2',
      auth: this.oauth2Client,
    });

    const { data } = await user.userinfo.get();

    return { email: data.email, googleID: data.id };
  }
}
