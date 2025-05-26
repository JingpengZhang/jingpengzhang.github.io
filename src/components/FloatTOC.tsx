import { useBoolean, useClickAway } from "ahooks";
import type { MarkdownHeading } from "astro";
import type React from "react";
import { useRef, useState } from "react";

const FlotTOC: React.FC<{
  headings: MarkdownHeading[];
}> = ({ headings }) => {
  const container = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useBoolean(false);

  useClickAway(() => setVisible.setFalse(), container.current);
  return (
    <div className="relative block xl:hidden" ref={container}>
      <button
        onClick={setVisible.toggle}
        className="h-12 w-12 text-2xl cursor-pointer"
      >
        🧭
      </button>

      {visible && (
        <div className="absolute bottom-12 right-0 w-[80vw] p-5 bg-black/40 backdrop-blur-md rounded-lg gap-4 text-sm flex flex-col z-50 shadow-2xl">
          {headings.map((item) => (
            <a
              href={`#${item.slug}`}
              onClick={setVisible.setFalse}
              key={item.slug}
              className=""
            >
              {item.text}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlotTOC;
