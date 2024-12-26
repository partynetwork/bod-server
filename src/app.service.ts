import { Injectable } from '@nestjs/common';
import { createWorker } from 'tesseract.js';

@Injectable()
export class AppService {
  async extractTextFromImage(file: Express.Multer.File): Promise<string> {
    const worker = await createWorker('eng');
    const recognizeResult = await worker.recognize(file.buffer);
    return this.sanitizeText(recognizeResult.data.text);
  }

  private sanitizeText(text: string): string {
    return text.replace(/[\n\r]/g, ' ').trim();
  }
}
