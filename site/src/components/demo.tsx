export function Demo() {
  return (
    <div className="mt-10 relative w-full">
      {/* Simulated macOS Window */}
      <div className="relative rounded-lg overflow-hidden border border-white/10 shadow-lg bg-black">
        {/* Video Area - aspect ratio prevents layout shift while loading */}
        <div className="relative aspect-1022/663">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="/demo.mov"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </div>
  );
}
