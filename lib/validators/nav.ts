import { z } from 'zod';

export const navCategoryCreateSchema = z.object({
  labelZh: z.string().min(1, '中文分类名称不能为空').max(60),
  labelEn: z.string().min(1, 'English category name is required').max(60),
  key: z.string().optional(),
});

export const navCategoryUpdateSchema = z.object({
  id: z.string().min(1),
  key: z.string().min(1, '分类标识不能为空').max(80),
  labelZh: z.string().min(1, '中文分类名称不能为空').max(60),
  labelEn: z.string().min(1, 'English category name is required').max(60),
});

export const navCategoryReorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

export const navSiteCreateSchema = z.object({
  categoryId: z.string().min(1),
  nameZh: z.string().min(1, '中文站点名称不能为空').max(120),
  nameEn: z.string().min(1, 'English site name is required').max(120),
  url: z.string().url('请输入合法链接'),
  descriptionZh: z.string().max(300).optional().default(''),
  descriptionEn: z.string().max(300).optional().default(''),
  tags: z.array(z.string().max(24)).optional().default([]),
});

export const navSiteUpdateSchema = z.object({
  id: z.string().min(1),
  categoryId: z.string().min(1),
  nameZh: z.string().min(1, '中文站点名称不能为空').max(120),
  nameEn: z.string().min(1, 'English site name is required').max(120),
  url: z.string().url('请输入合法链接'),
  descriptionZh: z.string().max(300).optional().default(''),
  descriptionEn: z.string().max(300).optional().default(''),
  tags: z.array(z.string().max(24)).optional().default([]),
});

export const navSiteReorderSchema = z.object({
  categoryId: z.string().min(1),
  ids: z.array(z.string().min(1)).min(1),
});
