import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-canvas-soft px-6 text-center">
      <div className="flex flex-col items-center">
        <LogoMark detailed className="h-20 w-auto" />
        <p className="mt-10 text-sm font-bold tracking-[0.16em] text-ink uppercase">Page not found</p>
        <h1 className="mt-4 text-[clamp(2.75rem,7vw,4.5rem)]">This page doesn’t exist.</h1>
        <p className="mt-5 max-w-sm">It may have moved, or the link may be mistyped.</p>
        <Button href="/" className="mt-10">
          Back to home
        </Button>
      </div>
    </main>
  );
}
