import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    const author = await this.prisma.category.create({
      data: {
        name,
      },
    });
    return author;
  }

  async findAll() {
    const categories = await this.prisma.category.findMany();
    const books = await this.prisma.book.findMany();
    // 手动统计每个分类的书籍数量
    const result = categories
      .map((category) => {
        const bookCount = books.filter(
          (book) => book.category_id === category.id,
        ).length;

        // 若分类下无书籍，则不返回该分类
        if (bookCount === 0) {
          return null;
        }
        return {
          category_id: category.id,
          name: category.name,
          book_count: bookCount,
        };
      })
      // 过滤掉 undefined
      .filter((item) => item !== null);
    return result;
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: id },
    });
    if (!category) {
      throw new HttpException('category not found', 400);
    }

    return category;
  }

  async findByName(name: string) {
    const category = await this.prisma.category.findFirst({
      where: { name: name },
    });
    if (!category) {
      throw new HttpException('category not found', 400);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
    return category;
  }

  async remove(id: number) {
    await this.findOne(id);
    const category = await this.prisma.category.delete({
      where: { id },
    });
    return category;
  }
}
