import { Trash2 } from 'lucide-react';
import { db } from '../db/db';
import { useBudget } from '../hooks/useBudget';
import { format } from 'date-fns';
import { getCategoryIcon } from '../utils/categories';

export const TransactionsView = () => {
    const { transactions, metrics } = useBudget();

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            await db.transactions.delete(id);
        }
    };

    if (!transactions) return null;

    // Sort by date descending
    const sortedTransactions = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="p-6 pt-12">
            <h1 className="text-2xl font-bold mb-8 tracking-[0.2em] uppercase text-text-secondary text-center">Transactions</h1>

            <div className="flex flex-col gap-3 max-w-md mx-auto">
                {sortedTransactions.map(t => {
                    const Icon = getCategoryIcon(t.category);
                    const currency = metrics?.currency || 'USD';

                    return (
                        <div key={t.id} className="bg-surface/50 backdrop-blur-md border border-neutral-800 p-4 rounded-2xl flex items-center justify-between hover:bg-surface transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-black/40 rounded-xl text-primary border border-white/5">
                                    <Icon size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-text-primary font-bold text-sm">
                                        {t.category === 'Others' && t.note ? t.note : t.category}
                                    </p>
                                    <p className="text-text-secondary text-xs">{format(t.date, 'MMM d, yyyy')} {t.category !== 'Others' && t.note ? `• ${t.note}` : ''}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-text-primary font-mono font-bold">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(t.amount)}
                                </span>
                                <button
                                    onClick={() => handleDelete(t.id!)}
                                    className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {sortedTransactions.length === 0 && (
                    <div className="text-center py-12 text-text-secondary">
                        <p>No transactions yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
