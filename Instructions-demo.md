9-20-2026

/Users/thor6/All_demo-working/demo/

 npm run cloudinary:breakpoints -- "src/images/blog/ernesto-samaniego-86yrou4EYco-unsplash.jpg" --alt="A nice day for a drink"
npm notice run my-portfolio@0.0.1 cloudinary:breakpoints
npm notice run node scripts/cloudinary-breakpoints.mjs src/images/blog/ernesto-samaniego-86yrou4EYco-unsplash.jpg --alt=A nice day for a drink
Uploading "images/blog/ernesto-samaniego-86yrou4EYco-unsplash" in paulapplegate-com; requesting JXL, AVIF and WebP breakpoints...
Saved src/data/cloudinary-images.json. Paste this into a Markdown post:

<cloudinary-picture src="images/blog/ernesto-samaniego-86yrou4EYco-unsplash" cloud-name="paulapplegate-com" alt="A nice day for a drink" width="4160" height="6240" sizes="(max-width: 720px) calc(100vw - 3rem), 672px"></cloudinary-picture>

For a post cover, use:
coverImage: "images/blog/ernesto-samaniego-86yrou4EYco-unsplash"
coverAlt: "A nice day for a drink"
coverCloudName: "paulapplegate-com"
thor6@Mac  %



# Responsive images: JXL → AVIF → WebP

All displayed template photos use this order, with a responsive `srcset` for each format:

1. `<source type="image/jxl">` — explicit `f_jxl` URLs.
2. `<source type="image/avif">` — explicit `f_avif` URLs.
3. `<source type="image/webp">` — explicit `f_webp` URLs.
4. `<img>` — WebP `src` and WebP `srcset` as the final fallback.

There is no `f_auto`. `q_auto` remains enabled for image quality. The browser chooses the first supported format, then an appropriate candidate width using `sizes` and display density. It does not download all three formats. A failed image request does not cause `<picture>` to retry the next format.

## Complete workflow

1. Open Terminal in your copy of this repository and run `npm install`. Use Node 22.12 or newer.

2. Create `.env.local` in the project root with:

   ```dotenv
   PUBLIC_CLOUDINARY_CLOUD_NAME=paulapplegate-com
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   If you already have a `.env`, you can keep it. The uploader loads `.env`, then `.env.local`; values already in the terminal environment take priority. Only the cloud name has a `PUBLIC_` prefix. Both environment files are ignored by Git. The build and the browser do not need the key or secret.

3. Put a photograph in `src/images/blog/`, creating that folder if needed. For example, `src/images/blog/photo.jpg`.

4. Upload it and generate responsive breakpoints:

   ```bash
   npm run cloudinary:breakpoints -- "src/images/blog/photo.jpg" --alt="Describe your photo"
   ```

   This uploads as public ID `images/blog/photo`, asks Cloudinary to analyze **each format separately**, and saves its returned widths in `src/data/cloudinary-images.json`. No Sharp conversion is used. Cloudinary retains the generated breakpoint variants; this uses your Cloudinary transformation/storage allowance. Run uploads one at a time, including in batch loops.

5. Copy the `<cloudinary-picture ...></cloudinary-picture>` snippet printed by the command into a `.md` post under `src/content/blog/`. Keep a blank line before and after it. **No import and no MDX conversion are needed.** Restart the dev server after generating a new manifest entry if it is already running.

   Once an image is in the manifest, this shorter Markdown form also works:

   ```markdown
   ![Describe your photo](cloudinary:images/blog/photo)
   ```

   That shorthand uses the configured default cloud. The printed HTML snippet includes the specific cloud name, dimensions, and sizes explicitly.

6. To use the photo as a cover, copy the three frontmatter lines printed by the command:

   ```yaml
   coverImage: "images/blog/photo"
   coverAlt: "Describe your photo"
   coverCloudName: "paulapplegate-com"
   ```

   Cards, post heroes, and the transformation showcase automatically use that cover and its saved breakpoint widths.

7. Preview and verify:

   ```bash
   npm run dev
   npm run check
   npm test
   npm run build
   ```

   Commit the post and `src/data/cloudinary-images.json` with your site changes. Upload credentials are unnecessary on the hosting service. If using another cloud, configure the same public cloud name when building there.

## Existing images and optional settings

To analyze an image already uploaded to Cloudinary:

```bash
npm run cloudinary:breakpoints -- "images/blog/photo" --existing --alt="Describe your photo"
```

To choose a different public ID, sizes hint, or maximum candidate width:

```bash
npm run cloudinary:breakpoints -- "src/images/blog/photo.jpg" --public-id="blog/my-photo" --sizes="100vw" --max-width=2160
```

Defaults are a minimum width of 50, maximum width of 1920, a 20,000-byte step, and up to 20 candidates per format. Cloudinary can return fewer widths and limits analysis to the original image's width. Other options are `--min-width`, `--bytes-step`, and `--max-images`.

Reusing an existing public ID does not overwrite the remote image by default. Use `--existing` to analyze it, or deliberately add `--overwrite` to replace it with your local file and save its new version. For a file outside the project, supply `--public-id` explicitly.

Without saved breakpoint data, an image still works when you provide dimensions. It uses standard candidate widths: 320, 480, 640, 800, 960, 1280, 1600, 1920. These are fallback widths, not claimed Cloudinary analysis. You can override them with `widths`.

## Using the Astro component

Existing `CloudinaryImage` usage remains supported:

```astro
---
import CloudinaryImage from '../components/CloudinaryImage.astro';
---

