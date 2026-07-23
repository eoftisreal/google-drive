import { Controller, Get, Param, Headers, Res, HttpStatus, NotFoundException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Controller('stream')
export class StreamController {
  private readonly logger = new Logger(StreamController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService
  ) {}

  @Get(':id')
  async streamMedia(@Param('id') id: string, @Headers('range') range: string, @Res() res: Response) {
    try {
      // Find media source
      const source = await this.prisma.mediaSource.findFirst({
        where: { mediaId: id },
      });

      if (!source) {
        throw new NotFoundException('Media source not found');
      }

      const provider = this.storage.getProvider(source.provider);
      const metadata = await provider.getMetadata(source.providerFileId);

      const fileSize = metadata.size;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunksize = (end - start) + 1;
        const stream = await provider.getStream(source.providerFileId, range);

        res.writeHead(HttpStatus.PARTIAL_CONTENT, {
          'Content-Range': \`bytes \${start}-\${end}/\${fileSize}\`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': metadata.mimeType,
        });

        stream.pipe(res);
      } else {
        res.writeHead(HttpStatus.OK, {
          'Content-Length': fileSize,
          'Content-Type': metadata.mimeType,
        });

        const stream = await provider.getStream(source.providerFileId);
        stream.pipe(res);
      }
    } catch (error: any) {
      this.logger.error(\`Failed to stream media \${id}\`, error.stack);
      if (!res.headersSent) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: { code: 'STREAM_ERROR', message: error.message } });
      }
    }
  }
}
