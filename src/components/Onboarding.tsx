import { useState } from 'react';
import { db } from '../db/db';
import { addDays } from 'date-fns';
import { ArrowRight } from 'lucide-react';

export const Onboarding = () => {
    const [amount, setAmount] = useState('');
    const [currencyCode, setCurrencyCode] = useState('USD');
    const [duration, setDuration] = useState(30);

    const CURRENCIES = [
        { symbol: '$', code: 'USD' },
        { symbol: '€', code: 'EUR' },
        { symbol: '£', code: 'GBP' },
        { symbol: '₹', code: 'INR' },
        { symbol: '¥', code: 'JPY' },
    ];

    const handleStart = async () => {
        if (!amount) return;
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;

        try {
            await db.budgets.add({
                totalAmount: numAmount,
                currencySymbol: currencyCode,
                startDate: new Date(),
                endDate: addDays(new Date(), duration),
                isActive: true
            });
        } catch (error) {
            console.error("Failed to create budget:", error);
            alert("Failed to save budget. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-text-primary selection:bg-primary selection:text-black">
            <div className="flex flex-col items-center mb-12">
                <div className="w-20 h-20 rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/20 border-2 border-primary/20 p-2 bg-surface/50 mb-6">
                    <img src="/logo.png" alt="TallyDaili" className="w-full h-full object-cover rounded-2xl" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white">Tally<span className="text-primary italic">Daili</span></h1>
                <p className="text-text-secondary text-[10px] uppercase tracking-[0.3em] mt-2 font-bold opacity-50">Precision Budgeting</p>
            </div>

            <div className="flex flex-col gap-8 w-full max-w-xs z-10">
                <div>
                    <label className="text-text-secondary text-xs uppercase tracking-widest block mb-4">Select Currency</label>
                    <div className="flex gap-3 flex-wrap">
                        {CURRENCIES.map(c => (
                            <button
                                key={c.code}
                                onClick={() => setCurrencyCode(c.code)}
                                className={`w-12 h-12 rounded-full border flex items-center justify-center text-lg font-bold transition-all duration-300 ${currencyCode === c.code ? 'bg-primary text-black border-primary scale-110 shadow-lg shadow-primary/20' : 'bg-surface text-text-secondary border-neutral-800 hover:border-neutral-600'}`}
                            >
                                {c.symbol}
                            </button>
                        ))}
                    </div>
                </div>


                <div>
                    <label className="text-text-secondary text-xs uppercase tracking-widest block mb-4">Budget Cycle</label>
                    <div className="flex gap-3">
                        {[7, 14, 30].map(d => (
                            <button
                                key={d}
                                onClick={() => setDuration(d)}
                                className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all ${duration === d ? 'bg-primary text-black border-primary' : 'bg-surface text-text-secondary border-neutral-800'}`}
                            >
                                {d} Days
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-text-secondary text-xs uppercase tracking-widest block mb-4">Monthly Total</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-mono text-xl">
                            {CURRENCIES.find(c => c.code === currencyCode)?.symbol}
                        </span>
                        <input
                            type="number"
                            inputMode="numeric"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-surface border border-neutral-800 rounded-2xl py-6 pl-12 pr-6 text-3xl font-mono focus:border-primary focus:outline-none transition-colors placeholder:text-neutral-700"
                            placeholder="0"
                        />
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    disabled={!amount}
                    className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold p-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all mt-4 text-lg shadow-xl shadow-primary/10"
                >
                    Start Tracking <ArrowRight size={24} />
                </button>
            </div>

            {/* Decor */}
            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>
    );
};
