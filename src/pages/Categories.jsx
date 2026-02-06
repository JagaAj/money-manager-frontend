import React, { useState, useEffect } from "react";
import { getSummary } from "../api";
import { Tag, TrendingUp, TrendingDown, Layers, PieChart } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

const Categories = () => {
  const [summaries, setSummaries] = useState({
    expenseCategories: {},
    incomeCategories: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSummary()
      .then((res) => {
        setSummaries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const CategorySection = ({ title, data, type }) => {
    const items = Object.entries(data);
    const totalAmount = items.reduce((sum, [_, val]) => sum + val, 0);

    const icon = type === "income" ? TrendingUp : TrendingDown;
    const color = type === "income" ? "text-teal-400" : "text-red-400";
    const bg = type === "income" ? "bg-teal-500/10 border-teal-500/20" : "bg-red-500/10 border-red-500/20";

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className={clsx("p-3 rounded-2xl border", bg)}>
            {React.createElement(icon, { className: clsx("w-5 h-5", color) })}
          </div>
          <h3 className="text-2xl font-black text-white capitalize tracking-tight">
            {title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(([name, amount], idx) => {
            const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
            return (
              <motion.div
                key={name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ scale: 1.02 }}
                className="glass-card p-6 rounded-[2rem] group transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Tag className="w-12 h-12" />
                </div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors">
                    <Tag className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="text-right">
                    <p className={clsx("text-lg font-black tracking-tighter", color)}>
                      {type === "income" ? "+" : "-"}${amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-end mb-2">
                  <h4 className="text-lg font-black text-white capitalize tracking-tight">
                    {name}
                  </h4>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {percentage.toFixed(1)}% Intensity
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className={clsx("h-full", type === "income" ? "bg-teal-500" : "bg-red-500")}
                    transition={{ duration: 0.4, ease: "circOut" }}
                  />
                </div>
              </motion.div>
            );
          })}
          {items.length === 0 && (
            <div className="col-span-full py-16 text-center glass-card rounded-[2.5rem] border-dashed">
              <div className="flex flex-col items-center gap-4 text-slate-500 font-bold uppercase tracking-widest text-xs">
                <PieChart className="w-10 h-10 opacity-20" />
                No intelligence found for {title}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Syncing Intelligence</p>
      </div>
    );

  return (
    <div className="space-y-16 pb-20">
      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-1">
          <Layers className="w-4 h-4" />
          Neural Breakdown
        </div>
        <h2 className="text-4xl font-black text-white tracking-tight">
          Category <span className="text-indigo-400">Intelligence</span>
        </h2>
      </motion.div>

      <CategorySection
        title="Revenue Streams"
        data={summaries.incomeCategories}
        type="income"
      />

      <CategorySection
        title="Expense Allocation"
        data={summaries.expenseCategories}
        type="expense"
      />
    </div>
  );
};

export default Categories;
