import React, { useState, useEffect } from "react";
import { getAccounts, createAccount, getTransactions } from "../api";
import {
  Wallet,
  Plus,
  CreditCard,
  ArrowRightLeft,
  History,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import AddTransactionModal from "../components/AddTransactionModal";
import { format } from "date-fns";
import clsx from "clsx";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");

  const fetchData = async () => {
    try {
      const [accRes, txRes] = await Promise.all([
        getAccounts(),
        getTransactions(),
      ]);
      setAccounts(accRes.data);
      setTransfers(txRes.data.filter((tx) => tx.type === "TRANSFER"));
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
      setNewAccountName("");
      setIsAccountModalOpen(false);
      fetchData();
    } catch (e) {
      alert("Failed to create account");
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-[0.2em] mb-1">
            <ShieldCheck className="w-4 h-4" />
            Secure Assets
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Accounts <span className="text-teal-400">&</span> Wallets
          </h2>
        </motion.div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Quick Transfer
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAccountModalOpen(true)}
            className="flex items-center gap-2 bg-white text-slate-950 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-500 hover:text-white transition-all shadow-xl"
          >
            <Plus className="w-5 h-5" />
            New Account
          </motion.button>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {accounts.map((acc, idx) => (
          <motion.div
            key={acc.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="relative overflow-hidden glass-card rounded-[2.5rem] p-8 group transition-all duration-300 hover:translate-y-[-5px]"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-all duration-700"></div>
            <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group-hover:border-teal-500/30 transition-colors">
                  <Wallet className="w-6 h-6 text-teal-400" />
                </div>
                <CreditCard className="w-8 h-8 text-white/10 group-hover:text-white/20 transition-colors" />
              </div>
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                  {acc.name}
                </p>
                <h3 className="text-4xl font-black tracking-tighter text-white">
                  ${acc.balance?.toLocaleString()}
                </h3>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.div>
        ))}
      </div>

      {/* Transfer History Bento */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card rounded-[3rem] p-8 relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-500/10 rounded-2xl">
            <History className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-black text-white">
            Transfer <span className="text-slate-500">History</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 opacity-50">
                <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Execution Date</th>
                <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Routing</th>
                <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Notes</th>
                <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transfers.map((tx) => {
                const fromAcc = accounts.find((a) => a.id === tx.fromAccountId)?.name || "External";
                const toAcc = accounts.find((a) => a.id === tx.toAccountId)?.name || "Wallet";
                return (
                  <tr key={tx.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="py-6 text-sm font-bold text-slate-400">
                      {format(new Date(tx.timestamp), "MMM dd, hh:mm a")}
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-3 text-xs font-black">
                        <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-slate-400">
                          {fromAcc}
                        </span>
                        <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                          <ArrowRight className="w-4 h-4 text-teal-500" />
                        </motion.div>
                        <span className="px-3 py-1 bg-teal-500/10 rounded-lg border border-teal-500/20 text-teal-400">
                          {toAcc}
                        </span>
                      </div>
                    </td>
                    <td className="py-6">
                      <p className="text-sm font-medium text-slate-500 italic">
                        {tx.description || "Inter-asset movement"}
                      </p>
                    </td>
                    <td className="py-6 text-xl font-black text-right text-indigo-400 tracking-tight">
                      ${tx.amount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Account Creation Modal Wrapper (Styled) */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-[2.5rem] w-full max-w-md p-10 relative"
          >
            <h3 className="text-3xl font-black text-white mb-6">Create <br /><span className="text-teal-500 text-4xl">New Account</span></h3>
            <form onSubmit={handleCreateAccount} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Account Name</label>
                <input
                  className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 text-white font-bold focus:border-teal-500/50 outline-none transition-all"
                  placeholder="e.g. Robinhood, Cold Storage"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="flex-1 py-4 text-slate-500 font-bold hover:text-white transition-colors"
                >
                  ABORT
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-white text-slate-950 rounded-2xl font-black shadow-2xl hover:bg-teal-500 hover:text-white transition-all"
                >
                  INITIALIZE
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

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
