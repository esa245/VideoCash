'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useApp();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (email !== 'mdesaalli74@gmail.com') {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'You are not authorized to access this panel.',
        });
        setLoading(false);
        return;
    }
    const success = await adminLogin(email, password);
    if (success) {
      router.push('/admin');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Please check your credentials and try again.',
      });
    }
    setLoading(false);
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
                    <label className="text-sm text-gray-400">Admin Email</label>
                    <Input
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 h-14 bg-white/5 rounded-xl border border-white/10"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Password</label>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 h-14 bg-white/5 rounded-xl border border-white/10"
                        required
                    />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-xl font-bold text-lg" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : 'Secure Login'}
                </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
