import { Controller, Get } from '@nestjs/common';

@Controller('')
export class RootController {
  @Get()
  getRoot() {
    return {
      status: 'running',
      name: 'Google Drive Streaming API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      availableEndpoints: [
        '/api/health - API health status',
        '/api/media - Media management',
        '/api/stream/:id - Stream media',
        '/api/history/:userId - Watch history',
      ]
    };
  }

  @Get('version')
  getVersion() {
    return {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
