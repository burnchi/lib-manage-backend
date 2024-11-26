import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  controllers: [MemberController],
  providers: [MemberService, PrismaService],
})
export class MemberModule {}
