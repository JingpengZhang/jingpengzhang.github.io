import type { CollectionEntry } from "astro:content";

export type Post = {
  id: number;
  slug:string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  guid: {
    rendered: string;
  };
  tags: Tag[];
  featured_media: Media["id"] | 0;
  featured_media_data?: Media;
};

export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export type Media = {
  id: number;
  guid: {
    rendered: string;
  };
};
