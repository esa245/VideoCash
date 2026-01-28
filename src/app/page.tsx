'use client';
import { useApp } from '@/contexts/AppContext';
import UserHeader from '@/components/user/Header';
import Hero from '@/components/user/Hero';
import AuthForm from '@/components/auth/AuthForm';
import Dashboard from '@/components/user/Dashboard';
import TimerOverlay from '@/components/user/TimerOverlay';

export default function Home() {
  const context = useApp();

  if (!context) {
    return null; // Or a loading spinner
  }

  const { isAuthenticated, showAuthForm, adTimer } = context;

  return (
    <>
      <div className="relative z-10 min-h-screen bg-background">
        <UserHeader />
        <div className="relative">
          {isAuthenticated ? (
            <Dashboard />
          ) : showAuthForm ? (
            <div className="flex justify-center items-center pt-10 md:pt-20">
              <AuthForm />
            </div>
          ) : (
            <Hero />
          )}
        </div>
      </div>
      {adTimer.active && <TimerOverlay />}
    </>
  );
}
