import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const MediaSourceSchema = z.object({
  id: z.string().uuid(),
  provider: z.enum(['GOOGLE_DRIVE', 'S3', 'R2']),
  quality: z.string().nullable(),
});

export const MediaSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().nullable(),
  posterUrl: z.string().url().nullable(),
  duration: z.number().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  sources: z.array(MediaSourceSchema).optional(),
});

export const CreateMediaSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  posterUrl: z.string().url().optional(),
  provider: z.enum(['GOOGLE_DRIVE', 'S3', 'R2']),
  providerFileId: z.string().min(1),
});

export type PaginationQuery = z.infer<typeof PaginationSchema>;
export type User = z.infer<typeof UserSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type CreateMediaDTO = z.infer<typeof CreateMediaSchema>;

export interface ApiResponse<T> {
  data: T | null;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
  error: {
    code: string;
    message: string;
  } | null;
}
