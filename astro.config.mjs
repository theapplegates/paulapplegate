// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import process from 'node:process';
import rehypeCloudinaryPicture from './src/plugins/rehype-cloudinary-picture.mjs';

const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), 'PUBLIC_');

export default defineConfig({
  markdown: {
    rehypePlugins: [[rehypeCloudinaryPicture, { cloudName: env.PUBLIC_CLOUDINARY_CLOUD_NAME }]],
  },
});
