import { useBudget } from '../hooks/useBudget';
import { useBudgetStore } from '../store/useBudgetStore';
import { Plus, Settings, TrendingUp, TrendingDown, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { getCategoryIcon } from '../utils/categories';

export const Dashboard = () => {
    const { metrics, isLoading, transactions } = useBudget();
    const { openExpenseModal, openBudgetDetails } = useBudgetStore();

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background text-primary font-mono animate-pulse">
                Loading...
            </div>
        );
    }
    if (!metrics) return null;

    const { dailyRemaining, totalSpent, totalBudget, currency, isExpired, totalCycleDays, daysPassed, velocity, fixedBuffer, rolloverReward } = metrics;

    const spentPercentage = Math.min((totalSpent / totalBudget) * 100, 100);
    const formattedDaily = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(dailyRemaining);

    const recentTransactions = (transactions || []).slice().sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

    return (
        <div className="min-h-screen bg-background p-6 flex flex-col items-center relative overflow-hidden selection:bg-primary selection:text-black">
            {/* Subtle Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 hover:bg-primary/30 blur-[100px] rounded-full transition-colors duration-1000 -z-10" />

            <header className="w-full max-w-md flex justify-between items-center z-20 mb-8 pt-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/5 border border-white/5 bg-surface/50">
                        <img src="/logo.png" alt="TallyDaili" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        <span className="text-primary font-black text-xl logo-fallback">$</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-white text-lg font-black tracking-tight leading-none">Tally<span className="text-primary italic">Daili</span></h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[9px] text-text-secondary font-bold uppercase tracking-widest opacity-60">Cycle Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {fixedBuffer > 0 && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group relative">
                            <Shield size={14} />
                            <div className="absolute top-10 right-0 bg-surface border border-neutral-800 p-2 rounded-lg text-[8px] font-black uppercase tracking-widest hidden group-hover:block whitespace-nowrap z-50">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(fixedBuffer)} Planned Spending
                            </div>
                        </div>
                    )}
                    <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full flex flex-col items-center">
                        <span className="text-primary text-[8px] uppercase font-black tracking-tighter">Budget</span>
                        <span className="text-primary font-mono font-black text-xs">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(totalBudget)}
                        </span>
                    </div>

                    <button
                        onClick={openBudgetDetails}
                        className="p-3 hover:bg-surface rounded-full transition-colors text-text-secondary hover:text-white"
                    >
                        <Settings className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <main className="text-center flex flex-col items-center z-10 w-full max-w-md mb-8">
                <h1 className="text-text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-4">Daily Remaining</h1>
                <div className="flex items-center gap-4">
                    <div className={`text-5xl sm:text-7xl font-bold font-mono tracking-tighter transition-colors duration-500 ${dailyRemaining < 0 ? 'text-danger' : 'text-primary'}`}>
                        {formattedDaily}
                    </div>
                    {velocity !== 'normal' && (
                        <div className={`p-2 rounded-xl border ${velocity === 'high' ? 'bg-danger/10 border-danger/20 text-danger' : 'bg-primary/10 border-primary/20 text-primary'} animate-bounce`}>
                            {velocity === 'high' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                        </div>
                    )}
                </div>

                {rolloverReward > 0 && !isExpired && (
                    <div className="mt-4 flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">Rollover:</span>
                        <span className="text-[9px] font-black text-primary font-mono">
                            +{new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(rolloverReward)}
                        </span>
                    </div>
                )}

                {isExpired && (
                    <span className="text-danger text-xs mt-4 font-bold tracking-widest uppercase border border-danger/50 px-3 py-1 rounded-full">
                        Cycle Ended
                    </span>
                )}
            </main>

            {/* Health Summary Card */}
            <div className="w-full max-w-md bg-surface/30 backdrop-blur-xl border border-neutral-800/50 p-6 rounded-[2.5rem] mb-10 text-left relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12" />

                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h3 className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] mb-0.5">Budget Health</h3>
                        <p className="text-white text-lg font-black">{spentPercentage.toFixed(0)}% <span className="text-[8px] text-text-secondary uppercase opacity-50 ml-1">used</span></p>
                    </div>
                    <div className="p-2 bg-neutral-900 rounded-xl border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    </div>
                </div>

                <div className="w-full bg-neutral-900 rounded-full h-1 mb-6 relative overflow-hidden">
                    <div
                        className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${spentPercentage}%` }}
                    />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-800/50">
                    <div>
                        <p className="text-[8px] text-text-secondary font-black uppercase tracking-widest mb-1 opacity-50">Avg Spent</p>
                        <p className="text-[12px] font-black text-primary font-mono tracking-tighter">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(totalSpent / (daysPassed || 1))}
                        </p>
                        <p className="text-[6px] text-text-secondary font-bold uppercase tracking-tighter opacity-40">daily</p>
                    </div>
                    <div>
                        <p className="text-[8px] text-text-secondary font-black uppercase tracking-widest mb-1 opacity-50">Today</p>
                        <p className="text-[12px] font-black text-primary font-mono tracking-tighter">
                            {formattedDaily}
                        </p>
                        <p className="text-[6px] text-text-secondary font-bold uppercase tracking-tighter opacity-40">liquid</p>
                    </div>
                    <div>
                        <p className="text-[8px] text-text-secondary font-black uppercase tracking-widest mb-1 opacity-50">Remaining</p>
                        <p className="text-[12px] font-black text-white font-mono tracking-tighter">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(totalBudget - totalSpent)}
                        </p>
                        <p className="text-[6px] text-text-secondary font-bold uppercase tracking-tighter opacity-40">balance</p>
                    </div>
                    <div>
                        <p className="text-[8px] text-text-secondary font-black uppercase tracking-widest mb-1 opacity-50">Limit</p>
                        <p className="text-[12px] font-black text-white font-mono tracking-tighter opacity-70">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(totalBudget / totalCycleDays)}
                        </p>
                        <p className="text-[6px] text-text-secondary font-bold uppercase tracking-tighter opacity-40">target</p>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="w-full max-w-md z-10 flex-1 overflow-auto pb-24 no-scrollbar">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-text-secondary text-[9px] font-black tracking-[0.2em] uppercase">Recent Activity</h3>
                    <div className="w-8 h-px bg-neutral-800 flex-1 ml-4 opacity-50" />
                </div>
                <div className="flex flex-col gap-3">
                    {recentTransactions.map(t => {
                        const Icon = getCategoryIcon(t.category);
                        return (
                            <div key={t.id} className="bg-surface/50 backdrop-blur-md border border-neutral-800 p-4 rounded-2xl flex items-center justify-between hover:bg-surface transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-black/40 rounded-xl text-primary border border-white/5 group-hover:bg-primary group-hover:text-black transition-colors">
                                        <Icon size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-text-primary font-black text-xs uppercase tracking-wider">{t.category}</p>
                                        <p className="text-text-secondary text-[9px] font-bold opacity-60">{format(t.date, 'MMM d')} {t.note ? `• ${t.note}` : ''}</p>
                                    </div>
                                </div>
                                <span className="text-text-primary font-mono font-black text-sm">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(t.amount)}
                                </span>
                            </div>
                        );
                    })}
                    {recentTransactions.length === 0 && (
                        <div className="text-center py-12 text-text-secondary text-xs font-bold uppercase tracking-widest border border-dashed border-neutral-800 rounded-[2rem] bg-surface/20">
                            No movements recorded
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={openExpenseModal}
                className="fixed bottom-8 right-8 bg-primary text-black p-5 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 group z-30 border border-primary/50"
                aria-label="Add Expense"
            >
                <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
        </div>
    );
};
