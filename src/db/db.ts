import Dexie, { type EntityTable } from 'dexie';

export interface Budget {
    id: number;
    totalAmount: number;
    currencySymbol: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    fixedExpenses?: number; // Safety buffer for bills/rent
}

export interface Transaction {
    id?: number;
    amount: number;
    category: string;
    note: string;
    date: Date;
    budgetId: number;
}

export interface PlannedPayment {
    id?: number;
    amount: number;
    category: string;
    note: string;
    date: Date;
    budgetId: number;
    isExecuted: boolean; // True if it has been converted to a real transaction
}

const db = new Dexie('BudgetDB') as Dexie & {
    budgets: EntityTable<Budget, 'id'>;
    transactions: EntityTable<Transaction, 'id'>;
    plannedPayments: EntityTable<PlannedPayment, 'id'>;
};

db.version(4).stores({
    budgets: '++id, isActive, startDate, endDate',
    transactions: '++id, budgetId, date, category',
    plannedPayments: '++id, budgetId, date, category'
});

export { db };
