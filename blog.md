# Build a Fast Image Blog with Astro and Cloudinary

Portfolio sites live and die by their images. A single unoptimized JPEG hero can weigh 2 MB, kill your Core Web Vitals, and cost your visitors on metered mobile data. This tutorial shows you how to build a blog where every image is automatically optimized, correctly sized for every screen, and generates its own Open Graph social card — without touching an image editor.

By the end you will have:

- A working Astro blog with dynamic routes
- A Cloudinary URL builder that enforces `f_auto` and `q_auto` on every image
- A reusable `<CloudinaryImage>` component with responsive `srcset`
- A cinematic blurred hero built from a single Cloudinary image
- Open Graph images auto-generated for every page
- A Lighthouse score of 100 across all categories

---

## The core idea

Cloudinary is not just image storage. It is a transformation pipeline that runs in the URL. You describe what you want — width, format, quality, crop, blur — and Cloudinary generates the result on the fly. The browser never sees the original file.

The most important transformations are:

| Parameter | What it does |
|---|---|
| `f_auto` | Serves AVIF to Chrome, WebP to Safari, JPEG as fallback |
| `q_auto` | Finds the lowest quality the eye won't notice |
| `c_fill,g_auto` | Crops to exact dimensions; AI picks the focal point |
| `e_blur:N` | Gaussian blur — `2000` is cinematic, `500` is soft |
| `e_grayscale` | Converts to black and white server-side |
| `w_N,h_N` | Resizes to exact pixel dimensions |

A URL with all of the above looks like this:

```
https://res.cloudinary.com/your-cloud/image/upload/f_auto,q_auto,w_800,c_fill,g_auto/my-photo
```

Everything between `upload/` and `/my-photo` is the transformation string. You can stack as many parameters as you need.

---

## Step 1 — Create the Astro project

```bash
npm create astro@latest my-portfolio
cd my-portfolio
npm install
```

Astro 6 ships with TypeScript and static site generation out of the box. No additional packages are needed for Cloudinary — it is just URLs.

---

## Step 2 — Add your Cloudinary cloud name

Create a `.env` file in the project root:

```
PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

Find your cloud name at the top of the [Cloudinary Console](https://console.cloudinary.com) dashboard. Prefix it with `PUBLIC_` so Astro exposes it to the client at build time.

---

## Step 3 — Build the Cloudinary URL library

Create `src/lib/cloudinary.ts`. This is the only file in the project that constructs Cloudinary URLs. Everything else imports from here.

```typescript
// src/lib/cloudinary.ts

const CLOUD_NAME = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'demo';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south';
  blur?: number;
  grayscale?: boolean;
}

function buildTransformations(options: CloudinaryOptions): string {
  const t: string[] = ['f_auto', 'q_auto'];  // always on — you cannot forget them

  if (options.width)     t.push(`w_${options.width}`);
  if (options.height)    t.push(`h_${options.height}`);
  if (options.crop)      t.push(`c_${options.crop}`);
  if (options.gravity)   t.push(`g_${options.gravity}`);
  if (options.blur)      t.push(`e_blur:${options.blur}`);
  if (options.grayscale) t.push('e_grayscale');

  return t.join(',');
}

export function getImageUrl(publicId: string, options: CloudinaryOptions = {}): string {
  return `${BASE_URL}/${buildTransformations(options)}/${publicId}`;
}

export function getSrcSet(
  publicId: string,
  widths: number[] = [400, 800, 1200, 1600],
  options: Omit<CloudinaryOptions, 'width'> = {},
): string {
  return widths
    .map(w => `${getImageUrl(publicId, { ...options, width: w })} ${w}w`)
    .join(', ');
}
```

**Why this matters:** `f_auto` and `q_auto` are prepended inside `buildTransformations` before any other option. They are part of the array literal, not a conditional. You cannot call `getImageUrl` without them. This is the architecture decision that makes the whole template safe by default.

**What `getSrcSet` does:** It calls `getImageUrl` once per width in the `widths` array and joins the results into a standard `srcset` string. Cloudinary generates each resized variant on the fly when the URL is first requested, then caches it on their CDN.

---

## Step 4 — Build the `CloudinaryImage` component

This is a drop-in replacement for `<img>` that wires every image through the Cloudinary pipeline.

```astro
---
// src/components/CloudinaryImage.astro
import { getImageUrl, getSrcSet } from '../lib/cloudinary';
import type { CloudinaryOptions } from '../lib/cloudinary';

