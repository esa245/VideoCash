'use client'
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { UserPlus, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function ReferralView() {
    const { currentUser, settings } = useApp();
    const { toast } = useToast();

    if (!currentUser) return null;

    const refLink = `https://videocash.pro/join?ref=${currentUser.id}`;

    const copyRef = () => {
        navigator.clipboard.writeText(refLink);
        toast({ title: "Copied!", description: "Referral link copied to clipboard." });
    };

    return (
        <div className="flex justify-center">
            <Card className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-3xl text-center">
                <CardHeader className="flex flex-col items-center">
                    <UserPlus className="h-12 w-12 text-purple-500 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Invite Friends, Earn ${settings.referralBonus.toFixed(2)}</h3>
                    <p className="text-gray-400 mb-4 italic">প্রতি রেফারে ${settings.referralBonus.toFixed(2)} বোনাস যা পেমেন্টের সময় যোগ হবে।</p>
                </CardHeader>
                <CardContent>
                    <div className="bg-white/5 p-2 rounded-2xl flex items-center justify-between border border-white/10">
                        <Input readOnly value={refLink} className="bg-transparent border-none text-blue-400 text-sm truncate focus-visible:ring-0 focus-visible:ring-offset-0" />
                        <Button onClick={copyRef} className="bg-blue-600 px-4 py-2 h-auto rounded-lg text-xs font-bold uppercase shrink-0">
                            <Copy className="h-4 w-4 mr-2"/>
                            Copy
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
