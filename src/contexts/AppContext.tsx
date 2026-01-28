'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { VideoAd, User, AppSettings } from '@/lib/types';
import { videoAds as initialAds, users as initialUsers, appSettings as initialSettings } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type AdTimer = {
  active: boolean;
  timeLeft: number;
  totalTime: number;
  reward: number;
  adId: string;
};

interface AppContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentUser: User | null;
  showAuthForm: boolean;
  videoAds: VideoAd[];
  settings: AppSettings;
  adTimer: AdTimer;
  login: (email: string, pass: string) => boolean;
  adminLogin: (email: string, pass: string) => boolean;
  logout: () => void;
  setShowAuthForm: (show: boolean) => void;
  register: (name: string, email: string, pass: string) => boolean;
  playAd: (ad: VideoAd) => void;
  claimDailyBonus: () => void;
  updateCurrentUser: (user: User) => void;
  setVideoAds: React.Dispatch<React.SetStateAction<VideoAd[]>>;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  
  const [videoAds, setVideoAds] = useState<VideoAd[]>(initialAds);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [adTimer, setAdTimer] = useState<AdTimer>({
    active: false,
    timeLeft: 0,
    totalTime: 0,
    reward: 0,
    adId: '',
  });

  const updateCurrentUser = (user: User) => {
    setCurrentUser(user);
    setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? user : u));
  }

  const login = (email: string, pass: string): boolean => {
    const user = users.find(u => u.email === email);
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      setShowAuthForm(false);
      return true;
    }
    toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid credentials.' });
    return false;
  };
  
  const register = (name: string, email: string, pass: string): boolean => {
    if (users.some(u => u.email === email)) {
      toast({ variant: 'destructive', title: 'Registration Failed', description: 'Email already exists.' });
      return false;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      balance: 0,
      referrals: 0,
      referralEarnings: 0,
      adsWatchedToday: 0,
      lastDailyClaim: null,
    };
    setUsers(prev => [...prev, newUser]);
    setIsAuthenticated(true);
    setCurrentUser(newUser);
    setShowAuthForm(false);
    toast({ title: 'Success', description: 'Registration successful!' });
    return true;
  };

  const adminLogin = (email: string, pass: string): boolean => {
    if (email === 'mdesaalli74@gmail.com' && pass === 'mdesa1111') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const playAd = (ad: VideoAd) => {
    if (!currentUser) return;
    if (currentUser.adsWatchedToday >= 10) {
      toast({ variant: 'destructive', title: "Today's limit reached!", description: "You have already watched 10 videos today. Come back tomorrow." });
      return;
    }
    setAdTimer({
      active: true,
      timeLeft: ad.time,
      totalTime: ad.time,
      reward: ad.reward,
      adId: ad.id,
    });
  };

  const addReward = (reward: number) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance + reward,
      adsWatchedToday: currentUser.adsWatchedToday + 1,
    };
    updateCurrentUser(updatedUser);
    toast({ title: 'Reward!', description: `Successfully credited: $${reward.toFixed(2)}` });
  };
  
  const claimDailyBonus = () => {
    if (!currentUser) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    if (currentUser.lastDailyClaim === today) {
        toast({ variant: 'destructive', title: 'Already Claimed', description: "You've already claimed your daily bonus today." });
        return;
    }
    const updatedUser = {
        ...currentUser,
        balance: currentUser.balance + settings.dailyBonus,
        lastDailyClaim: today
    };
    updateCurrentUser(updatedUser);
    toast({ title: 'Daily Bonus!', description: `$${settings.dailyBonus.toFixed(2)} has been credited to your account.` });
  }

  useEffect(() => {
    if (!adTimer.active) return;
    if (adTimer.timeLeft <= 0) {
      setAdTimer({ ...adTimer, active: false });
      addReward(adTimer.reward);
      return;
    }
    const interval = setInterval(() => {
      setAdTimer(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
    }, 1000);
    return () => clearInterval(interval);
  }, [adTimer.active, adTimer.timeLeft]);

  const value = {
    isAuthenticated,
    isAdmin,
    currentUser,
    showAuthForm,
    videoAds,
    settings,
    adTimer,
    login,
    adminLogin,
    logout,
    setShowAuthForm,
    register,
    playAd,
    claimDailyBonus,
    updateCurrentUser,
    setVideoAds,
    setSettings,
    users,
    setUsers
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
