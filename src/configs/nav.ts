import type { AstroGlobal } from "astro";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";

export const Navs = [
  {
    title: "🏠 首页",
    link: "/",
  },
  {
    title: "📚 笔记",
    link: "/notes",
  },
  {
    title: "💻 关于",
    link: "/about",
  },
];

export const RouteMap: Record<string, string[]> = {
  "/": ["/"],
  "/notes": ["/notes", "/posts/[slug]"],
};

export const isActive = (
  astro: Readonly<
    AstroGlobal<
      Record<string, any>,
      AstroComponentFactory,
      Record<string, string | undefined>
    >
  >,
  route: string
) => {
  if (!RouteMap[route]) return false;
  for (const path of RouteMap[route]) {
    if (astro.url.pathname === path || astro.routePattern === path) {
      return true;
    }
  }
  return false;
};
