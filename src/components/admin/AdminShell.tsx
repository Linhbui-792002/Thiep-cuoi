"use client";

import { ReactNode } from "react";
import { AdminNav } from "./AdminNav";

export function AdminShell({
  title,
  description,
  children,
  wide = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="admin-app min-h-dvh">
      <AdminNav />
      <main className={`mx-auto w-full px-4 py-5 sm:px-6 sm:py-8 ${wide ? "max-w-6xl" : "max-w-4xl"}`}>
        <header className="mb-5 sm:mb-7">
          <h1 className="font-serif text-2xl text-olive sm:text-3xl">{title}</h1>
          {description ? <p className="mt-1 text-sm text-gray-500 sm:text-base">{description}</p> : null}
        </header>
        {children}
      </main>
    </div>
  );
}
