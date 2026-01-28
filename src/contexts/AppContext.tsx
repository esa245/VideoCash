'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { VideoAd, User, AppSettings } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useFirebase, useDoc, useCollection, useMemoFirebase, setDocumentNonBlocking, addDocumentNonBlocking, deleteDocumentNonBlocking, initiateEmailSignIn, initiateEmailSignUp, updateProfileNonBlocking } from '@/firebase';
import { doc, collection, onSnapshot, query as firestoreQuery } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

interface AppContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUserLoading: boolean;
  currentUser: User | null;
  showAuthForm: boolean;
  videoAds: VideoAd[];
  settings: AppSettings;
  login: (email: string, pass: string) => void;
  adminLogin: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  setShowAuthForm: (show: boolean) => void;
  register: (name: string, email: string, pass:string) => void;
  playAd: (ad: VideoAd) => void;
  claimDailyBonus: () => void;
  updateCurrentUser: (user: Partial<User>) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  addVideoAd: (ad: Omit<VideoAd, 'id'>) => void;
  deleteVideoAd: (adId: string) => void;
  updateSettings: (settings: AppSettings) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { auth, firestore, user: firebaseUser, isUserLoading: isAuthLoading } = useFirebase();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  
  const [videoAds, setVideoAds] = useState<VideoAd[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ minWithdrawal: 100, dailyBonus: 0.50, referralBonus: 1.00 });
  const [users, setUsers] = useState<User[]>([]);

  // Firestore References
  const userDocRef = useMemoFirebase(
    () => (firestore && firebaseUser ? doc(firestore, 'users', firebaseUser.uid) : null),
    [firestore, firebaseUser]
  );
  const videoAdsCollectionRef = useMemoFirebase(() => (firestore ? collection(firestore, 'video_ads') : null), [firestore]);
  const settingsDocRef = useMemoFirebase(() => (firestore ? doc(firestore, 'admin_settings', 'global_settings') : null), [firestore]);

  // Firestore Data Hooks
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userDocRef);
  const { data: videoAdsData, isLoading: areAdsLoading } = useCollection<VideoAd>(videoAdsCollectionRef);
  const { data: settingsData, isLoading: areSettingsLoading } = useDoc<AppSettings>(settingsDocRef);
  
  const isUserLoading = isAuthLoading || (!!firebaseUser && isProfileLoading);

  useEffect(() => {
    if (videoAdsData) {
      setVideoAds(videoAdsData);
    }
  }, [videoAdsData]);

  useEffect(() => {
    if (settingsData) {
      setSettings(settingsData);
    }
  }, [settingsData]);


  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    if (firebaseUser && firestore) {
      if (userProfile) {
        setCurrentUser(userProfile);
      } else {
        const newUserDocRef = doc(firestore, 'users', firebaseUser.uid);
        const newUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'New User',
          email: firebaseUser.email!,
          balance: 0,
          referrals: 0,
          referralEarnings: 0,
          adsWatchedToday: 0,
          lastDailyClaim: null,
        };
        setDocumentNonBlocking(newUserDocRef, newUser, {});
        setCurrentUser(newUser); 
      }

      if (firebaseUser.email === 'mdesaalli74@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setCurrentUser(null);
      setIsAdmin(false);
    }
  }, [firebaseUser, userProfile, isUserLoading, firestore]);

  const updateCurrentUser = useCallback((userData: Partial<User>) => {
    if (userDocRef) {
        setDocumentNonBlocking(userDocRef, userData, { merge: true });
    }
  }, [userDocRef]);

  const login = (email: string, pass: string): void => {
    if (!auth) return;
    initiateEmailSignIn(auth, email, pass)
        .then(() => {
            setShowAuthForm(false);
        })
        .catch((error: any) => {
            toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid credentials or user does not exist.' });
        });
  };
  
  const register = async (name: string, email: string, pass: string) => {
    if (!auth || !firestore) return;
    try {
        const credential = await initiateEmailSignUp(auth, email, pass);
        const user = credential.user;
        await updateProfileNonBlocking(user, { displayName: name });
        const newUser: User = {
            id: user.uid,
            name,
            email: user.email!,
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
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Registration Failed', description: error.message });
    }
  };

  const adminLogin = async (email: string, pass: string): Promise<boolean> => {
    if (!auth) return false;
    try {
        await initiateEmailSignIn(auth, email, pass);
        return true;
    } catch(e) {
        return false;
    }
  };

  const logout = () => {
    if (auth) {
        signOut(auth);
    }
  };

  const addReward = useCallback((reward: number) => {
    if (!currentUser) return;
    const updatedUser = {
      balance: currentUser.balance + reward,
      adsWatchedToday: currentUser.adsWatchedToday + 1,
    };
    updateCurrentUser(updatedUser);
    toast({ title: 'Reward!', description: `Successfully credited: $${reward.toFixed(2)}` });
  }, [currentUser, updateCurrentUser, toast]);

  const playAd = (ad: VideoAd) => {
    if (!currentUser) return;
    if (currentUser.adsWatchedToday >= 10) {
      toast({ variant: 'destructive', title: "Today's limit reached!", description: "You have already watched 10 videos today. Come back tomorrow." });
      return;
    }
    window.open(ad.adUrl, '_blank');
    addReward(ad.reward);
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
    if(firestore) {
        const usersCollection = collection(firestore, 'users');
        const q = firestoreQuery(usersCollection);
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userList = snapshot.docs.map(d => d.data() as User);
            setUsers(userList);
        });
        return () => unsubscribe();
    }
  },[firestore]);

  const addVideoAd = useCallback((ad: Omit<VideoAd, 'id'>) => {
    if (!videoAdsCollectionRef) return;
    addDocumentNonBlocking(videoAdsCollectionRef, ad);
  }, [videoAdsCollectionRef]);

  const deleteVideoAd = useCallback((adId: string) => {
      if (!firestore) return;
      const adDocRef = doc(firestore, 'video_ads', adId);
      deleteDocumentNonBlocking(adDocRef);
  }, [firestore]);

  const updateSettings = useCallback((newSettings: AppSettings) => {
      if (!settingsDocRef) return;
      setDocumentNonBlocking(settingsDocRef, newSettings);
  }, [settingsDocRef]);


  const value: AppContextType = {
    isAuthenticated: !!firebaseUser && !!currentUser,
    isAdmin,
    isUserLoading: isUserLoading || areAdsLoading || areSettingsLoading,
    currentUser,
    showAuthForm,
    videoAds,
    settings,
    login,
    adminLogin,
    logout,
    setShowAuthForm,
    register,
    playAd,
    claimDailyBonus,
    updateCurrentUser,
    users,
    setUsers,
    addVideoAd,
    deleteVideoAd,
    updateSettings,
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
