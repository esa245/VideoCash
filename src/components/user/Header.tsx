'use client';
import { useApp } from '@/contexts/AppContext';
import { PlayCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UserHeader() {
  const context = useApp();
  if (!context) return null;
  const { isAuthenticated, currentUser, logout } = context;

  return (
    <nav className="bg-background/80 backdrop-blur-lg sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/10">
      <Link href="/admin">
        <div className="flex items-center gap-2 cursor-pointer">
          <PlayCircle className="text-blue-500 h-8 w-8" />
          <h1 className="text-2xl font-bold tracking-wider">VIDEO<span className="text-blue-500">CASH</span></h1>
        </div>
      </Link>
      {isAuthenticated && currentUser && (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 leading-none uppercase">Available Balance</p>
            <p className="text-xl font-bold text-green-400 leading-none mt-1">${currentUser.balance.toFixed(2)}</p>
          </div>
          <Button onClick={logout} variant="ghost" size="icon" className="bg-red-500/20 text-red-500 h-10 w-10 rounded-full hover:bg-red-500 hover:text-white transition">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      )}
    </nav>
  );
}
