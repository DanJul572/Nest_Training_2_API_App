import { Exclude } from 'class-transformer';

export class GetUserDto {
  id: number;

  username: string;

  @Exclude()
  password: string;

  email: string;
}
