import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, CreditCard, LayoutGrid, FileText } from 'lucide-react';
import { createTransaction, getAccounts } from '../api';
import clsx from 'clsx';

const AddTransactionModal = ({ isOpen, onClose, onSuccess, initialType = 'EXPENSE' }) => {
    const [activeTab, setActiveTab] = useState(initialType);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialType);
        }
    }, [isOpen, initialType]);

    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        division: 'PERSONAL',
        fromAccountId: '',
        toAccountId: '',
        timestamp: new Date().toISOString().slice(0, 16),
    });

    const expenseCategories = ['Fuel', 'Movie', 'Food', 'Loan', 'Medical', 'Shopping', 'Travel', 'Other'];
    const incomeCategories = ['Salary', 'Business', 'Freelance', 'Investment', 'Rental', 'Other'];
    const divisions = ['PERSONAL', 'OFFICE'];

    useEffect(() => {
        if (isOpen) {
            getAccounts().then(res => {
                setAccounts(res.data);
                if (res.data.length > 0 && !formData.fromAccountId) {
                    setFormData(prev => ({ ...prev, fromAccountId: res.data[0].id }));
                }
            });
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let finalDescription = formData.description;
            let finalCategory = formData.category;
            let finalDivision = formData.division;


            if (activeTab === 'TRANSFER') {
                const fromAccName = accounts.find(a => a.id === formData.fromAccountId)?.name || 'Account';
                const toAccName = accounts.find(a => a.id === formData.toAccountId)?.name || 'Account';
                finalDescription = formData.description || `Transferred from ${fromAccName} to ${toAccName}`;
                finalCategory = null; // No category for transfers
                finalDivision = null; // No division for transfers
            }

            await createTransaction({
                ...formData,
                type: activeTab,
                description: finalDescription,
                category: finalCategory,
                division: finalDivision,
                amount: parseFloat(formData.amount),
                timestamp: new Date(formData.timestamp).toISOString(),
            });
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                amount: '',
                category: '',
                description: '',
                division: 'PERSONAL',
                fromAccountId: accounts[0]?.id || '',
                toAccountId: '',
                timestamp: new Date().toISOString().slice(0, 16),
            });
        } catch (error) {
            console.error('Failed to create transaction', error);
            alert('Failed to save transaction');
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Add Transaction</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex p-2 gap-2 bg-slate-50 dark:bg-slate-800/50">
                    <button
                        onClick={() => setActiveTab('INCOME')}
                        className={clsx(
                            "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                            activeTab === 'INCOME'
                                ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                                : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                        )}
                    >
                        Income
                    </button>
                    <button
                        onClick={() => setActiveTab('EXPENSE')}
                        className={clsx(
                            "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                            activeTab === 'EXPENSE'
                                ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                                : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                        )}
                    >
                        Expense
                    </button>
                    <button
                        onClick={() => setActiveTab('TRANSFER')}
                        className={clsx(
                            "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                            activeTab === 'TRANSFER'
                                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                                : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                        )}
                    >
                        Transfer
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg font-bold text-slate-800 dark:text-white"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">Date & Time</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.timestamp}
                                    onChange={e => setFormData({ ...formData, timestamp: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        {activeTab !== 'TRANSFER' && (
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">Division</label>
                                <div className="relative">
                                    <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        value={formData.division}
                                        onChange={e => setFormData({ ...formData, division: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 appearance-none"
                                    >
                                        {divisions.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                    </div>

                    {activeTab !== 'TRANSFER' && (
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">Category</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 appearance-none"
                                    required={activeTab !== 'TRANSFER'}
                                >
                                    <option value="" disabled>Select Category</option>
                                    {(activeTab === 'INCOME' ? incomeCategories : expenseCategories).map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}


                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">Account</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    value={formData.fromAccountId}
                                    onChange={e => setFormData({ ...formData, fromAccountId: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 appearance-none"
                                >
                                    <option value="" disabled>Select Account</option>
                                    {accounts.map(a => <option key={a.id} value={a.id}>{a.name} (${a.balance})</option>)}
                                </select>
                            </div>
                        </div>

                        {activeTab === 'TRANSFER' && (
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">To Account</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        value={formData.toAccountId}
                                        onChange={e => setFormData({ ...formData, toAccountId: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 appearance-none"
                                    >
                                        <option value="" disabled>Select Destination</option>
                                        {accounts.filter(a => a.id !== formData.fromAccountId).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">Description</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <textarea
                                rows="2"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
                                placeholder="What is this for?"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={clsx(
                            "w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95",
                            activeTab === 'INCOME' ? "bg-green-500 hover:bg-green-600 shadow-green-500/30" :
                                activeTab === 'EXPENSE' ? "bg-red-500 hover:bg-red-600 shadow-red-500/30" :
                                    "bg-blue-500 hover:bg-blue-600 shadow-blue-500/30"
                        )}
                    >
                        Save Transaction
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;
