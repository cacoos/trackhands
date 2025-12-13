export function Navbar() {
  return (
    <nav className="relative px-6 sm:px-10 lg:px-4 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="TrackHands" className="w-6 h-6 rounded-md" />
          <span className="font-semibold text-sm">TrackHands</span>
        </div>
        <a
          href="https://github.com/cacoos/trackhands/releases/latest"
          className="px-4 py-2 bg-foreground text-surface rounded-lg font-medium text-sm hover:bg-foreground/90 transition-colors"
        >
          Download
        </a>
      </div>
    </nav>
  );
}
