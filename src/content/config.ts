import { defineCollection, z } from 'astro:content';

const categoryEnum = z.enum([
  'alert',
  'council',
  'traffic',
  'event',
  'business',
  'community',
]);

const httpUrl = z.string().url().refine((value) => {
  const protocol = new URL(value).protocol;
  return protocol === 'http:' || protocol === 'https:';
}, 'Must be an HTTP(S) URL');

const optionalHttpUrl = z.union([httpUrl, z.literal('')]).optional();

const newsSchema = z.object({
  title: z.string(),
  permalink: z.string().optional(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  category: categoryEnum,
  urgent: z.boolean().default(false),
  verified: z.boolean().default(false),
  source: z.string(),
  sourceUrl: optionalHttpUrl,
  expiresAt: z.coerce.date().optional(),
  eventStart: z.coerce.date().optional(),
  eventEnd: z.coerce.date().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).default([]),
  community: z.string().default('monasterevin'),
});

const serviceCategoryEnum = z.enum([
  'plumber',
  'electrician',
  'builder',
  'gardener',
  'mechanic',
  'childcare',
  'cleaner',
  'painter',
  'roofer',
  'cafe',
  'shop',
  'other',
]);

const socialSchema = z
  .object({
    facebook: optionalHttpUrl,
    instagram: optionalHttpUrl,
    twitter: optionalHttpUrl,
    linkedin: optionalHttpUrl,
  })
  .optional();

const serviceSchema = z.object({
  name: z.string(),
  category: serviceCategoryEnum,
  address: z.string(),
  phone: z.string().optional(),
  email: z.union([z.string().email(), z.literal('')]).optional(),
  website: optionalHttpUrl,
  social: socialSchema,
  verified: z.boolean().default(false),
  description: z.string().optional(),
  community: z.string().default('monasterevin'),
});

export const collections = {
  news: defineCollection({
    type: 'content',
    schema: newsSchema,
  }),
  services: defineCollection({
    type: 'data',
    schema: serviceSchema,
  }),
};

export type NewsEntry = z.infer<typeof newsSchema>;
export type ServiceEntry = z.infer<typeof serviceSchema>;
