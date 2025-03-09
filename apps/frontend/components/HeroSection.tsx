import React from "react";
import { Button } from "@repo/ui/button";
import Image from "next/image";
import Link from "next/link";

type HeroProps = {
  title: string;
  subtitle: string;
  primaryAction: { label: string; href:string };
  secondaryAction?: { label: string;};
};

export const HeroSection: React.FC<HeroProps> = ({ title, subtitle, primaryAction, secondaryAction }) => {
    return (
      <section className="flex flex-col md:flex-row items-center justify-between py-32 bg-blue-100 px-8 md:px-16">
        <div className="text-left max-w-xl">
          <h1 className="text-6xl font-bold text-gray-900 leading-tight">{title}</h1>
          <p className="text-xl text-gray-700 mt-6">{subtitle}</p>
          <div className="mt-8 flex gap-6">
          <Link href={primaryAction.href}>
              <Button label={primaryAction.label} variant="primary" />
            </Link>
            {secondaryAction && <Button label={secondaryAction.label} variant="outline" />}
          </div>
        </div>
        <div className="mt-12 md:mt-0 flex justify-center w-full md:w-1/2">
          <Image src="/paintbrush.svg" alt="Paintbrush" width={400} height={400} className="w-full max-w-lg md:max-w-xl" />
        </div>
      </section>
    );
  };