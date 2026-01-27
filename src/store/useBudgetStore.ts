import { create } from 'zustand';

interface BudgetState {
    isExpenseModalOpen: boolean;
    activeTab: 'dashboard' | 'history' | 'analytics';
    isBudgetDetailsOpen: boolean;
    openExpenseModal: () => void;
    closeExpenseModal: () => void;
    openBudgetDetails: () => void;
    closeBudgetDetails: () => void;
    setActiveTab: (tab: 'dashboard' | 'history' | 'analytics') => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
    isExpenseModalOpen: false,
    activeTab: 'dashboard',
    isBudgetDetailsOpen: false,
    openExpenseModal: () => set({ isExpenseModalOpen: true }),
    closeExpenseModal: () => set({ isExpenseModalOpen: false }),
    openBudgetDetails: () => set({ isBudgetDetailsOpen: true }),
    closeBudgetDetails: () => set({ isBudgetDetailsOpen: false }),
    setActiveTab: (tab) => set({ activeTab: tab }),
}));
