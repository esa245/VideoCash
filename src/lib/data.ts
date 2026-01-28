import type { VideoAd, User, AppSettings } from './types';
import imageData from './placeholder-images.json';

export const videoAds: VideoAd[] = imageData.placeholderImages.map((img, index) => {
    const rewards = [0.80, 0.50, 0.25, 0.20, 0.20, 0.20, 0.30, 0.20, 0.15, 0.20];
    const times = [30, 25, 20, 20, 15, 15, 30, 20, 15, 15];
    return {
        id: img.id,
        title: img.description,
        reward: rewards[index],
        time: times[index],
        image: img.imageUrl,
        imageHint: img.imageHint,
    };
});

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Ariful Islam',
    email: 'ariful77@gmail.com',
    balance: 84.50,
    referrals: 12,
    referralEarnings: 12.00,
    adsWatchedToday: 10,
    lastDailyClaim: '2024-07-28',
  },
  {
    id: 'user-2',
    name: 'Tania Pro',
    email: 'tania_pro@yahoo.com',
    balance: 12.20,
    referrals: 2,
    referralEarnings: 2.00,
    adsWatchedToday: 5,
    lastDailyClaim: '2024-07-29',
  },
  {
    id: 'user-3',
    name: 'Test User',
    email: 'test@test.com',
    balance: 0,
    referrals: 0,
    referralEarnings: 0,
    adsWatchedToday: 0,
    lastDailyClaim: null,
  }
];

export const appSettings: AppSettings = {
  minWithdrawal: 100,
  dailyBonus: 0.50,
  referralBonus: 1.00,
};
