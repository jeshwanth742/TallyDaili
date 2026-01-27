import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/db";
import { differenceInCalendarDays } from "date-fns";

const CURRENCY_MAP: Record<string, string> = {
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP',
    '₹': 'INR',
    '¥': 'JPY',
};

export function useBudget() {
    const activeBudget = useLiveQuery(() =>
        db.budgets.filter(b => b.isActive).last() // Get the latest active budget
        , [], null);

    const transactions = useLiveQuery(() =>
        (activeBudget && activeBudget.id) ? db.transactions.where('budgetId').equals(activeBudget.id).toArray() : []
        , [activeBudget?.id], []);

    const plannedPayments = useLiveQuery(() =>
        (activeBudget && activeBudget.id) ? db.plannedPayments.where('budgetId').equals(activeBudget.id).toArray() : []
        , [activeBudget?.id], []);

    if (activeBudget === null) {
        return { isLoading: true, budget: null, transactions: [], plannedPayments: [], metrics: null };
    }

    if (!activeBudget) {
        return { isLoading: false, budget: null, transactions: [], plannedPayments: [], metrics: null };
    }

    // Defensive Data Parser
    const safeDate = (d: any) => {
        if (d instanceof Date && !isNaN(d.getTime())) return d;
        if (typeof d === 'string' || typeof d === 'number') {
            const parsed = new Date(d);
            return isNaN(parsed.getTime()) ? new Date() : parsed;
        }
        return new Date();
    };

    // If transactions are still loading (useLiveQuery output is undefined initially)
    const txs = (transactions || []).map(t => ({ ...t, date: safeDate(t.date) }));
    const pps = (plannedPayments || []).map(p => ({ ...p, date: safeDate(p.date) }));

    const totalSpent = txs.reduce((acc, t) => acc + t.amount, 0);

    // Total Planned amount (Reserved Funds)
    const plannedTotal = pps.filter(p => !p.isExecuted).reduce((acc, p) => acc + p.amount, 0);

    // We treat either the manual fixedExpenses OR the sum of planned items as the buffer.
    // For now, let's combine them or prioritize the new planned system.
    const fixedBuffer = Math.max(activeBudget.fixedExpenses || 0, plannedTotal);
    const remainingBudget = activeBudget.totalAmount - totalSpent;

    // Spendable amount is remaining budget minus the fixed buffer (if not yet spent)
    // We treat fixed buffer as "reserved" money.
    const spendableBudget = Math.max(0, remainingBudget - fixedBuffer);

    const today = new Date();

    const startDate = safeDate(activeBudget.startDate);
    const endDate = safeDate(activeBudget.endDate);

    // Sanitize Currency Defensive
    const rawSymbol = activeBudget.currencySymbol || '$'; // Default to $ if missing
    const currencyCode = (rawSymbol.length === 3) ? rawSymbol : (CURRENCY_MAP[rawSymbol] || 'USD');

    // Calculate days remaining (inclusive of today)
    let daysRemaining = differenceInCalendarDays(endDate, today) + 1;

    // Total cycle duration
    const totalCycleDays = differenceInCalendarDays(endDate, startDate) + 1;
    const daysPassed = totalCycleDays - daysRemaining;

    // Handle edge cases
    const isExpired = daysRemaining <= 0;
    if (daysRemaining < 1) daysRemaining = 1;

    // Daily Remaining is now based on Spendable Budget
    const dailyRemaining = spendableBudget / daysRemaining;

    // Velocity Logic: 7-day average vs Today
    const last7Days = txs.filter(t => {
        const diff = differenceInCalendarDays(today, t.date);
        return diff >= 1 && diff <= 7;
    });
    const avg7Days = last7Days.length > 0 ? last7Days.reduce((acc, t) => acc + t.amount, 0) / 7 : dailyRemaining;

    const spentToday = txs.filter(t => differenceInCalendarDays(today, t.date) === 0)
        .reduce((acc, t) => acc + t.amount, 0);

    // Velocity: Positive means spending more than average, Negative means less.
    const velocity = spentToday > avg7Days ? 'high' : (spentToday < avg7Days * 0.8 ? 'low' : 'normal');

    // Rollover Reward: How much did we save yesterday vs yesterday's daily limit?
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const spentYesterday = txs.filter(t => differenceInCalendarDays(yesterday, t.date) === 0)
        .reduce((acc, t) => acc + t.amount, 0);

    // To calculate yesterday's limit accurately, we'd need history. 
    // We'll estimate it by comparing it to the dailyRemaining.
    const rolloverReward = Math.max(0, dailyRemaining - spentYesterday);

    // Category Spending Today (for Entry Modal feedback)
    const categorySpendingToday = txs.filter(t => differenceInCalendarDays(today, t.date) === 0)
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

    // Sanitize Currency (Already done above)

    return {
        isLoading: false,
        budget: activeBudget,
        transactions: txs,
        plannedPayments: pps,
        metrics: {
            totalBudget: activeBudget.totalAmount,
            totalSpent,
            remainingBudget,
            spendableBudget,
            fixedBuffer,
            daysRemaining,
            totalCycleDays,
            daysPassed,
            dailyRemaining,
            velocity,
            spentToday,
            spentYesterday,
            rolloverReward,
            categorySpendingToday,
            isExpired,
            currency: currencyCode
        }
    };
}
