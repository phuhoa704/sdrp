import { PackagePlus, CreditCardIcon, Percent, Zap, Gift, Truck, Ticket } from "lucide-react";

const PROMOTION_UI_MAP: Record<string, { label: string; description: string; icon: any; color: string; bgColor: string }> = {
    amount_off_products: {
        label: "Giảm tiền sản phẩm",
        description: "Giảm số tiền cố định trực tiếp trên từng sản phẩm được chọn.",
        icon: PackagePlus,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
    },
    amount_off_order: {
        label: "Giảm tiền hóa đơn",
        description: "Khuyến mãi giảm một khoản tiền cố định trên tổng giá trị đơn hàng.",
        icon: CreditCardIcon,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10"
    },
    percentage_off_product: {
        label: "Giảm % sản phẩm",
        description: "Ưu đãi theo tỷ lệ phần trăm cho danh mục hoặc sản phẩm cụ thể.",
        icon: Percent,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10"
    },
    percentage_off_order: {
        label: "Giảm % hóa đơn",
        description: "Chiết khấu theo % trên tổng bill khi đơn hàng đạt điều kiện.",
        icon: Zap,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10"
    },
    buy_x_get_y: {
        label: "Mua X tặng Y",
        description: "Chương trình quà tặng kèm khi khách hàng mua đủ số lượng X.",
        icon: Gift,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10"
    },
    shipping_methods: {
        label: "Miễn phí vận chuyển",
        description: "Hỗ trợ phí giao hàng để kích khích khách hàng chốt đơn nhanh.",
        icon: Truck,
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10"
    },
    unknown: {
        label: "Khuyến mãi",
        description: "Chương trình ưu đãi khách hàng.",
        icon: Ticket,
        color: "text-slate-500",
        bgColor: "bg-slate-500/10"
    }
};

export const getPromotionUIData = (p: any) => {
    if (p.type === 'buy_get') return PROMOTION_UI_MAP.buy_x_get_y;
    const am = p.application_method;
    if (!am) return PROMOTION_UI_MAP.unknown;

    if (am.target_type === 'shipping_methods') return PROMOTION_UI_MAP.shipping_methods;

    if (am.target_type === 'items') {
        return am.type === 'percentage' ? PROMOTION_UI_MAP.percentage_off_product : PROMOTION_UI_MAP.amount_off_products;
    }

    if (am.target_type === 'order') {
        return am.type === 'percentage' ? PROMOTION_UI_MAP.percentage_off_order : PROMOTION_UI_MAP.amount_off_order;
    }

    return PROMOTION_UI_MAP.unknown;
};