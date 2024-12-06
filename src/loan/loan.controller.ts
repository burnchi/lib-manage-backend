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
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoanService } from './loan.service';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  async create(@Body() createLoanDto: CreateLoanDto) {
    return this.loanService.create(createLoanDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1, // 当前页，默认第 1 页
    @Query('pageSize') pageSize: number = 6, // 每页条数，默认 10 条
    @Query('book') book?: string, // 搜索关键字（可选）
    @Query('member') member?: string, // 搜索关键字（可选）
    @Query('returned') returned?: number, // 搜索关键字（可选）
  ) {
    return this.loanService.findAll(+page, +pageSize, book, member, +returned);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.loanService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return this.loanService.update(+id, updateLoanDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.loanService.remove(+id);
  }
}
