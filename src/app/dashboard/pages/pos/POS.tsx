
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
    ArrowLeft, AlertTriangle, X, CheckCircle2,
    BookOpen, Sparkles,
    History, Receipt, User, Calendar, MapPin, ChevronDown,
    GripVertical
} from 'lucide-react';
import { Product } from '@/types/product';
import { B2COrder } from '@/types/b2corder';
import { ProductModal } from '@/components/ProductModal';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

// Refactored Components
import { POSTabs } from './POSTabs';
import { POSCatalog } from './POSCatalog';
import { POSCart } from './POSCart';
import { POSHistoryDrawer } from './POSHistoryDrawer';

// Reuse logic from InventoryScreen for the Detail Modal
import { createPortal } from 'react-dom';
import { DiseaseDetailScreen } from '../DiseaseDetailScreen';
import { DiagnosisScreen } from '../DiagnosisScreen';
import { useMedusaProducts, useCategories, useSalesChannels } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';

interface POSItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    variant: string;
    image: string;
    tech_specs?: string; // Lưu thông tin nồng độ/xuất xứ
}

interface OrderTab {
    id: string;
    label: string;
    items: POSItem[];
    customer: { name: string; phone: string; address?: string } | null;
    discount: number;
    fulfillment: 'pickup' | 'delivery';
    shippingFee: number;
    shippingPartner?: string;
    branch?: string;
}

interface POSScreenProps {
    onBack: () => void;
    onCompleteOrder: (order: B2COrder) => void;
    b2cHistory?: B2COrder[]; // Lấy lịch sử từ Retailer view
}

