import { Download04Icon } from "hugeicons-react";

export function CTA() {
  return (
    <section className="relative py-12 px-6 sm:px-10 lg:px-4">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-lg bg-gradient-to-br from-surface-alt to-surface-elevated p-6 border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,165,116,0.1)_0%,_transparent_50%)]" />
          <div className="relative">
            <h2 className="text-lg font-display font-semibold mb-2">Ready to break the habit?</h2>
            <p className="text-muted text-sm mb-4">
              Download TrackHands for free and start building healthier habits today.
            </p>
            <a
              href="https://github.com/cacoos/trackhands/releases/latest"
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-surface rounded-lg text-sm font-medium hover:bg-foreground/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download04Icon size={14} />
              Download TrackHands
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
