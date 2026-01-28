'use client';
import { useContext } from 'react';
import { AppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { setShowAuthForm } = context;

  return (
    <div className="text-center py-16 md:py-28">
      <h2 className="text-5xl md:text-7xl font-bold mb-6 font-headline">
        Watch Videos.
        <br />
        <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text text-6xl">
          Earn $100 in 10 Days*
        </span>
      </h2>
      <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
        প্রতিদিন ভিডিও দেখে $১০ পর্যন্ত আয় করার সুযোগ। সরাসরি বিকাশ বা নগদে পেমেন্ট বুঝে নিন।
      </p>
      <Button
        onClick={() => setShowAuthForm(true)}
        className="bg-blue-600 hover:bg-blue-700 px-12 py-5 h-auto rounded-full font-bold text-xl shadow-xl shadow-blue-500/20"
      >
        Start Earning Today
      </Button>
    </div>
  );
}
