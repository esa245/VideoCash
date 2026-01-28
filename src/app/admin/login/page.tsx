'use client';
import { useState, useContext, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('mdesaalli74@gmail.com');
  const [password, setPassword] = useState('mdesa1111');
  const context = useContext(AppContext);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (context?.adminLogin(email, password)) {
      router.push('/admin');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid credentials. Please try again.',
      });
    }
  };

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
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 h-12 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 h-12 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-primary"
              />
            </div>
            <Button type="submit" className="w-full font-bold text-lg h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity">
              Secure Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
