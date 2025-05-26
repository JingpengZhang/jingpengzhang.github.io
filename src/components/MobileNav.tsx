import type { AstroGlobal } from "astro";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import type React from "react";
import { Navs } from "../configs/nav";
import { useRef } from "react";
import { useBoolean, useClickAway } from "ahooks";

const MobileNav: React.FC<{
  astro: Readonly<
    AstroGlobal<
      Record<string, any>,
      AstroComponentFactory,
      Record<string, string | undefined>
    >
  >;
}> = () => {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useBoolean(false);

  useClickAway(() => setVisible.setFalse(), container.current);

  return (
    <div ref={container} className="h-full xl:hidden">
      <button className="h-full" onClick={setVisible.toggle}>
        🍔
      </button>
      {visible && (
        <div className="fixed top-16 left-0 w-full bg-gradient-to-r from-gray-900 to-indigo-900 py-2">
          <ul className="w-full">
            {Navs.map((item) => (
              <li key={item.title}>
                <a
                  href={item.link}
                  className="h-12 flex items-center justify-center"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
