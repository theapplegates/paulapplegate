---
title: "Build a Fast Portfolio in Astro with Cloudinary Image Optimization"
description: "Learn how f_auto and q_auto automatically shrink images by up to 80% with zero visual quality loss — and how to wire them into a reusable Astro component."
publishDate: 2024-12-15
coverImage: "cld-sample-2"
coverAlt: "Scenic landscape — used here to demonstrate Cloudinary's automatic format selection"
tags: ["cloudinary", "performance", "astro"]
author: "Eugene Musebe"
---

Portfolio sites live and die by their image performance. A single unoptimized JPEG hero can weigh 2 MB, tank your Core Web Vitals, and cost your visitors on metered mobile data plans.

Cloudinary solves this with two transformations you should apply to every image.

## f_auto — automatic format

`f_auto` instructs Cloudinary to serve the most efficient format the requesting browser understands:

- **Chrome / Edge** → AVIF or WebP
- **Safari** → WebP or HEIC
- **Older browsers** → JPEG fallback

A 1.2 MB JPEG becomes ~80 KB AVIF delivered to Chrome — a **93 % reduction** with no perceptible quality difference.

## q_auto — automatic quality

`q_auto` analyses each image and picks the lowest compression level the human eye won't notice. A highly-detailed photograph needs more fidelity than a flat graphic; Cloudinary handles both cases without manual tuning.

## How this template applies both

Every URL produced by `src/lib/cloudinary.ts` always starts with `f_auto,q_auto`:

```typescript
// f_auto and q_auto are always prepended — you can't forget them
const t: string[] = ['f_auto', 'q_auto'];
```

Passing an image through `<CloudinaryImage>` automatically produces a `srcset` with multiple widths, so the browser downloads only the size it actually needs.

## The real-world numbers

| Format | File size | Savings |
|--------|-----------|---------|
| Original JPEG | 1 200 KB | — |
| JPEG q_auto | 310 KB | 74 % |
| WebP f_auto + q_auto | 120 KB | 90 % |
| AVIF f_auto + q_auto | 78 KB | 94 % |

These numbers come from Cloudinary's own benchmarks on representative web images. Your results will vary, but the direction is always the same: smaller, faster, better Lighthouse scores.
