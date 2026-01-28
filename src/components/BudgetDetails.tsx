import { useBudget } from '../hooks/useBudget';
import { useBudgetStore } from '../store/useBudgetStore';
import { db } from '../db/db';
import { format, addDays } from 'date-fns';
import { X, Download, Trash2, Edit2, Globe, ArrowRight, Shield, Calendar } from 'lucide-react';
import { exportTransactionsToCSV } from '../utils/export';
import { InputModal } from './InputModal';
import { useState } from 'react';

export const BudgetDetails = () => {
    const { isBudgetDetailsOpen, closeBudgetDetails } = useBudgetStore();
    const { budget, metrics, transactions } = useBudget();

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        initialValue: string;
        onSave: (val: string) => void;
        type?: 'text' | 'number';
    }>({
        isOpen: false,
        title: '',
        initialValue: '',
        onSave: () => { },
    });

    const safeFormat = (date: Date | string | number | null | undefined, fmt: string) => {
        try {
            if (!date) return 'N/A';
            const d = new Date(date);
            if (isNaN(d.getTime())) return 'Invalid Date';
            return format(d, fmt);
        } catch (e) {
            console.error('Date formatting error:', e);
            return 'Error';
        }
    };

    console.log('BudgetDetails Render:', { isBudgetDetailsOpen, budget, metrics });

    if (!isBudgetDetailsOpen || !budget || !metrics) return null;

    const { totalSpent, totalBudget, daysRemaining, totalCycleDays, daysPassed, currency } = metrics;
    const spentPercentage = Math.min((totalSpent / totalBudget) * 100, 100);
    const timePercentage = Math.min((daysPassed / totalCycleDays) * 100, 100);

    const openModal = (title: string, initialValue: string, onSave: (val: string) => void, type: 'text' | 'number' = 'number') => {
        setModalConfig({ isOpen: true, title, initialValue, onSave, type });
    };

    const handleFinishEarly = async () => {
        if (confirm('Finish this budget cycle early? This will end the current period.')) {
            await db.budgets.update(budget.id!, { isActive: false });
            window.location.reload();
        }
    };

    const handleEditBudget = () => {
        openModal('Total Budget', totalBudget.toString(), async (val) => {
            const num = parseFloat(val);
            if (!isNaN(num)) await db.budgets.update(budget.id!, { totalAmount: num });
        });
    };

    const handleEditFixed = () => {
        const currentFixed = budget.fixedExpenses || 0;
        openModal('Usage Limit Reminder', currentFixed.toString(), async (val) => {
            const num = parseFloat(val);
            if (!isNaN(num)) await db.budgets.update(budget.id!, { fixedExpenses: num });
        });
    };

    const handleEditPeriod = () => {
        openModal('Budget Days', totalCycleDays.toString(), async (val) => {
            const days = parseInt(val);
            if (days && !isNaN(days)) {
                // Determine new end date: startDate + (days - 1)
                // e.g. Start Jan 1, 1 Day duration -> End Jan 1. (1-1=0 adds)
                const newEndDate = addDays(new Date(budget.startDate), days - 1);
                await db.budgets.update(budget.id!, { endDate: newEndDate });
            }
        });
    };

    const handleEditCurrency = () => {
        openModal('Currency Code', currency, async (val) => {
            if (val && val.length >= 1) {
                await db.budgets.update(budget.id!, { currencySymbol: val });
                window.location.reload();
            }
        }, 'text');
    };

    // Circular Progress Math for Days Remaining
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    // We want to show a partial ring. If 100% of time is left, ring is full.
    const remainingPercentage = (daysRemaining / totalCycleDays);
    const strokeDashoffset = circumference - (remainingPercentage * circumference);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={closeBudgetDetails} />

            {/* Content */}
            <div className="relative w-full max-w-sm bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">
                        <button onClick={closeBudgetDetails} className="p-3 hover:bg-white/5 rounded-full transition-colors text-text-secondary">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5">
                                <span className="text-[10px] font-black text-primary">$</span>
                            </div>
                            <h2 className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Tally<span className="text-primary italic">Daili</span></h2>
                        </div>
                        <button onClick={handleEditBudget} className="p-3 hover:bg-white/5 rounded-full transition-colors text-text-secondary">
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* High-Fidelity Spent Card */}
                    <div className="bg-[#B0003A] p-10 rounded-[2.5rem] mb-6 relative overflow-hidden group shadow-[0_20px_40px_rgba(176,0,58,0.3)]">
                        {/* TD Watermark */}
                        <div className="absolute top-6 right-8 text-white/10 select-none text-4xl font-black italic tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">TD</div>

                        <h3 className="text-white text-5xl font-black font-mono text-center mb-3 tracking-tighter drop-shadow-md">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(totalSpent)}
                        </h3>
                        <p className="text-center text-white/60 text-[9px] font-black uppercase tracking-[0.4em] mb-8">Total Spent</p>

                        <div className="px-2">
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-3">
                                <div className="h-full bg-white shadow-[0_0_10px_white] transition-all duration-1500 ease-out" style={{ width: `${spentPercentage}%` }} />
                            </div>
                            <p className="text-white font-black text-[9px] text-center uppercase tracking-widest opacity-80">{spentPercentage.toFixed(1)}% Used</p>
                        </div>
                    </div>

                    {/* Stats Layout (Cap & Days) */}
                    <div className="flex gap-4 mb-8 h-32">
                        {/* Cap Card */}
                        <div className="flex-1 bg-surface/40 border border-white/5 p-6 rounded-[2.2rem] flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <span className="text-xl font-black text-white font-mono tracking-tighter">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(totalBudget)}
                                </span>
                                <span className="text-[9px] text-text-secondary font-black uppercase tracking-widest opacity-50">Cap</span>
                            </div>

                            <div>
                                <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-primary/40 rounded-full" style={{ width: `${timePercentage}%` }} />
                                </div>
                                <div className="flex justify-between text-[7px] text-text-secondary font-black uppercase tracking-widest opacity-40">
                                    <span>{safeFormat(budget.startDate, 'dd MMM')}</span>
                                    <span>{safeFormat(budget.endDate, 'dd MMM')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Days Guard */}
                        <div className="w-32 bg-surface/40 border border-white/5 rounded-[2.2rem] flex flex-col items-center justify-center relative">
                            <svg className="w-20 h-20 -rotate-90">
                                <circle cx="40" cy="40" r={radius} fill="transparent" stroke="#1A1A1A" strokeWidth="4" />
                                <circle
                                    cx="40"
                                    cy="40"
                                    r={radius}
                                    fill="transparent"
                                    stroke="#00E676"
                                    strokeWidth="4"
                                    strokeDasharray={circumference}
                                    style={{ strokeDashoffset }}
                                    strokeLinecap="round"
                                    className="transition-all duration-1500 shadow-[0_0_10px_#00E676]"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center mb-1">
                                <span className="text-2xl font-black text-white font-mono">{daysRemaining}</span>
                                <span className="text-[7px] text-text-secondary font-black uppercase tracking-widest opacity-50 -mt-1">Left</span>
                            </div>
                            <span className="text-[8px] text-text-secondary font-black uppercase tracking-widest opacity-30 mt-1 absolute bottom-4">Days</span>
                        </div>
                    </div>

                    {/* Actions List */}
                    <div className="grid grid-cols-1 gap-2">
                        {[
                            {
                                icon: Shield, label: 'Usage Limit Reminder', action: handleEditFixed,
                                val: new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(budget.fixedExpenses || 0),
                                color: 'text-primary'
                            },
                            {
                                icon: Globe, label: 'Currency', action: handleEditCurrency, val: currency, color: undefined
                            },
                            {
                                icon: Calendar, label: 'Budget Period', action: handleEditPeriod,
                                val: `${totalCycleDays} Days`,
                                color: 'text-primary'
                            },
                            { icon: Download, label: 'Export Data', action: () => exportTransactionsToCSV(transactions, currency), color: undefined, val: undefined },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={i}
                                    onClick={item.action}
                                    className="w-full flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 bg-neutral-900 rounded-xl border border-white/5 group-hover:scale-110 transition-transform ${item.color || 'text-text-secondary'}`}>
                                            <Icon size={16} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary group-hover:text-white transition-colors">{item.label}</span>
                                    </div>
                                    {item.val ? (
                                        <span className="text-[9px] font-black text-primary font-mono bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg uppercase">{item.val}</span>
                                    ) : (
                                        <ArrowRight size={14} className="text-neutral-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    )}
                                </button>
                            );
                        })}

                        <button
                            onClick={handleFinishEarly}
                            className="w-full flex items-center justify-between p-4 hover:bg-danger/10 border border-transparent hover:border-danger/20 rounded-2xl transition-all group mt-2"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-neutral-900 rounded-xl border border-white/5 group-hover:bg-danger/20 text-danger/60 group-hover:text-danger transition-all">
                                    <Trash2 size={16} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-danger/60 group-hover:text-danger transition-colors">Finish Cycle</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>


            <InputModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                onSave={modalConfig.onSave}
                title={modalConfig.title}
                initialValue={modalConfig.initialValue}
                type={modalConfig.type}
            />
        </div >
    );
};
