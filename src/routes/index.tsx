import { createFileRoute } from "@tanstack/react-router";
import Slideshow from "@/components/Slideshow";

export const Route = createFileRoute("/")({
  component: Slideshow,
  head: () => ({
    meta: [
      { title: "Which Ball Hits First? — 5th Grade Physics" },
      { name: "description", content: "Interactive classroom slideshow on projectile motion." },
    ],
  }),
});
