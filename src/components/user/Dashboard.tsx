'use client';
import { useApp } from '@/contexts/AppContext';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, UserPlus, Banknote, Gift, Headset } from 'lucide-react';
import { format } from 'date-fns';
import { useMemo } from 'react';
import VideosView from './VideosView';
import ReferralView from './ReferralView';
import WithdrawView from './WithdrawView';
import SupportView from './SupportView';


function WithdrawalProgress() {
  const { currentUser, settings } = useApp();
  if (!currentUser) return null;

  const progressPercent = (currentUser.balance / settings.minWithdrawal) * 100;
  const dailyAvg = 3.50; // As per original spec
  const daysLeft = currentUser.balance < settings.minWithdrawal ? Math.ceil((settings.minWithdrawal - currentUser.balance) / dailyAvg) : 0;
  
  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl mb-8 p-6">
      <div className="flex justify-between items-end mb-4 flex-wrap gap-2">
        <div>
          <p className="text-gray-400 text-sm uppercase">Withdrawal Progress (${settings.minWithdrawal} Goal)</p>
          <h3 className="text-4xl font-bold">
            ${currentUser.balance.toFixed(2)}
            <span className="text-lg text-gray-500"> / ${settings.minWithdrawal.toFixed(2)}</span>
          </h3>
        </div>
        <div className="text-right">
          <p className="text-blue-400 font-bold">
            {currentUser.balance < 10 ? `Estimated: 10 Days left` : `Estimated: ${daysLeft} Days left`}
          </p>
        </div>
      </div>
      <Progress value={progressPercent} className="w-full bg-white/5 h-3 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500" />
    </Card>
  );
}

function StatsGrid() {
  const { currentUser } = useApp();
  if (!currentUser) return null;

  const stats = [
    { label: 'Current USD', value: `$${currentUser.balance.toFixed(2)}`, color: 'border-blue-500', textColor: '' },
    { label: 'Referral Bonus', value: `$${currentUser.referralEarnings.toFixed(2)}`, color: 'border-purple-500', textColor: 'text-purple-400' },
    { label: 'Videos Today', value: `${currentUser.adsWatchedToday}/10`, color: 'border-green-500', textColor: '' },
    { label: 'Total Referrals', value: `${currentUser.referrals}`, color: 'border-yellow-500', textColor: '' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {stats.map(stat => (
        <Card key={stat.label} className={`bg-white/5 backdrop-blur-xl border-white/10 p-5 rounded-2xl border-l-4 ${stat.color}`}>
          <p className="text-[10px] text-gray-400 uppercase">{stat.label}</p>
          <h3 className={`text-2xl font-bold mt-1 ${stat.textColor}`}>{stat.value}</h3>
        </Card>
      ))}
    </div>
  );
}

function DailyBonusCard() {
    const { currentUser, claimDailyBonus, settings } = useApp();
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const isClaimed = useMemo(() => currentUser?.lastDailyClaim === today, [currentUser?.lastDailyClaim, today]);

    return (
        <div className="p-0.5 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 mb-10">
            <div className="bg-background rounded-[22px] p-6 flex justify-between items-center">
                <div>
                    <h4 className="text-xl font-bold text-blue-400 flex items-center gap-2"><Gift /> Daily Login Reward</h4>
                    <p className="text-gray-400 text-sm">Claim your daily ${settings.dailyBonus.toFixed(2)} reward now.</p>
                </div>
                <Button 
                    id="claim-btn"
                    onClick={claimDailyBonus}
                    disabled={isClaimed}
                    className="bg-blue-600 px-6 py-3 h-auto rounded-xl font-bold hover:scale-105 transition disabled:bg-gray-800 disabled:text-gray-500 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                    {isClaimed ? 'Claimed' : `Claim $${settings.dailyBonus.toFixed(2)}`}
                </Button>
            </div>
        </div>
    );
}

export default function Dashboard() {
  const { videoAds, currentUser } = useApp();
  const adsWatchedToday = currentUser?.adsWatchedToday ?? 0;
  
  return (
    <div className="container mx-auto px-0 md:px-6 py-8">
      <WithdrawalProgress />
      <StatsGrid />
      <DailyBonusCard />
      
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border-white/10 rounded-xl h-auto p-1.5 mb-8">
          <TabsTrigger value="videos" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3">
            <Video className="h-4 w-4" /> Daily Videos ({10 - adsWatchedToday})
          </TabsTrigger>
          <TabsTrigger value="referral" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3">
            <UserPlus className="h-4 w-4" /> Refer System
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3">
            <Banknote className="h-4 w-4" /> Cash Out
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3">
            <Headset className="h-4 w-4" /> Support
          </TabsTrigger>
        </TabsList>
        <TabsContent value="videos">
            <VideosView />
        </TabsContent>
        <TabsContent value="referral">
            <ReferralView />
        </TabsContent>
        <TabsContent value="withdraw">
            <WithdrawView />
        </TabsContent>
        <TabsContent value="support">
            <SupportView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
