'use client';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';

export default function AnalyticsDashboard() {
    const { users } = useApp();

    const totalUsers = users.length;
    const totalVideosWatched = users.reduce((acc, user) => acc + user.adsWatchedToday, 0); // Note: This is today's watch count. A real app would store total.
    const totalUserBalance = users.reduce((acc, user) => acc + user.balance, 0);

    const stats = [
        { label: 'Total Active Users', value: totalUsers.toLocaleString(), color: '', border: ''},
        { label: 'Total Videos Watched (Today)', value: totalVideosWatched.toLocaleString(), color: 'text-blue-500', border: ''},
        { label: 'Total User Balance', value: `$${totalUserBalance.toFixed(2)}`, color: 'text-green-500', border: 'border-b-4 border-green-600' },
    ];

    return (
        <div id="stats-section" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map(stat => (
                <Card key={stat.label} className={`bg-white/5 backdrop-blur-xl border-white/10 p-6 rounded-3xl ${stat.border}`}>
                    <p className="text-gray-500 uppercase text-xs">{stat.label}</p>
                    <h3 className={`text-4xl font-bold mt-2 ${stat.color}`}>{stat.value}</h3>
                </Card>
            ))}
        </div>
    );
}
