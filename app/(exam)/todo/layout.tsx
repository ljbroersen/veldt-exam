import type { Metadata } from "next";

import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "ToDo App - VELDT Inc.",
  description: "ToDo App page.",
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <article className="px-6 pt-8 pb-20 bg-neutral-100">
      <Header title="1. ToDo App" />
      {children}
    </article>
  );
}
