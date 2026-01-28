'use client'
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export default function WithdrawView() {
    const { currentUser, settings } = useApp();
    if (!currentUser) return null;
    
    const canWithdraw = currentUser.balance >= settings.minWithdrawal;

    return (
        <div className="flex justify-center">
            <Card className="max-w-lg w-full bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-3xl text-center">
                <CardHeader className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border ${canWithdraw ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                        <Lock className={`text-2xl ${canWithdraw ? 'text-green-500' : 'text-red-500'}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                        {canWithdraw ? 'Withdrawal Unlocked' : 'Withdrawal Locked'}
                    </h3>
                    <p className="text-gray-400 mb-6 font-bold">
                        {canWithdraw 
                            ? 'You have reached the minimum withdrawal amount.'
                            : `You need at least <span class="text-white">$${settings.minWithdrawal.toFixed(2)}</span> to withdraw.`
                        }
                    </p>
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
