---
title: "Responsive Images with srcset, sizes, and Cloudinary"
description: "Use picture for format selection and srcset with sizes for responsive image widths."
publishDate: 2024-12-08
coverCloudName: "paulapplegate-com"
coverImage: "cld-sample-4"
coverAlt: "A photograph shown at multiple responsive sizes"
tags: ["cloudinary", "responsive", "performance"]
author: "Eugene Musebe"
---

Responsive images let the browser choose an image width that suits its layout, display density, and loading preferences.

## Formats and widths are separate decisions

`<picture>` offers formats in order: **JXL → AVIF → WebP**. Within each supported source, `srcset` offers candidate widths and `sizes` describes the image's layout width.

The browser considers both the rendered width and pixel density. A 400-pixel-wide image on a 2× display may benefit from an 800-pixel-wide file.

## How sizes helps

For an article image in this template, the prose column is at most 720 pixels wide, including 48 pixels of horizontal padding:

```html
sizes="(max-width: 720px) calc(100vw - 3rem), 672px"
```

Without a `sizes` hint, width-descriptor image selection assumes the full viewport width. That can cause oversized downloads for images in a narrower column; it does not always select the largest candidate.

## A working Markdown example

The photograph below uses the same three-format responsive picture as the cards and heroes. It is written directly in this Markdown file without an import:

<cloudinary-picture src="cld-sample-4" cloud-name="demo" alt="Cloudinary sample photograph" width="1200" height="800"></cloudinary-picture>

```html
<cloudinary-picture src="cld-sample-4" cloud-name="demo" alt="Cloudinary sample photograph" width="1200" height="800"></cloudinary-picture>
```

For your own image, run the upload command and paste the snippet it prints. The component and Markdown plugin automatically use that image's saved Cloudinary breakpoints. Existing assets without saved analysis use a standard width list, which you can override using `widths`.

## Preventing layout shift

Image dimensions reserve space before the file loads. Uploaded images get these dimensions from the saved manifest. Images without a manifest entry need explicit `width` and `height` values.
