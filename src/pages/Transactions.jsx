import React, { useState, useEffect } from 'react';
import { getTransactions } from '../api';
import { Filter, Search, Edit2 } from 'lucide-react';
import { format, differenceInHours } from 'date-fns';
import clsx from 'clsx';
// We might need to reuse the modal for editing, but for now let's just list them
// To implement 'Edit', I would pass the transaction to the modal.

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filters, setFilters] = useState({
        division: '',
        category: '',
        start: '',
        end: '',
    });
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await getTransactions({
                ...filters,
                division: filters.division === 'ALL' ? null : filters.division,
                category: filters.category === 'ALL' ? null : filters.category,
            });
            setTransactions(res.data);
        } catch (error) {
            console.error("Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const getRemainingTime = (timestamp) => {
        const diff = 12 - differenceInHours(new Date(), new Date(timestamp));
        if (diff <= 0) return null;

        const totalMinutes = (12 * 60) - Math.floor((new Date() - new Date(timestamp)) / 60000);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return `${h}h ${m}m left`;
    };

    const isEditable = (timestamp) => {
        return differenceInHours(new Date(), new Date(timestamp)) < 12;
    };


    const categories = ['ALL', 'Salary', 'Business', 'Freelance', 'Fuel', 'Movie', 'Food', 'Loan', 'Medical', 'Shopping', 'Travel', 'Investment', 'Rental', 'Other'];


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Transaction History</h2>
                    <p className="text-slate-500 dark:text-slate-400">View and manage your financial records</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Division</label>
                    <select
                        className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm min-w-[120px]"
                        value={filters.division}
                        onChange={e => handleFilterChange('division', e.target.value)}
                    >
                        <option value="">All Divisions</option>
                        <option value="PERSONAL">Personal</option>
                        <option value="OFFICE">Office</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                    <select
                        className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm min-w-[120px]"
                        value={filters.category}
                        onChange={e => handleFilterChange('category', e.target.value)}
                    >
                        {categories.map(c => <option key={c} value={c === 'ALL' ? '' : c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Start Date</label>
                    <input
                        type="date"
                        className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm"
                        value={filters.start}
                        onChange={e => handleFilterChange('start', e.target.value ? new Date(e.target.value).toISOString() : '')}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">End Date</label>
                    <input
                        type="date"
                        className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm"
                        value={filters.end}
                        onChange={e => handleFilterChange('end', e.target.value ? new Date(e.target.value).toISOString() : '')}
                    />
                </div>
                <button
                    onClick={() => setFilters({ division: '', category: '', start: '', end: '' })}
                    className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 bg-slate-100 rounded-lg"
                >
                    Clear
                </button>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Details</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Division</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Amount</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4">
                                        <span className={clsx(
                                            "px-2 py-1 rounded text-xs font-bold uppercase",
                                            tx.type === 'INCOME' ? "bg-green-100 text-green-700" :
                                                tx.type === 'EXPENSE' ? "bg-red-100 text-red-700" :
                                                    "bg-blue-100 text-blue-700"
                                        )}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                        <div className="font-medium">{format(new Date(tx.timestamp), 'MMM dd, yyyy')}</div>
                                        <div className="text-xs text-slate-400">{format(new Date(tx.timestamp), 'hh:mm a')}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-slate-800 dark:text-white capitalize">{tx.category}</div>
                                        <div className="text-xs text-slate-500">{tx.description}</div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {tx.division}
                                    </td>
                                    <td className={clsx(
                                        "p-4 text-sm font-bold text-right",
                                        tx.type === 'INCOME' ? "text-green-600" :
                                            tx.type === 'EXPENSE' ? "text-red-600" :
                                                "text-blue-600"
                                    )}>
                                        {tx.type === 'EXPENSE' ? '-' : tx.type === 'INCOME' ? '+' : ''}${tx.amount}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            {isEditable(tx.timestamp) ? (
                                                <>
                                                    <button className="p-2 text-indigo-500 hover:bg-indigo-100/50 rounded-lg transition-colors" title="Edit within 12h window">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm animate-pulse">
                                                        {getRemainingTime(tx.timestamp)}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="p-2 text-slate-300 cursor-not-allowed opacity-50" title="Editing window (12h) expired">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-tighter opacity-60">
                                                        Locked
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </td>


                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-400">
                                        {loading ? "Loading..." : "No transactions found matching your filters"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default Transactions;
