import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDTO } from './dto/auth.dto';
import { IAuthToken } from 'src/interfaces/auth.interface';
import HashUtil from 'src/utils/hash.util';
import { ValidateMessages } from 'src/enum/validateMessages';
import { JwtService } from '@nestjs/jwt';
import {
  SaveUserWithEmailDTO,
  SaveUserWithUsernameDTO,
} from '../user/dto/save.dto';

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
      throw new UnauthorizedException(ValidateMessages.USER_PASSWORD_WRONG);
    }

    authTokenPayload = {
      ...user,
    };

    return await this.jwtService.signAsync(authTokenPayload);
  }

  async saveUser<T extends SaveUserWithUsernameDTO | SaveUserWithEmailDTO>(
    data: T,
  ): Promise<string> {
    const saveUserResponse = await this.userRepo.save(data);

    return saveUserResponse.id;
  }
}
