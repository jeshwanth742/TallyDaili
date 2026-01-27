import type { ReactNode } from 'react';
import { useBudgetStore } from '../store/useBudgetStore';
import { LayoutDashboard, Calendar, BarChart2 } from 'lucide-react';
import { AddExpenseModal } from './AddExpenseModal';
import { BudgetDetails } from './BudgetDetails';
import { ErrorBoundary } from './ErrorBoundary';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const { activeTab, setActiveTab } = useBudgetStore();

    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col relative">
            <main className="flex-1 overflow-y-auto pb-24">
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-lg border-t border-neutral-800 pb-safe z-40">
                <div className="flex justify-around items-center px-8 py-4 max-w-md mx-auto">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-primary scale-110' : 'text-neutral-500 hover:text-text-secondary opacity-60'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Dash</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-primary scale-110' : 'text-neutral-500 hover:text-text-secondary opacity-60'}`}
                    >
                        <Calendar size={20} />
                        <span className="text-[8px] font-black uppercase tracking-widest">History</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'analytics' ? 'text-primary scale-110' : 'text-neutral-500 hover:text-text-secondary opacity-60'}`}
                    >
                        <BarChart2 size={20} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Stats</span>
                    </button>
                </div>
            </nav>

            <AddExpenseModal />
            <ErrorBoundary>
                <BudgetDetails />
            </ErrorBoundary>
        </div>
    );
};