interface Props extends CloudinaryOptions {
  publicId: string;
  alt: string;
  width: number;
  height: number;
  widths?: number[];
  sizes?: string;
  loading?: 'lazy' | 'eager';
  class?: string;
}

const {
  publicId, alt, width, height,
  widths = [400, 800, 1200, 1600],
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'lazy',
  class: className,
  ...cloudinaryOptions
} = Astro.props;

const src    = getImageUrl(publicId, { width, height, ...cloudinaryOptions });
const srcset = getSrcSet(publicId, widths, cloudinaryOptions);
---

<img
  src={src}
  srcset={srcset}
  sizes={sizes}
  alt={alt}
  width={width}
  height={height}
  loading={loading}
  decoding="async"
  class={className}
/>
```

**Three accessibility and performance rules enforced by this component:**

1. **`alt` is required** — TypeScript will error at build time if you forget it. Screen readers and search engines depend on alt text.

2. **`width` and `height` are required** — These give the browser the aspect ratio before the image loads. Without them, the page reflows when the image arrives (Cumulative Layout Shift). This is one of the most common Lighthouse failures.

3. **`loading="lazy"` by default** — Images below the fold are deferred. Pass `loading="eager"` for above-the-fold heroes.

**Usage:**

```astro
<CloudinaryImage
  publicId="my-photo"
  alt="A clear description of the image"
  width={800}
  height={500}
  crop="fill"
  gravity="auto"
  loading="eager"
/>
```

That single component call produces a fully optimized `<img>` with a four-width `srcset`. The browser picks the right size automatically.

---

## Step 5 — Set up content collections

Astro's content collections give every blog post a validated schema. If you forget a required field the build fails — not silently at runtime.

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    coverImage: z.string(),   // Cloudinary public ID — no extension, no leading slash
    coverAlt: z.string(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Your Name'),
  }),
});

export const collections = { blog };
```

Note that `coverImage` stores a **Cloudinary public ID**, not a file path or full URL. The URL is always built at render time by `cloudinary.ts`. This means you can change the transformation — crop mode, dimensions, effects — without touching a single piece of content.

**A blog post looks like this:**

```markdown
---
title: "Build a Fast Portfolio in Astro with Cloudinary"
description: "How f_auto and q_auto shrink images by 94% automatically."
publishDate: 2025-01-15
coverImage: "cld-sample-2"
coverAlt: "Mountain landscape used to demonstrate Cloudinary format selection"
tags: ["cloudinary", "performance", "astro"]
author: "Your Name"
---

Post content here...
```

---

## Step 6 — The blur hero technique

This is the most distinctive Cloudinary technique in the template. The cover image is requested **twice** using two different transformation strings — both from the same public ID.

```typescript
// src/layouts/BlogPost.astro (frontmatter)
const blurredBg = getImageUrl(coverImage, {
  width: 1440,
  height: 760,
  crop: 'fill',
  gravity: 'auto',
  blur: 2000,          // e_blur:2000 — cinematic background
});

const sharpCard = getImageUrl(coverImage, {
  width: 880,
  height: 495,
  crop: 'fill',
  gravity: 'auto',
  // no blur
});
```

The URLs differ only in whether `e_blur:2000` is present. One image becomes two visual layers:

```
Background URL:  .../f_auto,q_auto,w_1440,h_760,c_fill,g_auto,e_blur:2000/cld-sample-2
Foreground URL:  .../f_auto,q_auto,w_880,h_495,c_fill,g_auto/cld-sample-2
```

The layout stacks them:

