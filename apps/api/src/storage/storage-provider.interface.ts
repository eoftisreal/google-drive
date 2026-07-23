import { Readable } from 'stream';

export interface MediaMetadata {
  size: number;
  mimeType: string;
}

export interface IStorageProvider {
  name: string;
  getMetadata(fileId: string): Promise<MediaMetadata>;
  getStream(fileId: string, range?: string): Promise<Readable>;
}
