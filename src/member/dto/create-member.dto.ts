import { IsString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  name: string;

  @IsString()
  class_name: string;

  @IsString()
  phone: string;
}
