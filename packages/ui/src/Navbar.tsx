import { ReactNode } from "react"

import React from "react";

type NavbarProps = {
  logo: string;
  links?: { label: string; href: string }[];
};

export const Navbar: React.FC<NavbarProps> = ({ logo, links }) => {
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <div className="text-xl font-bold">{logo}</div>
      {links && (
        <div className="flex gap-4">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-gray-700 hover:underline">
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};