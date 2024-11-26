import { HttpException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from 'src/member/dto/create-member.dto';
import { UpdateMemberDto } from 'src/member/dto/update-member.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async create(createMemberDto: CreateMemberDto) {
    const { name, class_name, phone } = createMemberDto;
    const member = await this.prisma.member.create({
      data: {
        name,
        class_name,
        phone,
      },
    });
    return member;
  }

  async findAll() {
    const members = await this.prisma.member.findMany();
    return members;
  }

  async findOne(id: number) {
    const member = await this.prisma.member.findUnique({
      where: { id: id },
    });
    if (!member) {
      throw new HttpException('member not found', 400);
    }

    return member;
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    await this.findOne(id);
    const member = await this.prisma.member.update({
      where: { id },
      data: updateMemberDto,
    });
    return member;
  }

  async remove(id: number) {
    await this.findOne(id);
    const member = await this.prisma.member.delete({
      where: { id },
    });
    return member;
  }
}
