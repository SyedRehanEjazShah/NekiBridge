"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface NGOLogoProps {
  name: string;
  logo?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "w-9 h-9 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-11 h-11 text-lg",
  xl: "w-12 h-12 text-xl",
};

const imgSizeMap = {
  sm: 36,
  md: 40,
  lg: 44,
  xl: 48,
};

export function NGOLogo({ name, logo, size = "md", className }: NGOLogoProps) {
  if (logo) {
    return (
      <div className={cn("rounded-xl overflow-hidden shrink-0 bg-white", sizeMap[size], className)}>
        <Image
          src={logo}
          alt={`${name} logo`}
          width={imgSizeMap[size]}
          height={imgSizeMap[size]}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shrink-0",
        sizeMap[size],
        className
      )}
    >
      {name.charAt(0)}
    </div>
  );
}
