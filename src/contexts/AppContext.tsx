'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import type { VideoAd, User, AppSettings } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useFirebase, useDoc, useCollection, useMemoFirebase, setDataNonBlocking, pushDataNonBlocking, removeDataNonBlocking, initiateEmailSignIn, initiateEmailSignUp, updateProfileNonBlocking, updateDataNonBlocking } from '@/firebase';
import { ref, onValue } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { videoAds as initialVideoAds, appSettings as initialAppSettings } from '@/lib/data';

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
  const { auth, database, user: firebaseUser, isUserLoading: isAuthLoading } = useFirebase();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  
  const [videoAds, setVideoAds] = useState<VideoAd[]>([]);
  const [settings, setSettings] = useState<AppSettings>(initialAppSettings);
  const [users, setUsers] = useState<User[]>([]);

  // Realtime Database References
  const userRef = useMemoFirebase(
    () => (database && firebaseUser ? ref(database, `users/${firebaseUser.uid}`) : null),
    [database, firebaseUser]
  );
  const videoAdsRef = useMemoFirebase(() => (database ? ref(database, 'video_ads') : null), [database]);
  const settingsRef = useMemoFirebase(() => (database ? ref(database, 'admin_settings') : null), [database]);
  const usersRef = useMemoFirebase(() => (database ? ref(database, 'users') : null), [database]);


  // Realtime Database Data Hooks
  const prevUserRef = useRef(userRef);
  const { data: userProfile, isLoading: isProfileLoadingFromDoc } = useDoc<User>(userRef);
  const { data: videoAdsData, isLoading: areAdsLoading } = useCollection<VideoAd>(videoAdsRef);
  const { data: settingsData, isLoading: areSettingsLoading } = useDoc<AppSettings>(settingsRef);
  
  const profileJustStartedLoading = prevUserRef.current !== userRef;
  const isProfileLoading = profileJustStartedLoading || (!!userRef && isProfileLoadingFromDoc);

  const isDataContextLoading = areAdsLoading || areSettingsLoading;
  const isUserLoading = isAuthLoading || (!!firebaseUser && isProfileLoading) || isDataContextLoading;

  useEffect(() => {
    prevUserRef.current = userRef;
  }, [userRef]);


  useEffect(() => {
    if (videoAdsRef) {
      onValue(videoAdsRef, (snapshot) => {
        if (!snapshot.exists()) {
          initialVideoAds.forEach(ad => {
            pushDataNonBlocking(videoAdsRef, {
              title: ad.title,
              reward: ad.reward,
              adUrl: ad.adUrl,
            });
          });
        }
      }, { onlyOnce: true });
    }
    if (settingsRef) {
      onValue(settingsRef, (snapshot) => {
        if (!snapshot.exists()) {
          setDataNonBlocking(settingsRef, initialAppSettings);
        }
      }, { onlyOnce: true });
    }
  }, [videoAdsRef, settingsRef]);

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

    if (firebaseUser && database) {
      if (userProfile) {
        setCurrentUser(userProfile);
      } else {
        const newUserRef = ref(database, `users/${firebaseUser.uid}`);
        const newUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'New User',
          email: firebaseUser.email!,
          balance: 0,
          adsWatchedToday: 0,
          lastDailyClaim: null,
        };
        setDataNonBlocking(newUserRef, newUser);
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
  }, [firebaseUser, userProfile, isUserLoading, database]);

  const updateCurrentUser = useCallback((userData: Partial<User>) => {
    if (userRef) {
        updateDataNonBlocking(userRef, userData);
    }
  }, [userRef]);

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
    if (!auth || !database) return;
    try {
        const credential = await initiateEmailSignUp(auth, email, pass);
        const user = credential.user;
        await updateProfileNonBlocking(user, { displayName: name });
        
        const newUser: User = {
            id: user.uid,
            name,
            email: user.email!,
            balance: 0,
            adsWatchedToday: 0,
            lastDailyClaim: null,
        };
        const newUserRef = ref(database, `users/${user.uid}`);
        await setDataNonBlocking(newUserRef, newUser);
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
    if(usersRef) {
        const unsubscribe = onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const userList = Object.keys(data).map(key => ({ ...data[key], id: key }));
                setUsers(userList);
            } else {
                setUsers([]);
            }
        });
        return () => unsubscribe();
    }
  },[usersRef]);

  const addVideoAd = useCallback((ad: Omit<VideoAd, 'id'>) => {
    if (!videoAdsRef) return;
    pushDataNonBlocking(videoAdsRef, ad);
  }, [videoAdsRef]);

  const deleteVideoAd = useCallback((adId: string) => {
      if (!database) return;
      const adRef = ref(database, `video_ads/${adId}`);
      removeDataNonBlocking(adRef);
  }, [database]);

  const updateSettings = useCallback((newSettings: AppSettings) => {
      if (!settingsRef) return;
      setDataNonBlocking(settingsRef, newSettings);
  }, [settingsRef]);


  const value: AppContextType = {
    isAuthenticated: !!firebaseUser && !!currentUser,
    isAdmin,
    isUserLoading,
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
