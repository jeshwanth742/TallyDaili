import { useState } from 'react';
import { useBudgetStore } from '../store/useBudgetStore';
import { useBudget } from '../hooks/useBudget';
import { db } from '../db/db';
import { X } from 'lucide-react';
import { getCurrencySymbol } from '../utils/currency';
import { CATEGORIES } from '../utils/categories';
import { NumericKeypad } from './NumericKeypad';

export const AddExpenseModal = () => {
    const { isExpenseModalOpen, closeExpenseModal } = useBudgetStore();
    const { budget, metrics } = useBudget();
    const [amount, setAmount] = useState('0');
    const [note, setNote] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);

    if (!isExpenseModalOpen || !budget || !metrics) return null;

    const { categorySpendingToday } = metrics;

    const handleSave = async () => {
        const num = parseFloat(amount);
        if (isNaN(num) || num <= 0) return;

        await db.transactions.add({
            amount: num,
            category: selectedCategory,
            note: note,
            date: new Date(),
            budgetId: budget.id
        });

        handleClose();
    };

    const handleClose = () => {
        setAmount('0');
        setNote('');
        setSelectedCategory(CATEGORIES[0].id);
        closeExpenseModal();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={handleClose} />

            {/* Modal Glass Container */}
            <div className="relative w-full max-w-sm bg-[#121212] p-5 rounded-[2rem] border border-white/5 shadow-[0_0_100px_rgba(0,0,0,1)] zoom-in-95 duration-300">

                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-text-secondary text-[10px] uppercase tracking-[0.3em] font-black opacity-60">Add Expense</h2>
                    <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-secondary">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Main Content: Amount Display */}
                <div className="flex flex-col items-center mb-12">
                    <div className="flex items-center justify-center">
                        <span className="text-3xl text-text-secondary font-black font-mono mr-2 sm:mr-4 opacity-40">{getCurrencySymbol(budget.currencySymbol)}</span>
                        <div className="text-6xl sm:text-8xl font-black font-mono text-white tracking-tighter flex items-center">
                            {amount}
                            <div className="w-1.5 h-16 bg-primary ml-4 rounded-full animate-pulse shadow-[0_0_20px_rgba(0,230,118,0.5)]" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Categories & Notes */}
                    <div className="flex flex-col gap-6 sm:gap-10">
                        <div>
                            <label className="text-text-secondary text-[10px] uppercase tracking-[0.2em] block mb-4 sm:mb-6 font-black opacity-50">Category</label>
                            <div className="grid grid-cols-4 gap-3">
                                {CATEGORIES.map(cat => {
                                    const Icon = cat.icon;
                                    const isSelected = selectedCategory === cat.id;
                                    const spendToday = categorySpendingToday[cat.id] || 0;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl border transition-all duration-300 ${isSelected ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20 scale-105' : 'bg-neutral-900 border-white/5 text-text-secondary hover:border-white/10'}`}
                                        >
                                            <Icon size={18} className="mb-2" />
                                            <span className="text-[8px] font-black uppercase tracking-widest">{cat.label}</span>
                                            {spendToday > 0 && (
                                                <span className="text-[7px] font-black text-primary/60 mt-1">-{spendToday}</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="text-text-secondary text-[10px] uppercase tracking-[0.2em] block mb-4 font-black opacity-50">Note</label>
                            <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="What was this for?"
                                className="w-full bg-neutral-900/50 border border-white/5 rounded-[1.5rem] p-5 text-white focus:border-primary/50 focus:outline-none transition-all text-sm placeholder:text-neutral-700 font-bold"
                            />
                        </div>
                    </div>

                    {/* Right: Keypad */}
                    <div className="flex items-center justify-center p-2 bg-neutral-900/20 rounded-[2rem] border border-white/5">
                        <NumericKeypad value={amount} onChange={setAmount} onDone={handleSave} />
                    </div>
                </div>
            </div>
        </div>
    );
};
