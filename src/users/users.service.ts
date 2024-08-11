import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { GetUserDto } from './dto/get-user.dto';

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
    return plainToInstance(GetUserDto, user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return plainToInstance(GetUserDto, users);
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    if (!user) throw new NotFoundException('user not found');
    return plainToInstance(GetUserDto, user);
  }

  findOneByName(name: string) {
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
    return 'user has been deleted';
  }
}
