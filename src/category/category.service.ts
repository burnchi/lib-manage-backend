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
    const categorys = await this.prisma.category.findMany();
    return categorys;
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
