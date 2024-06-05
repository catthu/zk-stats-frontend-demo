import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="px-24 py-6">
      {children}
    </div>
  );
}
