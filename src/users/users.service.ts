import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await this.hashPassword(createUserDto.password);
    const user = await this.prisma.user.create({
      data: createUserDto,
    });
    delete user.password;
    return user;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(name: string) {
    return this.prisma.user.findFirst({
      where: {
        name: name,
      },
    });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    return 'User removed';
  }
}
