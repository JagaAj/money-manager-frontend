import React, { useState, useEffect } from 'react';
import { getAccounts, createAccount, getTransactions } from '../api';
import { Wallet, Plus, CreditCard, ArrowRightLeft, History } from 'lucide-react';
import AddTransactionModal from '../components/AddTransactionModal';
import { format } from 'date-fns';

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');

    const fetchData = async () => {
        try {
            const [accRes, txRes] = await Promise.all([
                getAccounts(),
                getTransactions()
            ]);
            setAccounts(accRes.data);
            setTransfers(txRes.data.filter(tx => tx.type === 'TRANSFER'));
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            await createAccount({ name: newAccountName, balance: 0 });
            setNewAccountName('');
            setIsAccountModalOpen(false);
            fetchData();
        } catch (e) {
            alert("Failed to create account");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Accounts & Wallets</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage your financial sources and transfers</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsTransferModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-900/30"
                    >
                        <ArrowRightLeft className="w-4 h-4" />
                        Quick Transfer
                    </button>
                    <button
                        onClick={() => setIsAccountModalOpen(true)}
                        className="flex items-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-4 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
                    >
                        <Plus className="w-5 h-5" />
                        New Account
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map(acc => (
                    <div key={acc.id} className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 group hover:scale-[1.02] transition-transform duration-300">
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                                    <Wallet className="w-6 h-6 text-white" />
                                </div>
                                <CreditCard className="w-8 h-8 text-white/40" />
                            </div>
                            <div>
                                <p className="text-indigo-200 text-sm font-medium mb-1 uppercase tracking-wider">{acc.name}</p>
                                <h3 className="text-3xl font-bold tracking-tight">${acc.balance?.toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>
                ))}
                {accounts.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        No accounts found. Create one to get started.
                    </div>
                )}
            </div>

            {/* Transfer History Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <History className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Transfer History</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">Description</th>
                                <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">Route</th>
                                <th className="pb-3 text-xs font-semibold text-slate-500 uppercase text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {transfers.map((tx) => {
                                const fromAcc = accounts.find(a => a.id === tx.fromAccountId)?.name || 'Unknown';
                                const toAcc = accounts.find(a => a.id === tx.toAccountId)?.name || 'Unknown';
                                return (
                                    <tr key={tx.id} className="group">
                                        <td className="py-4 text-sm text-slate-500">
                                            {format(new Date(tx.timestamp), 'MMM dd, h:mm a')}
                                        </td>
                                        <td className="py-4">
                                            <div className="text-sm font-medium text-slate-800 dark:text-white">{tx.description || 'Inter-account transfer'}</div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-medium">{fromAcc}</span>
                                                <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                                                <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded font-medium">{toAcc}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm font-bold text-right text-blue-500">
                                            ${tx.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                            {transfers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-slate-400">No transfer history records yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Account Creation Modal */}
            {isAccountModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <h3 className="text-xl font-bold mb-4">Add New Account</h3>
                        <form onSubmit={handleCreateAccount}>
                            <input
                                className="w-full mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Account Name (e.g., Bank, Cash)"
                                value={newAccountName}
                                onChange={e => setNewAccountName(e.target.value)}
                                required
                            />
                            <div className="flex gap-2 justify-end">
                                <button type="button" onClick={() => setIsAccountModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Transfer Modal */}
            <AddTransactionModal
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                onSuccess={fetchData}
                initialType="TRANSFER"
            />
        </div>
    );
};

export default Accounts;

