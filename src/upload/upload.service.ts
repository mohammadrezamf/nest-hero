import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  getFileUrl(fileName: string): string {
    return `http://localhost:3000/upload/${fileName}`;
  }
}
