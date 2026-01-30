'use client'
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';

export default function VideosView() {
    const { videoAds, playAd, currentUser } = useApp();
    const adsCompleted = (currentUser?.adsWatchedToday ?? 0) >= 10;
    const watchedTodayIds = currentUser?.watchedAdIdsToday || [];

    return (
         <div className="space-y-4">
            {videoAds.map((ad, index) => {
                const isWatched = watchedTodayIds.includes(ad.id);
                return (
                    <Card key={ad.id} className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl group hover:border-blue-500/30 transition-all">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-600/20 text-blue-400 font-bold h-10 w-10 flex items-center justify-center rounded-lg text-lg">
                                    {index + 1}
                                </div>
                                <div>
                                    <h4 className="font-bold text-base">{ad.title}</h4>
                                    <p className="text-gray-400 text-sm">Reward: <span className="text-green-400 font-bold">${ad.reward.toFixed(2)}</span></p>
                                </div>
                            </div>
                            <Button 
                                onClick={() => playAd(ad)} 
                                className="bg-white/5 group-hover:bg-blue-600 py-3 h-auto rounded-xl font-bold transition shrink-0" 
                                disabled={adsCompleted || isWatched}
                            >
                                <PlayCircle className="h-5 w-5 mr-2" />
                                {adsCompleted ? "Limit Reached" : isWatched ? "Watched" : "Watch Ad"}
                            </Button>
                        </div>
                    </Card>
                )
            })}
            {adsCompleted && (
                <Card className="bg-green-500/10 backdrop-blur-xl border-green-500/20 rounded-2xl text-center p-8">
                    <h3 className="text-xl font-bold text-green-400">All Ads Watched!</h3>
                    <p className="text-gray-400 mt-1">You have completed all available ads for today. Please check back tomorrow.</p>
                </Card>
            )}
        </div>
    )
}
