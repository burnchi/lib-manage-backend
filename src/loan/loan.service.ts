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

  async findAll(
    page: number,
    pageSize: number,
    book?: string,
    member?: string,
    returned?: number,
  ) {
    // 计算分页的起始位置
    const skip = (page - 1) * pageSize;

    let loans = [];
    let totalCount = 0;

    // 如果没有任何条件，则查询所有书籍
    if (!book && !member && !returned) {
      loans = await this.prisma.loan.findMany({
        take: pageSize,
        skip,
        orderBy: {
          uploadedAt: 'desc',
        },
      });
      // TODO:查询符合条件的总记录数
      totalCount = await this.prisma.loan.count();
    }

    // 如果有book条件，则查询指定书籍的借阅记录
    if (book && book.length > 0) {
      // 可能有同名书
      const bookObj = await this.prisma.book.findMany({
        where: { title: { contains: book } },
      });
      // console.log(bookObj);
      // [{ id: 1 }, { id: 2 }]

      if (bookObj) {
        const bookIds = bookObj.map((item) => item.id);

        loans = await this.prisma.loan.findMany({
          take: pageSize,
          skip,
          orderBy: {
            uploadedAt: 'desc',
          },
          where: { book_id: { in: bookIds } },
        });
      }
      totalCount = bookObj.length;
    }
    // 如果有member条件，则查询指定成员的借阅记录
    if (member && member.length > 0) {
      const memberObj = await this.prisma.member.findMany({
        where: { name: { contains: member } },
      });
      // console.log(memberObj);
      if (memberObj) {
        const memberIds = memberObj.map((item) => item.id);
        loans = await this.prisma.loan.findMany({
          take: pageSize,
          skip,
          orderBy: {
            uploadedAt: 'desc',
          },
          where: { member_id: { in: memberIds } },
        });
      }
      totalCount = memberObj.length;
    }

    const returnedBool = returned === 1;

    // 如果有returned条件，则查询指定状态的借阅记录
    if (returned && returned >= 0) {
      loans = await this.prisma.loan.findMany({
        take: pageSize,
        skip,
        orderBy: {
          uploadedAt: 'desc',
        },
        where: { returned: returnedBool },
      });

      totalCount = await this.prisma.loan.count({
        where: { returned: returnedBool },
      });
    }

    // last return
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
