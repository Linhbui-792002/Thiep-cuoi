"use client";

import { ThemeConfig } from "@/lib/theme";
import { themeToCssVars } from "@/lib/theme";
import { CSSProperties, ReactNode } from "react";

interface Props {
  theme: ThemeConfig;
  children: ReactNode;
  className?: string;
}

export function ThemeProvider({ theme, children, className = "" }: Props) {
  const vars = themeToCssVars(theme) as CSSProperties;

  return (
    <div className={className} style={vars}>
      {children}
    </div>
  );
}
