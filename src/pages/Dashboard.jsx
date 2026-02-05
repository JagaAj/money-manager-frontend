import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { getSummary, getChartData, getTransactions } from '../api';
import AddTransactionModal from '../components/AddTransactionModal';
import { format } from 'date-fns';
import clsx from 'clsx';

const Dashboard = () => {
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
    const [chartType, setChartType] = useState('monthly');
    const [chartData, setChartData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [sumRes, chartRes, txRes] = await Promise.all([
                getSummary(),
                getChartData(chartType),
                getTransactions({ limit: 5 }) // Assuming backend supports limit, otherwise slice locally
            ]);
            setSummary(sumRes.data);
            setChartData(chartRes.data);
            setRecentTransactions(txRes.data.slice(0, 5)); // Just in case
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [chartType]);

    const SummaryCard = ({ title, amount, icon: Icon, colorClass, bgClass }) => (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    ${amount.toLocaleString()}
                </h3>
            </div>
            <div className={`p-3 rounded-xl ${bgClass}`}>
                <Icon className={`w-6 h-6 ${colorClass}`} />
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h2>
                    <p className="text-slate-500 dark:text-slate-400">Overview of your personal finances</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
                >
                    <Plus className="w-5 h-5" />
                    Add Transaction
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Total Income"
                    amount={summary.totalIncome}
                    icon={TrendingUp}
                    colorClass="text-green-500"
                    bgClass="bg-green-500/10"
                />
                <SummaryCard
                    title="Total Expenses"
                    amount={summary.totalExpense}
                    icon={TrendingDown}
                    colorClass="text-red-500"
                    bgClass="bg-red-500/10"
                />
                <SummaryCard
                    title="Total Balance"
                    amount={summary.balance}
                    icon={DollarSign}
                    colorClass="text-blue-500"
                    bgClass="bg-blue-500/10"
                />
            </div>

            {/* Chart Section */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        Financial Overview
                    </h3>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        {['weekly', 'monthly', 'yearly'].map(type => (
                            <button
                                key={type}
                                onClick={() => setChartType(type)}
                                className={clsx(
                                    "px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-all",
                                    chartType === type
                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                )}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 12 }}
                                excludeToLocalTime={true}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend iconType="circle" />
                            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={50} />
                            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Recent Transactions</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                                <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">Description</th>
                                <th className="pb-3 text-xs font-semibold text-slate-500 uppercase text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentTransactions.map((tx) => (
                                <tr key={tx.id} className="group">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={clsx(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                                                tx.type === 'INCOME' ? "bg-green-100 text-green-600" :
                                                    tx.type === 'EXPENSE' ? "bg-red-100 text-red-600" :
                                                        "bg-blue-100 text-blue-600"
                                            )}>
                                                {tx.category ? tx.category[0] : 'T'}
                                            </div>
                                            <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{tx.category}</span>

                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-slate-500">{format(new Date(tx.timestamp), 'MMM dd, yyyy')}</td>
                                    <td className="py-4 text-sm text-slate-500 max-w-[200px] truncate">{tx.description}</td>
                                    <td className={clsx(
                                        "py-4 text-sm font-bold text-right",
                                        tx.type === 'INCOME' ? "text-green-500" :
                                            tx.type === 'EXPENSE' ? "text-red-500" :
                                                "text-blue-500"
                                    )}>
                                        {tx.type === 'EXPENSE' ? '-' : tx.type === 'INCOME' ? '+' : ''}${tx.amount}
                                    </td>

                                </tr>
                            ))}
                            {recentTransactions.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-slate-400">No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
            />
        </div>
    );
};

export default Dashboard;
