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
