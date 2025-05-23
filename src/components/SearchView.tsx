import type { CollectionEntry } from "astro:content";
import type React from "react";
import { useState } from "react";

const SearchView: React.FC<{
  posts: CollectionEntry<"blog">[];
}> = ({ posts }) => {
  const [result, setResult] = useState<CollectionEntry<"blog">[]>([]);

  const filter = (keyword: string) => {
    setResult(
      posts.filter((v) =>
        v.data.title.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
      )
    );
  };

  return (
    <div className="w-[700px] rounded-lg overflow-hidden border border-gray-900 bg-gray-800 shadow">
      <div className=" p-4">
        <input
          type="text"
          className="border w-full rounded-lg h-9"
          onInput={(e) => filter(e.currentTarget.value)}
        />
      </div>
      <div className=" w-full shadow-lg p-3 pt-0">
        <ul className="flex flex-col gap-2">
          {result.map((post) => (
            <li
              key={post.id}
              className="px-2 h-9 flex items-center bg-gray-950 rounded-lg"
            >
              <a href={`/posts/${post.id}`}>
                <p className="line-clamp-1">{post.data.title}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchView;
