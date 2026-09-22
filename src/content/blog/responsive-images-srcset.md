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

<picture>
  <source
	type="image/jxl"
	srcset="
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_480/f_jxl/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.jxl 480w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_1255/f_jxl/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.jxl 1255w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_2161/f_jxl/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.jxl 2161w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_2368/f_jxl/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.jxl 2368w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_2934/f_jxl/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.jxl 2934w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_3417/f_jxl/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.jxl 3417w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_3608/f_jxl/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.jxl 3608w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_3733/f_jxl/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.jxl 3733w"
	sizes="(max-width: 9333px) 40vw, 3733px"
  />
  <source
	type="image/avif"
	srcset="
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_480/f_avif/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.avif 480w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_1255/f_avif/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.avif 1255w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_2161/f_avif/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.avif 2161w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_2368/f_avif/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.avif 2368w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_2934/f_avif/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.avif 2934w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_3417/f_avif/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.avif 3417w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_3608/f_avif/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.avif 3608w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_3733/f_avif/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.avif 3733w"
	sizes="(max-width: 9333px) 40vw, 3733px"
  />
  <source
	type="image/webp"
	srcset="
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_480/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 480w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_1255/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 1255w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_2161/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 2161w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_2368/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 2368w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_2934/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 2934w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_3417/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 3417w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_3608/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 3608w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_3733/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 3733w"
	sizes="(max-width: 9333px) 40vw, 3733px"
  />
  <img
	src="https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_3733/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp"
	srcset="
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_480/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 480w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_1255/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 1255w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_2161/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 2161w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_2368/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 2368w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_2934/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 2934w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_3417/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 3417w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_3608/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 3608w,
	https://res.cloudinary.com/paulapplegate-com/image/upload/q_auto/c_scale,w_3733/f_webp/v1790047319/breakpoints/axtjtfoohsd2l7h7toom.webp 3733w"
	sizes="(max-width: 9333px) 40vw, 3733px"
	alt=""
	loading="lazy"
	width="3733"
	height="5597"
  />
</picture>


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
