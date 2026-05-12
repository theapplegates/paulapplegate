# CloudAstro

A beginner-friendly blog template that showcases Cloudinary's image optimization pipeline. Every image on the site is served through Cloudinary — automatically converted to AVIF/WebP, compressed to the smallest size the eye won't notice, and resized for each visitor's screen.

Built with [Astro 6](https://astro.build) and [Cloudinary](https://cloudinary.com).

---

## What you get

- Cinematic blog post heroes using the Cloudinary blur technique
- Responsive images via `srcset` — the browser downloads only the pixels it needs
- Automatic format selection (`f_auto`) — AVIF for Chrome, WebP for Safari, JPEG fallback
- Automatic quality compression (`q_auto`) — up to 94 % smaller files with no visual loss
- Open Graph images generated automatically from your cover photo — no design tool needed
- Lighthouse 100 across Performance, Accessibility, Best Practices, and SEO
- Three sample blog posts ready to edit or replace

---

## Quick start

### 1. Prerequisites

- Node.js 22 or later
- A free [Cloudinary account](https://cloudinary.com/users/register/free)

### 2. Clone and install

```bash
git clone https://github.com/musebe/my-portfolio.git
cd my-portfolio
npm install
```

### 3. Add your Cloudinary cloud name

Create a `.env` file in the project root:

```
PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

Find your cloud name in the [Cloudinary Console](https://console.cloudinary.com) — it is shown at the top of the dashboard.

> **No account yet?** The template falls back to Cloudinary's public `demo` cloud so the dev server works immediately. Swap in your own cloud name when you are ready to use your own images.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

---

## Project structure

```
src/
├── components/
│   ├── CloudinaryImage.astro    # Drop-in <img> with srcset + Cloudinary URL
│   ├── CloudinaryShowcase.astro # Three-panel transformation demo in each post
│   ├── BlogCard.astro           # Card used in the home and listing pages
│   ├── Header.astro
│   └── Footer.astro
├── content/
│   └── blog/
│       ├── cloudinary-image-optimization.md
│       ├── responsive-images-srcset.md
│       └── getting-started-with-astro.md
├── layouts/
│   ├── Layout.astro             # Base HTML shell, meta tags, OG tags
│   └── BlogPost.astro           # Blog post layout with blurred hero
├── lib/
│   └── cloudinary.ts            # URL builder — the only place Cloudinary logic lives
├── pages/
│   ├── index.astro
│   └── blog/
│       ├── index.astro
│       └── [slug].astro
├── styles/
│   └── global.css               # Design tokens (colours, fonts, spacing)
└── content.config.ts            # Blog collection schema
```

---

## How Cloudinary is integrated

All Cloudinary logic lives in one file: `src/lib/cloudinary.ts`. Nothing else in the project constructs image URLs directly.

### The URL builder

Every URL produced by the library prepends `f_auto,q_auto` automatically — you cannot forget them:

```typescript
// src/lib/cloudinary.ts

function buildTransformations(options: CloudinaryOptions): string {
  const t: string[] = ['f_auto', 'q_auto']; // always on

  if (options.width)     t.push(`w_${options.width}`);
  if (options.height)    t.push(`h_${options.height}`);
  if (options.crop)      t.push(`c_${options.crop}`);
  if (options.gravity)   t.push(`g_${options.gravity}`);
  if (options.blur)      t.push(`e_blur:${options.blur}`);
  if (options.grayscale) t.push('e_grayscale');

  return t.join(',');
}
```

A call like `getImageUrl('my-photo', { width: 800, crop: 'fill', gravity: 'auto' })` produces:

```
https://res.cloudinary.com/your-cloud/image/upload/f_auto,q_auto,w_800,c_fill,g_auto/my-photo
```

### The three exported functions

| Function | Use case |
|---|---|
| `getImageUrl(publicId, options)` | Single optimized URL |
| `getSrcSet(publicId, widths, options)` | Responsive `srcset` string |
| `getOgImageUrl(publicId)` | 1200×630 Open Graph card |

---

## Cloudinary transformations used in this template

### `f_auto` — automatic format

Cloudinary inspects the `Accept` header and serves the most efficient format the requesting browser supports:

| Browser | Format served |
|---|---|
| Chrome / Edge | AVIF |
| Safari | WebP |
| Older browsers | JPEG |

A 1.2 MB JPEG becomes ~78 KB AVIF for Chrome — a **94 % reduction** with no visible quality loss.

### `q_auto` — automatic quality

Cloudinary analyses the image content and finds the lowest compression the eye won't notice. A detailed photograph needs more fidelity than a flat graphic; `q_auto` handles both without any manual tuning.

### `c_fill,g_auto` — smart crop

Fills the exact dimensions without squishing the image. `g_auto` uses Cloudinary's AI to detect the most important subject and keep it in frame — faces, objects, whatever is visually dominant.

### `e_blur:N` — gaussian blur

Used in the blog post hero to show how one image can serve two roles: the cover is requested twice with different transformations.

```typescript
// Two URLs, one image, zero Photoshop
const sharp   = getImageUrl(coverImage, { width: 880, crop: 'fill', gravity: 'auto' });
const blurred = getImageUrl(coverImage, { width: 1440, crop: 'fill', gravity: 'auto', blur: 2000 });
```

The blurred version (`e_blur:2000`) becomes the full-bleed cinematic background. The sharp version floats above it in a card. The only difference between the two URLs is one transformation parameter.

### `e_grayscale` — greyscale

Converts the image to black and white server-side. No image editor, no second upload. Shown in the `CloudinaryShowcase` component that appears in every post.

### OG image — chained transformations

`getOgImageUrl` uses Cloudinary's chained transformation syntax (steps separated by `/`) to crop and darken in two discrete passes:

```
/c_fill,w_1200,h_630,g_auto / e_brightness:-15,f_auto,q_auto / my-photo
```

Every page gets a unique, correctly-sized social card from its cover photo — automatically, with no design work.

---

## The `CloudinaryImage` component

Use it anywhere you would use an `<img>` tag:

```astro
---
import CloudinaryImage from '../components/CloudinaryImage.astro';
---

<CloudinaryImage
  publicId="my-photo"
  alt="Description of the photo"
  width={800}
  height={500}
  crop="fill"
  gravity="auto"
  loading="lazy"
/>
```

It generates a full `srcset` and `sizes` hint automatically. The `width` and `height` props are required — they give the browser the aspect ratio before the image loads, preventing layout shift (CLS).

### Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `publicId` | `string` | Yes | — | Cloudinary asset ID |
| `alt` | `string` | Yes | — | Alt text (empty string only for decorative images) |
| `width` | `number` | Yes | — | Rendered width in px |
| `height` | `number` | Yes | — | Rendered height in px |
| `widths` | `number[]` | No | `[400, 800, 1200, 1600]` | Srcset breakpoints |
| `sizes` | `string` | No | `(max-width: 768px) 100vw, ...` | CSS sizes hint |
| `crop` | `string` | No | — | `fill`, `fit`, `scale`, `crop`, `thumb`, `pad` |
| `gravity` | `string` | No | — | `auto`, `face`, `center`, `north`, `south` |
| `blur` | `number` | No | — | Blur strength (e.g. `500` soft, `2000` cinematic) |
| `grayscale` | `boolean` | No | `false` | Convert to greyscale |
| `loading` | `string` | No | `lazy` | `lazy` or `eager` (use `eager` for above-the-fold images) |
| `class` | `string` | No | — | CSS class forwarded to `<img>` |

---

## Writing a blog post

Create a new `.md` file inside `src/content/blog/`. The filename becomes the URL slug.

```markdown
---
title: "My Post Title"
description: "One sentence shown in cards and meta tags."
publishDate: 2025-01-15
coverImage: "your-cloudinary-public-id"
coverAlt: "Describe the image for screen readers"
tags: ["cloudinary", "astro"]
author: "Your Name"
---

Your Markdown content here...
```

### Frontmatter fields

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Post title |
| `description` | Yes | Used in meta tags and blog cards |
| `publishDate` | Yes | ISO date — posts are sorted by this |
| `coverImage` | Yes | Cloudinary public ID (no extension, no leading slash) |
| `coverAlt` | Yes | Alt text for the cover image |
| `tags` | No | Array of strings shown as pills in the hero |
| `author` | No | Defaults to `Eugene Musebe` |

### Finding your Cloudinary public ID

1. Open the [Cloudinary Media Library](https://console.cloudinary.com/console/media_library)
2. Upload or select an image
3. Click the asset to open its detail panel
4. Copy the **Public ID** — it looks like `folder/image-name` or just `image-name`, with no file extension

Paste it into `coverImage` and the template handles the rest: hero, showcase panel, OG image, and blog card thumbnail are all generated from that one ID.

---

## Uploading your own images

The fastest path is the Cloudinary dashboard:

1. Go to [Media Library](https://console.cloudinary.com/console/media_library)
2. Click **Upload** and drag your files in
3. Copy the Public ID and paste it into your post frontmatter

For bulk uploads or CI pipelines, use the [Cloudinary CLI](https://cloudinary.com/documentation/cloudinary_cli) or the [Node.js SDK](https://cloudinary.com/documentation/node_integration).

---

## Deployment

The site produces a fully static build — the output goes to `dist/` and can be deployed anywhere.

```bash
npm run build
```

### Vercel

```bash
npm i -g vercel
vercel
```

Add `PUBLIC_CLOUDINARY_CLOUD_NAME` as an environment variable in the Vercel project settings.

### Netlify

Connect the repo and set build command to `npm run build` with publish directory `dist`. Add `PUBLIC_CLOUDINARY_CLOUD_NAME` in **Site configuration → Environment variables**.

### Any static host

Upload the contents of `dist/` to S3, GitHub Pages, or Cloudflare Pages. No server required.

---

## Customising the design

All visual tokens live in `src/styles/global.css` under `:root`. Change `--accent` to rebrand the entire site in one line:

```css
:root {
  --bg: #ffffff;
  --bg-secondary: #f8fafc;
  --text: #0f172a;
  --text-muted: #475569;
  --border: #e2e8f0;
  --accent: #7c3aed;       /* change this colour to rebrand everything */
  --accent-hover: #6d28d9;
  --accent-light: #ede9fe;
}
```

---

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npx astro check` | Type-check all `.astro` files |

---

## License

MIT — use it, modify it, publish it, build on it.
