import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Calendar,
  Tag,
  CreditCard,
  LayoutGrid,
  FileText,
  DollarSign,
  ArrowRightLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Repeat,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { createTransaction, getAccounts, updateTransaction } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

// Custom Premium Select Component to fix native hover issues
const CustomSelect = ({ value, onChange, options, placeholder, icon: Icon, accent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-transparent border-b border-white/10 hover:border-white/30 pb-2 flex items-center justify-between cursor-pointer transition-colors duration-100 group"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {Icon && <Icon className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors duration-100" />}
          <span className={clsx("text-sm font-bold truncate", value ? "text-white" : "text-slate-500")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={clsx("w-4 h-4 text-slate-600 transition-transform duration-200", isOpen && "rotate-180")} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.12, ease: "circOut" }}
            className="absolute z-[110] left-0 right-0 mt-2 bg-[#0b0f1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="max-height-[250px] overflow-y-auto py-2 custom-scrollbar">
              {options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    "px-4 py-3 text-sm font-bold cursor-pointer transition-all duration-75 flex items-center justify-between",
                    value === opt.value
                      ? (accent === 'teal' ? 'bg-teal-500 text-teal-950' : accent === 'rose' ? 'bg-rose-500 text-rose-950' : 'bg-indigo-500 text-indigo-950')
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {opt.label}
                  {value === opt.value && <CheckCircle2 className="w-4 h-4" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AddTransactionModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialType = "EXPENSE",
  transaction = null,
}) => {
  const [activeTab, setActiveTab] = useState(initialType);
  const [accounts, setAccounts] = useState([]);

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    division: "PERSONAL",
    fromAccountId: "",
    toAccountId: "",
    timestamp: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        setActiveTab(transaction.type);
        setFormData({
          amount: transaction.amount.toString(),
          category: transaction.category || "",
          description: transaction.description || "",
          division: transaction.division || "PERSONAL",
          fromAccountId: transaction.fromAccountId || "",
          toAccountId: transaction.toAccountId || "",
          timestamp: new Date(transaction.timestamp).toISOString().slice(0, 16),
        });
      } else {
        setActiveTab(initialType);
        setFormData({
          amount: "",
          category: "",
          description: "",
          division: "PERSONAL",
          fromAccountId: accounts[0]?.id || "",
          toAccountId: "",
          timestamp: new Date().toISOString().slice(0, 16),
        });
      }
    }
  }, [isOpen, transaction, initialType, accounts]);

  const expenseCategories = ["Fuel", "Movie", "Food", "Loan", "Medical", "Shopping", "Travel", "Other"];
  const incomeCategories = ["Salary", "Business", "Freelance", "Investment", "Rental", "Other"];
  const divisions = ["PERSONAL", "OFFICE"];

  useEffect(() => {
    if (isOpen) {
      getAccounts().then((res) => {
        setAccounts(res.data);
        if (res.data.length > 0 && !formData.fromAccountId && !transaction) {
          setFormData((prev) => ({ ...prev, fromAccountId: res.data[0].id }));
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

      if (activeTab === "TRANSFER") {
        const fromAccName = accounts.find((a) => a.id === formData.fromAccountId)?.name || "Account";
        const toAccName = accounts.find((a) => a.id === formData.toAccountId)?.name || "Account";
        finalDescription = formData.description || `Transferred from ${fromAccName} to ${toAccName}`;
        finalCategory = null;
        finalDivision = null;
      }

      const payload = {
        ...formData,
        type: activeTab,
        description: finalDescription,
        category: finalCategory,
        division: finalDivision,
        amount: parseFloat(formData.amount),
        timestamp: new Date(formData.timestamp).toISOString(),
      };

      if (transaction) {
        await updateTransaction(transaction.id, payload);
      } else {
        await createTransaction(payload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save transaction", error);
      alert(error.response?.data?.message || "Failed to save transaction");
    }
  };

  const getAccentColor = () => {
    if (activeTab === "INCOME") return "teal";
    if (activeTab === "EXPENSE") return "rose";
    return "indigo";
  };

  if (!isOpen) return null;

  const accent = getAccentColor();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.15, ease: "circOut" }}
          className="relative bg-[#0b0f1a] border border-white/5 rounded-[2rem] w-full max-w-4xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
        >
          {/* Left Panel: The Core Status (35% width) */}
          <div className={clsx(
            "md:w-[35%] p-10 flex flex-col justify-between transition-colors duration-200",
            accent === 'teal' ? 'bg-teal-500/10' : accent === 'rose' ? 'bg-rose-500/10' : 'bg-indigo-500/10'
          )}>
            <div>
              <div className="flex items-center gap-4 mb-20">
                <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center border-2",
                  accent === 'teal' ? 'bg-teal-500/20 border-teal-500/30' :
                    accent === 'rose' ? 'bg-rose-500/20 border-rose-500/30' :
                      'bg-indigo-500/20 border-indigo-500/30'
                )}>
                  {activeTab === 'INCOME' ? <TrendingUp className="text-teal-400 w-7 h-7" /> :
                    activeTab === 'EXPENSE' ? <TrendingDown className="text-rose-400 w-7 h-7" /> :
                      <Repeat className="text-indigo-400 w-7 h-7" />}
                </div>
                <div>
                  <h2 className={clsx("text-4xl font-black uppercase tracking-tighter leading-none",
                    accent === 'teal' ? 'text-teal-400' : accent === 'rose' ? 'text-rose-400' : 'text-indigo-400'
                  )}>
                    {activeTab}
                  </h2>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mt-1">Transaction</p>
                </div>
              </div>

              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Transaction Value</h2>
              <div className="flex items-center gap-2">
                <span className={clsx("text-4xl font-black mt-2",
                  accent === 'teal' ? 'text-teal-500' : accent === 'rose' ? 'text-rose-500' : 'text-indigo-500'
                )}>$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="bg-transparent text-7xl font-black text-white tracking-tighter outline-none w-full placeholder:text-white/5"
                  placeholder="0"
                  autoFocus
                />
              </div>
            </div>

            <div className="pt-20 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Awaiting Verification</p>
              </div>
            </div>
          </div>

          {/* Right Panel: The Data Grid (65% width) */}
          <div className="flex-1 p-10 bg-slate-900/50">
            <div className="flex justify-between items-center mb-10">
              {/* Minimal Tab Switcher */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
                {["INCOME", "EXPENSE", "TRANSFER"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      "px-6 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all duration-100",
                      activeTab === tab
                        ? (accent === 'teal' ? 'bg-teal-500 text-teal-950' : accent === 'rose' ? 'bg-rose-500 text-rose-950' : 'bg-indigo-500 text-indigo-950')
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Tag className="w-4 h-4 text-slate-600" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{activeTab === 'TRANSFER' ? 'Target' : 'Classification'}</span>
                  </div>
                  <CustomSelect
                    value={activeTab === 'TRANSFER' ? formData.toAccountId : formData.category}
                    onChange={(val) => setFormData({ ...formData, [activeTab === 'TRANSFER' ? 'toAccountId' : 'category']: val })}
                    placeholder={activeTab === 'TRANSFER' ? 'Select Destination' : 'Select Category'}
                    accent={accent}
                    options={activeTab === 'TRANSFER' ?
                      accounts.filter(a => a.id !== formData.fromAccountId).map(a => ({ label: a.name, value: a.id })) :
                      (activeTab === "INCOME" ? incomeCategories : expenseCategories).map(c => ({ label: c, value: c }))
                    }
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-slate-600" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Source Entity</span>
                  </div>
                  <CustomSelect
                    value={formData.fromAccountId}
                    onChange={(val) => setFormData({ ...formData, fromAccountId: val })}
                    placeholder="Select Account"
                    accent={accent}
                    options={accounts.map(a => ({ label: `${a.name} ($${a.balance})`, value: a.id }))}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-600" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</span>
                  </div>
                  <input
                    type="datetime-local"
                    value={formData.timestamp}
                    onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 hover:border-white/30 pb-2 text-sm font-bold text-white outline-none focus:border-white/50 transition-colors duration-100 [color-scheme:dark] cursor-pointer"
                  />
                </div>

                {activeTab !== "TRANSFER" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <LayoutGrid className="w-4 h-4 text-slate-600" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vector</span>
                    </div>
                    <CustomSelect
                      value={formData.division}
                      onChange={(val) => setFormData({ ...formData, division: val })}
                      placeholder="Select Vector"
                      accent={accent}
                      options={divisions.map(d => ({ label: d, value: d }))}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Execution Notes</span>
                </div>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 hover:border-white/30 pb-2 text-sm font-bold text-white outline-none focus:border-white/50 transition-colors duration-100"
                  placeholder="Log detail entry..."
                />
              </div>

              <div className="pt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className={clsx(
                    "px-12 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 transition-all duration-150 shadow-2xl",
                    accent === 'teal' ? 'bg-teal-500 text-teal-950 shadow-teal-500/20' :
                      accent === 'rose' ? 'bg-rose-500 text-rose-950 shadow-rose-500/20' :
                        'bg-indigo-500 text-indigo-950 shadow-indigo-500/20'
                  )}
                >
                  Finalize Transaction
                  <CheckCircle2 className="w-4 h-4" />
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddTransactionModal;
