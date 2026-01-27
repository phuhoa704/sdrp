import { B2COrder } from "@/types/order";

export const MOCK_B2C_HISTORY: B2COrder[] = [
    {
        id: "POS-8821",
        customer: { name: "Chú Năm Ruộng", phone: "0912345678", address: "Ấp 3, Mỹ An, Tháp Mười, Đồng Tháp" },
        date: "Hôm nay, 08:30",
        timestamp: Date.now() - 3600000,
        total: 450000,
        status: 'completed',
        items: [{ name: "SuperKill 500WP", qty: 3, price: 150000, variant: "Chai/Gói", tech_specs: "500WP (Bột thấm nước) - Ấn Độ" }]
    }
];