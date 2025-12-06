import { Button, Hero, Section, FeatureCard } from "@repo/ui";
import { Calendar, Clock, Share2, Users } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center font-bold text-xl" href="/">
          TimePick
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/app/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/app">
            App
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <Hero
          title="Schedule Meetings over Email Effortlessly"
          subtitle="Find the perfect time for everyone without the back-and-forth emails. Simple, fast, and free."
          ctaText="Start Scheduling"
          ctaLink="/app"
        />

        <Section className="bg-muted/50">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={Calendar}
              title="Easy Integration"
              description="Connects seamlessly with your existing calendar."
            />
            <FeatureCard
              icon={Clock}
              title="Smart Suggestions"
              description="Automatically finds the best time slots for all participants."
            />
            <FeatureCard
              icon={Share2}
              title="Simple Sharing"
              description="Share a link and let others pick their preferred times."
            />
            <FeatureCard
              icon={Users}
              title="Group Scheduling"
              description="Coordinate with multiple people effortlessly."
            />
          </div>
        </Section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2025 TimePick. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
