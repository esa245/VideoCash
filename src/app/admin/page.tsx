'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { PieChart, Film, Users, Settings, LogOut, ArrowLeft, Banknote } from 'lucide-react';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import ManageAds from '@/components/admin/ManageAds';
import UserManagement from '@/components/admin/UserManagement';
import GlobalSettings from '@/components/admin/GlobalSettings';
import WithdrawalManagement from '@/components/admin/WithdrawalManagement';

type Section = 'stats' | 'manage-ads' | 'users' | 'settings' | 'withdrawals';

const AdminHeader = () => (
    <div className="flex justify-between items-center mb-10 bg-white/5 backdrop-blur-xl border-white/10 p-6 rounded-3xl border-l-4 border-yellow-500">
        <div>
            <h1 className="text-3xl font-bold text-yellow-500 uppercase tracking-tighter">Adsman <span className="text-white">Central</span></h1>
            <p className="text-gray-500 text-sm italic">Master Control Panel - Secure Access</p>
        </div>
        <div className="text-right">
            <p className="text-xs text-gray-500 uppercase">System Status</p>
            <p className="text-green-500 font-bold flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live & Online
            </p>
        </div>
    </div>
);

const navItems = [
    { id: 'stats', label: 'Analytics Dashboard', icon: PieChart, color: 'text-blue-500' },
    { id: 'manage-ads', label: 'Manage Video Ads', icon: Film, color: 'text-purple-500' },
    { id: 'users', label: 'User Management', icon: Users, color: 'text-green-500' },
    { id: 'withdrawals', label: 'Withdrawal Requests', icon: Banknote, color: 'text-yellow-500' },
    { id: 'settings', label: 'Global Settings', icon: Settings, color: 'text-gray-500' },
];

export default function AdminPage() {
    const { isAdmin, logout, isUserLoading } = useApp();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState<Section>('stats');

    useEffect(() => {
        if (!isUserLoading && !isAdmin) {
            router.replace('/admin/login');
        }
    }, [isAdmin, isUserLoading, router]);

    if (isUserLoading || !isAdmin) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    const renderSection = () => {
        switch (activeSection) {
            case 'stats': return <AnalyticsDashboard />;
            case 'manage-ads': return <ManageAds />;
            case 'users': return <UserManagement />;
            case 'withdrawals': return <WithdrawalManagement />;
            case 'settings': return <GlobalSettings />;
            default: return <AnalyticsDashboard />;
        }
    };

    const handleLogout = () => {
        router.replace('/');
        logout();
    }

    return (
        <div className="p-4 md:p-8">
            <AdminHeader />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    {navItems.map(item => (
                        <Button key={item.id} onClick={() => setActiveSection(item.id as Section)} variant="ghost" className={`w-full justify-start gap-4 p-4 h-auto rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition text-base ${activeSection === item.id ? 'bg-white/10' : ''}`}>
                            <item.icon className={`${item.color} h-5 w-5`} /> {item.label}
                        </Button>
                    ))}
                    <Button onClick={() => router.push('/')} variant="ghost" className="w-full justify-start gap-4 p-4 h-auto rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition text-base text-gray-300">
                        <ArrowLeft className="h-5 w-5" /> Back to User Panel
                    </Button>
                    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-4 p-4 h-auto rounded-2xl bg-red-500/10 backdrop-blur-xl border border-red-500/20 hover:bg-red-500/20 transition text-base text-red-400">
                        <LogOut className="h-5 w-5" /> Logout
                    </Button>
                </div>

                <div className="lg:col-span-3 space-y-8">
                    {renderSection()}
                </div>
            </div>
        </div>
    );
}
