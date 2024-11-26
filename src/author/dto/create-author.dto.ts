import { IsNumber, IsString } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  name: string;

  @IsNumber()
  book_id: number;
}
