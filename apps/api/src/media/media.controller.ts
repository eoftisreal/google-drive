import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaSchema, PaginationSchema } from 'core';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('media')
export class MediaController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Query() query: any) {
    const { page, limit } = PaginationSchema.parse({
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
    });
    const skip = (page - 1) * limit;

    // Simplistic text search using Prisma contains for MVP
    const whereClause = query.search ? {
      title: { contains: query.search, mode: 'insensitive' as any },
      deletedAt: null
    } : { deletedAt: null };

    const [data, total] = await Promise.all([
      this.prisma.media.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.media.count({ where: whereClause }),
    ]);

    return {
      data,
      meta: { total, page, limit },
      error: null,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id, deletedAt: null },
      include: { sources: true },
    });

    if (!media) {
      return { data: null, error: { code: 'NOT_FOUND', message: 'Media not found' } };
    }
    return { data: media, error: null };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() body: any, @Query('userId') userId: string) {
    const validatedData = CreateMediaSchema.parse(body);

    // In a real flow, you'd extract userId from the JWT payload via req.user
    // Using query string userId here purely to bypass complex token generation in scaffold

    const media = await this.prisma.media.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        posterUrl: validatedData.posterUrl,
        createdBy: userId || 'system', // Fallback to avoid relation error
        sources: {
          create: [{
            provider: validatedData.provider as any,
            providerFileId: validatedData.providerFileId,
          }]
        }
      },
      include: { sources: true }
    });

    return { data: media, error: null };
  }
}