const POS: React.FC<POSScreenProps> = ({ onBack, onCompleteOrder, b2cHistory = [] }) => {
    const { salesChannels } = useSalesChannels();
    const { selectedSalesChannelId } = useAppSelector((state: RootState) => state.ui);

    const brands = useMemo(() => salesChannels.map(sc => sc.name), [salesChannels]);
    const [currentBranch, setCurrentBranch] = useState("");

    const [tabs, setTabs] = useState<OrderTab[]>([
        { id: '1', label: 'Đơn 1', items: [], customer: null, discount: 0, fulfillment: 'pickup', shippingFee: 0, branch: "" }
    ]);

    useEffect(() => {
        const selected = salesChannels.find(sc => sc.id === selectedSalesChannelId);
        if (selected) {
            setCurrentBranch(selected.name);
            setTabs(prev => prev.map(t => t.branch === "" ? { ...t, branch: selected.name } : t));
        }
    }, [selectedSalesChannelId, salesChannels]);
    const [activeTabId, setActiveTabId] = useState('1');
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");
    const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
    const [showAlertDrawer, setShowAlertDrawer] = useState(false);
    const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

    // Resizable Cart State
    const [cartWidth, setCartWidth] = useState(500);
    const [isResizingActive, setIsResizingActive] = useState(false);
    const isResizing = useRef(false);

    // Modals state
    const [productToConfigure, setProductToConfigure] = useState<Product | null>(null);
    const [diseaseToShow, setDiseaseToShow] = useState<string | null>(null);
    const [showAIModal, setShowAIModal] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [isCreatingShipping, setIsCreatingShipping] = useState(false);
    const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<B2COrder | null>(null);

    const { products: allProducts, loading: productsLoading } = useMedusaProducts({ limit: 100 });
    const { categories: medusaCategories } = useCategories();

    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
    const categories = ["Tất cả", ...medusaCategories.map(c => c.name)];

    const subtotal = activeTab.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const vatAmount = subtotal * 0.08;
    const totalAmount = subtotal + vatAmount - activeTab.discount + activeTab.shippingFee;

    const criticalProducts = allProducts.filter((p: any) => {
        // Handle potential missing data in real products
        const metadata = (p as any).metadata || {};
        const expiryDateStr = metadata.expiry_date || p.variants?.[0]?.metadata?.expiry_date;
        const stockLevel = p.variants?.reduce((sum: number, v: any) => sum + (v.inventory_quantity || 0), 0) || 0;

        if (expiryDateStr) {
            const expiryDate = new Date(expiryDateStr);
            const diffDays = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays <= 60 && diffDays > 0) return true;
        }

        return stockLevel < 20;
    });

    const filteredProducts = allProducts.filter((p: any) => {
        const productCategories = p.categories?.map((c: any) => c.name) || [];
        const matchesCat = selectedCategory === "Tất cả" || productCategories.includes(selectedCategory);

        const activeIngredient = (p as any).metadata?.active_ingredient || p.variants?.[0]?.metadata?.active_ingredient || "";
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activeIngredient.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCat && matchesSearch;
    });

    // Resizing logic
    const startResizing = useCallback((e: React.MouseEvent) => {
        isResizing.current = true;
        setIsResizingActive(true);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', stopResizing);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }, []);

    const stopResizing = useCallback(() => {
        isResizing.current = false;
        setIsResizingActive(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopResizing);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing.current) return;
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth >= 380 && newWidth <= window.innerWidth * 0.6) {
            setCartWidth(newWidth);
        }
    }, []);

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', stopResizing);
        };
    }, [handleMouseMove, stopResizing]);

    // Handlers
    const handleAddTab = () => {
        const newId = (Math.max(...tabs.map(t => parseInt(t.id))) + 1).toString();
        setTabs([...tabs, { id: newId, label: `Đơn ${newId}`, items: [], customer: null, discount: 0, fulfillment: 'pickup', shippingFee: 0, branch: currentBranch }]);
        setActiveTabId(newId);
    };

    const handleRemoveTab = (id: string) => {
        if (tabs.length > 1) {
            const newTabs = tabs.filter(t => t.id !== id);
            setTabs(newTabs);
            if (activeTabId === id) setActiveTabId(newTabs[0].id);
        }
    };

    const handleBranchChange = (branch: string) => {
        setCurrentBranch(branch);
        setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, branch: branch } : t));
    };

    const updateItemQty = (id: string, variant: string, tech_specs: string | undefined, delta: number) => {
        setTabs(prev => prev.map(t => t.id === activeTabId ? {
            ...t,
            items: t.items.map(i => (i.id === id && i.variant === variant && i.tech_specs === tech_specs) ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
        } : t));
    };

    const removeItem = (id: string, variant: string, tech_specs: string | undefined) => {
        setTabs(prev => prev.map(t => t.id === activeTabId ? {
            ...t, items: t.items.filter(i => !(i.id === id && i.variant === variant && i.tech_specs === tech_specs))
        } : t));
    };

    const handleCheckout = async () => {
        if (activeTab.items.length === 0) return;
        if (activeTab.fulfillment === 'delivery') {
            setIsCreatingShipping(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsCreatingShipping(false);
        }

        const order: B2COrder = {
            id: `POS-${Math.floor(1000 + Math.random() * 9000)}`,
            customer: {
                name: activeTab.customer?.name || 'Khách lẻ',
                phone: activeTab.customer?.phone || '000',
                address: activeTab.customer?.address || 'Tại quầy'
            },
            date: new Date().toLocaleString('vi-VN'),
            timestamp: Date.now(),
            total: totalAmount,
            status: 'completed',
            items: activeTab.items.map(i => ({
                name: i.name,
                qty: i.quantity,
                price: i.price,
                variant: i.variant,
                tech_specs: i.tech_specs
            }))
        };

        onCompleteOrder(order);

        setShowCheckoutSuccess(true);
        setTimeout(() => {
            setShowCheckoutSuccess(false);
            setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, items: [], customer: null, discount: 0, fulfillment: 'pickup', shippingFee: 0, shippingPartner: undefined } : t));
        }, 2000);
    };

    // Render Order Detail Modal
    const renderOrderDetailModal = () => {
        if (!selectedOrderForDetail) return null;
        const order = selectedOrderForDetail;

        const modalContent = (
            <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 md:p-12 animate-fade-in">
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setSelectedOrderForDetail(null)} />
                <div className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl animate-slide-up flex flex-col border dark:border-slate-800">
                    <div className="p-8 bg-slate-900 text-white flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10"><Receipt size={28} className="text-emerald-400" /></div>
                            <div>
                                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Chi tiết đơn hàng POS</p>
                                <h3 className="text-xl font-black">{order.id}</h3>
                            </div>
                        </div>
                        <button onClick={() => setSelectedOrderForDetail(null)} className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all"><X size={28} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-slate-50/30 dark:bg-slate-950/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <Card className="p-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><User size={14} /> Khách hàng</h4>
                                <p className="font-bold text-slate-800 dark:text-white">{order.customer.name}</p>
                                <p className="text-sm text-slate-500 mt-1">{order.customer.phone}</p>
                                <p className="text-xs text-slate-400 mt-2 italic">{order.customer.address}</p>
                            </Card>
                            <Card className="p-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar size={14} /> Giao dịch</h4>
                                <p className="font-bold text-slate-800 dark:text-white">{order.date}</p>
                                <p className="text-sm text-emerald-600 font-bold mt-1 uppercase tracking-tighter">Hoàn tất • Tiền mặt</p>
                            </Card>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Sản phẩm</th>
                                        <th className="px-6 py-4 text-center">SL</th>
                                        <th className="px-6 py-4 text-right">Đơn giá</th>
                                        <th className="px-6 py-4 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y dark:divide-slate-800">
                                    {order.items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.name}</p>
                                                <div className="flex gap-1.5 mt-1">
                                                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/50">{item.variant}</span>
                                                    {item.tech_specs && <span className="text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border dark:border-slate-700">{item.tech_specs}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-xs font-black">x{item.qty}</td>
                                            <td className="px-6 py-4 text-right text-xs text-slate-500">{item.price.toLocaleString()}đ</td>
                                            <td className="px-6 py-4 text-right text-sm font-black text-emerald-600">{(item.price * item.qty).toLocaleString()}đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="p-8 border-t dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center shrink-0">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tổng thanh toán</p>
                            <p className="text-3xl font-black text-emerald-600">{order.total.toLocaleString()}đ</p>
                        </div>
                        <Button className="px-10 rounded-2xl" onClick={() => setSelectedOrderForDetail(null)}>Đóng</Button>
                    </div>
                </div>
            </div>
        );
        return createPortal(modalContent, document.getElementById('modal-root')!);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#F1F5F9] dark:bg-slate-950 flex flex-col overflow-hidden animate-fade-in">
            {/* POS Top Header */}
            <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-6 h-16 flex items-center justify-between shrink-0 relative z-[200]">
                <div className="flex items-center gap-6 h-full">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                        <ArrowLeft size={20} className="text-slate-500" />
                    </button>

                    <div className="h-10 px-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 flex items-center gap-2 group cursor-pointer hover:bg-white transition-all shadow-sm">
                        <div className="w-6 h-6 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                            <MapPin size={14} />
                        </div>
                        <div className="flex flex-col pr-4 border-r dark:border-slate-700">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Chi nhánh</p>
                            <select
                                value={currentBranch}
                                onChange={(e) => handleBranchChange(e.target.value)}
                                className="bg-transparent text-[11px] font-black text-slate-700 dark:text-slate-200 outline-none cursor-pointer appearance-none"
                            >
                                {brands.map((b: string) => <option key={b} value={b} className="dark:bg-slate-900">{b}</option>)}
                            </select>
                        </div>
                        <ChevronDown size={14} className="text-slate-400 group-hover:text-primary" />
                    </div>

                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />

                    <POSTabs
                        tabs={tabs}
                        activeTabId={activeTabId}
                        onSelectTab={setActiveTabId}
                        onAddTab={handleAddTab}
                        onRemoveTab={handleRemoveTab}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowHistoryDrawer(true)}
                        className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="Lịch sử bán hàng B2C"
                    >
                        <History size={20} />
                    </button>

                    <button
                        onClick={() => setShowAlertDrawer(true)}
                        className="relative p-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        title="Cảnh báo tồn kho / Hết hạn"
                    >
                        <AlertTriangle size={20} />
                        {criticalProducts.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                                {criticalProducts.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                <POSCatalog
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    categories={categories}
                    filteredProducts={filteredProducts}
                    allProducts={allProducts}
                    onProductClick={setProductToConfigure}
                    onOpenAI={() => setShowAIModal(true)}
                    onOpenDisease={(id) => setDiseaseToShow(id)}
                />

                {/* Improved Resize Handle UX */}
                <div
                    onMouseDown={startResizing}
                    className={`absolute top-0 bottom-0 w-4 -ml-2 cursor-col-resize z-[150] group flex items-center justify-center transition-all ${isResizingActive ? 'pointer-events-auto' : ''}`}
                    style={{ right: `${cartWidth - 8}px` }}
                >
                    {/* Main Visual Line */}
                    <div className={`w-[2px] h-full transition-colors duration-300 ${isResizingActive ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800 group-hover:bg-primary/50'}`} />

                    {/* Grip Handle - Affordance */}
                    <div className={`absolute w-7 h-14 bg-white dark:bg-slate-900 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center shadow-xl ${isResizingActive ? 'border-primary scale-110' : 'border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2'}`}>
                        <GripVertical size={18} className={`${isResizingActive ? 'text-primary' : 'text-slate-400'}`} />

                        {/* Visual Hint Dot - Pulse */}
                        {!isResizingActive && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping opacity-75" />
                        )}
                    </div>

                    {/* Overlay to prevent hover loss during fast resizing */}
                    {isResizingActive && (
                        <div className="fixed inset-0 z-[-1] cursor-col-resize" />
                    )}
                </div>

                <POSCart
                    width={cartWidth}
                    activeTab={activeTab}
                    subtotal={subtotal}
                    vatAmount={vatAmount}
                    totalAmount={totalAmount}
                    isCreatingShipping={isCreatingShipping}
                    onUpdateQty={updateItemQty}
                    onRemoveItem={removeItem}
                    onClearCart={() => setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, items: [] } : t))}
                    onSetFulfillment={(f) => setTabs(prev => prev.map(t => t.id === activeTabId ? {
                        ...t,
                        fulfillment: f,
                        shippingFee: f === 'pickup' ? 0 : 30000,
                        shippingPartner: f === 'delivery' ? 'GHTK' : undefined
                    } : t))}
                    onUpdateShippingFee={(fee) => setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, shippingFee: fee } : t))}
                    onSetShippingPartner={(partner) => setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, shippingPartner: partner } : t))}
                    onUpdateDiscount={(amount) => setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, discount: amount } : t))}
                    onOpenCustomerModal={() => setShowCustomerModal(true)}
                    onCheckout={handleCheckout}
                />
            </div>

            {/* Drawer Cảnh báo hàng hóa */}
            {showAlertDrawer && (
                <div className="fixed inset-0 z-[10600] flex justify-end animate-fade-in">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAlertDrawer(false)} />
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl animate-slide-left flex flex-col">
                        <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between bg-rose-500 text-white">
                            <div className="flex items-center gap-3">
                                <AlertTriangle size={24} />
                                <h3 className="text-lg font-bold">Cảnh báo tồn kho ({criticalProducts.length})</h3>
                            </div>
                            <button onClick={() => setShowAlertDrawer(false)} className="p-2 hover:bg-white/10 rounded-full">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                            {criticalProducts.map((p: any) => (
                                <Card key={p.id} className="p-4 border-rose-100 dark:border-rose-900/30 hover:border-rose-300 transition-all">
                                    <div className="flex gap-4">
                                        <img src={p.thumbnail} className="w-16 h-16 rounded-xl object-cover border dark:border-slate-800" alt={p.title} />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm dark:text-white truncate">{p.title}</h4>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{(p as any).metadata?.active_ingredient || ''}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="soft"
                                        size="sm"
                                        fullWidth
                                        className="mt-4 dark:bg-rose-900/20 dark:text-rose-400"
                                        onClick={() => { setProductToConfigure(p); setShowAlertDrawer(false); }}
                                    >
                                        Kiểm tra / Nhập thêm
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Drawer Lịch sử bán hàng B2C với bộ lọc mới */}
            <POSHistoryDrawer
                isOpen={showHistoryDrawer}
                onClose={() => setShowHistoryDrawer(false)}
                history={b2cHistory}
                onViewDetail={(order) => {
                    setSelectedOrderForDetail(order);
                }}
            />

            {/* Modals */}
            {showCustomerModal && (
                <div className="fixed inset-0 z-[10500] flex items-center justify-center p-4 animate-fade-in">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCustomerModal(false)} />
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl border dark:border-slate-800">
                        <h3 className="text-xl font-bold mb-6 dark:text-white">Thông tin khách hàng</h3>
                        <div className="space-y-5">
                            <input id="cust-name" placeholder="Họ và tên..." defaultValue={activeTab.customer?.name || ''} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 dark:text-white outline-none" />
                            <input id="cust-phone" placeholder="Số điện thoại..." defaultValue={activeTab.customer?.phone || ''} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 dark:text-white outline-none" />
                            <textarea id="cust-address" placeholder="Địa chỉ..." defaultValue={activeTab.customer?.address || ''} className="w-full h-24 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 dark:text-white outline-none resize-none" />
                            <div className="flex gap-3 pt-4">
                                <Button variant="secondary" fullWidth onClick={() => setShowCustomerModal(false)}>Hủy</Button>
                                <Button fullWidth onClick={() => {
                                    const nameInput = document.getElementById('cust-name') as HTMLInputElement;
                                    const phoneInput = document.getElementById('cust-phone') as HTMLInputElement;
                                    const addressInput = document.getElementById('cust-address') as HTMLTextAreaElement;
                                    if (nameInput.value && phoneInput.value) {
                                        setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, customer: { name: nameInput.value, phone: phoneInput.value, address: addressInput.value } } : t));
                                        setShowCustomerModal(false);
                                    }
                                }}>Lưu</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {productToConfigure && (
                <ProductModal
                    product={productToConfigure}
                    onClose={() => setProductToConfigure(null)}
                    onAddToCart={(product, config) => {
                        setTabs(prev => prev.map(t => {
                            if (t.id !== activeTabId) return t;
                            const existingIdx = t.items.findIndex(i =>
                                i.id === product.id &&
                                i.variant === config.unit &&
                                i.tech_specs === config.tech_specs
                            );

                            if (existingIdx > -1) {
                                const newItems = [...t.items];
                                newItems[existingIdx].quantity += config.quantity;
                                return { ...t, items: newItems };
                            }

                            return {
                                ...t,
                                items: [...t.items, {
                                    id: product.id,
                                    name: product.title,
                                    price: config.price,
                                    quantity: config.quantity,
                                    variant: config.unit,
                                    image: product.thumbnail || '',
                                    tech_specs: config.tech_specs
                                }]
                            };
                        }));
                        setProductToConfigure(null);
                    }}
                />
            )}

            {diseaseToShow && (
                <div className="fixed inset-0 z-[10200] flex items-center justify-center p-4 animate-fade-in">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDiseaseToShow(null)} />
                    <div className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-transparent dark:border-slate-800 animate-slide-up">
                        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center shrink-0">
                            <h3 className="text-xl font-bold dark:text-white flex items-center gap-3">
                                <BookOpen size={24} className="text-primary" /> Chi tiết Bệnh hại
                            </h3>
                            <button onClick={() => setDiseaseToShow(null)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            <DiseaseDetailScreen
                                id={diseaseToShow}
                                onBack={() => setDiseaseToShow(null)}
                                onProductClick={(p) => { setProductToConfigure(p); setDiseaseToShow(null); }}
                                onAddToCart={(p, v) => {
                                    setProductToConfigure(p);
                                    setDiseaseToShow(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showAIModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-fade-in">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAIModal(false)} />
                    <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#F8FAFC] dark:bg-slate-950 rounded-[40px] overflow-hidden flex flex-col border border-white/20 dark:border-slate-800">
                        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                            <h3 className="text-xl font-bold dark:text-white flex items-center gap-3"><Sparkles size={24} className="text-primary" /> Trợ lý AI</h3>
                            <button onClick={() => setShowAIModal(false)} className="p-2 text-slate-400"><X size={24} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                            <DiagnosisScreen onBack={() => setShowAIModal(false)} onProductClick={setProductToConfigure} onAddToCart={(p, v) => {
                                setProductToConfigure(p);
                                setShowAIModal(false);
                            }} />
                        </div>
                    </div>
                </div>
            )}

            {showCheckoutSuccess && (
                <div className="absolute inset-0 z-[200] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
                    <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white animate-bounce shadow-2xl">
                        <CheckCircle2 size={64} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-8">Thanh toán thành công</h2>
                </div>
            )}

            {renderOrderDetailModal()}
        </div>
    );
};

export default POS;