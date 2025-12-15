import {
  Camera01Icon,
  ComputerIcon,
  Globe02Icon,
  Notification03Icon,
  Settings02Icon,
  ViewIcon,
} from "hugeicons-react";

const features = [
  {
    title: "Real-time Detection",
    description: "Uses MediaPipe to track your face and hand positions with millisecond precision.",
    icon: <ViewIcon size={14} />,
  },
  {
    title: "Gentle Warnings",
    description:
      "Configurable delay before showing warnings, so brief touches don't interrupt you.",
    icon: <Notification03Icon size={14} />,
  },
  {
    title: "System Tray App",
    description: "Runs quietly in your menu bar. Unobtrusive until you need it.",
    icon: <ComputerIcon size={14} />,
  },
  {
    title: "Adjustable Sensitivity",
    description: "Tune detection speed and camera resolution to match your preferences.",
    icon: <Settings02Icon size={14} />,
  },
  {
    title: "Screenshot Capture",
    description: "Automatically captures moments when detection triggers to help build awareness.",
    icon: <Camera01Icon size={14} />,
  },
  {
    title: "Cross-Platform",
    description: "Works on macOS, Windows, and Linux. Same great experience everywhere.",
    icon: <Globe02Icon size={14} />,
  },
];

export function Features() {
  return (
    <section className="relative py-12 px-6 sm:px-10 lg:px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-lg font-display font-semibold mb-2">Powered by real-time AI</h2>
          <p className="text-muted text-sm max-w-md">
            Uses MediaPipe to track your face and hands locally. No cloud, no data collection.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-3 rounded-lg bg-surface-alt border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center mb-2">
                {feature.icon}
              </div>
              <h3 className="text-sm font-medium mb-1">{feature.title}</h3>
              <p className="text-muted text-xs leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
