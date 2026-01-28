'use client'
import Image from 'next/image';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function VideosView() {
    const { videoAds, playAd, currentUser } = useApp();

    return (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoAds.map((ad, index) => (
                <Card key={ad.id} className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl group hover:border-blue-500/30 transition-all overflow-hidden">
                    <CardContent className="p-5">
                         <div className="w-full h-32 bg-slate-900 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                             <Image
                                src={ad.image}
                                alt={ad.title}
                                width={400}
                                height={225}
                                data-ai-hint={ad.imageHint}
                                className="object-cover w-full h-full"
                             />
                             <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-md font-bold">HD</span>
                         </div>
                         <h4 className="font-bold text-lg truncate">{ad.title}</h4>
                         <p className="text-gray-500 text-sm">Reward: <span className="text-green-400 font-bold">${ad.reward.toFixed(2)}</span> | {ad.time}s</p>
                         <Button onClick={() => playAd(ad)} className="w-full mt-4 bg-white/5 group-hover:bg-blue-600 py-3 h-auto rounded-xl font-bold transition" disabled={(currentUser?.adsWatchedToday ?? 0) >= 10}>
                             {(currentUser?.adsWatchedToday ?? 0) >= 10 ? "Limit Reached" : "Watch Ad"}
                         </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
