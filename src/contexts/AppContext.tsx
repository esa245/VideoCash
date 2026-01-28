'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { VideoAd, User, AppSettings } from '@/lib/types';
import { videoAds as initialAds, appSettings as initialSettings } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useFirebase, useDoc, useMemoFirebase, setDocumentNonBlocking, initiateEmailSignIn, initiateEmailSignUp, updateProfileNonBlocking } from '@/firebase';
import { doc, collection, getDocs, where, query as firestoreQuery } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

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
  login: (email: string, pass: string) => void;
  adminLogin: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  setShowAuthForm: (show: boolean) => void;
  register: (name: string, email: string, pass:string) => void;
  playAd: (ad: VideoAd) => void;
  claimDailyBonus: () => void;
  updateCurrentUser: (user: Partial<User>) => void;
  setVideoAds: React.Dispatch<React.SetStateAction<VideoAd[]>>;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { auth, firestore, user: firebaseUser, isUserLoading } = useFirebase();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  
  const [videoAds, setVideoAds] = useState<VideoAd[]>(initialAds);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [users, setUsers] = useState<User[]>([]);

  const userDocRef = useMemoFirebase(
    () => (firestore && firebaseUser ? doc(firestore, 'users', firebaseUser.uid) : null),
    [firestore, firebaseUser]
  );
  const { data: userProfile } = useDoc<User>(userDocRef);

  useEffect(() => {
    if (!isUserLoading) {
        if (firebaseUser && userProfile) {
            setCurrentUser(userProfile);
        } else {
            setCurrentUser(null);
            setIsAdmin(false);
        }
    }
  }, [firebaseUser, userProfile, isUserLoading]);

  const [adTimer, setAdTimer] = useState<AdTimer>({
    active: false,
    timeLeft: 0,
    totalTime: 0,
    reward: 0,
    adId: '',
  });

  const updateCurrentUser = useCallback((userData: Partial<User>) => {
    if (userDocRef) {
        setDocumentNonBlocking(userDocRef, userData, { merge: true });
    }
  }, [userDocRef]);

  const login = (email: string, pass: string): void => {
    if (!auth) return;
    initiateEmailSignIn(auth, email, pass);
    setShowAuthForm(false);
  };
  
  const register = async (name: string, email: string, pass: string) => {
    if (!auth || !firestore) return;
    try {
        await initiateEmailSignUp(auth, email, pass);
        // After signUp, onAuthStateChanged will trigger.
        // We need to wait for the user to be created to get the UID.
        // A better approach is to handle profile creation in a useEffect listening to firebaseUser
        
        // For now, let's assume we get the user right away for simplicity.
        // This part of the logic might need to be moved.
        
        auth.onAuthStateChanged(user => {
            if (user) {
                updateProfileNonBlocking(user, { displayName: name });
                const newUser: User = {
                    id: user.uid,
                    name,
                    email,
                    balance: 0,
                    referrals: 0,
                    referralEarnings: 0,
                    adsWatchedToday: 0,
                    lastDailyClaim: null,
                };
                const newUserRef = doc(firestore, 'users', user.uid);
                setDocumentNonBlocking(newUserRef, newUser, {});
                setShowAuthForm(false);
                toast({ title: 'Success', description: 'Registration successful!' });
            }
        });
        

    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Registration Failed', description: error.message });
    }
  };

  const adminLogin = async (email: string, pass: string): Promise<boolean> => {
    if (email === 'mdesaalli74@gmail.com' && pass === 'mdesa1111') {
        if (auth) {
           try {
                await initiateEmailSignIn(auth, email, pass);
                setIsAdmin(true);
                return true;
           } catch(e) {
                return false;
           }
        }
    }
    return false;
  };

  const logout = () => {
    if (auth) {
        signOut(auth);
    }
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

  useEffect(() => {
    if(firestore) {
        const usersCollection = collection(firestore, 'users');
        const q = firestoreQuery(usersCollection);
        getDocs(q).then(snapshot => {
            const userList = snapshot.docs.map(d => d.data() as User);
            setUsers(userList);
        });
    }
  },[firestore]);


  const value = {
    isAuthenticated: !!firebaseUser && !!currentUser,
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
