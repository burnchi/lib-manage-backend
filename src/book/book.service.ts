import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  // -------------------------------------- 创建书籍
  async create(createBookDto: CreateBookDto) {
    // 前端传来的参数
    const { publishedAt, title, category_name, author_list, copied_owned } =
      createBookDto;

    // 根据 category_name 查找 category_id
    let category = await this.prisma.category.findUnique({
      where: { name: category_name },
    });
    // console.log(category);

    // 如果 category 不存在,则创建 category
    if (!category) {
      category = await this.prisma.category.create({
        data: {
          name: category_name,
        },
      });
    }

    // 处理作者名字，确保每个作者都有对应的 author_id
    const authorIds = await Promise.all(
      author_list.map(async (name) => {
        // 查找作者是否已存在
        const existingAuthor = await this.prisma.author.findUnique({
          where: { name },
        });

        if (existingAuthor) {
          return existingAuthor.id; // 返回已有作者的 ID
        }

        // 如果作者不存在，则创建新作者
        const newAuthor = await this.prisma.author.create({
          data: { name },
        });

        return newAuthor.id; // 返回新创建作者的 ID
      }),
    );

    // 创建书籍
    const book = await this.prisma.book.create({
      data: {
        title,
        category_id: category.id,
        publishedAt,
        copied_owned,
      },
    });

    // 将书籍与作者关联
    const bookAuthorRecords = authorIds.map((author_id) => ({
      book_id: book.id,
      author_id,
    }));

    // 批量插入 BookAuthor 表
    await this.prisma.$executeRaw`
      INSERT INTO book_author (book_id, author_id)
      VALUES ${Prisma.join(bookAuthorRecords.map((rec) => Prisma.sql`(${rec.book_id}, ${rec.author_id})`))}
    `;

    return { book, authors: author_list };
  }

  // -------------------------------------- 查询所有书籍信息
  async findAll() {
    const books = await this.prisma.book.findMany();

    // 在组合表中，获取每本书的作者信息
    const booksWithAuthors = await Promise.all(
      books.map(async (book) => {
        const authors = await this.prisma.$queryRaw`
          SELECT a.*
          FROM author a
          JOIN book_author ba ON a.id = ba.author_id
          WHERE ba.book_id = ${book.id}
        `;

        // 获取书籍对应的分类名称
        const category = await this.prisma.category.findUnique({
          where: { id: book.category_id },
        });

        // 去掉 category_id 字段
        const { category_id, ...rest } = book;
        return {
          ...rest,
          category,
          authors, // 添加作者信息
        };
      }),
    );
    return booksWithAuthors;
  }

  async getBooks(page: number, pageSize: number, search?: string) {
    // 计算分页的起始位置
    const skip = (page - 1) * pageSize;
    // console.log(typeof page);
    // console.log(typeof pageSize);

    // 搜索条件
    const where = search
      ? {
          OR: [
            { title: { contains: search } }, // 搜索书名（大小写不敏感）
            // { category: { name: { contains: search, mode: 'insensitive' } } }, // 搜索分类名
          ],
        }
      : {};

    // 查询当前页的数据
    const books = await this.prisma.book.findMany({
      skip,
      take: pageSize,
      orderBy: {
        uploadedAt: 'desc',
      },
      where,
    });

    // 查询符合条件的总记录数
    const totalCount = await this.prisma.book.count({ where });

    // 在组合表中，获取每本书的作者信息
    const booksWithAuthors = await Promise.all(
      books.map(async (book) => {
        const authors = await this.prisma.$queryRaw`
          SELECT a.*
          FROM author a
          JOIN book_author ba ON a.id = ba.author_id
          WHERE ba.book_id = ${book.id}
        `;

        // 获取书籍对应的分类名称
        const category = await this.prisma.category.findUnique({
          where: { id: book.category_id },
        });

        // 去掉 category_id 字段
        const { category_id, ...rest } = book;
        return {
          ...rest,
          category,
          authors, // 添加作者信息
        };
      }),
    );

    // 最终返回的数据
    return {
      books: booksWithAuthors,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }

  // -------------------------------------- 查询一本书籍
  async findOne(id: number) {
    // TODO: 优化查询效率 这里查询了两次数据库,可以简化为一次查询
    const book = await this.prisma.book.findUnique({
      where: { id: id },
    });
    if (!book) {
      throw new HttpException('Book not found', 400);
    }

    // 查询该书籍的作者
    const authors = await this.prisma.$queryRaw`
      SELECT a.*
      FROM author a
      JOIN book_author ba ON a.id = ba.author_id
      WHERE ba.book_id = ${id}
    `;

    return {
      ...book,
      authors,
    };
  }

  // -------------------------------------- 更新一本书籍
  async update(id: number, updateBookDto: UpdateBookDto) {
    const { title, category_name, publishedAt, copied_owned, author_list } =
      updateBookDto;
    await this.findOne(id);
    let category_id: number | undefined;

    if (category_name) {
      // 根据 category_name 查找 category_id
      let category = await this.prisma.category.findUnique({
        where: { name: category_name },
      });

      // 如果 category 不存在,则创建 category
      if (!category) {
        category = await this.prisma.category.create({
          data: {
            name: category_name,
          },
        });
      }
      category_id = category.id;
    }

    // 检测请求体传来什么参数
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt;
    if (copied_owned !== undefined) updateData.copied_owned = copied_owned;

    const book = await this.prisma.book.update({
      where: { id },
      data: updateData,
    });

    // 如果有作者名字列表，则更新作者关联关系
    if (author_list && author_list.length > 0) {
      // 获取当前书籍关联的作者
      const currentAuthors = await this.prisma.$queryRaw`
        SELECT a.id, a.name
        FROM author a
        JOIN book_author ba ON a.id = ba.author_id
        WHERE ba.book_id = ${id}
      `;

      const currentAuthorNames = (currentAuthors as any).map(
        (author: any) => author.name,
      );

      // 找出需要新增的作者名字（前端传递的名字中不存在于当前关联中的作者）
      const authorsToAdd = author_list.filter(
        (name) => !currentAuthorNames.includes(name),
      );

      // 找出需要删除的作者名字（当前关联的作者中不在前端传递的名字中）
      const authorsToRemove = currentAuthorNames.filter(
        (name) => !author_list.includes(name),
      );

      // 处理新增的作者
      const authorIdsToAdd = [];
      for (const name of authorsToAdd) {
        // 检查作者是否存在
        const existingAuthor = await this.prisma.author.findUnique({
          where: { name },
        });

        if (existingAuthor) {
          authorIdsToAdd.push(existingAuthor.id);
        } else {
          // 创建新作者
          const newAuthor = await this.prisma.author.create({
            data: { name },
          });
          authorIdsToAdd.push(newAuthor.id);
        }
      }

      // 插入新增的作者关系到中间表
      if (authorIdsToAdd.length > 0) {
        await this.prisma.$executeRaw`
      INSERT INTO book_author (book_id, author_id)
      VALUES ${Prisma.join(
        authorIdsToAdd.map(
          (authorId) => Prisma.sql`(${id}, ${authorId})`, // 修正了 book_id 和 author_id 的对应关系
        ),
      )}
    `;
      }

      // 删除需要移除的作者关系
      if (authorsToRemove.length > 0) {
        await this.prisma.$executeRaw`
          DELETE FROM book_author
          WHERE book_id = ${id}
          AND author_id IN (
            SELECT id
            FROM author
            WHERE name IN (${Prisma.join(authorsToRemove)})
          )
        `;
      }
    }

    return { ...book, author_list };
  }

  // -------------------------------------- 删除一本书籍
  async remove(id: number) {
    await this.findOne(id);

    // 删除中间表中的关联记录
    await this.prisma.$executeRaw`
      DELETE FROM book_author WHERE book_id = ${id}
    `;

    // 删除书籍
    const book = await this.prisma.book.delete({
      where: { id },
    });
    return { message: 'Book deleted successfully', id };
  }
}
