import { format } from 'date-fns';

export function exportTransactionsToCSV(transactions: any[], currency: string) {
    if (!transactions.length) return;

    // Header
    const headers = ['Date', 'Category', 'Amount', 'Currency', 'Note'];

    const rows = transactions.map(t => [
        format(new Date(t.date), 'yyyy-MM-dd HH:mm'),
        t.category,
        t.amount,
        currency,
        t.note || ''
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const fileName = `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
