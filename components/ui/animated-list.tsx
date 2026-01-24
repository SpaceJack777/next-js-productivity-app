"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

type AnimatedListProps = {
  children: ReactNode;
  className?: string;
};

export function AnimatedList({ children, className }: AnimatedListProps) {
  return (
    <div className={className} style={{ position: "relative" }}>
      <AnimatePresence initial={false} mode="popLayout">
        {children}
      </AnimatePresence>
    </div>
  );
}

type AnimatedListItemProps = {
  children: ReactNode;
  className?: string;
  itemKey: string;
};

export function AnimatedListItem({
  children,
  className,
  itemKey,
}: AnimatedListItemProps) {
  return (
    <motion.div
      key={itemKey}
      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
      animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      style={{ overflow: "hidden" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
