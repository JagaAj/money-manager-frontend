import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  Wallet,
  Settings,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

const Navbar = () => {
  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/transactions", icon: History, label: "History" },
    { to: "/accounts", icon: Wallet, label: "Accounts" },
    { to: "/categories", icon: Layers, label: "Categories" },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50">
      <div className="glass-morphism px-8 py-3 rounded-2xl flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-black tracking-tighter hidden sm:block">MONEY MANAGER</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "relative flex items-center gap-2 p-2 px-4 rounded-xl transition-all duration-150 group",
                  isActive
                    ? "text-teal-400 font-bold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-5 h-5" />
                  <span className="hidden sm:block text-xs uppercase tracking-widest">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-teal-500/10 rounded-xl border border-teal-500/20"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
