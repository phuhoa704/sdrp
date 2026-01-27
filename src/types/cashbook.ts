export interface CashbookEntry {
    id: string;
    code: string;
    type: 'IN' | 'OUT' | 'TRANSFER';
    date: string;
    method: 'CASH' | 'BANK';
    amount: number;
    partner: string;
    reason: string;
    isAccounting: boolean;
    creator: string;
    note?: string;
}