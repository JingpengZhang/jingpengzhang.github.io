import { emojiCursor, ghostCursor } from "cursor-effects";
import { useEffect } from "react";

export default function MouseEffect() {
  useEffect(() => {

    // @ts-ignore
    let cursorEffect = new emojiCursor({ emoji: ["🔥", "🐬", "🦆"] });
    return () => {
      cursorEffect.destroy();
    };
  }, []);
  return null;
}
