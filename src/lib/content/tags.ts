// src/lib/content/tags.ts
import { getCollection } from "astro:content";

export async function getAllTags() {
  const posts = await getCollection("blog");

  const allTags = posts.flatMap((post) => {
    const tags = post.data.tags;
    if (!tags) return [];
    return Array.isArray(tags) ? tags : [tags];
  });

  const uniqueTags = Array.from(new Set(allTags));
  return uniqueTags;
}

export async function getPostsByTag(tag: string) {
  const posts = await getCollection("blog");

  return posts.filter((post) => {
    const tags = post.data.tags;
    if (!tags) return false;
    const tagList = Array.isArray(tags) ? tags : [tags];
    return tagList.includes(tag);
  });
}
