import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import {
  LoginDTO,
  SaveUserWithEmailDTO,
  SaveUserWithUsernameDTO,
} from './dto/auth.dto';
import { IAuthToken } from 'src/interfaces/auth.interface';
import HashUtil from 'src/utils/hash.util';
import { ValidateMessages } from 'src/enum/validateMessages';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(data: LoginDTO): Promise<string> {
    let authTokenPayload: IAuthToken;
    const user = await this.userRepo.findOneBy({ username: data.username });

    if (!(await HashUtil.compare(data.password, user.password))) {
      throw new UnauthorizedException(ValidateMessages.PASSWORD_WRONG);
    }

    authTokenPayload = {
      ...user,
    };

    return await this.jwtService.signAsync(authTokenPayload);
  }

  async saveUser<T extends 'username' | 'email'>(
    method: T,
    data: T extends 'username' ? SaveUserWithUsernameDTO : SaveUserWithEmailDTO,
  ): Promise<string> {
    let userObj = new UserEntity();
    userObj.isBOT = 0;
    userObj.isADMIN = 0;

    if (method === 'username' && data instanceof SaveUserWithUsernameDTO) {
      if (!(await this.userRepo.findOneBy({ username: data.username })).id) {
        throw new BadGatewayException(ValidateMessages.USERNAME_EXISTS);
      }

      const encryptedPassword = await HashUtil.hash(data.password);

      userObj.username = data.username;
      userObj.password = encryptedPassword;
    } else if (data instanceof SaveUserWithEmailDTO) {
      userObj.email = data.email;
      userObj.googleID = data.token;
    }

    const saveUserResponse = await this.userRepo.save(userObj);

    return saveUserResponse.id;
  }
}
