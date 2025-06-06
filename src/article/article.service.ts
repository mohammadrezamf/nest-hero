import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Article } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article-dto';
import { User } from '../auth/user.entity';
import * as fs from 'fs';
import * as path from 'path';

const SERVER_URL = 'https://mentoo-api.liara.run'; // you can move this to

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async createArticle(
    createArticleDto: CreateArticleDto,
    user: User,
  ): Promise<Article> {
    try {
      const article = this.articleRepository.create({
        ...createArticleDto,
        user,
      });
      await this.articleRepository.save(article);
      return article;
    } catch (error) {
      console.error('Error creating article:', error);
      throw new InternalServerErrorException('Failed to create article');
    }
  }

  async getAll() {
    try {
      const articles = await this.articleRepository.find();
      if (!articles) {
        throw new NotFoundException('no articles found');
      }

      return articles.map((item) => {
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          imageUrl: `${SERVER_URL}/uploads/files/${item.imageFilename}`,
        };
      });
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw new InternalServerErrorException('Failed to fetch articles');
    }
  }

  async getById(id: string) {
    const found = await this.articleRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`article with id ${id} not found`);
    }
    return {
      id: found.id,
      title: found.title,
      description: found.description,
      imageUrl: `${SERVER_URL}/uploads/files/${found.imageFilename}`,
    };
  }

  async deleteById(id: string) {
    const article = await this.articleRepository.findOne({ where: { id: id } });
    if (!article) {
      throw new NotFoundException('article with id not found');
    }

    const imagepath = path.join(
      __dirname,
      '..',
      '..',
      'upload',
      'files',
      article.imageFilename,
    );

    try {
      fs.unlinkSync(imagepath);
    } catch (err) {
      console.log('err', err);
    }

    try {
      await this.articleRepository.delete(id);
    } catch (error) {
      console.log('err', error);
      throw error;
    }

    return { message: 'deleted article' };
  }
}
