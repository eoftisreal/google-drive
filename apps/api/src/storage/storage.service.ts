import { Injectable } from '@nestjs/common';
import { IStorageProvider } from './storage-provider.interface';
import { GoogleDriveProvider } from './google-drive.provider';

@Injectable()
export class StorageService {
  private providers: Map<string, IStorageProvider> = new Map();

  constructor(private googleDrive: GoogleDriveProvider) {
    this.providers.set(this.googleDrive.name, this.googleDrive);
  }

  getProvider(name: string): IStorageProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Storage provider ${name} not found`);
    }
    return provider;
  }
}
