import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateArticleDto } from './dto/create-article-dto';
import { Article } from './article.entity';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @GetUser() user: User,
  ): Promise<Article> {
    return this.articleService.createArticle(createArticleDto, user);
  }

  @Get()
  async getAll() {
    return this.articleService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.articleService.getById(id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.articleService.deleteById(id);
  }
}
