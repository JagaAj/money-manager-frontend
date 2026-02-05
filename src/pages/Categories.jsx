import React, { useState, useEffect } from 'react';
import { getSummary } from '../api';
import { Tag, TrendingUp, TrendingDown, Layers } from 'lucide-react';
import clsx from 'clsx';

const Categories = () => {
    const [summaries, setSummaries] = useState({ expenseCategories: {}, incomeCategories: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSummary().then(res => {
            setSummaries(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const CategorySection = ({ title, data, type }) => {
        const items = Object.entries(data);
        const icon = type === 'income' ? TrendingUp : TrendingDown;
        const color = type === 'income' ? 'text-green-500' : 'text-red-500';
        const bg = type === 'income' ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10';

        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className={clsx("p-2 rounded-lg", bg)}>
                        {React.createElement(icon, { className: clsx("w-5 h-5", color) })}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white capitalize">{title}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(([name, amount]) => (
                        <div key={name} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-indigo-500/30 transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-indigo-500/10 transition-colors">
                                    <Tag className="w-5 h-5 text-indigo-500" />
                                </div>
                                <span className={clsx("text-sm font-bold", color)}>
                                    {type === 'income' ? '+' : '-'}${amount.toLocaleString()}
                                </span>
                            </div>
                            <h4 className="font-bold text-slate-800 dark:text-white capitalize">{name}</h4>
                            <p className="text-xs text-slate-500 mt-1">Total {type === 'income' ? 'earned' : 'spent'} in this category</p>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="col-span-full py-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            No patterns found for {title}.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;

    return (
        <div className="space-y-10 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Category Analytics</h2>
                <p className="text-slate-500 dark:text-slate-400">Detailed breakdown of your spending and earning habits</p>
            </div>

            <CategorySection title="Expense Categories" data={summaries.expenseCategories} type="expense" />
            <CategorySection title="Income Categories" data={summaries.incomeCategories} type="income" />
        </div>
    );
};

export default Categories;
