"use client";

import { useLayoutEffect, useRef } from "react";

interface ScrollToComponentProps {
  children: React.ReactNode;
  scrollOnMount?: boolean;
}

export function ScrollToComponent({ children, scrollOnMount = true }: ScrollToComponentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (scrollOnMount && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollOnMount]);

  return <div ref={ref}>{children}</div>;
}
