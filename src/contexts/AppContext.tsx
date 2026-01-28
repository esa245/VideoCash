'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { VideoAd, User, AppSettings } from '@/lib/types';
import { videoAds as initialAds, appSettings as initialSettings } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useFirebase, useDoc, useMemoFirebase, setDocumentNonBlocking, initiateEmailSignIn, initiateEmailSignUp, updateProfileNonBlocking } from '@/firebase';
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
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userDocRef);

  useEffect(() => {
    // Wait for auth and profile loading to finish
    if (isUserLoading || (firebaseUser && isProfileLoading)) {
      return;
    }

    if (firebaseUser && firestore) {
      // User is authenticated
      if (userProfile) {
        // Profile exists, update state
        setCurrentUser(userProfile);
      } else {
        // Profile doesn't exist, create it for the logged-in user
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
        setCurrentUser(newUser); // Optimistically update state
      }

      // Check for admin
      if (firebaseUser.email === 'mdesaalli74@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      // User is not authenticated
      setCurrentUser(null);
      setIsAdmin(false);
    }
  }, [firebaseUser, userProfile, isUserLoading, isProfileLoading, firestore]);

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


  const value: AppContextType = {
    isAuthenticated: !!firebaseUser && !!currentUser,
    isAdmin,
    isUserLoading: isUserLoading || (!!firebaseUser && isProfileLoading),
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
