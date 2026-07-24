import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConfigService } from './jwt-config.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (jwtConfig: JwtConfigService) => ({
        secret: jwtConfig.getSecret(),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [JwtConfigService],
    }),
  ],
  providers: [JwtConfigService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
