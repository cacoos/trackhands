export function Demo() {
  return (
    <div className="mt-10 relative w-full">
      {/* Simulated macOS Window */}
      <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black shadow-2xl">
        {/* Video Area */}
        <div className="relative aspect-video">
          <video
            className="w-full h-full object-cover"
            src="/demo.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        {/* macOS Title Bar - Overlay */}
        <div className="absolute top-0 left-0 right-0 flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-[11px] text-white/50 font-medium">TrackHands</span>
          </div>
          <div className="w-[54px]" />
        </div>
      </div>
    </div>
  );
}
