import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  async findAll() {
    return this.bookService.findAll();
  }

  @Get()
  async getBooks(
    @Query('page') page: number = 1, // 当前页，默认第 1 页
    @Query('pageSize') pageSize: number = 10, // 每页条数，默认 10 条
    @Query('search') search?: string, // 搜索关键字（可选）
  ) {
    return this.bookService.getBooks(page, pageSize, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
