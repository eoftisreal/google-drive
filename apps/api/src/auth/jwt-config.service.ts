import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtConfigService {
  private secret: string;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error(
        'CRITICAL: JWT_SECRET environment variable is not set. ' +
        'Set a strong, unique JWT_SECRET in your .env file'
      );
    }
    this.secret = process.env.JWT_SECRET;

    if (this.secret.length < 32) {
      console.warn('WARNING: JWT_SECRET should be at least 32 characters long');
    }
  }

  getSecret(): string {
    return this.secret;
  }
}
