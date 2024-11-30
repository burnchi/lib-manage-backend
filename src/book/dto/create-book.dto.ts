import { IsArray, IsInt, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category_name: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'publishedAt must be in YYYY-MM-DD format',
  })
  publishedAt: string;

  @IsInt()
  copied_owned: number;

  @IsArray()
  @IsString({ each: true })
  author_list: string[];
}
