import { file, glob } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/blog/articles" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});

const tags = defineCollection({
  loader: file("src/data/blog/settings.json", {
    parser: (text) => JSON.parse(text).tags,
  }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
  }),
});

export const collections = { tags, blog };
