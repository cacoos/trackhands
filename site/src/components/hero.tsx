import { Download04Icon } from "hugeicons-react";
import { Demo } from "./demo";
import { GitHubIcon } from "./github-icon";

export function Hero() {
  return (
    <section className="relative pt-20 pb-12 px-6 sm:px-10 lg:px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-start">
          <h1 className="text-[26px] font-display font-semibold leading-[1.2] mb-3 max-w-xl">
            Stop touching your face. <span className="text-muted">Automatically.</span>
          </h1>

          <p className="text-sm text-muted max-w-md mb-6">
            TrackHands uses AI to detect when your hands get too close to your mouth and gently
            reminds you to stop. Break the habit, one warning at a time.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href="https://github.com/cacoos/trackhands/releases/latest"
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-surface rounded-lg text-sm font-medium hover:bg-foreground/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download04Icon size={14} />
              Download for Free
            </a>
            <a
              href="https://github.com/cacoos/trackhands"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-alt border border-white/10 rounded-lg text-sm font-medium text-foreground hover:bg-surface-elevated transition-colors"
            >
              <GitHubIcon size={14} />
              View on GitHub
            </a>
          </div>
        </div>

        <Demo />
      </div>
    </section>
  );
}
