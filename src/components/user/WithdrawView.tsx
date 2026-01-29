'use client'
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Lock, Gift } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

function InitialRecharge() {
    const { currentUser, requestInitialRecharge, settings } = useApp();
    const [mobileNumber, setMobileNumber] = useState('');
    const { toast } = useToast();
    
    if (!settings.initialRechargeEnabled || !currentUser || currentUser.initialRechargeClaimed) {
        return null;
    }

    const handleClaim = () => {
        if(mobileNumber.length >= 10 && /^\d+$/.test(mobileNumber)) {
            requestInitialRecharge(mobileNumber);
        } else {
            toast({
                variant: 'destructive',
                title: 'Invalid Number',
                description: 'Please enter a valid mobile number.',
            });
        }
    }

    return (
        <Card className="max-w-lg w-full bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-3xl text-center border-primary">
            <CardHeader className="flex flex-col items-center p-0 pb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-primary/10 border border-primary/20">
                    <Gift className="text-2xl text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">First Time Bonus</CardTitle>
                <CardDescription className="text-gray-400">
                    Get 10 Taka free mobile recharge on your first day!
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-4">
                    <Input 
                        placeholder="Enter Your Mobile Number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="text-center h-12 text-lg bg-white/5"
                        type="tel"
                    />
                    <Button 
                        onClick={handleClaim}
                        className="w-full bg-primary hover:bg-primary/90 py-4 h-auto rounded-xl font-bold text-lg"
                    >
                        Claim 10 Taka Recharge
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function WithdrawView() {
    const { currentUser, settings } = useApp();
    if (!currentUser) return null;
    
    const canWithdraw = currentUser.balance >= settings.minWithdrawal;

    return (
        <div className="flex flex-col items-center gap-8">
            <InitialRecharge />
            <Card className="max-w-lg w-full bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-3xl text-center">
                <CardHeader className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border ${canWithdraw ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                        <Lock className={`text-2xl ${canWithdraw ? 'text-green-500' : 'text-red-500'}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                        {canWithdraw ? 'Withdrawal Unlocked' : 'Withdrawal Locked'}
                    </h3>
                    <p className="text-gray-400 mb-6" dangerouslySetInnerHTML={{__html: canWithdraw 
                            ? 'You have reached the minimum withdrawal amount.'
                            : `You need at least <span class="text-white font-bold">$${settings.minWithdrawal.toFixed(2)}</span> to withdraw.`
                        }}/>
                </CardHeader>
                <CardContent>
                     <div className="space-y-4 mb-8 text-left">
                        <div className="flex justify-between text-sm bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-xl">
                            <span>Current Balance:</span>
                            <span className="font-bold text-green-400">${currentUser.balance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-xl">
                            <span>Minimum Required:</span>
                            <span className="font-bold text-red-400">${settings.minWithdrawal.toFixed(2)}</span>
                        </div>
                    </div>
                    <Button disabled={!canWithdraw} className="w-full bg-gray-800 py-4 h-auto rounded-xl font-bold text-gray-500 cursor-not-allowed disabled:bg-gray-800 enabled:bg-green-600 enabled:text-white enabled:cursor-pointer">
                        Request Payment
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
