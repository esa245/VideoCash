'use client'
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import type { PromotedLink } from '@/lib/types';

export default function PromotionsView() {
    const { promotedLinks, registerClickOnPromotedLink } = useApp();

    if (!promotedLinks || promotedLinks.length === 0) {
        return (
            <Card className="bg-yellow-500/10 backdrop-blur-xl border-yellow-500/20 rounded-2xl text-center p-8">
                <h3 className="text-xl font-bold text-yellow-400">No Promotions Yet!</h3>
                <p className="text-gray-400 mt-1">Be the first to promote your link from the Support tab.</p>
            </Card>
        );
    }
    
    const handleClick = (link: PromotedLink) => {
        if (registerClickOnPromotedLink) {
            registerClickOnPromotedLink(link);
        }
    };

    return (
         <div className="space-y-4">
            {promotedLinks.map((link) => (
                <Card key={link.id} className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl group hover:border-yellow-500/30 transition-all">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 overflow-hidden">
                             <div className="bg-yellow-600/20 text-yellow-400 font-bold h-10 w-10 flex items-center justify-center rounded-lg shrink-0">
                                P
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-bold text-base truncate" title={link.url}>{link.url}</h4>
                                <p className="text-gray-400 text-sm">Promoted by: <span className="text-yellow-400 font-bold">{link.userName}</span></p>
                            </div>
                        </div>
                        <Button 
                            onClick={() => handleClick(link)} 
                            className="bg-white/5 group-hover:bg-yellow-600 py-3 h-auto rounded-xl font-bold transition shrink-0" 
                        >
                            <ExternalLink className="h-5 w-5 mr-2" />
                            Visit Site
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}