const Terminal = () => {
  return (
    <div className="fixed bottom-10 right-6 z-100 cursor-pointer transform hover:scale-110 transition-transform">
      <div className="relative">
        <div className="absolute inset-0 blur-md bg-gradient-to-r from-cyan-400/30 to-fuchsia-400/30 rounded-full" />
        <div className="absolute inset-0 blur-sm bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 rounded-full animate-pulse" />

        <svg
          width="60"
          height="60"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative filter drop-shadow-lg"
        >
          <circle
            cx="60"
            cy="60"
            r="59"
            stroke="url(#paint0_linear)"
            strokeWidth="1.5"
          />
          <circle
            cx="60"
            cy="60"
            r="40"
            stroke="url(#paint1_linear)"
            strokeWidth="1.5"
          />
          <path
            d="M30 60C30 43.4315 43.4315 30 60 30"
            stroke="#0FF"
            strokeWidth="1.5"
          />
          <path
            d="M90 60C90 76.5685 76.5685 90 60 90"
            stroke="#F0F"
            strokeWidth="1.5"
          />
          <circle cx="30" cy="60" r="2.5" fill="#0FF" />
          <circle cx="90" cy="60" r="2.5" fill="#F0F" />
          <circle cx="60" cy="30" r="2.5" fill="#0FF" />
          <circle cx="60" cy="90" r="2.5" fill="#F0F" />
          <rect x="58" y="58" width="4" height="4" fill="#0FF" />
          <rect
            x="56"
            y="56"
            width="8"
            height="8"
            stroke="#F0F"
            strokeWidth="1.5"
            fill="none"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="0"
              y1="60"
              x2="120"
              y2="60"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0FF" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="#F0F" stopOpacity="0.9" />
              <stop offset="1" stopColor="#0FF" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient
              id="paint1_linear"
              x1="15"
              y1="60"
              x2="105"
              y2="60"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F0F" stopOpacity="0.9" />
              <stop offset="1" stopColor="#0FF" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export { Terminal };
