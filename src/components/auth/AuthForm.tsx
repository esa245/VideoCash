'use client';
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from 'next/navigation';

export default function AuthForm() {
  const context = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
      const refCode = searchParams.get('ref');
      if(refCode) {
        setReferralCode(refCode);
        setIsLogin(false); // Switch to register form if ref code is present
      }
  }, [searchParams]);

  if (!context) return null;
  const { login, register } = context;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(email, password);
    } else {
        if (!name || !email || !password) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields.' });
            return;
        }
      register(name, email, password, referralCode || null);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl p-2">
      <CardContent className="p-6">
        <div className="flex justify-around mb-8 border-b border-white/10">
          <button
            onClick={() => setIsLogin(true)}
            className={`pb-4 text-xl font-bold transition-colors ${
              isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`pb-4 text-xl font-bold transition-colors ${
              !isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
            }`}
          >
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {isLogin ? (
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 h-14 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-primary"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 h-14 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-primary"
                required
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-4 h-14 rounded-xl font-bold text-lg mt-4">
                Login
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 h-14 bg-white/5 rounded-xl border border-white/10"
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 h-14 bg-white/5 rounded-xl border border-white/10"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 h-14 bg-white/5 rounded-xl border border-white/10"
              />
              <Input
                type="text"
                placeholder="Referral Code (Optional)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="w-full p-4 h-14 bg-white/5 rounded-xl border border-white/10"
              />
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 py-4 h-14 rounded-xl font-bold text-lg mt-4">
                Sign Up
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
