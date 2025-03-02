import React from "react";
import { Navbar } from "@repo/ui/navbar";
import { Footer } from "@repo/ui/footer";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar logo="CollabDraw" />
      <main>{children}</main>
      <Footer />
    </div>
  );
};