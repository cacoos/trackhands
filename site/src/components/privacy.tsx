import { LockIcon } from "hugeicons-react";
import { GitHubIcon } from "./github-icon";

export function Privacy() {
  return (
    <section className="relative py-12 px-6 sm:px-10 lg:px-4">
      <div className="max-w-5xl mx-auto">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-3">
          <LockIcon size={14} />
        </div>
        <h2 className="text-lg font-display font-semibold mb-2">100% private</h2>
        <p className="text-muted text-sm mb-4 max-w-md">
          All processing happens locally on your device. Your camera feed never leaves your
          computer. No accounts, no tracking, no data collection. Ever.
        </p>
        <a
          href="https://github.com/cacoos/trackhands"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-alt rounded-md border border-white/10 text-xs hover:bg-surface-elevated transition-colors"
        >
          <GitHubIcon size={12} />
          View on GitHub
        </a>
      </div>
    </section>
  );
}
