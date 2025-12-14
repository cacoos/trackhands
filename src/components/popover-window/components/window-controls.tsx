interface WindowControlsProps {
  onTerminate: () => void;
}

export function WindowControls({ onTerminate }: WindowControlsProps) {
  return (
    <button
      className="flex items-center justify-center w-9 h-9 rounded-md bg-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/30 transition-colors"
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
  );
}
