import React from "react";
import { Layout } from "../components/Layout";
import { HeroSection } from "../components/HeroSection";
import { Card } from "@repo/ui/card";
import { Users, Brush, Star, Share2 } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <HeroSection
        title="Collaborate in real-time with CollabDraw!"
        subtitle="A powerful online whiteboard for seamless teamwork and creativity."
        primaryAction={{ label: "Get Started", href: "/signup" }}
        secondaryAction={{ label: "Try now" }}
      />
      
      {/* Extended Hero Section Background */}
      <div className="bg-blue-100 py-16 px-6 flex justify-center">
        <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <Card title="Active Collaboration" description="Work together in real-time." icon={Users} />
          <Card title="Infinite Canvas" description="Draw, sketch, and ideate without limits." icon={Brush} />
          <Card title="Seamless Sharing" description="Easily share your work with the team." icon={Share2} />
          <Card title="Cloud-Synced" description="Access your projects from anywhere." icon={Star} />
        </div>
      </div>
    </Layout>
  );
}