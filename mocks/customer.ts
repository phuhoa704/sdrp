import { Customer } from "@/types/customer";

export const MOCK_CUSTOMERS: Customer[] = [
    {
        id: "KH000005",
        name: "Anh Giang - Kim Mã",
        phone: "0987654321",
        email: "giangkm@agri.vn",
        group: "Khách lẻ",
        debt: 0,
        totalSales: 12500000,
        address: "123 Kim Mã, Ba Đình, Hà Nội",
        isActive: true,
        createdAt: "22/01/2026"
    },
    {
        id: "KH000004",
        name: "Anh Hoàng - Sài Gòn",
        phone: "0912333444",
        group: "Đại lý cấp 2",
        debt: 2500000,
        totalSales: 45000000,
        isActive: true,
        createdAt: "15/01/2026"
    },
    {
        id: "KH000003",
        name: "Tuấn - Hà Nội",
        phone: "0944555666",
        group: "Khách lẻ",
        debt: 0,
        totalSales: 850000,
        isActive: true,
        createdAt: "10/01/2026"
    }
];