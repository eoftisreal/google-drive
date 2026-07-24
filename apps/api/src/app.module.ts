import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Import all feature modules
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MediaModule } from './media/media.module';
import { StorageModule } from './storage/storage.module';
import { HistoryModule } from './history/history.module';
import { StreamModule } from './stream/stream.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Core modules
    PrismaModule,

    // Feature modules
    HealthModule,
    AuthModule,
    UsersModule,
    MediaModule,
    StorageModule,
    HistoryModule,
    StreamModule,
  ],
})
export class AppModule {}
