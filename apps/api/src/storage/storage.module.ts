import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { GoogleDriveProvider } from './google-drive.provider';

@Module({
  providers: [StorageService, GoogleDriveProvider],
  exports: [StorageService],
})
export class StorageModule {}
