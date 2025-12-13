export function Footer() {
  return (
    <footer className="relative py-6 px-6 sm:px-10 lg:px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="TrackHands" className="w-4 h-4 rounded" />
          <span className="text-xs text-muted">
            Made by{" "}
            <a href="https://x.com/cacoos" className="text-foreground hover:underline">
              @cacoos
            </a>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/cacoos/trackhands"
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://github.com/cacoos/trackhands/releases"
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            Releases
          </a>
        </div>
      </div>
    </footer>
  );
}

