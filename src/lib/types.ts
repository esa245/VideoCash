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
  adsWatchedToday: number;
  lastDailyClaim: string | null; // ISO date string yyyy-mm-dd
  referralCode: string;
  referredBy: string | null;
  referralsCount: number;
};

export type AppSettings = {
  minWithdrawal: number;
  dailyBonus: number;
  referralBonus: number;
};
