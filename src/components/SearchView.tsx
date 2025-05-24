import { useKeyPress } from "ahooks";
import type { CollectionEntry } from "astro:content";
import { navigate } from "astro:transitions/client";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import SvgArrow from "../assets/svgs/Arrow.svg?react";

const SearchView: React.FC<{
  posts: CollectionEntry<"blog">[];
}> = ({ posts }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const [result, setResult] = useState<CollectionEntry<"blog">[]>([]);

  const filter = (keyword: string) => {
    setSelectedIndex(undefined);
    setResult(
      posts
        .filter((v) =>
          v.data.title.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
        )
        .slice(0, 5)
    );
  };

  const [selectedIndex, setSelectedIndex] = useState<number>();

  const selected = useMemo(
    () => (selectedIndex !== undefined ? result[selectedIndex] : null),
    [selectedIndex]
  );

  useKeyPress("downarrow", () => {
    setSelectedIndex((prev) => {
      if (prev === undefined) {
        return 0;
      } else if (prev === result.length - 1) {
        return 0;
      } else {
        return prev + 1;
      }
    });
  });

  useKeyPress("uparrow", () => {
    setSelectedIndex((prev) => {
      if (prev === undefined) {
        return result.length - 1;
      } else if (prev === 0) {
        return result.length - 1;
      } else {
        return prev - 1;
      }
    });
  });

  useKeyPress("enter", () => {
    if (selected) navigate("/posts/" + selected.id);
  });

  return (
    <div className="p-5 w-[700px] rounded-lg overflow-hidden bg-white shadow">
      <div className="flex items-center gap-4">
        <input
          ref={inputRef}
          type="text"
          placeholder="请输入关键字"
          className="border w-full placeholder:text-gray-400 rounded-lg h-14 bg-gray-100 text-black px-3"
          onInput={(e) => filter(e.currentTarget.value)}
        />
      </div>

      <div className=" w-full mt-4">
        <ul className="flex flex-col">
          {result.map((post, i) => (
            <li
              key={post.id}
              className={`px-2 h-14 flex items-center rounded-lg text-black transition-all hover:bg-gray-100 ${
                i === selectedIndex ? "bg-gray-100" : ""
              }`}
            >
              <a
                href={`/posts/${post.id}`}
                className="w-full flex items-center justify-between"
              >
                <p className="line-clamp-1">{post.data.title}</p>

                <ul className="text-xs gap-2 text-white flex items-center">
                  {post.data.tags.map((tag) => (
                    <li
                      key={tag}
                      className=" px-2 h-5 rounded-sm flex items-center justify-center bg-gray-500"
                    >
                      <span className="line-clamp-1">{tag}</span>
                    </li>
                  ))}
                </ul>
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between mt-3 px-2 pb-2">
          <span className="text-gray-400 text-xs">{result.length}条结果</span>

          {result.length > 0 && (
            <a
              href=""
              className="flex items-center text-black text-xs underline"
            >
              更多结果
              <SvgArrow width={14} className="rotate-180" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchView;
