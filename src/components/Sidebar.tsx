import React, { useState, useEffect, useMemo, Fragment, useRef } from 'react';
import {
  Home, Package, User, ShoppingBag, Tag, Ticket,
  ChevronDown, ChevronRight, Zap, Moon, Sun, ChevronLeft,
  Wallet,
  BookText,
  MapPin,
  Check
} from 'lucide-react';
import { UserRole } from '@/types/enum';
import { ViewState } from '@/types/view-state';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useSalesChannels } from '@/hooks';
import { setSelectedSalesChannelId } from '@/store/slices/uiSlice';
import { RootState } from '@/store';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  role: UserRole;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onBrandChange?: (brand: string) => void;
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  view?: ViewState;
  children?: SubMenuItem[];
  category?: CategoryMenuItem[];
}

interface CategoryMenuItem {
  id: string;
  label: string;
  children?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  label: string;
  view: ViewState;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setView,
  role,
  isCollapsed,
  toggleSidebar,
  isDarkMode,
  toggleTheme,
  onBrandChange,
  isMobileMenuOpen = false,
  onCloseMobileMenu
}) => {
  const dispatch = useAppDispatch();
  const [isBrandMenuOpen, setIsBrandMenuOpen] = useState(false);
  const brandMenuRef = useRef<HTMLDivElement>(null);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['marketplace', 'warehouse']);
  const [hoveredMenu, setHoveredMenu] = useState<{ id: string, top: number } | null>(null);

  const { salesChannels, loading: channelsLoading, refresh } = useSalesChannels({ isDisabled: false });
  const { selectedSalesChannelId, salesChannelsRefreshTrigger } = useAppSelector((state: RootState) => state.ui);

  const selectedChannel = useMemo(() =>
    salesChannels.find(sc => sc.id === selectedSalesChannelId) || salesChannels[0],
    [salesChannels, selectedSalesChannelId]
  );

  useEffect(() => {
    if (salesChannels.length > 0 && !selectedSalesChannelId) {
      dispatch(setSelectedSalesChannelId(salesChannels[0].id));
    }
  }, [salesChannels, selectedSalesChannelId, dispatch]);

  useEffect(() => {
    if (selectedChannel && onBrandChange) {
      onBrandChange(selectedChannel.name);
    }
  }, [selectedChannel, onBrandChange]);

  // Refresh sales channels when trigger changes
  useEffect(() => {
    if (salesChannelsRefreshTrigger > 0) {
      refresh();
    }
  }, [salesChannelsRefreshTrigger, refresh]);


  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  // Menu items based on role
  const getMenuItems = (): MenuItem[] => {
    // RETAILER menu
    if (role === UserRole.RETAILER) {
      return [
        {
          id: 'home',
          label: 'TRANG CHỦ',
          icon: Home,
          view: 'HOME',
        },
        {
          id: 'warehouse',
          label: 'KHO HÀNG',
          icon: Package,
          category: [
            {
              id: "products", label: "Quản lý hàng hóa", children: [
                { id: 'product-list', label: 'Sản phẩm', view: 'PRODUCTS' },
                { id: 'inventory', label: 'Danh mục tồn kho', view: 'INVENTORY' },
              ]
            },
            {
              id: "category", label: "Cấu trúc danh mục", children: [
                { id: 'data-groups', label: 'Phân loại', view: 'DATA_GROUPS' },
                { id: 'category', label: 'LOẠI HÀNG', view: 'CATEGORY' },
                { id: 'collection', label: 'BỘ SƯU TẬP', view: 'COLLECTION' },
                { id: 'sales-channels', label: 'KÊNH BÁN HÀNG', view: 'SALES_CHANNELS' },
              ]
            },
            {
              id: "stock", label: "Nghiệp vụ kho", children: [
                { id: 'stock-locations', label: 'VỊ TRÍ KHO', view: 'STOCK_LOCATIONS' },
                { id: 'stock-check', label: 'KIỂM KHO', view: 'STOCK_CHECK' },
                { id: 'export', label: 'XUẤT HỦY', view: 'STOCK_DISPOSAL' },
              ]
            }
          ],
        },
        {
          id: "books",
          label: "SỔ SÁCH",
          icon: BookText,
          children: [
            { id: "stockup", label: "Phiếu xuất/nhập hàng", view: "STOCK_UP" },
            { id: 'orders', label: 'Đơn hàng POS', view: 'CATALOG' }
          ]
        },
        {
          id: 'notebook',
          label: 'SỔ QUỸ',
          icon: Wallet,
          view: 'CASHBOOK',
        },
        {
          id: 'customers',
          label: 'KHÁCH HÀNG',
          icon: User,
          children: [
            { id: 'customers', label: 'DANH SÁCH KHÁCH HÀNG', view: 'CUSTOMERS' },
            { id: 'customers-group', label: 'NHÓM KHÁCH HÀNG', view: 'CUSTOMERS_GROUP' },
          ],
        },
        {
          id: 'pricing',
          label: 'BẢNG GIÁ',
          icon: Tag,
          view: 'PRICING',
        },
        {
          id: 'promotions',
          label: 'KHUYẾN MÃI',
          icon: Ticket,
          view: 'PROMOTIONS',
        },
        {
          id: 'marketplace',
          label: 'MARKETPLACE',
          icon: ShoppingBag,
          children: [
            { id: 'wholesale-store', label: 'GIAN HÀNG SỈ', view: 'WHOLESALE_MARKETPLACE' },
            { id: 'order-history', label: 'LỊCH SỬ NHẬP', view: 'MARKETPLACE' },
          ],
        },
      ];
    }

    // SELLER menu
    if (role === UserRole.SELLER) {
      return [
        {
          id: 'home',
          label: 'TRANG CHỦ',
          icon: Home,
          view: 'HOME',
        },
        {
          id: 'warehouse',
          label: 'KHO HÀNG',
          icon: Package,
          view: 'CATALOG',
        },
        {
          id: 'customers',
          label: 'KHÁCH HÀNG',
          icon: User,
          view: 'AI_DIAGNOSIS',
        },
      ];
    }

    // ADMIN menu
    if (role === UserRole.ADMIN) {
      return [
        {
          id: 'home',
          label: 'TRANG CHỦ',
          icon: Home,
          view: 'HOME',
        },
        {
          id: 'master-data',
          label: 'MASTER DATA',
          icon: Package,
          view: 'MASTER_DATA',
        },
      ];
    }

    // Default fallback
    return [];
  };

  const menuItems = getMenuItems();

  const isMenuActive = (item: MenuItem): boolean => {
    if (item.view && currentView === item.view) return true;
    if (item.children) {
      return item.children.some(child => currentView === child.view);
    }
    return false;
  };

  const isSubMenuActive = (view: ViewState): boolean => {
    return currentView === view;
  };

  const handleMouseEnter = (e: React.MouseEvent, item: MenuItem) => {
    if (!isCollapsed || !item.children || item.children.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredMenu({ id: item.id, top: rect.top });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[99] lg:hidden animate-in fade-in duration-200"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-[100] transition-all duration-300",
        isCollapsed ? 'w-20 px-2' : 'w-64 px-4',
        // Mobile responsive
        "lg:flex",
        isMobileMenuOpen ? "flex" : "hidden lg:flex"
      )}>
        <div className={cn(
          "flex items-center gap-3 py-6 px-2",
          isCollapsed ? 'justify-center flex-col' : 'justify-between'
        )}>
          <div className="flex gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap size={18} className='text-white fill-white' />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-slate-800 dark:text-white tracking-tight">SDRP</span>
                <span className="text-xs font-bold text-emerald-400 tracking-widest -mt-1 uppercase">Platform</span>
              </div>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
            title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 w-full overflow-y-auto scrollbar-hide  relative">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = isMenuActive(item);
            const isExpanded = expandedMenus.includes(item.id);
            const hasChildren = item.children && item.children.length > 0;
            const hasCategory = item.category && item.category.length > 0;

            return (
              <Fragment key={idx}>
                {item.id === "books" && <div className="border-t dark:border-slate-800/50 my-2"></div>}
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (hasChildren || hasCategory) {
                        toggleMenu(item.id);
                      } else if (item.view) {
                        setView(item.view);
                      }
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, item)}
                    onMouseLeave={() => setHoveredMenu(null)}
                    className={cn(
                      "flex items-center transition-all duration-400 group rounded-xl overflow-hidden relative",
                      isActive
                        ? "bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200",
                      isCollapsed ? "justify-center mx-auto mb-3 w-12 h-12" : "gap-4 p-3.5 px-4 mb-0 w-full",
                    )}
                  >
                    {Icon && <Icon
                      size={20}
                      className={cn(
                        isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400 group-hover:text-emerald-400"
                      )}
                    />}
                    {!isCollapsed && (
                      <>
                        <span className={cn(
                          "flex-1 text-left text-xs font-bold tracking-wide uppercase line-clamp-1",
                          isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400 group-hover:text-emerald-400"
                        )}>
                          {item.label}
                        </span>
                        {(hasChildren || hasCategory) && (
                          isExpanded ? (
                            <ChevronDown size={16} className="text-slate-500" />
                          ) : (
                            <ChevronRight size={16} className="text-slate-500" />
                          )
                        )}
                      </>
                    )}
                  </button>

                  {hasChildren && isExpanded && !isCollapsed && (
                    <div className="ml-8 mt-1 space-y-0.5">
                      {item.children?.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => setView(child.view)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-bold transition-all duration-200 uppercase",
                            isSubMenuActive(child.view)
                              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                          )}
                        >
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            isSubMenuActive(child.view) ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300"
                          )} />
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {hasCategory && isExpanded && !isCollapsed && (
                    <div className="flex flex-col">
                      {item.category?.map((cate) => (
                        <Fragment key={cate.id}>
                          <div className="pl-12 px-3 py-2 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] border-t border-slate-50/50 dark:border-slate-800/50 first:border-t-0">{cate.label}</div>
                          {cate?.children?.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => setView(child.view)}
                              className={cn(
                                "flex items-center gap-3 py-2 pl-12 pr-4 rounded-xl text-[11px] font-bold transition-all uppercase",
                                isSubMenuActive(child.view)
                                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10"
                                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                              )}
                            >
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                isSubMenuActive(child.view) ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300"
                              )} />
                              {child.label}
                            </button>
                          ))}
                        </Fragment>
                      ))}
                    </div>
                  )}

                  {isCollapsed && hasChildren && hoveredMenu?.id === item.id && (
                    <div
                      className="fixed left-[72px] w-[220px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden z-[999] animate-in fade-in slide-in-from-left-2 duration-200"
                      style={{ top: hoveredMenu.top }}
                      onMouseEnter={() => setHoveredMenu(hoveredMenu)}
                      onMouseLeave={() => setHoveredMenu(null)}
                    >
                      <div className="px-5 py-3 flex items-center justify-between border-b border-white/5 bg-slate-50/50 dark:bg-white/5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</span>
                        <ChevronRight size={12} className="text-slate-600" />
                      </div>
                      <div className="p-2 space-y-0.5">
                        {item.children?.map(child => {
                          const isSubActive = isSubMenuActive(child.view);
                          return (
                            <button
                              key={child.id}
                              onClick={() => {
                                setView(child.view);
                                setHoveredMenu(null);
                              }}
                              className={cn(
                                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all",
                                isSubActive
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                              )}
                            >
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300",
                                isSubActive ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" : "bg-slate-700 group-hover:bg-slate-500"
                              )} />
                              <span className="uppercase tracking-tight whitespace-nowrap">{child.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {isCollapsed && hasCategory && hoveredMenu?.id === item.id && (
                    <div
                      className='fixed left-[72px] w-[220px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden z-[999] animate-in fade-in slide-in-from-left-2 duration-200'
                      style={{ top: hoveredMenu.top }}
                      onMouseEnter={() => setHoveredMenu(hoveredMenu)}
                      onMouseLeave={() => setHoveredMenu(null)}
                    >
                      <div className="px-5 py-3 flex items-center justify-between border-b border-white/5 bg-slate-50/50 dark:bg-white/5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</span>
                        <ChevronRight size={12} className="text-slate-600" />
                      </div>
                      <div className="p-2 space-y-0.5">
                        {item.category?.map(cate => (
                          <Fragment key={cate.id}>
                            <div className='px-3 pt-4 pb-2 text-[8px] font-black text-slate-400 uppercase tracking-widest border-t first:border-t-0 border-slate-50 dark:border-slate-800'>{cate.label}</div>
                            {cate.children?.map(child => {
                              const isSubActive = isSubMenuActive(child.view);
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => {
                                    setView(child.view);
                                    setHoveredMenu(null);
                                  }}
                                  className={cn(
                                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all",
                                    isSubActive
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                                  )}
                                >
                                  <div className={cn(
                                    "w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300",
                                    isSubActive ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" : "bg-slate-700 group-hover:bg-slate-500"
                                  )} />
                                  <span className="uppercase tracking-tight whitespace-nowrap">{child.label}</span>
                                </button>
                              );
                            })}
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Fragment>
            );
          })}
        </nav>

        <div className="relative mb-2" ref={brandMenuRef}>
          <button
            onClick={() => setIsBrandMenuOpen(!isBrandMenuOpen)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300",
              "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50",
              isCollapsed && "justify-center"
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-emerald-500" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Chi nhánh</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{selectedChannel?.name || 'Đang tải...'}</p>
              </div>
            )}
            {!isCollapsed && <ChevronDown size={14} className={cn("text-slate-400 transition-transform", isBrandMenuOpen && "rotate-180")} />}
          </button>

          {isBrandMenuOpen && (
            <div className={cn(
              "absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-[110] overflow-hidden animate-in slide-in-from-bottom-2 duration-200",
              isCollapsed && "left-0 w-64"
            )}>
              <div className="p-2 space-y-1">
                {salesChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => {
                      dispatch(setSelectedSalesChannelId(channel.id));
                      setIsBrandMenuOpen(false);
                      if (onBrandChange) onBrandChange(channel.name);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-xs font-bold",
                      selectedSalesChannelId === channel.id
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                  >
                    <MapPin size={14} />
                    <span className="flex-1 text-left">{channel.name}</span>
                    {selectedSalesChannelId === channel.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t dark:border-slate-800 border-slate-200 space-y-2">
          <button
            onClick={toggleTheme}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
              isCollapsed && "justify-center"
            )}
          >
            {isDarkMode ? (
              <Sun size={20} className="text-amber-400" />
            ) : (
              <Moon size={20} className="text-slate-400" />
            )}
            {!isCollapsed && (
              <span className="text-xs font-medium">
                {isDarkMode ? 'Giao diện sáng' : 'Giao diện tối'}
              </span>
            )}
          </button>

        </div>
      </div>
    </>
  );
};
