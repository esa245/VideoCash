export type VideoAd = {
  id: string;
  title: string;
  reward: number;
  adUrl: string;
};

export type User = {
  id:string;
  name: string;
  email: string;
  balance: number;
  referrals: number;
  referralEarnings: number;
  adsWatchedToday: number;
  lastDailyClaim: string | null; // ISO date string yyyy-mm-dd
};

export type AppSettings = {
  minWithdrawal: number;
  dailyBonus: number;
  referralBonus: number;
};

export type PromotedLink = {
  id: string;
  url: string;
  userId: string;
  userName: string;
  clicks: number;
  createdAt: string;
};
