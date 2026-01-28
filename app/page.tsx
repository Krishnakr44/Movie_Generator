"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { StoryCreateForm } from "@/components/StoryCreateForm";
import { Button } from "@/components/ui/Button";
import { ErrorBox } from "@/components/ui/ErrorBox";

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState("");
  const createSectionRef = useRef<HTMLDivElement>(null);

  const handleCreated = (storyId: string) => {
    router.push(`/story/${storyId}`);
  };

  const scrollToCreate = () => {
    createSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero: minimal, cinematic, single CTA */}
      <header className="relative px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 md:pt-32 md:pb-36">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-parchment-100 tracking-tight leading-[1.1] animate-fade-in">
            AI-powered Indian fiction,
            <br />
            <span className="text-accent-light">you're the director.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-ink-400 max-w-xl mx-auto leading-relaxed animate-fade-in [animation-delay:80ms]">
            Set the rules. Shape the world. Control the memory. Build stories
            chapter by chapter—mythology, folklore horror, desi sci-fi—with
            characters that stick and twists that land.
          </p>
          <div className="mt-10 animate-fade-in">
            <Button
              size="lg"
              onClick={scrollToCreate}
              className="min-w-[200px]"
            >
              Create your story
            </Button>
          </div>
        </div>
      </header>

      {/* Story creation: card-based panel */}
      <section
        id="create"
        ref={createSectionRef}
        className="px-4 pb-20 sm:pb-24 scroll-mt-8"
      >
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="mb-6">
              <ErrorBox
                message={error}
                onDismiss={() => setError("")}
              />
            </div>
          )}
          <StoryCreateForm onCreated={handleCreated} onError={setError} />
        </div>
      </section>
    </div>
  );
}