```astro
<section class="hero">
  <!-- Blurred Cloudinary image as full-bleed ambient background -->
  <div class="bg" aria-hidden="true">
    <img src={blurredBg} alt="" width={1440} height={760} loading="eager" />
    <div class="bg-overlay"></div>
  </div>

  <!-- Sharp image in a floating card above the blur -->
  <div class="hero-inner">
    <div class="photo-card">
      <CloudinaryImage
        publicId={coverImage}
        alt={coverAlt}
        width={880}
        height={495}
        crop="fill"
        gravity="auto"
        loading="eager"
      />
    </div>

    <!-- Title, tags, and author on the dark blurred background -->
    <header class="post-header">
      <h1>{title}</h1>
    </header>
  </div>
</section>
```

The overlay `div` applies a dark gradient on top of the blurred image so white text remains legible at any contrast ratio. The result is a cinematic hero that demonstrates Cloudinary's transformation pipeline visually — readers can see the difference between `e_blur:2000` and the sharp version side by side.

---

## Step 7 — The transformation showcase

Between the hero and the post prose, a three-panel component shows the same image with three different Cloudinary transformations. Readers see the API in action in the UI itself.

```astro
---
// src/components/CloudinaryShowcase.astro
const variants = [
  {
    label: 'Auto-optimized',
    code: 'f_auto, q_auto',
    options: { width: 640, height: 420, crop: 'fill' as const },
  },
  {
    label: 'Greyscale',
    code: 'e_grayscale',
    options: { width: 640, height: 420, crop: 'fill' as const, grayscale: true },
  },
  {
    label: 'Soft blur',
    code: 'e_blur:500',
    options: { width: 640, height: 420, crop: 'fill' as const, blur: 500 },
  },
];
---

{variants.map(v => (
  <div class="panel">
    <CloudinaryImage publicId={publicId} alt={alt} width={640} height={420} {...v.options} />
    <div class="caption">
      <strong>{v.label}</strong>
      <code>{v.code}</code>
    </div>
  </div>
))}
```

Each panel calls `CloudinaryImage` with different options. Cloudinary handles the rest. No pre-exported image variants, no build step, no image editor.

---

## Step 8 — Open Graph images from Cloudinary

Every page needs a 1200×630 image for social sharing previews. Normally this means designing cards in Figma or running a screenshot service. With Cloudinary you generate them from the cover photo in the URL.

```typescript
// src/lib/cloudinary.ts
export function getOgImageUrl(publicId: string): string {
  return `${BASE_URL}/c_fill,w_1200,h_630,g_auto/e_brightness:-15,f_auto,q_auto/${publicId}`;
}
```

**What the chained transformations do:**

```
Step 1: c_fill,w_1200,h_630,g_auto
  → Crop to OG dimensions, AI picks the focal point

Step 2: e_brightness:-15,f_auto,q_auto
  → Darken by 15 % so white text overlays would remain legible
  → Serve as AVIF/WebP and compress automatically
```

The two steps are separated by `/` — Cloudinary applies them in order. The darkened, cropped result is cached on the CDN after the first request.

Use the OG URL in your page layout:

```astro
---
// src/layouts/Layout.astro
const { title, description, ogImage } = Astro.props;
---
<head>
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  {ogImage && <meta property="og:image" content={ogImage} />}

  <meta name="twitter:card" content="summary_large_image" />
  {ogImage && <meta name="twitter:image" content={ogImage} />}
</head>
```

And pass it from every page:

```astro
---
// src/pages/blog/[slug].astro
import { getOgImageUrl } from '../../lib/cloudinary';

const ogImage = getOgImageUrl(post.data.coverImage);
---

<Layout title={post.data.title} ogImage={ogImage}>
  ...
</Layout>
```

Every blog post, the listing page, and the home page each get a unique, correctly-sized OG card automatically. Zero design work after the initial function is written.

---

## Step 9 — Dynamic routes

Astro uses file-based routing. A file named `[slug].astro` generates one page per blog post.

```astro
---
// src/pages/blog/[slug].astro
import { getCollection, render } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props:  { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<BlogPost post={post}>
  <Content />
</BlogPost>
```

