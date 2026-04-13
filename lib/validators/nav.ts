import { z } from 'zod';

export const navCategoryCreateSchema = z.object({
  label: z.string().min(1, '分类名称不能为空').max(60),
  key: z.string().optional(),
});

export const navCategoryUpdateSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1, '分类名称不能为空').max(60),
  key: z.string().min(1, '分类标识不能为空').max(80),
});

export const navCategoryReorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

export const navSiteCreateSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1, '站点名称不能为空').max(120),
  url: z.string().url('请输入合法链接'),
  description: z.string().max(300).optional().default(''),
  tags: z.array(z.string().max(24)).optional().default([]),
});

export const navSiteUpdateSchema = z.object({
  id: z.string().min(1),
  categoryId: z.string().min(1),
  name: z.string().min(1, '站点名称不能为空').max(120),
  url: z.string().url('请输入合法链接'),
  description: z.string().max(300).optional().default(''),
  tags: z.array(z.string().max(24)).optional().default([]),
});

export const navSiteReorderSchema = z.object({
  categoryId: z.string().min(1),
  ids: z.array(z.string().min(1)).min(1),
});
