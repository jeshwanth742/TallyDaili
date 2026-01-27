import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Search, ListIcon, Calendar as CalIcon, Trash2, Plus, ShieldCheck, Clock } from 'lucide-react';
import { getCategoryIcon } from '../utils/categories';
import { db } from '../db/db';

import { InputModal } from './InputModal';

export const HistoryView = () => {
    const { transactions, plannedPayments, metrics, isLoading, budget } = useBudget();
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        step: 'amount' | 'note';
        amount: string;
        note: string;
    }>({
        isOpen: false,
        step: 'amount',
        amount: '',
        note: ''
    });

    if (isLoading || !metrics || !budget) return null;

    const handleScheduleStart = () => {
        setModalConfig({ isOpen: true, step: 'amount', amount: '', note: '' });
    };

    const handleModalSave = async (val: string) => {
        if (modalConfig.step === 'amount') {
            if (!val || isNaN(parseFloat(val))) return;
            setModalConfig(prev => ({ ...prev, step: 'note', amount: val }));
        } else {
            // Save Note & Finish
            if (!val) return;
            await db.plannedPayments.add({
                amount: parseFloat(modalConfig.amount),
                category: 'Other',
                note: val,
                date: selectedDate,
                budgetId: budget.id!,
                isExecuted: false
            });
            setModalConfig(prev => ({ ...prev, isOpen: false }));
        }
    };

    const handleExecute = async (p: any) => {
        if (confirm(`Convert "${p.note}" spending into a real expense?`)) {
            await db.transactions.add({
                amount: p.amount,
                category: p.category,
                note: `[Planned] ${p.note}`,
                date: new Date(),
                budgetId: p.budgetId
            });
            await db.plannedPayments.delete(p.id);
        }
    };

    const { currency } = metrics;

    // Calendar logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const txs = transactions || [];
    const filteredTxs = txs.filter(t =>
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.note && t.note.toLowerCase().includes(searchQuery.toLowerCase()))
    ).sort((a, b) => b.date.getTime() - a.date.getTime());

    const selectedDateTransactions = txs.filter(t => isSameDay(t.date, selectedDate));

    const handleDelete = async (id: number) => {
        if (confirm('Delete this transaction?')) {
            await db.transactions.delete(id);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background animate-in fade-in duration-500">
            {/* Header / Toggle */}
            <header className="p-6 pb-2">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text-primary">History</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleScheduleStart}
                            className="bg-primary/10 text-primary p-2 rounded-xl border border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-2"
                            title="Schedule/Reserve Money"
                        >
                            <Plus size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest pr-1 whitespace-nowrap">Reminder</span>
                        </button>
                        <div className="bg-surface p-1 rounded-xl flex border border-neutral-800">
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-white'}`}
                            >
                                <CalIcon size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-white'}`}
                            >
                                <ListIcon size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface border border-neutral-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
                {viewMode === 'calendar' ? (
                    <>
                        {/* Month Selector */}
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">{format(currentMonth, 'MMMM yyyy')}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-surface rounded-lg text-text-secondary"><ChevronLeft size={20} /></button>
                                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-surface rounded-lg text-text-secondary"><ChevronRight size={20} /></button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 mb-8">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                <div key={i} className="text-[10px] font-bold text-neutral-500 text-center py-2 uppercase">{d}</div>
                            ))}
                            {daysInMonth.map(day => {
                                const dayTxs = txs.filter(t => isSameDay(t.date, day));
                                const dayPps = (plannedPayments || []).filter(p => isSameDay(p.date, day) && !p.isExecuted);
                                const isSelected = isSameDay(day, selectedDate);
                                const isTodayDay = isToday(day);

                                return (
                                    <button
                                        key={day.toISOString()}
                                        onClick={() => setSelectedDate(day)}
                                        className={`aspect-square flex flex-col items-center justify-center rounded-xl transition-all relative border ${isSelected ? 'bg-primary/20 border-primary text-primary' : 'bg-surface/30 border-transparent hover:border-neutral-800 text-text-secondary'} ${isTodayDay && !isSelected ? 'text-primary font-bold' : ''}`}
                                    >
                                        <span className="text-[10px] font-mono">{format(day, 'd')}</span>
                                        <div className="flex gap-0.5 mt-1">
                                            {dayTxs.length > 0 && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-primary' : 'bg-primary/50'}`} />}
                                            {dayPps.length > 0 && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-primary' : 'bg-primary/50'} animate-pulse`} />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Daily Breakdown */}
                        <div className="animate-in slide-in-from-bottom duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">{format(selectedDate, 'eeee, dd MMM')}</h4>
                                <span className="text-[10px] text-text-secondary font-mono">
                                    {(selectedDateTransactions.length + (plannedPayments || []).filter(p => isSameDay(p.date, selectedDate) && !p.isExecuted).length)} items
                                </span>
                            </div>
                            <div className="space-y-3">
                                {/* Planned Payments First */}
                                {plannedPayments?.filter(p => isSameDay(p.date, selectedDate) && !p.isExecuted).map(p => {
                                    const CatIcon = getCategoryIcon(p.category);
                                    return (
                                        <div key={`pps-${p.id}`} className="flex items-center justify-between bg-primary/5 border border-primary/20 p-3 rounded-2xl group hover:bg-primary/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-primary/20 rounded-xl text-primary border border-primary/30 relative">
                                                    <CatIcon size={16} />
                                                    <Clock size={8} className="absolute -bottom-0.5 -right-0.5 animate-pulse text-white bg-primary rounded-full" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[7px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full uppercase font-black tracking-tighter">Reminder</span>
                                                    </div>
                                                    <p className="text-[10px] text-primary/60 font-bold leading-tight mt-0.5">{p.note}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-mono font-bold text-primary">
                                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(p.amount)}
                                                </span>
                                                <button
                                                    onClick={() => handleExecute(p)}
                                                    className="p-1.5 bg-primary text-black rounded-lg hover:scale-105 transition-all shadow-lg shadow-primary/20"
                                                    title="Convert to Real Expense"
                                                >
                                                    <ShieldCheck size={14} />
                                                </button>
                                                <button
                                                    onClick={async () => p.id && await db.plannedPayments.delete(p.id)}
                                                    className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Real Transactions */}
                                {selectedDateTransactions.map(t => {
                                    const Icon = getCategoryIcon(t.category);
                                    return (
                                        <div key={t.id} className="flex items-center justify-between bg-surface/50 border border-neutral-800 p-3 rounded-2xl group hover:bg-surface transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-background rounded-xl text-primary border border-white/5">
                                                    <Icon size={16} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-text-primary leading-tight">{t.category}</p>
                                                    {t.note && <p className="text-[10px] text-text-secondary leading-tight mt-0.5">{t.note}</p>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-mono font-bold text-text-primary">
                                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(t.amount)}
                                                </span>
                                                <button
                                                    onClick={() => t.id && handleDelete(t.id)}
                                                    className="p-1.5 opacity-0 group-hover:opacity-100 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {selectedDateTransactions.length === 0 && (
                                    <p className="text-center py-6 text-[10px] text-text-secondary italic border border-dashed border-neutral-800 rounded-2xl uppercase tracking-widest">No transactions on this day</p>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    /* Entire List Mode */
                    <div className="space-y-3">
                        {filteredTxs.map(t => {
                            const Icon = getCategoryIcon(t.category);
                            return (
                                <div key={t.id} className="flex items-center justify-between bg-surface/50 border border-neutral-800 p-4 rounded-2xl group hover:bg-surface transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-background rounded-xl text-primary border border-white/5">
                                            <Icon size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-text-primary">{t.category}</p>
                                            <p className="text-[10px] text-text-secondary mt-0.5 font-medium">{format(t.date, 'dd MMM yyyy')} {t.note ? `• ${t.note}` : ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-mono font-bold text-text-primary">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(t.amount)}
                                        </span>
                                        <button
                                            onClick={() => t.id && handleDelete(t.id)}
                                            className="p-2 opacity-0 group-hover:opacity-100 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredTxs.length === 0 && (
                            <div className="text-center py-20 text-text-secondary">
                                <Search className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                <p className="text-sm font-bold uppercase tracking-widest">No results found</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <InputModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                onSave={handleModalSave}
                title={modalConfig.step === 'amount' ? 'Amount to Plan' : 'What is this for?'}
                placeholder={modalConfig.step === 'amount' ? '0.00' : 'e.g. Rent, Gift, Trip...'}
                initialValue=""
                type={modalConfig.step === 'amount' ? 'number' : 'text'}
                shouldCloseOnSave={modalConfig.step !== 'amount'}
            />
        </div >
    );
};
