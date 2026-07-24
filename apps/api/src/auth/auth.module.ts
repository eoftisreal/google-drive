import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || undefined,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule implements OnModuleInit {
  private readonly logger = new Logger(AuthModule.name);

  onModuleInit() {
    // Validate JWT_SECRET on module initialization
    if (!process.env.JWT_SECRET) {
      const error = 'CRITICAL: JWT_SECRET environment variable is not set. Set a strong, unique JWT_SECRET in your .env file';
      this.logger.error(error);
      throw new Error(error);
    }

    if (process.env.JWT_SECRET.length < 32) {
      this.logger.warn('WARNING: JWT_SECRET should be at least 32 characters long for production security');
    }

    this.logger.log('✅ JWT_SECRET validated successfully');
  }
}
