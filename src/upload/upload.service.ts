// src/upload/upload.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  async saveFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const filePath = join('uploads', file.filename);
    
    return {
      originalName: file.originalname,
      filename: file.filename,
      path: filePath,
      size: file.size,
      mimetype: file.mimetype
    };
  }

  async saveMultipleFiles(files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    return files.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      path: join('uploads', file.filename),
      size: file.size,
      mimetype: file.mimetype
    }));
  }

  async getFile(filename: string) {
    const filePath = join(process.cwd(), 'uploads', filename);
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      throw new BadRequestException('File not found');
    }
  }
}