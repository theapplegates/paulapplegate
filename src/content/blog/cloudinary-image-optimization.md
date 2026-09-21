---
title: "Responsive JXL, AVIF, and WebP Images with Cloudinary"
description: "Serve JPEG XL first, with AVIF and WebP fallbacks, using a reusable Astro picture component."
publishDate: 2024-12-15
coverCloudName: "paulapplegate-com"
coverImage: "cld-sample-2"
coverAlt: "Scenic landscape demonstrating responsive image formats"
tags: ["cloudinary", "performance", "astro"]
author: "Eugene Musebe"
---

<cloudinary-picture src="images/blog/Gulfstream-G800" cloud-name="paulapplegate-com" alt="Describe your photo" width="1672" height="941" sizes="(max-width: 720px) calc(100vw - 3rem), 672px"></cloudinary-picture>


<cloudinary-picture src="images/blog/mvhom9kgeg23ujtn16nv" cloud-name="paulapplegate-com" alt="Golden hour with a breathtaking house on a cliff" width="5272" height="2962" sizes="(max-width: 720px) calc(100vw - 3rem), 672px"></cloudinary-picture>


<cloudinary-picture src="images/blog/ernesto-samaniego-86yrou4EYco-unsplash" cloud-name="paulapplegate-com" alt="A nice day for a drink" width="4160" height="6240" sizes="(max-width: 720px) calc(100vw - 3rem), 672px"></cloudinary-picture>


Final Image Test
<cloudinary-picture src="images/blog/nenad-radojcic-kIQoxt8-srU-unsplash" cloud-name="paulapplegate-com" alt="A village on the ocean" width="5073" height="7609" sizes="(max-width: 720px) calc(100vw - 3rem), 672px"></cloudinary-picture>

This template asks Cloudinary for three explicit image formats. The browser chooses the first format it supports, in this order: **JXL → AVIF → WebP**.

## Format selection with picture

Each `CloudinaryImage` component renders a `<picture>` containing `image/jxl`, `image/avif`, and `image/webp` sources. Every source has its own responsive `srcset` and the same `sizes` hint. The final `<img>` uses WebP for both `src` and `srcset`.

A browser that supports JPEG XL selects the first source. Otherwise it tries AVIF, then WebP. This is format capability selection; an HTTP error at a selected source does not automatically retry the next format.

## Quality and crop

Each URL uses an explicit `f_jxl`, `f_avif`, or `f_webp`, alongside `q_auto` for quality. Actual file sizes depend on the photograph, dimensions, and encoder output.

The component scales the crop height with each candidate width. A 16:9 cover remains 16:9 at every size instead of downloading a differently shaped crop.

## Upload once, save the breakpoints

The upload command requests Cloudinary's responsive breakpoint analysis separately for all three formats. It saves the returned widths, image dimensions, cloud name, and version in `src/data/cloudinary-images.json`.

```bash
npm run cloudinary:breakpoints -- "src/images/blog/photo.jpg" --alt="Describe your photo"
```

Paste the printed image tag into a Markdown post. The build consumes the saved JSON without needing private API credentials. See `CLOUDINARY.md` in the repository for the complete setup instructions.

<cloudinary-picture src="images/blog/vadim-sadovski-OxHm0L9_6ng-unsplash" cloud-name="paulapplegate-com" alt="How else would you start your day?" width="1955" height="3000" sizes="(max-width: 720px) calc(100vw - 3rem), 672px"></cloudinary-picture>


