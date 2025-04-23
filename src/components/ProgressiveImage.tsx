// src/components/ProgressiveImage.tsx
"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import clsx from "clsx";

interface ProgressiveImageProps extends Omit<ImageProps, "src"> {
  lowQualitySrc: string | undefined;
  highQualitySrc: string;
  alt: string;
}

export function ProgressiveImage({ lowQualitySrc, highQualitySrc, alt, className, ...rest }: ProgressiveImageProps) {
  const [isHighLoaded, setHighLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = highQualitySrc;
    img.onload = () => {
      setHighLoaded(true);
    };
  }, [highQualitySrc]);

  return (
    <div className={clsx("relative overflow-hidden", className)}>
      {/* low‑res blurred */}
      <Image
        src={lowQualitySrc ?? ""}
        alt={alt}
        className="h-full w-full object-cover filter transition-opacity ease-out"
        unoptimized
        {...rest}
      />

      {/* hi‑res replaces it (fades in) */}
      {isHighLoaded && (
        <Image
          src={highQualitySrc}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-700 ease-in"
          unoptimized
          {...rest}
        />
      )}
    </div>
  );
}
