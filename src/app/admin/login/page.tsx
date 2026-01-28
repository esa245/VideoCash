'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const email = 'mdesaalli74@gmail.com';
  const password = 'mdesa1111';
  const { adminLogin } = useApp();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleLogin = async () => {
      const success = await adminLogin(email, password);
      if (success) {
        router.push('/admin');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Automatic login failed. Please check credentials.',
        });
      }
    };
    if (adminLogin) {
        handleLogin();
    }
  }, [adminLogin, router, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-yellow-500 uppercase tracking-tighter">
            Adsman <span className="text-white">Central</span>
          </CardTitle>
          <CardDescription className="text-gray-500 italic">Master Control Panel - Secure Access</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-gray-400">Attempting secure login...</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
