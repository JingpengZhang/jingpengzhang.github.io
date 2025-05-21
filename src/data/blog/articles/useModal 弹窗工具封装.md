---
title: useModal 弹窗工具封装
slug: react-usemodal-advanced-usage
excerpt: 本文介绍了三种 React 弹窗封装方式：基础版、自管理动画版、可外部控制动画版，适用于不同使用场景。
tags:
  - React
createdAt: 2025-05-21T13:21:55+08:00
updatedAt: 2025-05-21T13:21:55+08:00
---

`useModal` 是一个用于创建和管理 React 弹窗的实用 hook，支持基础弹窗和带出入场动画的弹窗，适合动态挂载组件的场景。

---

## ✅ 基础版：简单可控弹窗

适用于无动画需求，手动调用 `show/hide` 来控制弹窗的挂载与卸载。

### `useModal.ts`

```ts
import React from "react";
import { createRoot, type Root } from "react-dom/client";

// 定义控制器类型
type ModalController<P> = {
  show: (props?: Partial<P>) => void;
  hide: () => void;
};

// 基础 useModal 函数
export function useModal<P>(
  Component: React.ComponentType<P & { onClose: () => void }>
): ModalController<P> {
  let root: Root | null = null;
  let container: HTMLDivElement | null = null;

  const show = (props: Partial<P> = {}) => {
    if (container) return;

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    const onClose = () => hide();

    root.render(<Component {...(props as P)} onClose={onClose} />);
  };

  const hide = () => {
    if (root && container) {
      root.unmount();
      document.body.removeChild(container);
      root = null;
      container = null;
    }
  };

  return { show, hide };
}
```

---

### 示例弹窗组件 `ShareProject.tsx`

```tsx
import { DefaultProjectThumb } from "@/config/defaultAssets";
import type React from "react";
import SvgClose from "@/assets/svgs/closeSmall.svg?react";
import QRCodeLib from "qrcode";
import { useEffect, useRef } from "react";

export type ShareProjectProps = {
  title: string;
  url: string;
  thumb?: string;
};

type Props = {
  onClose: () => void;
} & ShareProjectProps;

const ShareProject: React.FC<Props> = ({ onClose, ...props }) => {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen bg-black_o40 flex flex-col justify-center items-center">
      <div className="w-80 rounded-md overflow-hidden">
        <div className="bg-white w-full py-5 text-center">
          <p className="text-base font-bold">{props.title}</p>
        </div>
      </div>

      <div className="flex items-center justify-center mt-6">
        <button
          onClick={onClose}
          className="bg-black_o40 text-white rounded-full p-0.5"
        >
          <SvgClose width={46} height={46} />
        </button>
      </div>
    </div>
  );
};

export default ShareProject;
```

---

### 使用方式

```tsx
const Demo = () => {
  const { show } = useModal(ShareProject);

  return (
    <button onClick={() => show({ title: "测试弹窗" })}>
      显示弹窗
    </button>
  );
};
```

---

## ✨ 带出入场动画版（**自管理**）

适用于“单次弹出 + 自动关闭”的弹窗。弹窗关闭后自动卸载，无需外部调用 `hide`。

### 核心特点

- 使用 `framer-motion` 实现出入场动画
- 内部自行卸载，无需外部干预

```ts
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { createRoot, type Root } from "react-dom/client";

type ModalWrapperProps = {
  Component: React.ComponentType<any>;
  props: Record<string, any>;
  onClose: () => void;
  onExited: () => void;
};

const ModalWrapper = ({ Component, props, onExited }: ModalWrapperProps) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence onExitComplete={onExited}>
      {visible && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Component {...props} onClose={handleClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export function useModal<T extends object>(
  Component: React.ComponentType<T & { onClose: () => void }>
) {
  let root: Root | null = null;
  let container: HTMLDivElement | null = null;

  const handleUnmount = () => {
    if (root && container) {
      root.unmount();
      document.body.removeChild(container);
      root = null;
      container = null;
    }
  };

  const show = (props: Partial<T> = {}) => {
    if (container) return;

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    root.render(
      <ModalWrapper
        Component={Component}
        props={props}
        onClose={handleUnmount}
        onExited={handleUnmount}
      />
    );
  };

  return { show };
}
```

---

## 🎛️ 带出入场动画版（**可外部关闭**）

适合需要在外部控制弹窗关闭的场景，例如定时关闭、事件驱动等。

```ts
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { createRoot, type Root } from "react-dom/client";

type ModalWrapperProps = {
  Component: React.ComponentType<any>;
  props: Record<string, any>;
  onExited: () => void;
  closeRef: { current: () => void };
};

const ModalWrapper = ({
  Component,
  props,
  onExited,
  closeRef,
}: ModalWrapperProps) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  closeRef.current = handleClose;

  return (
    <AnimatePresence onExitComplete={onExited}>
      {visible && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Component {...props} onClose={handleClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export function useModal<T extends object>(
  Component: React.ComponentType<T & { onClose: () => void }>
) {
  let root: Root | null = null;
  let container: HTMLDivElement | null = null;

  const closeRef = { current: () => {} };

  const unmount = () => {
    if (root && container) {
      root.unmount();
      document.body.removeChild(container);
      root = null;
      container = null;
      closeRef.current = () => {};
    }
  };

  const show = (props: Partial<T> = {}) => {
    if (container) return;

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    root.render(
      <ModalWrapper
        Component={Component}
        props={props}
        onExited={unmount}
        closeRef={closeRef}
      />
    );
  };

  const hide = () => {
    closeRef.current();
  };

  return { show, hide };
}
```

---

## 📝 总结

| 版本 | 是否支持动画 | 是否支持外部关闭 | 适用场景 |
|------|--------------|------------------|----------|
| 基础版 | ❌ | ✅ | 快速简单的弹窗 |
| 动画版（自管理） | ✅ | ❌ | 自动关闭的提示类弹窗 |
| 动画版（可控制） | ✅ | ✅ | 可由外部触发关闭的弹窗 |
