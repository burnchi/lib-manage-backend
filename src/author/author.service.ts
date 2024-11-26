import { HttpException, Injectable } from '@nestjs/common';
import { UpdateAuthorDto } from 'src/author/dto/update-author.dto';
import { PrismaService } from 'src/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const { name, book_id } = createAuthorDto;
    const author = await this.prisma.author.create({
      data: {
        name,
        book_id,
      },
    });
    return author;
  }

  async findAll() {
    const authors = await this.prisma.author.findMany();
    return authors;
  }

  async findOne(id: number) {
    const author = await this.prisma.author.findUnique({
      where: { id: id },
    });
    if (!author) {
      throw new HttpException('author not found', 400);
    }

    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    await this.findOne(id);
    const author = await this.prisma.author.update({
      where: { id },
      data: updateAuthorDto,
    });
    return author;
  }

  async remove(id: number) {
    await this.findOne(id);
    const author = await this.prisma.author.delete({
      where: { id },
    });
    return author;
  }
}
