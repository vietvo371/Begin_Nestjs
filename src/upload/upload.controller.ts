// src/upload/upload.controller.ts
import { 
  Controller, 
  Post, 
  Get,
  Param,
  Res,
  UseInterceptors, 
  UploadedFile,
  UploadedFiles,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('single')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      // new ParseFilePipe({
      //   validators: [
      //     new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
      //     new FileTypeValidator({ fileType: '(png|jpeg|jpg)' }),
      //   ],
      // }),
    ) file: Express.Multer.File,
  ) {
    return this.uploadService.saveFile(file);
  }

  @Post('multiple')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 5)) // Maximum 5 files
  async uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.uploadService.saveMultipleFiles(files);
  }

  @Get('files/:filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const file = await this.uploadService.getFile(filename);
    res.sendFile(file);
  }
}