`getStaticPaths` runs at build time and returns one entry per post. Astro renders each entry to a static HTML file. The resulting site has no server, no runtime, and no JavaScript payload for the routing logic.

---

## Step 10 — Lighthouse 100

These four additions push the scores to 100 across all categories.

### Performance — preconnect and LCP preload

Add these to the `<head>` of your base layout. The preconnect eliminates the TCP/TLS handshake time for the first Cloudinary request. The preload tells the browser to start fetching the LCP image immediately, before it parses the HTML far enough to find the `<img>` tag.

```astro
<!-- src/layouts/Layout.astro -->
<link rel="preconnect" href="https://res.cloudinary.com" crossorigin />
<link rel="dns-prefetch" href="https://res.cloudinary.com" />

<slot name="head" />
```

Then inject the preload from the home page:

```astro
<!-- src/pages/index.astro -->
<Layout title="...">
  <link
    slot="head"
    rel="preload"
    as="image"
    href={lcpSrc}
    imagesrcset={srcsetA}
    imagesizes="(max-width: 768px) 100vw, 58vw"
  />
  ...
</Layout>
```

Also add `fetchpriority="high"` to the above-the-fold hero image so the browser prioritises it over other requests on the page.

### Accessibility — contrast and heading hierarchy

The `--text-muted` colour must pass WCAG AA (minimum 4.5:1 contrast ratio against white). `#64748b` fails at ~4.4:1. Switch to `#475569` which passes at ~6.7:1.

```css
/* src/styles/global.css */
:root {
  --text-muted: #475569;  /* was #64748b — failed contrast */
}
```

Heading levels must not skip. If a page has an `<h1>`, the next heading must be `<h2>`, not `<h3>`. Feature cards on the home page violated this — changing their headings from `<h3>` to `<h2>` fixed the Lighthouse audit.

### SEO — descriptive link text

Links whose visible text is `→` or `← Back` need an `aria-label` so search engines and screen readers understand their destination:

```astro
<a href="/blog" aria-label="View all blog posts">View all →</a>
<a href="/" aria-label="CloudAstro — home">CloudAstro</a>
```

---

## Real-world numbers

| Format | File size | Savings vs original |
|---|---|---|
| Original JPEG | 1 200 KB | — |
| JPEG + `q_auto` | 310 KB | 74 % |
| WebP + `f_auto,q_auto` | 120 KB | 90 % |
| AVIF + `f_auto,q_auto` | 78 KB | 94 % |

These are Cloudinary's own benchmarks on representative web images. Your numbers will vary, but the direction is always the same: smaller, faster, better Lighthouse scores.

---

## Best practices summary

**Always use `f_auto` and `q_auto` together.** `f_auto` picks the best format; `q_auto` picks the best quality. Neither is as effective alone. Make them structural defaults in your URL builder so they are impossible to omit.

**Store public IDs, not URLs.** Your content schema should hold `"cld-sample-2"`, not the full URL. This lets you change transformations site-wide without touching content files.

**Provide `width` and `height` on every image.** The browser needs the aspect ratio to reserve space before the image loads. Missing dimensions are the single most common cause of layout shift.

**Use `loading="eager"` only for above-the-fold images.** Set it on the hero and the first blog card. Everything else should be `lazy`.

**Use `srcset` with real breakpoints.** Generate variants at `400w`, `800w`, `1200w`, and `1600w`. Cloudinary creates each on first request and caches it. The browser picks the right size based on the viewport.

**One public ID, multiple effects.** The blur hero technique — the same image at `e_blur:2000` for the background and sharp for the foreground — is a direct consequence of treating Cloudinary as a transformation pipeline rather than a CDN. Explore `e_grayscale`, `e_brightness`, `e_contrast`, and `e_art` the same way.

**Let Cloudinary generate your OG images.** A chained transformation `c_fill,w_1200,h_630,g_auto/e_brightness:-15,f_auto,q_auto` turns any cover photo into a social card in one URL. No Figma, no Puppeteer, no screenshot service.
