import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/signin-dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async isValidPassword(
    requestPassword: string,
    existingPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(requestPassword, existingPassword);
  }

  private async generateJWTToken(
    id: number,
    name: string,
  ): Promise<{
    access_token: string;
  }> {
    const payload = { sub: id, username: name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  public async signIn(signInDto: SignInDto): Promise<any> {
    const user = await this.usersService.findOneByName(signInDto.username);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const isValidPassword = await this.isValidPassword(
      signInDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException('password is invalid');
    }

    return this.generateJWTToken(user.id, user.name);
  }
}
