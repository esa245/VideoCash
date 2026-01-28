'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import UserHeader from '@/components/user/Header';
import Hero from '@/components/user/Hero';
import AuthForm from '@/components/auth/AuthForm';
import Dashboard from '@/components/user/Dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const context = useApp();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (searchParams.get('refCode')) {
      if(context && !context.isAuthenticated) {
        context.setShowAuthForm(true);
      }
    }
  }, [searchParams, context]);

  if (!context) {
    return null; // Or a loading spinner
  }

  const { isAuthenticated, showAuthForm, isUserLoading } = context;

  const DashboardSkeleton = () => (
    <div className="container mx-auto px-0 md:px-6 py-8">
        <Skeleton className="h-[125px] w-full rounded-3xl mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Skeleton className="h-[80px] rounded-2xl" />
            <Skeleton className="h-[80px] rounded-2xl" />
            <Skeleton className="h-[80px] rounded-2xl" />
            <Skeleton className="h-[80px] rounded-2xl" />
        </div>
        <Skeleton className="h-[90px] w-full rounded-3xl mb-10" />
    </div>
  );

  return (
    <>
      <div className="relative z-10 min-h-screen bg-background">
        <UserHeader />
        <div className="relative">
          {isUserLoading ? (
            <DashboardSkeleton />
          ) : isAuthenticated ? (
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
    </>
  );
}
