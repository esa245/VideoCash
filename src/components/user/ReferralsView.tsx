'use client';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export default function ReferralsView() {
    const { currentUser, settings } = useApp();
    const { toast } = useToast();
    const [origin, setOrigin] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin);
        }
    }, []);


    if (!currentUser) return null;

    const referralLink = `${origin}?ref=${currentUser.referralCode}`;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied!', description: 'Referral link copied to clipboard.' });
    };
    
    const shareLink = () => {
        if(navigator.share) {
            navigator.share({
                title: 'Join VideoCash Pro!',
                text: `Watch videos and earn money. Use my referral code: ${currentUser.referralCode}`,
                url: referralLink,
            }).catch((e) => console.log('Share failed:', e));
        } else {
            copyToClipboard(referralLink);
        }
    }

    return (
        <div className="flex justify-center">
            <Card className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-3xl text-center">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Invite Friends, Earn More!</CardTitle>
                    <CardDescription className="text-gray-400">
                        Share your referral code and earn ${settings.referralBonus.toFixed(2)} for every friend that signs up!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="text-center">
                        <p className="text-gray-400 uppercase text-sm">Your Unique Referral Code</p>
                        <p className="text-5xl font-bold tracking-widest text-primary my-2">{currentUser.referralCode}</p>
                    </div>

                    <div className="space-y-2">
                         <label className="text-sm text-gray-400 text-left block">Your Referral Link</label>
                        <div className="flex gap-2">
                            <Input readOnly value={referralLink} className="bg-white/5 h-12 text-base"/>
                            <Button onClick={() => copyToClipboard(referralLink)} size="icon" variant="secondary" className="h-12 w-12 shrink-0 bg-white/10 hover:bg-white/20">
                                <Copy />
                            </Button>
                        </div>
                    </div>
                    
                    <Button onClick={shareLink} className="w-full bg-blue-600 hover:bg-blue-700 py-4 h-auto rounded-xl font-bold text-lg">
                        <Share2 className="mr-2" /> Share Your Link
                    </Button>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="text-gray-400">Users Referred</p>
                            <p className="text-2xl font-bold">{currentUser.referralsCount}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="text-gray-400">Referral Earnings</p>
                            <p className="text-2xl font-bold text-green-400">${(currentUser.referralsCount * settings.referralBonus).toFixed(2)}</p>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
