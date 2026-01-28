'use client';
import { useApp } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function GlobalSettings() {
    const { settings, setSettings } = useApp();
    const { toast } = useToast();

    const handleUpdate = () => {
        toast({ title: 'Success', description: 'System settings updated.' });
    };

    return (
        <Card id="settings-section" className="bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-[2rem] space-y-6">
            <h2 className="text-2xl font-bold">System Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Minimum Withdrawal Limit ($)</label>
                    <Input 
                        type="number" 
                        value={settings.minWithdrawal}
                        onChange={(e) => setSettings(s => ({...s, minWithdrawal: parseFloat(e.target.value)}))}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Daily Login Bonus ($)</label>
                    <Input 
                        type="number"
                        value={settings.dailyBonus}
                        onChange={(e) => setSettings(s => ({...s, dailyBonus: parseFloat(e.target.value)}))}
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm text-gray-400">Referral Bonus ($)</label>
                    <Input 
                        type="number"
                        value={settings.referralBonus}
                        onChange={(e) => setSettings(s => ({...s, referralBonus: parseFloat(e.target.value)}))}
                    />
                </div>
            </div>
            <Button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700 px-10 py-3 h-auto rounded-xl font-bold">Update Settings</Button>
        </Card>
    );
}
