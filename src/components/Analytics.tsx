import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { format, subDays, isSameMonth, isSameDay, startOfDay, startOfYear, eachMonthOfInterval } from 'date-fns';
import { getCurrencySymbol } from '../utils/currency';
import { CATEGORIES, getCategoryIcon } from '../utils/categories';

export const Analytics = () => {
    const { transactions, budget, metrics } = useBudget();
    const [range, setRange] = useState<'today' | 'week' | 'month' | 'year'>('week');

    if (!transactions || !budget || !metrics) return null;

    const { currency } = metrics;

    // 1. Budget Summary Polishing
    const spentPercentage = Math.min((metrics.totalSpent / metrics.totalBudget) * 100, 100);

    // 2. Spending by Category (Pie Chart)
    const categorySpending: Record<string, number> = {};
    transactions.forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });
    const pieData = Object.entries(categorySpending).map(([name, value]) => {
        const cat = CATEGORIES.find(c => c.id === name);
        return { name, value, color: cat?.color || '#3b82f6' };
    }).filter(i => i.value > 0);

    const PIE_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#71B37C'];

    // 3. Dynamic Bar Chart Logic
    let barData: any[] = [];
    const now = new Date();

    if (range === 'today') {
        const start = startOfDay(now);
        const hours = Array.from({ length: 6 }, (_, i) => {
            const h = new Date(start.getTime() + i * 4 * 60 * 60 * 1000); // 4 hour blocks
            return h;
        });
        barData = hours.map(h => {
            const amount = transactions.filter(t =>
                t.date >= h && t.date < new Date(h.getTime() + 4 * 60 * 60 * 1000)
            ).reduce((sum, t) => sum + t.amount, 0);
            return {
                label: format(h, 'HH:mm'),
                amount
            };
        });
    } else if (range === 'week') {
        const days = Array.from({ length: 7 }, (_, i) => subDays(now, 6 - i));
        barData = days.map(d => ({
            label: format(d, 'dd/MM'),
            amount: transactions.filter(t => isSameDay(t.date, d)).reduce((sum, t) => sum + t.amount, 0)
        }));
    } else if (range === 'month') {
        const blocks = Array.from({ length: 6 }, (_, i) => subDays(now, (5 - i) * 5));
        barData = blocks.map(b => {
            const amount = transactions.filter(t =>
                t.date >= subDays(b, 4) && t.date <= b
            ).reduce((sum, t) => sum + t.amount, 0);
            return {
                label: format(b, 'dd MMM'),
                amount
            };
        });
    } else if (range === 'year') {
        const months = eachMonthOfInterval({
            start: startOfYear(now),
            end: now
        });
        barData = months.map(m => ({
            label: format(m, 'MMM'),
            amount: transactions.filter(t => isSameMonth(t.date, m)).reduce((sum, t) => sum + t.amount, 0)
        }));
    }

    return (
        <div className="p-6 pt-12 min-h-full flex flex-col pb-24 text-center bg-background animate-in fade-in duration-500">
            <h1 className="text-2xl font-black mb-8 tracking-[0.2em] uppercase text-text-secondary opacity-50">Analytics</h1>

            {/* Range Selector */}
            <div className="flex bg-surface p-1 rounded-2xl border border-neutral-800 mb-8 self-center">
                {(['today', 'week', 'month', 'year'] as const).map(r => (
                    <button
                        key={r}
                        onClick={() => setRange(r)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${range === r ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-white'}`}
                    >
                        {r}
                    </button>
                ))}
            </div>

            {/* Budget Summary Card */}
            <div className="bg-surface/30 backdrop-blur-xl border border-neutral-800/50 p-8 rounded-[2.5rem] mb-8 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-1">Budget Health</h3>
                        <p className="text-2xl font-black text-white">{spentPercentage.toFixed(0)}% <span className="text-[10px] text-text-secondary uppercase font-bold opacity-50 tracking-normal">consumed</span></p>
                    </div>
                    <div className="p-3 bg-neutral-900 rounded-2xl border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                </div>

                <div className="w-full bg-neutral-900 rounded-full h-1.5 mb-8 relative overflow-hidden">
                    <div
                        className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${spentPercentage}%` }}
                    />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-neutral-800/50">
                    <div>
                        <p className="text-[9px] text-text-secondary font-black uppercase tracking-widest mb-2 opacity-50">Avg Spent</p>
                        <p className="text-base font-black text-primary font-mono tracking-tighter">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(metrics.totalSpent / (metrics.daysPassed || 1))}
                        </p>
                        <p className="text-[7px] text-text-secondary font-bold mt-1 lowercase opacity-50">per day</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-text-secondary font-black uppercase tracking-widest mb-2 opacity-50">For Today</p>
                        <p className="text-base font-black text-primary font-mono tracking-tighter">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(metrics.dailyRemaining)}
                        </p>
                        <p className="text-[7px] text-text-secondary font-bold mt-1 lowercase opacity-50">liquid</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-text-secondary font-black uppercase tracking-widest mb-2 opacity-50">Remaining</p>
                        <p className="text-base font-black text-white font-mono tracking-tighter">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(metrics.totalBudget - metrics.totalSpent)}
                        </p>
                        <p className="text-[7px] text-text-secondary font-bold mt-1 lowercase opacity-50">balance</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-text-secondary font-black uppercase tracking-widest mb-2 opacity-50">Limit</p>
                        <p className="text-base font-black text-white font-mono tracking-tighter opacity-70">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(metrics.totalBudget / metrics.totalCycleDays)}
                        </p>
                        <p className="text-[7px] text-text-secondary font-bold mt-1 lowercase opacity-50">daily target</p>
                    </div>
                </div>
            </div>

            {/* Min/Max Cards */}
            <div className="grid grid-cols-2 gap-4 mb-10">
                {(() => {
                    const sortedTxs = [...transactions].sort((a, b) => a.amount - b.amount);
                    const minTx = sortedTxs[0];
                    const maxTx = sortedTxs[sortedTxs.length - 1];

                    if (!minTx) return null;

                    return (
                        <>
                            <div className="bg-surface/30 border border-neutral-800/50 p-6 rounded-[2.5rem] text-left relative overflow-hidden group hover:bg-surface/50 transition-all">
                                <div className="absolute top-4 right-4 text-primary/10 transition-transform group-hover:scale-110">
                                    {(() => { const Icon = getCategoryIcon(minTx.category); return <Icon size={24} />; })()}
                                </div>
                                <h4 className="text-2xl font-black text-white mb-1 font-mono tracking-tighter">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(minTx.amount)}
                                </h4>
                                <p className="text-white/40 text-[8px] font-black uppercase tracking-widest mb-4">Min Spend</p>
                                <div className="flex items-center gap-1.5 opacity-40">
                                    <div className="w-1 h-1 rounded-full bg-text-secondary" />
                                    <p className="text-[8px] font-bold text-text-secondary">{format(minTx.date, 'dd MMM')}</p>
                                </div>
                            </div>

                            <div className="bg-surface/30 border border-neutral-800/50 p-6 rounded-[2.5rem] text-left relative overflow-hidden group hover:bg-surface/50 transition-all">
                                <div className="absolute top-4 right-4 text-danger/10 transition-transform group-hover:scale-110">
                                    {(() => { const Icon = getCategoryIcon(maxTx.category); return <Icon size={24} />; })()}
                                </div>
                                <h4 className="text-2xl font-black text-white mb-1 font-mono tracking-tighter">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(maxTx.amount)}
                                </h4>
                                <p className="text-white/40 text-[8px] font-black uppercase tracking-widest mb-4">Max Spend</p>
                                <div className="flex items-center gap-1.5 opacity-40">
                                    <div className="w-1 h-1 rounded-full bg-danger" />
                                    <p className="text-[8px] font-bold text-text-secondary">{format(maxTx.date, 'dd MMM')}</p>
                                </div>
                            </div>
                        </>
                    );
                })()}
            </div>

            {/* Spending Trend Bar Chart */}
            <div className="mb-12 bg-surface/20 p-6 rounded-[2.5rem] border border-neutral-800/30">
                <h3 className="text-left text-[10px] font-black text-text-secondary mb-8 uppercase tracking-[0.2em] opacity-50 flex items-center justify-between">
                    <span>Spending Trend</span>
                    <span className="font-mono lowercase tracking-normal">{range} view</span>
                </h3>
                <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <XAxis
                                dataKey="label"
                                stroke="#555"
                                fontSize={9}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                                fontStyle="italic"
                                fontWeight="bold"
                            />
                            <Tooltip
                                cursor={{ fill: '#ffffff', opacity: 0.05, radius: 8 }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-surface/90 backdrop-blur-md border border-neutral-800 p-3 rounded-xl shadow-2xl">
                                                <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">{payload[0].payload.label}</p>
                                                <p className="text-sm font-black text-primary font-mono">
                                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(payload[0].value as number)}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="amount" radius={[6, 6, 6, 6]}>
                                {barData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={'#00E676'} fillOpacity={0.8} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="mb-6">
                <h3 className="text-left text-[10px] font-black text-text-secondary mb-8 uppercase tracking-[0.2em] opacity-50">Distribution</h3>
                <div className="h-64 w-full flex items-center justify-center -mb-8 scale-110">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                                formatter={(value: any) => [`${getCurrencySymbol(currency)}${value}`, '']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Category Pills Detail */}
                <div className="flex flex-wrap gap-2.5 justify-center mt-12">
                    {pieData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 py-3 px-5 rounded-2xl text-[10px] font-black text-text-primary group hover:border-primary/50 transition-all">
                            <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length], boxShadow: `0 0 10px ${PIE_COLORS[index % PIE_COLORS.length]}44` }} />
                            <span className="uppercase tracking-widest">{entry.name}</span>
                            <span className="text-primary font-mono">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(entry.value)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
