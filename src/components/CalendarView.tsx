import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { getCategoryIcon } from '../utils/categories';

export const CalendarView = () => {
    const { transactions, metrics } = useBudget();
    const [selectedDate, setSelectedDate] = useState(new Date());

    if (!transactions || !metrics) return null;

    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Calculate daily spending totals
    const dailyTotals: Record<string, number> = {};
    transactions.forEach(t => {
        const dateKey = format(t.date, 'yyyy-MM-dd');
        dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + t.amount;
    });

    // Get transactions for selected date
    const selectedDateTransactions = transactions.filter(t => isSameDay(t.date, selectedDate));
    const selectedDateTotal = dailyTotals[format(selectedDate, 'yyyy-MM-dd')] || 0;

    // Approximation for visual guide
    const averageDaily = metrics.totalBudget / 30;

    return (
        <div className="p-6 pt-12 text-center pb-24">
            <h1 className="text-2xl font-bold mb-8 tracking-[0.2em] uppercase text-text-secondary">{format(today, 'MMMM yyyy')}</h1>

            <div className="grid grid-cols-7 gap-2 max-w-md mx-auto mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="text-xs text-text-secondary font-bold py-2">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 max-w-md mx-auto mb-8">
                {daysInMonth.map(day => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const spent = dailyTotals[dateKey] || 0;
                    const isSelected = isSameDay(day, selectedDate);

                    let statusColor = 'bg-surface border-neutral-800 hover:border-neutral-700';
                    if (spent > 0) {
                        statusColor = spent <= averageDaily ? 'bg-primary/10 border-primary text-primary' : 'bg-red-500/10 border-red-500 text-red-500';
                    }

                    if (isSelected) {
                        statusColor = 'bg-primary border-primary text-black scale-105 shadow-lg shadow-primary/20 z-10';
                    } else if (isSameDay(day, today)) {
                        statusColor = 'bg-surface border-primary text-primary';
                    }

                    return (
                        <button
                            key={dateKey}
                            onClick={() => setSelectedDate(day)}
                            className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative transition-all duration-200 ${statusColor}`}
                        >
                            <span className={`text-xs font-bold ${!isSameMonth(day, today) && !isSelected ? 'opacity-20' : ''}`}>
                                {format(day, 'd')}
                            </span>
                            {spent > 0 && !isSelected && (
                                <div className={`w-1 h-1 rounded-full mt-1 ${spent <= averageDaily ? 'bg-primary' : 'bg-red-500'}`} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Daily Breakdown List */}
            <div className="text-left max-w-md mx-auto">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="text-xs uppercase tracking-widest text-text-secondary font-bold">
                        {isSameDay(selectedDate, today) ? 'Today' : format(selectedDate, 'MMM d, yyyy')}
                    </h3>
                    <span className="text-sm font-bold text-text-primary">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: metrics.currency }).format(selectedDateTotal)}
                    </span>
                </div>

                <div className="flex flex-col gap-2">
                    {selectedDateTransactions.map(t => {
                        const Icon = getCategoryIcon(t.category);
                        return (
                            <div key={t.id} className="bg-surface/50 backdrop-blur-md border border-neutral-800 p-3 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-black/40 rounded-lg text-primary border border-white/5">
                                        <Icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-text-primary font-bold text-xs">{t.category}</p>
                                        <p className="text-text-secondary text-[10px]">{t.note || 'No note'}</p>
                                    </div>
                                </div>
                                <span className="text-text-primary font-mono font-bold text-xs">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: metrics.currency }).format(t.amount)}
                                </span>
                            </div>
                        );
                    })}
                    {selectedDateTransactions.length === 0 && (
                        <div className="text-center py-8 text-text-secondary text-xs italic border border-dashed border-neutral-800 rounded-xl">
                            No spending on this day
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
