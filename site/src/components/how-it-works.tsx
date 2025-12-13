const steps = [
  {
    title: "Install & Launch",
    description:
      "Download the app and grant camera permissions. TrackHands runs in your system tray.",
  },
  {
    title: "Go About Your Day",
    description: "The app monitors your hands in the background, using minimal system resources.",
  },
  {
    title: "Get Reminded",
    description: "When your hand gets close to your mouth, a gentle warning appears on screen.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-12 px-2 bg-surface-alt/50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-lg font-display font-semibold mb-2">How it works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-4 left-8 w-[calc(100%+1rem)] h-px bg-white/10 -translate-y-1/2" />
              )}
              <div className="relative z-10">
                <div className="w-8 h-8 rounded-full bg-surface-elevated border border-white/10 flex items-center justify-center mb-2">
                  <span className="text-xs font-display text-muted">{i + 1}</span>
                </div>
                <h3 className="text-sm font-medium mb-1">{step.title}</h3>
                <p className="text-muted text-xs">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

