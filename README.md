# CloudAstro — responsive Cloudinary image blog

An Astro blog with JPEG XL first, AVIF next, and WebP as the final fallback. Every template photo uses a native `<picture>` with responsive `srcset` and `sizes`; image URLs use explicit formats, never automatic format selection.

**[Follow the complete setup and image workflow in CLOUDINARY.md](CLOUDINARY.md).**

```bash
npm install
npm run dev
```

Node 22.12 or newer is required. The included sample photos explicitly use Cloudinary's public `demo` account, so they work without upload credentials. Your own photos default to `paulapplegate-com`, configurable using `PUBLIC_CLOUDINARY_CLOUD_NAME`.

Features include responsive homepage mosaics, article cards, blurred post heroes, transformation examples, and import-free images inside Markdown posts. Cloudinary chooses the saved breakpoints independently for each output format. No local image conversion or client-side resizing script is needed.

```bash
npm run cloudinary:breakpoints -- "src/images/blog/photo.jpg" --alt="Describe your photo"
npm run check
npm test
npm run build
```

The uploader needs private credentials only when you upload or analyze an image. Rendering and building use the committed manifest. Social preview metadata uses a separate JPEG URL for crawler compatibility; displayed page images use JXL → AVIF → WebP.

This repository is based on the CloudAstro template by Eugene Musebe.
