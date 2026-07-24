import { Controller, Post, Body, Get, Param, UseGuards, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/history')
export class HistoryController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':userId')
  async getHistory(@Param('userId') userId: string) {
    const history = await this.prisma.watchHistory.findMany({
      where: { userId },
      include: { media: true },
      orderBy: { updatedAt: 'desc' },
      take: 20
    });
    return { data: history, error: null };
  }

  @Post()
  async updateProgress(@Body() body: { userId: string, mediaId: string, progressSeconds: number, completed: boolean }) {
    const record = await this.prisma.watchHistory.upsert({
      where: {
        userId_mediaId: { userId: body.userId, mediaId: body.mediaId }
      },
      update: {
        progressSeconds: body.progressSeconds,
        completed: body.completed,
      },
      create: {
        userId: body.userId,
        mediaId: body.mediaId,
        progressSeconds: body.progressSeconds,
        completed: body.completed,
      }
    });
    return { data: record, error: null };
  }
}
