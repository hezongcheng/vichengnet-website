import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  titleEn: z.string().optional(),
  slug: z.string().min(1, 'slug 不能为空'),
  summary: z.string().optional(),
  summaryEn: z.string().optional(),
  content: z.string().min(1, '正文不能为空'),
  contentEn: z.string().optional(),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  categoryEn: z.string().optional(),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().optional(),
  seoTitleEn: z.string().optional(),
  seoDescription: z.string().optional(),
  seoDescriptionEn: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoKeywordsEn: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  publishedAt: z.string().optional().nullable(),
});
