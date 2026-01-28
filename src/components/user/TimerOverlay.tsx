'use client';
import { useApp } from '@/contexts/AppContext';

export default function TimerOverlay() {
  const { adTimer } = useApp();
  const { timeLeft, totalTime } = adTimer;

  const circumference = 2 * Math.PI * 124; // 2 * pi * r
  const offset = circumference - (timeLeft / totalTime) * circumference;

  return (
    <div className="fixed inset-0 bg-black/95 z-[200] flex flex-col items-center justify-center">
      <div className="w-64 h-64 border-8 border-white/5 rounded-full relative flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="124"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>
        </svg>
        <span className="text-6xl font-black italic">{timeLeft}</span>
      </div>
      <h2 className="text-2xl font-bold mt-10 tracking-widest text-blue-400 uppercase">Loading Video Ad...</h2>
      <p className="text-gray-500 mt-2">Finish watching to receive your USD reward</p>
    </div>
  );
}
