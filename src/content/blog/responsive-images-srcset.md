---
title: "Responsive Images with srcset, sizes, and Cloudinary"
description: "Stop serving a 1600px image to a 375px phone. Learn how srcset and sizes work together with Cloudinary to deliver the right image at every breakpoint."
publishDate: 2024-12-08
coverImage: "cld-sample-4"
coverAlt: "A vibrant photograph shown at multiple responsive sizes"
tags: ["cloudinary", "responsive", "performance"]
author: "Eugene Musebe"
---

Every `<img>` without a `srcset` is sending an oversized image to someone. A visitor on a 375 px phone downloading your 1600 px hero wastes ~75 % of the bytes they downloaded.

The fix is two HTML attributes working together: `srcset` and `sizes`.

## How srcset works

`srcset` gives the browser a menu of available image widths:

```html
<img
  srcset="
    /image/upload/w_400/photo 400w,
    /image/upload/w_800/photo 800w,
    /image/upload/w_1200/photo 1200w
  "
  src="/image/upload/w_800/photo"
  alt="…"
/>
```

The `400w`, `800w`, `1200w` descriptors tell the browser the intrinsic width of each candidate. The browser picks the best match — but it needs one more hint.

## How sizes completes the picture

Without `sizes`, the browser assumes every image is `100vw` (full viewport width) and always downloads the largest candidate. `sizes` fixes that:

```html
sizes="(max-width: 640px) 100vw,
       (max-width: 1024px) 50vw,
       33vw"
```

This reads: "below 640 px the image fills the screen; between 640–1024 px it fills half; above that, a third." The browser uses this to pick the smallest `srcset` entry that still looks sharp.

## How this template generates it automatically

`getSrcSet()` in `src/lib/cloudinary.ts` builds the full `srcset` string from a list of widths. Each entry is an independently-optimized Cloudinary URL with `f_auto,q_auto` baked in:

```typescript
export function getSrcSet(publicId, widths = [400, 800, 1200, 1600], options = {}) {
  return widths
    .map(w => `${getImageUrl(publicId, { ...options, width: w })} ${w}w`)
    .join(', ');
}
```

Pass `widths` and `sizes` to `<CloudinaryImage>` and the component handles the rest.

## Preventing layout shift (CLS)

Always provide `width` and `height` on every `<img>`. These attributes let the browser reserve the correct space in the layout before the image loads, preventing the jarring jump that tanks your CLS score.

`<CloudinaryImage>` enforces both as required props — you can't accidentally omit them.
