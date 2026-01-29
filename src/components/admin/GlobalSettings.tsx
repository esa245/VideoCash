'use client';
import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { AppSettings } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function GlobalSettings() {
    const { settings: globalSettings, updateSettings } = useApp();
    const [localSettings, setLocalSettings] = useState<AppSettings>(globalSettings);
    const { toast } = useToast();

    useEffect(() => {
        setLocalSettings(globalSettings);
    }, [globalSettings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalSettings(s => ({ ...s, [name]: parseFloat(value) || 0 }));
    };

    const handleUpdate = () => {
        updateSettings(localSettings);
        toast({ title: 'Success', description: 'System settings updated.' });
    };

    return (
        <Card id="settings-section" className="bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-[2rem] space-y-6">
            <h2 className="text-2xl font-bold">System Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="minWithdrawal" className="text-sm text-gray-400">Minimum Withdrawal Limit ($)</label>
                    <Input 
                        id="minWithdrawal"
                        name="minWithdrawal"
                        type="number" 
                        value={localSettings.minWithdrawal}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="dailyBonus" className="text-sm text-gray-400">Daily Login Bonus ($)</label>
                    <Input 
                        id="dailyBonus"
                        name="dailyBonus"
                        type="number"
                        value={localSettings.dailyBonus}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="referralBonus" className="text-sm text-gray-400">Referral Bonus ($)</label>
                    <Input 
                        id="referralBonus"
                        name="referralBonus"
                        type="number"
                        step="0.1"
                        value={localSettings.referralBonus}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="flex items-center space-x-3 pt-4">
                <Switch
                    id="initialRechargeEnabled"
                    checked={localSettings.initialRechargeEnabled}
                    onCheckedChange={(checked) =>
                    setLocalSettings((s) => ({ ...s, initialRechargeEnabled: checked }))
                    }
                />
                <Label htmlFor="initialRechargeEnabled" className="text-base text-gray-300">Enable Initial 10 Taka Recharge Bonus</Label>
            </div>
            <Button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700 px-10 py-3 h-auto rounded-xl font-bold mt-4">Update Settings</Button>
        </Card>
    );
}
