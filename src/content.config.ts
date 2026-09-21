import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    /** Cloudinary public ID — no leading slash, no file extension */
    coverImage: z.string(),
    /** Optional per-image account; the bundled sample posts use demo. */
    coverCloudName: z.string().optional(),
    coverAlt: z.string(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Paul Applegate'),
  }),
});

export const collections = { blog };
