'use client';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { VideoAd } from '@/lib/types';

export default function ManageAds() {
    const { videoAds, setVideoAds } = useApp();
    const { toast } = useToast();
    const [newAd, setNewAd] = useState({ title: '', reward: '', time: '' });

    const handleSaveAd = () => {
        const { title, reward, time } = newAd;
        if (title && reward && time) {
            const ad: VideoAd = {
                id: `ad-${Date.now()}`,
                title,
                reward: parseFloat(reward),
                time: parseInt(time),
                image: `https://picsum.photos/seed/${Date.now()}/400/225`,
                imageHint: 'business tech'
            };
            setVideoAds(prevAds => [ad, ...prevAds]);
            setNewAd({ title: '', reward: '', time: '' });
            toast({ title: 'Success', description: 'New ad has been published.' });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields.' });
        }
    };

    const handleDeleteAd = (id: string) => {
        if (confirm("Are you sure? This will remove the ad for all users.")) {
            setVideoAds(prevAds => prevAds.filter(ad => ad.id !== id));
            toast({ title: 'Ad Removed', description: 'The selected ad has been deleted.' });
        }
    };
    
    return (
        <Card id="manage-ads-section" className="bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-[2rem] space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <PlusCircle className="text-blue-500" /> Add/Edit Video Ads
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-6 rounded-2xl">
                <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase ml-2">Video Title</label>
                    <Input type="text" value={newAd.title} onChange={(e) => setNewAd({...newAd, title: e.target.value})} placeholder="e.g. Premium YouTube Ad" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase ml-2">Reward ($)</label>
                    <Input type="number" value={newAd.reward} onChange={(e) => setNewAd({...newAd, reward: e.target.value})} placeholder="e.g. 0.85" step="0.01" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase ml-2">Time (Seconds)</label>
                    <Input type="number" value={newAd.time} onChange={(e) => setNewAd({...newAd, time: e.target.value})} placeholder="e.g. 30" />
                </div>
                <Button onClick={handleSaveAd} className="md:col-span-3 mt-2 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-base font-bold">Save Ad to System</Button>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Active Ads in System</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {videoAds.map((ad) => (
                        <div key={ad.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 group">
                            <div>
                                <span className="font-bold text-blue-400">{ad.title}</span>
                                <span className="ml-4 text-xs text-gray-500">${ad.reward.toFixed(2)} | {ad.time}s</span>
                            </div>
                            <Button onClick={() => handleDeleteAd(ad.id)} size="icon" variant="ghost" className="text-red-500 hover:bg-red-500/20">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
