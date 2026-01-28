'use client';
import { useApp } from '@/contexts/AppContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function UserManagement() {
    const { users } = useApp();

    const getStatus = (adsWatched: number) => {
        if (adsWatched === 10) return <Badge variant="secondary" className="bg-green-500/10 text-green-500">Completed</Badge>;
        if (adsWatched > 0) return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">Working</Badge>;
        return <Badge variant="outline">Idle</Badge>;
    };

    return (
        <Card id="users-section" className="bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-[2rem]">
            <h2 className="text-2xl font-bold mb-6">Recent User Activity</h2>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-gray-400">User Email</TableHead>
                            <TableHead className="text-gray-400">Balance</TableHead>
                            <TableHead className="text-gray-400 text-center">Today's Ads</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id} className="border-white/5 text-sm hover:bg-white/5">
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="font-bold text-green-400">${user.balance.toFixed(2)}</TableCell>
                                <TableCell className="text-center">{user.adsWatchedToday}/10</TableCell>
                                <TableCell>{getStatus(user.adsWatchedToday)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
