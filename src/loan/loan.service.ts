import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoanService {
  constructor(private prisma: PrismaService) {}

  async create(createLoanDto: CreateLoanDto) {
    const { book_id, member_id, loan_date, returned_date, returned } =
      createLoanDto;
    const loan = await this.prisma.loan.create({
      data: {
        book_id,
        member_id,
        loan_date,
        returned_date,
        returned,
      },
    });
    return loan;
  }

  async findAll() {
    const loans = await this.prisma.loan.findMany();
    return loans;
  }

  async findOne(id: number) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: id },
    });
    if (!loan) {
      throw new HttpException('loan not found', 400);
    }

    return loan;
  }

  async update(id: number, updateLoanDto: UpdateLoanDto) {
    await this.findOne(id);
    const loan = await this.prisma.loan.update({
      where: { id },
      data: updateLoanDto,
    });
    return loan;
  }

  async remove(id: number) {
    await this.findOne(id);
    const loan = await this.prisma.loan.delete({
      where: { id },
    });
    return loan;
  }
}
