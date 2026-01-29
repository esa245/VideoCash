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
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import type { WithdrawalRequest } from '@/lib/types';
import { format } from 'date-fns';


export default function WithdrawalManagement() {
    const { withdrawalRequests, updateWithdrawalRequest } = useApp();

    const getStatusBadge = (status: WithdrawalRequest['status']) => {
        switch (status) {
            case 'Pending':
                return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">Pending</Badge>;
            case 'Completed':
                return <Badge variant="secondary" className="bg-green-500/10 text-green-500">Completed</Badge>;
            case 'Rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Card id="withdrawals-section" className="bg-white/5 backdrop-blur-xl border-white/10 p-8 rounded-[2rem]">
            <h2 className="text-2xl font-bold mb-6">Withdrawal & Recharge Requests</h2>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-gray-400">Date</TableHead>
                            <TableHead className="text-gray-400">User Email</TableHead>
                            <TableHead className="text-gray-400">Type</TableHead>
                            <TableHead className="text-gray-400">Amount</TableHead>
                            <TableHead className="text-gray-400">Account</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...withdrawalRequests].sort((a, b) => b.createdAt - a.createdAt).map(request => (
                            <TableRow key={request.id} className="border-white/5 text-sm hover:bg-white/5">
                                <TableCell>{format(new Date(request.createdAt), 'PPpp')}</TableCell>
                                <TableCell>{request.userEmail}</TableCell>
                                <TableCell>
                                    <Badge variant={request.type === 'Recharge' ? 'default' : 'secondary'}>{request.type}</Badge>
                                </TableCell>
                                <TableCell className="font-bold text-green-400">${request.amount.toFixed(2)}</TableCell>
                                <TableCell>{request.accountNumber}</TableCell>
                                <TableCell>{getStatusBadge(request.status)}</TableCell>
                                <TableCell className="text-right">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => updateWithdrawalRequest(request.id, 'Completed')}
                                                disabled={request.status === 'Completed'}
                                            >
                                                Mark as Completed
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => updateWithdrawalRequest(request.id, 'Rejected')}
                                                disabled={request.status === 'Rejected'}
                                            >
                                                Mark as Rejected
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
