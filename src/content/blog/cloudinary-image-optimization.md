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






<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--! Font Awesome Pro 7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc. --><path opacity=".4" fill="currentColor" d=""/><path fill="currentColor" d="M80 320C80 187.5 187.5 80 320 80C397.9 80 467.2 117.1 511 174.7C513.7 178.2 518.7 178.9 522.2 176.2C525.7 173.5 526.4 168.5 523.7 165C477 103.6 403.1 64 320 64C178.6 64 64 178.6 64 320L64 376C64 380.4 67.6 384 72 384C76.4 384 80 380.4 80 376L80 320zM564.8 245C563.5 240.8 559 238.4 554.8 239.7C550.6 241 548.2 245.5 549.5 249.7C556.3 271.9 560 295.6 560 320.1L560 376.1C560 380.5 563.6 384.1 568 384.1C572.4 384.1 576 380.5 576 376.1L576 320.1C576 294 572.1 268.8 564.8 245.1zM320 144C293.5 144 268.4 149.8 245.9 160.3C241.2 162.5 240.1 168.5 243.5 172.4C245.9 175.2 250 176 253.4 174.5C273.7 165.2 296.3 160 320.1 160C408.5 160 480.1 231.6 480.1 320L480.1 344.9C480.1 376.4 477.9 407.7 473.5 438.7C472.8 443.6 476.6 447.9 481.5 447.9C485.4 447.9 488.8 445 489.4 441.1C493.9 409.3 496.2 377.1 496.2 344.8L496.2 319.9C496.2 222.7 417.4 143.9 320.2 143.9zM203.5 199.6C200.5 196.1 195.2 195.8 192 199.2C162.2 230.7 144 273.2 144 320L144 344.9C144 376.3 139.6 407.5 131 437.5C129.5 442.7 133.3 447.9 138.7 447.9C142.2 447.9 145.3 445.6 146.2 442.3C155.3 410.7 160 377.9 160 344.9L160 320C160 277.7 176.4 239.3 203.1 210.7C206 207.6 206.2 202.8 203.5 199.6zM320 224C267 224 224 267 224 320L224 344.9C224 387.2 217.6 429.1 204.9 469.4C203.3 474.6 207.1 480 212.6 480C216 480 219.1 477.8 220.1 474.5C233.3 432.6 240 388.9 240 344.9L240 320C240 275.8 275.8 240 320 240C364.2 240 400 275.8 400 320L400 344.9C400 387.1 395.5 429.1 386.6 470.2C385.5 475.2 389.3 480 394.4 480C398.1 480 401.4 477.4 402.1 473.8C411.3 431.6 415.9 388.4 415.9 344.9L415.9 320C415.9 267 372.9 224 319.9 224zM328 320C328 315.6 324.4 312 320 312C315.6 312 312 315.6 312 320L312 344.9C312 406.8 300.6 468.1 278.4 525.8L272.5 541.1C270.9 545.2 273 549.9 277.1 551.4C281.2 552.9 285.9 550.9 287.4 546.8L293.3 531.5C316.3 472 328 408.8 328 344.9L328 320z"/></svg>
