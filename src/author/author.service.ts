import { HttpException, Injectable } from '@nestjs/common';
import { UpdateAuthorDto } from 'src/author/dto/update-author.dto';
import { PrismaService } from 'src/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const { name } = createAuthorDto;
    const author = await this.prisma.author.create({
      data: {
        name,
      },
    });
    return author;
  }

  async findAll() {
    const authors = await this.prisma.author.findMany();
    const booksAuthors = await this.prisma.book_author.findMany();

    const result = authors
      .map((author) => {
        const booksCount = booksAuthors.filter(
          (bookAuthor) => bookAuthor.author_id === author.id,
        ).length;
        if (booksCount === 0) {
          return null;
        }

        return {
          author_name: author.name,
          book_count: booksCount,
        };
      })
      .filter((item) => item !== null);
    return result;
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
    const { name } = updateAuthorDto;
    await this.findOne(id);
    const author = await this.prisma.author.update({
      where: { id },
      data: {
        name,
      },
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
