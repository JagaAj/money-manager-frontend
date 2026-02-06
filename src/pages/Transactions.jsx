import React, { useState, useEffect } from "react";
import { getTransactions } from "../api";
import {
  Filter,
  Search,
  Edit2,
  History as HistoryIcon,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCcw,
} from "lucide-react";
import { format, differenceInHours } from "date-fns";
import { motion } from "framer-motion";
import clsx from "clsx";
import AddTransactionModal from "../components/AddTransactionModal";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    division: "",
    category: "",
    start: "",
    end: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        division:
          filters.division && filters.division !== "ALL"
            ? filters.division
            : null,
        category:
          filters.category && filters.category !== "ALL"
            ? filters.category
            : null,
        start: filters.start ? `${filters.start}T00:00:00` : null,
        end: filters.end ? `${filters.end}T23:59:59` : null,
      };
      const res = await getTransactions(params);
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
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getRemainingTime = (timestamp) => {
    const diff = 12 - differenceInHours(new Date(), new Date(timestamp));
    if (diff <= 0) return null;
    const totalMinutes =
      12 * 60 - Math.floor((new Date() - new Date(timestamp)) / 60000);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m left`;
  };

  const isEditable = (timestamp) => {
    return differenceInHours(new Date(), new Date(timestamp)) < 12;
  };

  const categories = [
    "ALL",
    "Salary",
    "Business",
    "Freelance",
    "Fuel",
    "Movie",
    "Food",
    "Loan",
    "Medical",
    "Shopping",
    "Travel",
    "Investment",
    "Rental",
    "Other",
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-[0.2em] mb-1">
            <HistoryIcon className="w-4 h-4" />
            Audit Log
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Transaction <span className="text-teal-400">Ledger</span>
          </h2>
        </motion.div>

        <div className="flex bg-white/5 p-2 rounded-2xl border border-white/5">
          <button
            onClick={fetchTransactions}
            className="px-4 py-2 flex items-center gap-2 text-xs font-black text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCcw
              className={clsx("w-4 h-4", loading && "animate-spin")}
            />
            REFRESH
          </button>
        </div>
      </div>

      {/* Modern Filter Bento */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-6 rounded-[2rem] flex flex-wrap gap-6 items-end relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-500 opacity-30" />
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">
            Division
          </label>
          <select
            className="w-full bg-slate-900/50 p-3 rounded-xl text-sm font-bold border border-white/5 focus:border-teal-500/50 outline-none transition-colors duration-100"
            value={filters.division}
            onChange={(e) => handleFilterChange("division", e.target.value)}
          >
            <option value="" className="bg-slate-900 text-white">
              All Divisions
            </option>
            <option value="PERSONAL" className="bg-slate-900 text-white">
              Personal
            </option>
            <option value="OFFICE" className="bg-slate-900 text-white">
              Office
            </option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">
            Category
          </label>
          <select
            className="w-full bg-slate-900/50 p-3 rounded-xl text-sm font-bold border border-white/5 focus:border-indigo-500/50 outline-none transition-colors duration-100"
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            {categories.map((c) => (
              <option
                key={c}
                value={c === "ALL" ? "" : c}
                className="bg-slate-900 text-white"
              >
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">
            Start Date
          </label>
          <input
            type="date"
            className="w-full bg-slate-900/50 p-3 rounded-xl text-sm font-bold border border-white/5 focus:border-purple-500/50 outline-none"
            value={filters.start}
            onChange={(e) => handleFilterChange("start", e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">
            End Date
          </label>
          <input
            type="date"
            className="w-full bg-slate-900/50 p-3 rounded-xl text-sm font-bold border border-white/5 focus:border-purple-500/50 outline-none"
            value={filters.end}
            onChange={(e) => handleFilterChange("end", e.target.value)}
          />
        </div>
        <button
          onClick={() =>
            setFilters({ division: "", category: "", start: "", end: "" })
          }
          className="p-3 px-6 text-sm font-black text-red-400 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest"
        >
          Clear
        </button>
      </motion.div>

      {/* Ledger Table Bento */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Transaction
                </th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Division Info
                </th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Timestamp
                </th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">
                  Amount
                </th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">
                  Manage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={clsx(
                          "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shadow-inner",
                          tx.type === "INCOME"
                            ? "bg-teal-500/10 text-teal-500 border border-teal-500/20"
                            : tx.type === "EXPENSE"
                              ? "bg-red-500/10 text-red-500 border border-red-500/20"
                              : "bg-blue-500/10 text-blue-500 border border-blue-500/20",
                        )}
                      >
                        {tx.type === "INCOME" ? (
                          <ArrowUpCircle className="w-6 h-6" />
                        ) : (
                          <ArrowDownCircle className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <p className="text-base font-black text-white capitalize leading-tight">
                          {tx.category}
                        </p>
                        <p className="text-xs text-slate-500 font-bold">
                          {tx.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {tx.division}
                    </span>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-bold text-slate-300">
                      {format(new Date(tx.timestamp), "MMM dd, yyyy")}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase">
                      {format(new Date(tx.timestamp), "hh:mm a")}
                    </p>
                  </td>
                  <td
                    className={clsx(
                      "p-6 text-xl font-black text-right tracking-tight",
                      tx.type === "INCOME"
                        ? "text-teal-400"
                        : tx.type === "EXPENSE"
                          ? "text-red-400"
                          : "text-blue-400",
                    )}
                  >
                    {tx.type === "EXPENSE"
                      ? "-"
                      : tx.type === "INCOME"
                        ? "+"
                        : ""}
                    ₹{tx.amount.toLocaleString()}
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col items-center gap-2">
                      {isEditable(tx.timestamp) ? (
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingTransaction(tx);
                              setIsModalOpen(true);
                            }}
                            className="p-3 text-indigo-400 hover:bg-indigo-500/10 rounded-2xl transition-all border border-transparent hover:border-indigo-500/30 group/btn"
                          >
                            <Edit2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded uppercase tracking-widest animate-pulse">
                            {getRemainingTime(tx.timestamp)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center opacity-30 grayscale items-center gap-1">
                          <div className="p-3 text-slate-500">
                            <Edit2 className="w-4 h-4" />
                          </div>
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                            Locked
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <Search className="w-8 h-8 text-slate-600" />
                      </div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                        {loading
                          ? "Decrypting Ledger..."
                          : "No records found in this vector"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSuccess={fetchTransactions}
        transaction={editingTransaction}
      />
    </div>
  );
};

export default Transactions;
