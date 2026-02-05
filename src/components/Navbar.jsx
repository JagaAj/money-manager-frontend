import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, Wallet, Settings, Layers } from 'lucide-react';

import clsx from 'clsx';

const Navbar = () => {
    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/transactions', icon: History, label: 'History' },
        { to: '/accounts', icon: Wallet, label: 'Accounts' },
        { to: '/categories', icon: Layers, label: 'Categories' },
    ];


    return (
        <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:left-0 md:w-64 md:h-full bg-white dark:bg-slate-900 border-t md:border-r border-slate-200 dark:border-slate-800 z-50 transition-all duration-300">
            <div className="flex md:flex-col h-full justify-between md:justify-start p-4 md:p-6">
                <div className="hidden md:flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                        Money Manager
                    </h1>
                </div>

                <div className="flex md:flex-col w-full justify-around md:justify-start gap-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                clsx(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                                    isActive
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-semibold shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                )
                            }
                        >
                            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                            <span className="hidden md:block">{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="hidden md:block mt-auto p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-100 dark:border-indigo-900/30">
                    <h3 className="text-xs font-semibold uppercase text-indigo-500 mb-2">Pro Tip</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Track expenses daily to build better habits.</p>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
