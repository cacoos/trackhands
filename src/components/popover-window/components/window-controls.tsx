interface WindowControlsProps {
  onMinimize: () => void;
  onTerminate: () => void;
}

export function WindowControls({ onMinimize, onTerminate }: WindowControlsProps) {
  return (
    <div className="flex gap-2">
      <button
        className="flex items-center gap-2 px-3 h-9 rounded-lg bg-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.15] transition-colors text-sm font-medium"
        onClick={onMinimize}
        aria-label="Start monitoring"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 3l14 9-14 9V3z" />
        </svg>
        Run in background
      </button>
      <button
        className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/30 transition-colors"
        onClick={onTerminate}
        aria-label="Terminate"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
