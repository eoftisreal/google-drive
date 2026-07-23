import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
        Welcome to Media Platform
      </h1>
      <p className="text-lg text-gray-400 max-w-2xl mb-8">
        A highly scalable, general-purpose media streaming platform.
      </p>
      <div className="flex gap-4">
        <Button size="lg" asChild>
          <Link href="/browse">Browse Media</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/admin">Admin Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
