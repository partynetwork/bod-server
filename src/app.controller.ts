import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'hello';
  }

  @Post('ocr')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000 }), // 10kb
          new FileTypeValidator({ fileType: new RegExp('^image/') }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const text = await this.appService.extractTextFromImage(file);
    return { message: 'File uploaded successfully', text };
  }
}
