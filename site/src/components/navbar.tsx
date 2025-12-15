import { Link } from "wouter";
import { GitHubIcon } from "./github-icon";

export function Navbar() {
  return (
    <nav className="relative px-6 sm:px-10 lg:px-4 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/icon.png" alt="TrackHands" className="w-6 h-6 rounded-md" />
          <span className="font-semibold text-sm">TrackHands</span>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/cacoos/trackhands"
            className="p-1.5 text-muted hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <GitHubIcon size={16} />
          </a>
          <a
            href="https://github.com/cacoos/trackhands/releases/latest"
            className="px-3 py-1.5 bg-foreground text-surface rounded-md font-medium text-xs hover:bg-foreground/90 transition-colors"
          >
            Download
          </a>
        </div>
      </div>
    </nav>
  );
}
