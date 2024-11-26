import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { CategoryModule } from './category/category.module';
import { LoanModule } from './loan/loan.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [BookModule, MemberModule, AuthorModule, CategoryModule, LoanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
