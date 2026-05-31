import { defineCollection, z } from 'astro:content';

const categoryEnum = z.enum([
  'alert',
  'council',
  'traffic',
  'event',
  'business',
  'community',
]);

const newsSchema = z.object({
  title: z.string(),
  permalink: z.string().optional(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  category: categoryEnum,
  urgent: z.boolean().default(false),
  verified: z.boolean().default(false),
  source: z.string(),
  sourceUrl: z.union([z.string().url(), z.literal('')]).optional(),
  expiresAt: z.coerce.date().optional(),
  eventStart: z.coerce.date().optional(),
  eventEnd: z.coerce.date().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).default([]),
  community: z.string().default('riverside'),
});

export const collections = {
  news: defineCollection({
    type: 'content',
    schema: newsSchema,
  }),
};

export type NewsEntry = z.infer<typeof newsSchema>;
