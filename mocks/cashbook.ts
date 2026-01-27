import { CashbookEntry } from "@/types/cashbook";

export const MOCK_ENTRIES: CashbookEntry[] = [
    { id: '1', code: 'PT00001', type: 'IN', date: '22/01/2026 08:30', method: 'CASH', amount: 450000, partner: 'Chú Năm Ruộng', reason: 'Thu tiền bán hàng (POS-8821)', isAccounting: true, creator: 'Trần Phúc Lợi' },
    { id: '2', code: 'PC00001', type: 'OUT', date: '21/01/2026 15:45', method: 'BANK', amount: 12500000, partner: 'NPP Hoàng Gia', reason: 'Thanh toán tiền hàng sỉ (ORD-9928)', isAccounting: true, creator: 'Trần Phúc Lợi' },
    { id: '3', code: 'CQ00001', type: 'TRANSFER', date: '20/01/2026 10:00', method: 'CASH', amount: 5000000, partner: 'Nội bộ', reason: 'Chuyển tiền mặt vào tài khoản Techcombank', isAccounting: false, creator: 'Trần Phúc Lợi' }
];