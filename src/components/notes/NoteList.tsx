import { useEffect, useState } from "react";
import type { Post } from "../../types/wp";
import { fetchPosts } from "../../utils/api";
import { stripHtml } from "../../utils/global";
import Pagination from "../Pagination";

const NoteList = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const getPosts = async (page: number) => {
    const res = await fetchPosts({
      page,
      pageSize: 12,
    });
    setPosts(res.list);
    setTotal(res.total);
    setTotalPages(res.totalPages);
  };

  useEffect(() => {
    if (current > 0) getPosts(current);
  }, [current]);

  return (
    <div className="w-[1000px] mx-auto ">
      <ul className="columns-3 gap-4 mt-20">
        {posts.map((item) => (
          <li
            className="w-full  group hover:scale-105 transition-all mb-4"
            key={item.id}
          >
            <a
              href={`/posts/${encodeURIComponent(item.slug)}`}
              className="block bg-gray-800 h-fit w-full rounded-lg overflow-hidden shadow"
            >
              <div className="w-full aspect-video bg-gray-600">
                {item.featured_media_data && (
                  <img
                    src={item.featured_media_data.guid.rendered}
                    className="h-full w-full object-cover"
                    alt={"封面"}
                  />
                )}
              </div>

              <div className="p-4">
                <h2 className="text-lg font-bold line-clamp-2 transition-all">
                  {item.title.rendered}
                </h2>
                <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                  {stripHtml(item.excerpt.rendered)}
                </p>

                <ul className="flex flex-wrap text-xs gap-2 mt-6">
                  {item.tags.map((tag) => (
                    <li
                      key={tag.id}
                      className="bg-gradient-to-br from-indigo-700 to-indigo-800 rounded-full h-6 flex items-center px-2 italic text-indigo-100"
                    >
                      <span>#{tag.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Pagination
          current={current}
          total={total}
          totalPages={totalPages}
          onChange={(page) => setCurrent(page)}
        />
      </div>
    </div>
  );
};

export default NoteList;
