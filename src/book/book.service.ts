import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    const { publishedAt } = createBookDto;
    const book = await this.prisma.book.create({
      data: {
        title: createBookDto.title,
        category_id: createBookDto.category_id,
        publishedAt: createBookDto.publishedAt,
        copied_owned: createBookDto.copied_owned,
        author_id: createBookDto.author_id,
      },
    });
    return book;
  }

  async findAll() {
    const books = await this.prisma.book.findMany();
    return books;
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id: id },
    });
    if (!book) {
      throw new HttpException('Book not found', 400);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);
    const book = await this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
    return book;
  }

  async remove(id: number) {
    await this.findOne(id);
    const book = await this.prisma.book.delete({
      where: { id },
    });
    return book;
  }
}