<CloudinaryImage
  publicId="images/blog/photo"
  alt="Describe your photo"
  width={1200}
  height={800}
  sizes="(max-width: 720px) calc(100vw - 3rem), 672px"
/>
```

`width` and `height` can be omitted when the manifest supplies them. They also set the desired crop proportions: a 16:9 image stays 16:9 at every candidate width. Options include `cloudName`, `widths`, `sizes`, `crop`, `gravity`, `blur`, `grayscale`, `loading`, `fetchpriority`, `class` for the image, and `pictureClass` for the wrapper. Use `loading="eager"` and `fetchpriority="high"` for the main above-the-fold photo.

The default prose `sizes` hint describes this template's 720px column including 48px of padding. Use `sizes="100vw"` for a full-width image, or supply a hint matching your layout. Avoid separate WebP preload hints for a picture that may select JXL or AVIF; these can download an extra format.

## Sample photos and social previews

The homepage's `cld-sample-*` images explicitly use `cloudName="demo"`. The bundled posts set `coverCloudName: "demo"`. Your own images use `paulapplegate-com` by default. When replacing a sample cover, use the printed `coverCloudName` as well as the new public ID.

Social metadata (`og:image` and `twitter:image`) uses one explicit JPEG URL for crawlers. This is separate from displayed blog images and is not an extra fallback in their `<picture>` elements.

## Files to move to another Astro site

| File | Purpose |
| --- | --- |
| `src/lib/cloudinary-core.mjs` | Shared URL, format order, crop, and breakpoint logic |
| `src/lib/cloudinary.ts` | Astro environment configuration and typed exports |
| `src/data/cloudinary-images.json` | Generated public image metadata and format-specific widths |
| `src/components/CloudinaryImage.astro` | Responsive Astro picture component |
| `src/plugins/rehype-cloudinary-picture.mjs` | Import-free Markdown image support |
| `scripts/cloudinary-breakpoints.mjs` | Upload and per-format breakpoint analysis |
| `astro.config.mjs` | Markdown plugin registration; merge into the other site's config |
| `package.json` and `package-lock.json` | Command and dependencies; merge rather than replace |
| `.env.example` and `.gitignore` | Configuration template and private environment exclusions |
| `src/styles/global.css` | Copy the `.cloudinary-picture` rules |
| `tests/cloudinary.test.mjs` | Format, crop, Markdown, and upload contract tests |

The consuming templates in this repo are `BlogCard.astro`, `CloudinaryShowcase.astro`, `BlogPost.astro`, and `src/pages/index.astro`. `coverCloudName` is declared in `src/content.config.ts`.

Cloudinary references: [responsive breakpoint API](https://cloudinary.com/documentation/image_upload_api_reference#upload), [request signatures](https://cloudinary.com/documentation/authentication_signatures).