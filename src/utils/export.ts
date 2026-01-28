import { format } from 'date-fns';
import type { Transaction } from '../db/db';

export function exportTransactionsToCSV(transactions: Transaction[], currency: string) {
    if (!transactions.length) return;

    // Generate a readable Text/Markdown format
    const lines = [];
    lines.push(`Transaction Report`);
    lines.push(`Generated: ${format(new Date(), 'dd MMM yyyy HH:mm')}`);
    lines.push(`Total Transactions: ${transactions.length}`);
    lines.push('--------------------------------------------------');

    // Sort transactions by date (descending)
    const sorted = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());

    sorted.forEach(t => {
        const dateStr = format(new Date(t.date), 'yyyy-MM-dd HH:mm');
        const amountStr = `${currency}${t.amount.toFixed(2)}`;
        const noteStr = t.note ? ` - ${t.note}` : '';

        // Simple list format easy to read on mobile
        lines.push(`[${dateStr}] ${t.category.toUpperCase()}: ${amountStr}${noteStr}`);
    });

    lines.push('--------------------------------------------------');
    lines.push('End of Report');

    const txtContent = lines.join('\n');

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const fileName = `transactions_${format(new Date(), 'yyyy-MM-dd')}.txt`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
