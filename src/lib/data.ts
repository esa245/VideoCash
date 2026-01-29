import type { VideoAd, User, AppSettings } from './types';

export const videoAds: VideoAd[] = [
    {
        id: 'cpm-ad-1',
        title: 'অফার (১): অ্যাপ ইনস্টল করে আয় করুন',
        adUrl: 'https://www.effectivegatecpm.com/t8295gzkm?key=370687f852c8e8eb9099cd160f2a80ae',
        reward: 0.35,
    },
    {
        id: 'cpm-ad-2',
        title: 'অফার (২): বিজ্ঞাপন দেখে আয় করুন',
        adUrl: 'https://www.effectivegatecpm.com/xiedchkt?key=56bb4992d3fac02fe4ed2b9ac12a121d',
        reward: 0.35,
    },
    {
        id: 'cpm-ad-3',
        title: 'অফার (৩): স্পেশাল বোনাস!',
        adUrl: 'https://www.effectivegatecpm.com/t8295gzkm?key=370687f852c8e8eb9099cd160f2a80ae',
        reward: 0.30,
    },
    {
        id: 'cpm-ad-4',
        title: 'অফার (৪): সীমিত সময়ের অফার',
        adUrl: 'https://www.effectivegatecpm.com/xiedchkt?key=56bb4992d3fac02fe4ed2b9ac12a121d',
        reward: 0.30,
    },
    {
        id: 'cpm-ad-5',
        title: 'অফার (৫): সহজে আয় করুন',
        adUrl: 'https://www.effectivegatecpm.com/t8295gzkm?key=370687f852c8e8eb9099cd160f2a80ae',
        reward: 0.25,
    },
    {
        id: 'cpm-ad-6',
        title: 'অফার (৬): দৈনিক টাস্ক পূরণ করুন',
        adUrl: 'https://www.effectivegatecpm.com/xiedchkt?key=56bb4992d3fac02fe4ed2b9ac12a121d',
        reward: 0.25,
    },
    {
        id: 'cpm-ad-7',
        title: 'অফার (৭): কুইজ খেলে আয়',
        adUrl: 'https://www.effectivegatecpm.com/t8295gzkm?key=370687f852c8e8eb9099cd160f2a80ae',
        reward: 0.20,
    },
    {
        id: 'cpm-ad-8',
        title: 'অফার (৮): নতুন গেম!',
        adUrl: 'https://www.effectivegatecpm.com/xiedchkt?key=56bb4992d3fac02fe4ed2b9ac12a121d',
        reward: 0.20,
    },
    {
        id: 'cpm-ad-9',
        title: 'অফার (৯): ভিডিও দেখুন',
        adUrl: 'https://www.effectivegatecpm.com/t8295gzkm?key=370687f852c8e8eb9099cd160f2a80ae',
        reward: 0.15,
    },
    {
        id: 'cpm-ad-10',
        title: 'অফার (১০): ফাইনাল বোনাস',
        adUrl: 'https://www.effectivegatecpm.com/xiedchkt?key=56bb4992d3fac02fe4ed2b9ac12a121d',
        reward: 0.50,
    },
];

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Ariful Islam',
    email: 'ariful77@gmail.com',
    balance: 84.50,
    adsWatchedToday: 10,
    lastDailyClaim: '2024-07-28',
    referralCode: 'REF777',
    referredBy: null,
    referralsCount: 5,
  },
  {
    id: 'user-2',
    name: 'Tania Pro',
    email: 'tania_pro@yahoo.com',
    balance: 12.20,
    adsWatchedToday: 5,
    lastDailyClaim: '2024-07-29',
    referralCode: 'TANIA99',
    referredBy: 'REF777',
    referralsCount: 0,
  },
  {
    id: 'user-3',
    name: 'Test User',
    email: 'test@test.com',
    balance: 0,
    adsWatchedToday: 0,
    lastDailyClaim: null,
    referralCode: 'TEST01',
    referredBy: null,
    referralsCount: 0,
  }
];

export const appSettings: AppSettings = {
  minWithdrawal: 100,
  dailyBonus: 0.50,
  referralBonus: 1.00,
  initialRechargeEnabled: true,
};
