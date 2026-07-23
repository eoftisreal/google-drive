import { Injectable, Logger } from '@nestjs/common';
import { IStorageProvider, MediaMetadata } from './storage-provider.interface';
import { Readable } from 'stream';

@Injectable()
export class GoogleDriveProvider implements IStorageProvider {
  name = 'GOOGLE_DRIVE';
  private readonly logger = new Logger(GoogleDriveProvider.name);

  async getMetadata(fileId: string): Promise<MediaMetadata> {
    // Mock implementation for MVP to avoid needing real GDrive credentials in this setup
    this.logger.debug(`Fetching metadata for ${fileId}`);
    return {
      size: 100000000, // 100MB
      mimeType: 'video/mp4',
    };
  }

  async getStream(fileId: string, range?: string): Promise<Readable> {
    this.logger.debug(`Fetching stream for ${fileId} with range ${range}`);

    // Create a mock stream that sends fake data
    const start = range ? parseInt(range.replace(/\D/g, '')) || 0 : 0;
    const stream = new Readable({
      read(size) {
        this.push(Buffer.alloc(size, 0));
        this.push(null); // End immediately for the mock
      }
    });
    return stream;
  }
}
