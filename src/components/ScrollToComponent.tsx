"use client";

import { useEffect, useRef } from "react";

interface ScrollToComponentProps {
  children: React.ReactNode;
  scrollOnMount?: boolean;
}

export function ScrollToComponent({ children, scrollOnMount = true }: ScrollToComponentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollOnMount && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [scrollOnMount]);

  return <div ref={ref}>{children}</div>;
}
