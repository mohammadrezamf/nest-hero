import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  imageFilename?: string;
}
