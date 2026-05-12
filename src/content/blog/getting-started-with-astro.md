---
title: "Getting Started with Astro: Zero JS by Default"
description: "Astro ships zero JavaScript to the browser by default. Here's why that matters for performance and how to set up your first Astro project in under five minutes."
publishDate: 2024-12-01
coverImage: "cld-sample-5"
coverAlt: "Abstract architectural lines representing the structured nature of Astro components"
tags: ["astro", "getting-started", "performance"]
author: "Eugene Musebe"
---

Most modern frameworks ship a JavaScript runtime to every visitor — even pages that don't need it. Astro takes the opposite approach: HTML and CSS by default, JavaScript only when you opt in.

## Why zero JS matters

JavaScript is the most expensive resource on a web page. It blocks rendering, delays interactivity, and drains mobile batteries. A page with 0 KB of JS parses and renders faster than any framework-generated equivalent.

Astro achieves this with a compile step that renders your components to static HTML at build time. The client receives plain HTML with no framework overhead.

## Project structure

An Astro project is intentionally flat:

```
src/
├── components/   # Reusable .astro components
├── content/      # Markdown / MDX files (blog posts, docs)
├── layouts/      # Page wrappers with <slot />
├── lib/          # Plain TypeScript utilities
├── pages/        # File-based routing — each file = a URL
└── styles/       # Global CSS
```

## The .astro file format

Every `.astro` file has two sections separated by `---`:

```astro
---
// This runs at build time on the server.
// Import components, fetch data, do whatever you need.
const message = 'Hello from build time!';
---

<!-- This is the HTML output. -->
<p>{message}</p>

<style>
  /* Scoped to this component only */
  p { color: rebeccapurple; }
</style>
```

The fenced script block (`---`) is never sent to the browser. It runs once at build time and disappears.

## Content Collections

Astro's Content Collections give you type-safe access to your Markdown files. Define a schema in `src/content/config.ts`:

```typescript
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    publishDate: z.coerce.date(),
    coverImage: z.string(),
  }),
});
```

Then query it in any page:

```typescript
const posts = await getCollection('blog');
```

TypeScript knows the shape of every post — no `any`, no surprises.

## Next steps

From here, adding Cloudinary image optimization is a natural next step. Every image in the template is automatically optimized through `f_auto` and `q_auto` without any extra configuration on your part. Just drop a Cloudinary public ID into your front matter and the `<CloudinaryImage>` component handles the rest.
