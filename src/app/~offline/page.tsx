"use client";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 space-y-6">
      {/* Wifi-off icon */}
      <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M12 20h.01" />
          <path d="M8.5 16.429a5 5 0 0 1 7 0" />
          <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
          <path d="M13.83 10.17A10 10 0 0 1 19 12.859" />
          <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
          <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.82" />
          <line x1="2" x2="22" y1="2" y2="22" />
        </svg>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">You&apos;re Offline</h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          It looks like you&apos;ve lost your connection. Don&apos;t worry — your
          data is safely stored on your device.
        </p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 21h5v-5" />
        </svg>
        Try Again
      </button>
    </div>
  );
}
