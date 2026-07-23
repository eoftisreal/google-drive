import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [StreamController],
})
export class StreamModule {}
