import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Add global exception filter
    app.useGlobalFilters(new AllExceptionsFilter());

    // Set global prefix to match DigitalOcean preserve_path_prefix
    app.setGlobalPrefix('api');

    // Enable CORS with configurable origins
    app.enableCors({
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    });

    // Start listening
    const port = process.env.PORT || 8080;
    await app.listen(port);

    console.log(`🚀 API Server running on http://localhost:${port}`);
    console.log(`📍 Routes available at http://localhost:${port}/ (or https://yourdomain.com/api/ in production)`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
