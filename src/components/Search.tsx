import type { CollectionEntry } from "astro:content";
import React, { useEffect } from "react";
import SvgSearch from "../assets/svgs/PixelSearch.svg?react";
import { useModal } from "../hooks/useModal";
import SearchView from "./SearchView";
import { useKeyPress } from "ahooks";

const Search: React.FC<{
  posts: CollectionEntry<"blog">[];
}> = ({ posts }) => {
  const { show, hide } = useModal(SearchView);

  useKeyPress("meta.k", () => {
    show({ posts });
  });

  useKeyPress("esc", () => {
    hide();
  });

  return (
    <button
      onClick={() => show({ posts })}
      className="hidden xl:flex cursor-pointer items-center bg-gray-700 rounded-full mr-2 px-2 h-6"
    >
      <SvgSearch width={12} height={12} className="mr-2" />
      <span className="text-sm text-gray-400">⌘K</span>
    </button>
  );
};

export default Search;
