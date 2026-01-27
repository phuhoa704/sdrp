import { Product } from "@/types/product";

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "p1",
        name: "SuperKill 500WP",
        category: "Thuốc trừ sâu",
        active_ingredient: "Imidacloprid",
        expiry_date: "2024-12-01",
        regulatory_doc: "Verified",
        image_style: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400",
        price: 150000,
        stockLevel: 85,
        description: "Sản phẩm đặc trị các loại côn trùng chích hút. Hiệu lực kéo dài, phổ tác động rộng.",
        variants: [
            { id: "v1-1", label: "250SC - Chai Xanh - Nồng độ A", origin: "Mỹ", price_modifier: 1.2, stock: 45 },
            { id: "v1-2", label: "250SC - Chai Vàng - Nồng độ B", origin: "Thái Lan", price_modifier: 1.0, stock: 30 },
            { id: "v1-3", label: "500WP - Chai Xanh - Nồng độ A", origin: "Hàn Quốc", price_modifier: 1.1, stock: 25 },
            { id: "v1-4", label: "500WP - Chai Vàng - Nồng độ B", origin: "Mỹ", price_modifier: 1.3, stock: 15 },
            { id: "v1-5", label: "700WG - Chai Trắng - Nồng độ C", origin: "Đức", price_modifier: 1.5, stock: 10 }
        ]
    },
    {
        id: "p2",
        name: "GrowFast Nitro",
        category: "Phân bón lá",
        active_ingredient: "Nitrogen 30%",
        expiry_date: "2025-06-15",
        regulatory_doc: "Verified",
        image_style: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400",
        price: 85000,
        stockLevel: 45,
        description: "Cung cấp dinh dưỡng thiết yếu giúp bộ rễ phát triển mạnh.",
        variants: [
            { id: "v2-1", label: "Nitro-K - Can 5L - Đậm đặc", origin: "Mỹ", price_modifier: 1.8, stock: 20 },
            { id: "v2-2", label: "Nitro-K - Chai 1L - Tiêu chuẩn", origin: "Thái Lan", price_modifier: 1.0, stock: 50 },
            { id: "v2-3", label: "Nitro-Zinc - Chai 1L - Kẽm+", origin: "Hàn Quốc", price_modifier: 1.2, stock: 35 }
        ]
    },
    {
        id: "p3",
        name: "FungiGone 200SC",
        category: "Thuốc trừ bệnh",
        active_ingredient: "Azoxystrobin",
        expiry_date: "2024-05-20",
        regulatory_doc: "Verified",
        image_style: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=400",
        price: 210000,
        stockLevel: 15,
        description: "Chuyên dùng phòng trừ đạo ôn, khô vằn. Tác dụng nội hấp mạnh mẽ.",
        variants: [
            { id: "v3-1", label: "200SC - Chai Xanh - Nồng độ A", origin: "Mỹ", price_modifier: 1.4, stock: 12 },
            { id: "v3-2", label: "200SC - Chai Xanh - Nồng độ A", origin: "Thái Lan", price_modifier: 1.0, stock: 40 },
            { id: "v3-3", label: "250SC - Chai Vàng - Nồng độ B", origin: "Mỹ", price_modifier: 1.6, stock: 8 },
            { id: "v3-4", label: "250SC - Chai Vàng - Nồng độ B", origin: "Hàn Quốc", price_modifier: 1.3, stock: 22 }
        ]
    },
    {
        id: "p4",
        name: "Antracol 70WP",
        category: "Thuốc trừ bệnh",
        active_ingredient: "Propineb",
        expiry_date: "2025-10-10",
        regulatory_doc: "Verified",
        image_style: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=400",
        price: 185000,
        stockLevel: 60,
        variants: [
            { id: "v4-1", label: "70WP - Gói 1kg - Bột mịn", origin: "Đức", price_modifier: 1.0, stock: 60 },
            { id: "v4-2", label: "70WP - Gói 500g - Bột mịn", origin: "Thái Lan", price_modifier: 0.6, stock: 100 }
        ]
    },
    {
        id: "p5",
        name: "Tilt Super 300EC",
        category: "Thuốc trừ bệnh",
        active_ingredient: "Difenoconazole",
        expiry_date: "2024-11-20",
        regulatory_doc: "Verified",
        image_style: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=400",
        price: 245000,
        stockLevel: 30,
        variants: [
            { id: "v5-1", label: "300EC - Chai Nhôm - Thượng hạng", origin: "Thụy Sĩ", price_modifier: 1.2, stock: 15 },
            { id: "v5-2", label: "300EC - Chai Nhựa - Tiêu chuẩn", origin: "Mỹ", price_modifier: 1.0, stock: 30 }
        ]
    }
];