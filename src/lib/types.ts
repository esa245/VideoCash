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
  lastAdReset: number | null;
  lastDailyClaim: string | null; // ISO date string yyyy-mm-dd
  referralCode: string;
  referredBy: string | null;
  referralsCount: number;
  initialRechargeClaimed?: boolean;
};

export type AppSettings = {
  minWithdrawal: number;
  dailyBonus: number;
  referralBonus: number;
};

export type WithdrawalRequest = {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  type: 'Recharge' | 'Withdrawal';
  accountNumber: string;
  status: 'Pending' | 'Completed' | 'Rejected';
  createdAt: number;
}
