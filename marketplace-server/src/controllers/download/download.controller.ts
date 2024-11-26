import { Controller, Param, UseInterceptors } from '@nestjs/common';
import { DownloadService } from './download.service';
import { Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';

@Controller('download')
@UseInterceptors(LoggingInterceptor)
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get('imageBuffer/:id')
  async imageBuffer(
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const { file, cleanName, size, mimeType } = await this.downloadService.imageBuffer(id);

    response.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${cleanName}"`,
      'Content-Length': size.toString(),
    });
  
    response.send(file);
  }

  @Get('fileBuffer/:id')
  async fileBuffer(
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const { file, cleanName, size, mimeType } = await this.downloadService.fileBuffer(id);

    response.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${cleanName}"`,
      'Content-Length': size.toString(),
    });
  
    response.send(file);
  }

  @Get('imageStream/:id')
  async imageStream(
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const { file, cleanName, size, mimeType } = await this.downloadService.imageStream(id);

    response.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${cleanName}"`,
      'Content-Length': size.toString(),
    });

    file.pipe(response);
  }

  @Get('fileStream/:id')
  async fileStream(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { file, cleanName, size, mimeType } = await this.downloadService.fileStream(id);

    response.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${cleanName}"`,
      'Content-Length': size.toString(),
    });

    file.pipe(response);
  }
}
