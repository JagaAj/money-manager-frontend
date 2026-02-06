import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import {
  Plus,
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowRight,
  Filter,
  PieChart as PieChartIcon,
  Activity,
  ShieldCheck,
  Zap,
  Wallet,
  X,
  BrainCircuit,
  Rocket,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { getSummary, getChartData, getAccounts } from "../api";
import AddTransactionModal from "../components/AddTransactionModal";
import { format } from "date-fns";
import clsx from "clsx";

const OptimizationModal = ({ isOpen, onClose, summary, healthScore }) => {
  const [stage, setStage] = useState('advice'); // advice, applying, success

  const handleApply = () => {
    setStage('applying');
    setTimeout(() => {
      setStage('success');
    }, 2000);
  };

  const handleFinalClose = () => {
    onClose();
    setTimeout(() => setStage('advice'), 500);
  };

  const getAdvice = () => {
    const advice = [];
    if (healthScore < 50) {
      advice.push({
        title: "Liquidity Alert",
        desc: "High expense velocity detected. Consider liquidating low-yield assets to boost stability.",
        icon: <Zap className="w-4 h-4 text-rose-400" />,
        color: "text-rose-400"
      });
    } else {
      advice.push({
        title: "Capital Surplus",
        desc: "Healthy margin identified. Diversify $" + (summary.balance * 0.2).toFixed(0) + " into growth assets.",
        icon: <TrendingUp className="w-4 h-4 text-teal-400" />,
        color: "text-teal-400"
      });
    }

    if (summary.totalExpense > summary.totalIncome * 0.6) {
      advice.push({
        title: "Burn Rate High",
        desc: "Operating costs exceeding 60% of revenue. Optimization of category 'Lifestyle' recommended.",
        icon: <Activity className="w-4 h-4 text-indigo-400" />,
        color: "text-indigo-400"
      });
    }

    return advice;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleFinalClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-lg glass-card rounded-[3.5rem] p-12 overflow-hidden border-teal-500/20 shadow-[0_0_80px_rgba(20,184,166,0.15)] bg-[#0b0f1a]"
          >
            {stage === 'advice' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-teal-500/10 rounded-[1.5rem] border border-teal-500/20 shadow-[0_0_20px_rgba(20,184,166,0.1)]">
                      <BrainCircuit className="w-7 h-7 text-teal-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Strategic Optimization</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Quantum Analysis Complete</p>
                    </div>
                  </div>
                  <button onClick={handleFinalClose} className="p-3 hover:bg-white/5 rounded-2xl transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="space-y-6 mb-10">
                  {getAdvice().map((item, i) => (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      key={i}
                      className="flex gap-5 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
                    >
                      <div className="mt-1 p-3 rounded-[1rem] bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className={clsx("text-sm font-black uppercase tracking-widest mb-1.5", item.color)}>{item.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}

                  <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-teal-500/15 to-indigo-500/15 border border-white/5 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-[10px] font-black text-teal-500 uppercase tracking-[0.3em] mb-5">Performance Vector</p>
                    <div className="flex items-center justify-center gap-8 mb-2">
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-white">{healthScore}%</span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Status Quo</span>
                      </div>
                      <div className="w-12 h-px bg-white/10 relative">
                        <motion.div
                          animate={{ left: ["0%", "100%"] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-px bg-teal-500 shadow-[0_0_10px_teal]"
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-teal-400">{(healthScore * 1.15).toFixed(0)}%</span>
                        <span className="text-[8px] font-bold text-teal-500 uppercase tracking-widest mt-1">Calibrated</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleApply}
                    className="flex-1 py-5 rounded-3xl bg-teal-500 text-teal-950 font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(20,184,166,0.2)]"
                  >
                    Apply Strategic Adjustments
                  </button>
                </div>
              </motion.div>
            )}

            {stage === 'applying' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 flex flex-col items-center text-center"
              >
                <div className="relative mb-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="w-32 h-32 rounded-full border-t-2 border-r-2 border-teal-500/50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Rocket className="w-10 h-10 text-teal-500 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] mb-4">Synthesizing Alpha</h3>
                <p className="text-xs text-slate-400 font-medium max-w-[250px]">Rebalancing distribution matrices and optimizing capital flow vectors...</p>
              </motion.div>
            )}

            {stage === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-[2rem] bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(20,184,166,0.2)]">
                  <CheckCircle2 className="w-10 h-10 text-teal-500" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Strategy Synchronized</h3>
                <p className="text-sm text-slate-400 font-medium mb-12 max-w-[300px]">Strategic adjustments applied. Your portfolio efficiency has been calibrated to the projected growth vector.</p>
                <button
                  onClick={handleFinalClose}
                  className="w-full py-5 rounded-3xl bg-white text-slate-950 font-black text-xs uppercase tracking-[0.2em] hover:bg-teal-500 hover:text-white transition-all shadow-xl"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    expenseCategories: {},
    incomeCategories: {},
  });
  const [chartType, setChartType] = useState("monthly");
  const [chartData, setChartData] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptModalOpen, setIsOptModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyingOptim, setIsApplyingOptim] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [sumRes, chartRes, accRes] = await Promise.all([
        getSummary(),
        getChartData(chartType),
        getAccounts(),
      ]);
      setSummary(sumRes.data);
      setChartData(chartRes.data);
      setAccounts(accRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [chartType]);

  const handleOptimize = () => {
    setIsApplyingOptim(true);
    setTimeout(() => {
      setIsApplyingOptim(false);
      setIsOptModalOpen(true);
    }, 1200);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const calculateHealthScore = () => {
    if (summary.totalIncome === 0) return 0;
    const ratio = (summary.totalIncome - summary.totalExpense) / summary.totalIncome;
    return Math.max(0, Math.min(100, Math.round(ratio * 100)));
  };

  const healthScore = calculateHealthScore();

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-2 text-teal-500 font-bold text-xs uppercase tracking-[0.2em] mb-1">
            <Activity className="w-4 h-4" />
            Live Analytics
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Financial <span className="text-teal-500">Overview</span>
          </h2>
        </motion.div>

        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="group relative flex items-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-2xl font-black shadow-2xl hover:bg-teal-500 hover:text-white transition-all duration-150"
        >
          <Plus className="w-5 h-5 stroke-[3px]" />
          ADD TRANSACTION
          <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-12 grid-rows-auto gap-6"
      >
        {/* Main Balance Bento */}
        <motion.div
          variants={item}
          className="md:col-span-4 glass-card p-8 rounded-[2.5rem] flex flex-col justify-between overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 p-8">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
              <DollarSign className="w-6 h-6 text-teal-400" />
            </div>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">
              Total Balance
            </p>
            <h3 className="text-5xl font-black text-white tracking-tighter">
              ${summary.balance.toLocaleString()}
            </h3>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm text-teal-500 font-bold bg-teal-500/5 py-2 px-3 rounded-xl w-fit">
            <TrendingUp className="w-4 h-4" />
            +12.5% from last month
          </div>
        </motion.div>

        {/* Small Stats Bento */}
        <motion.div
          variants={item}
          className="md:col-span-4 bg-teal-500 p-8 rounded-[2.5rem] shadow-2xl shadow-teal-500/20 flex flex-col justify-between text-white relative group overflow-hidden"
        >
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300" />
          <p className="text-teal-100 font-bold uppercase tracking-widest text-xs opacity-80">
            Total Revenue
          </p>
          <h3 className="text-4xl font-black tracking-tight mt-1">
            ${summary.totalIncome.toLocaleString()}
          </h3>
          <div className="mt-4 flex items-center gap-1 font-bold text-xs">
            <span className="bg-white/20 p-1 px-2 rounded-lg">THIS YEAR</span>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="md:col-span-4 glass-card p-8 rounded-[2.5rem] flex flex-col justify-between border-red-500/20"
        >
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
            Total Expenses
          </p>
          <h3 className="text-4xl font-black text-white tracking-tight mt-1">
            ${summary.totalExpense.toLocaleString()}
          </h3>
          <div className="mt-4 rounded-full bg-red-500/10 h-2 w-full overflow-hidden border border-red-500/10">
            <div
              className="bg-red-500 h-full"
              style={{
                width: `${(summary.totalExpense / (summary.totalIncome || 1)) * 100}%`,
              }}
            />
          </div>
        </motion.div>

        {/* Chart Section Bento */}
        <motion.div
          variants={item}
          className="md:col-span-8 glass-card p-8 rounded-[2.5rem]"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl">
                <Calendar className="w-5 h-5 text-teal-500" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                Analysis
              </h3>
            </div>
            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
              {["weekly", "monthly", "yearly"].map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={clsx(
                    "px-4 py-2 text-[10px] font-black rounded-xl capitalize transition-all duration-100",
                    chartType === type
                      ? "bg-white text-slate-950 shadow-xl"
                      : "text-slate-500 hover:text-white",
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#ffffff"
                  opacity={0.05}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(str) => {
                    try {
                      const date = new Date(str);
                      if (chartType === "weekly") return format(date, "EEE");
                      if (chartType === "monthly")
                        return format(date, "dd MMM");
                      return format(date, "MMM yy");
                    } catch {
                      return str;
                    }
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.03)", radius: 10 }}
                  content={({ active, payload, label }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="glass-morphism p-4 rounded-2xl shadow-2xl border-white/10 min-w-[150px]">
                          <p className="text-[10px] font-black text-slate-500 uppercase mb-2">
                            Detailed View
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between font-bold text-xs">
                              <span className="text-teal-400">Income</span>
                              <span>+${payload[0].value}</span>
                            </div>
                            <div className="flex justify-between font-bold text-xs">
                              <span className="text-red-400">Expense</span>
                              <span>-${payload[1].value}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="income"
                  fill="#14b8a6"
                  radius={[6, 6, 6, 6]}
                  barSize={chartType === "weekly" ? 30 : 10}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fillOpacity={0.8} />
                  ))}
                </Bar>
                <Bar
                  dataKey="expense"
                  fill="#f43f5e"
                  radius={[6, 6, 6, 6]}
                  barSize={chartType === "weekly" ? 30 : 10}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Categories Bento */}
        <motion.div
          variants={item}
          className="md:col-span-4 glass-card p-8 rounded-[2.5rem] flex flex-col justify-between bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-500/20 rounded-2xl">
              <PieChartIcon className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">
              Allocation
            </h3>
          </div>
          <div className="space-y-4">
            {Object.entries(summary.expenseCategories).length > 0 ? (
              Object.entries(summary.expenseCategories)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([name, amount]) => {
                  const percentage = Math.round((amount / (summary.totalExpense || 1)) * 100);
                  return (
                    <div key={name} className="space-y-2">
                      <div className="flex justify-between text-xs font-black uppercase">
                        <span className="text-slate-400">{name}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          className="h-full bg-indigo-500"
                        />
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="py-10 text-center opacity-20">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Awaiting Data Breakdown</p>
              </div>
            )}
          </div>
          <Link
            to="/categories"
            className="mt-8 flex items-center justify-between w-full p-4 rounded-3xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <span className="font-bold text-xs uppercase text-slate-300">
              Detailed Intelligence
            </span>
            <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* FINANCIAL INTELLIGENCE NEXUS */}
        <motion.div
          variants={item}
          className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Health Score Hub */}
          <div className="glass-card p-8 rounded-[3rem] flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-indigo-500" />
            <div className="mb-6 relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/5"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364}
                  initial={{ strokeDashoffset: 364 }}
                  animate={{ strokeDashoffset: 364 - (364 * healthScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-teal-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{healthScore}</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Index</span>
              </div>
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-2">Financial Health score</h3>
            <p className="text-xs text-slate-500 font-medium px-4">
              Your capital efficiency is currently optimized at {healthScore}%.
            </p>
          </div>

          {/* Account Matrix */}
          <div className="glass-card p-8 rounded-[3rem] flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/5 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Asset Integrity</h3>
            </div>
            <div className="space-y-4">
              {accounts.slice(0, 3).map(acc => (
                <div key={acc.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-xs font-bold text-white truncate max-w-[100px]">{acc.name}</span>
                  </div>
                  <span className="text-xs font-black text-white">${acc.balance.toLocaleString()}</span>
                </div>
              ))}
              {accounts.length === 0 && <p className="text-[10px] text-slate-600 font-bold uppercase text-center py-4">No accounts linked</p>}
            </div>
          </div>

          {/* Efficiency Insights */}
          <div className="glass-card p-8 rounded-[3rem] flex flex-col justify-between bg-gradient-to-br from-teal-500/5 to-indigo-500/5 border-teal-500/20 relative group overflow-hidden">
            {isApplyingOptim && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-[#0b0f1a]/90 backdrop-blur-xl z-[10] flex flex-col items-center justify-center rounded-[3rem] border border-teal-500/30"
              >
                <Rocket className="w-10 h-10 text-teal-500 animate-bounce mb-4" />
                <p className="text-[10px] font-black text-teal-500 uppercase tracking-[0.3em]">Calibrating Vector...</p>
              </motion.div>
            )}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-teal-500/10 rounded-2xl">
                <Zap className="w-5 h-5 text-teal-400" />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Strategy Pulse</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                <div>
                  <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-1">Stability Threshold</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Your current balance covers {(summary.balance / (summary.totalExpense || 1)).toFixed(1)}x monthly expenses.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500" />
                <div>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Growth Vector</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Revenue is {summary.totalIncome > summary.totalExpense ? 'ahead of' : 'trailing'} expense velocity.</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleOptimize}
              className="mt-6 w-full py-3 rounded-2xl bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-teal-500 hover:text-white transition-all shadow-xl active:scale-95"
            >
              Optimize Portfolio
            </button>
          </div>
        </motion.div>
      </motion.div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />

      <OptimizationModal
        isOpen={isOptModalOpen}
        onClose={() => setIsOptModalOpen(false)}
        summary={summary}
        healthScore={healthScore}
      />
    </div>
  );
};

export default Dashboard;
