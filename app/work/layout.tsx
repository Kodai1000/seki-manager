import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "座席表を作成",
  description: "席マネで座席表を作成・編集します。",
  robots: { index: false, follow: false },
};

export default function WorkLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
