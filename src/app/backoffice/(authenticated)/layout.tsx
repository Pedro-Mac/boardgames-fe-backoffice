import type { ReactNode } from "react";

import Nav from "@/components/Nav";

export default function AuthenticatedLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900">
      <Nav />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
