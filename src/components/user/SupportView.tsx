'use client'
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, DollarSign, Send, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';


// A simple utility to get initials from a name
const getInitials = (name: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};


export default function SupportView() {
    const { currentUser, promoteLink } = useApp();
    const [promoUrl, setPromoUrl] = useState('');
    const { toast } = useToast();

    if (!currentUser) return null;

    const telegramLink = "https://t.me/+BwVCGF5qYWY5NDM1";

    const handlePromote = () => {
        if (!promoUrl || !(promoUrl.startsWith('http://') || promoUrl.startsWith('https://'))) {
            toast({ variant: 'destructive', title: 'Invalid URL', description: 'Please enter a valid URL starting with http:// or https://.' });
            return;
        }
        if (promoteLink) {
             promoteLink(promoUrl);
             setPromoUrl('');
        }
    };

    return (
        <div className="flex flex-col items-center gap-8">
            <Card className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-3xl">
                <CardHeader className="flex flex-row items-center gap-6 p-0 pb-8">
                    <Avatar className="h-20 w-20 border-2 border-primary">
                        <AvatarFallback className="text-2xl bg-white/10">
                            {getInitials(currentUser.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-3xl font-bold">{currentUser.name}</CardTitle>
                        <CardDescription className="text-gray-400">{currentUser.email}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl items-center">
                            <span className="flex items-center gap-3 text-gray-300"><DollarSign className="h-4 w-4 text-green-400" /> Current Balance:</span>
                            <span className="font-bold text-green-400 text-lg">${currentUser.balance.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between text-sm bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl items-center">
                            <span className="flex items-center gap-3 text-gray-300"><User className="h-4 w-4 text-purple-400" /> Total Referrals:</span>
                            <span className="font-bold text-purple-400 text-lg">{currentUser.referrals}</span>
                        </div>
                    </div>
                   
                    <div className="text-center pt-4">
                         <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                        <p className="text-gray-400 mb-6">যেকোনো প্রয়োজনে আমাদের সাথে টেলিগ্রামে যোগাযোগ করুন।</p>
                        <Button 
                            onClick={() => window.open(telegramLink, '_blank')} 
                            className="w-full max-w-sm mx-auto bg-sky-500 hover:bg-sky-600 py-4 h-auto rounded-xl font-bold text-lg"
                        >
                            <Send className="mr-2 h-5 w-5" /> Join Telegram Support
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-3xl">
                <CardHeader className="flex flex-col items-center p-0 pb-6 text-center">
                    <Zap className="h-10 w-10 text-yellow-500 mb-4" />
                    <CardTitle className="text-2xl font-bold">Promote Your Link</CardTitle>
                    <CardDescription className="text-gray-400">Pay $1.00 from your balance to get your link featured.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="flex flex-col gap-4">
                        <Input 
                            type="url"
                            placeholder="https://your-link.com"
                            value={promoUrl}
                            onChange={(e) => setPromoUrl(e.target.value)}
                            className="w-full p-4 h-14 bg-white/5 rounded-xl border border-white/10"
                        />
                        <Button onClick={handlePromote} className="w-full bg-yellow-600 hover:bg-yellow-700 py-4 h-14 rounded-xl font-bold text-lg">
                            Promote for $1.00
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
