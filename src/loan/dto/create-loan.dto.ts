import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber } from 'class-validator';

export class CreateLoanDto {
  @IsNumber()
  book_id: number;

  @IsNumber()
  member_id: number;

  @IsDate()
  @Transform(({ value }) => {
    // 将 UTC 时间转换为北京时间
    const date = new Date(value); // 转为 Date 对象（UTC）
    const offset = 8 * 60 * 60 * 1000; // UTC+8 的偏移量
    return new Date(date.getTime() + offset); // 转换为北京时间
  })
  loan_date: Date;

  @IsDate()
  @Transform(({ value }) => {
    // 将 UTC 时间转换为北京时间
    const date = new Date(value); // 转为 Date 对象（UTC）
    const offset = 8 * 60 * 60 * 1000; // UTC+8 的偏移量
    return new Date(date.getTime() + offset); // 转换为北京时间
  })
  returned_date: Date;

  @IsBoolean()
  returned: boolean;
}
