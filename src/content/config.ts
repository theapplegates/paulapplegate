import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    /** Cloudinary public ID — no leading slash, no file extension */
    coverImage: z.string(),
    coverAlt: z.string(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Eugene Musebe'),
  }),
});

export const collections = { blog };
