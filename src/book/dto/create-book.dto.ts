import { IsNumber, IsString, Matches } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsNumber()
  category_id: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'publishedAt must be in YYYY-MM-DD format',
  })
  publishedAt: string;

  @IsNumber()
  copied_owned: number;

  @IsNumber()
  author_id: number;
}
