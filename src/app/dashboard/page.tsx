'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectIsAuthenticated, selectCurrentUser } from '@/store/selectors';
import { logout, logoutFromMedusa } from '@/store/slices/authSlice';
import { setView, toggleSidebar, toggleTheme } from '@/store/slices/uiSlice';
import { selectIsSidebarCollapsed, selectIsDarkMode, selectCurrentView } from '@/store/selectors';
import { UserRole } from '@/types/enum';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/NavBar';
import { NotificationModal } from '@/components/NotificationModal';

// Import role-specific dashboards
import RetailerDashboard from './dashboards/RetailerDashboard';
import SellerDashboard from './dashboards/SellerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

// Import pages
import WholesaleMarketplace from './pages/WholesaleMarketplace';
import OrderHistory from './pages/OrderHistory';
import ProductCatalog from './pages/ProductCatalog';
import RetailOrders from './pages/RetailOrders';
import StockCheck from './pages/StockCheck';
import StockDisposal from './pages/StockDisposal';
import Cashbook from './pages/Cashbook';
import Customers from './pages/Customers';
import Pricing from './pages/Pricing';
import Promotions from './pages/Promotions';
import POS from './pages/pos/POS';
import { Loader2, Zap } from 'lucide-react';
import { Product } from '@/types/product';
import { NewsView } from './dashboards/News';
import { DiagnosisScreen } from './pages/DiagnosisScreen';
import { DiseaseDetailScreen } from './pages/DiseaseDetailScreen';
import { addToCart } from '@/store/slices/cartSlice';
import { useMedusaProducts } from '@/hooks';
import { B2COrder } from '@/types/order';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const currentView = useAppSelector(selectCurrentView);
  const isSidebarCollapsed = useAppSelector(selectIsSidebarCollapsed);
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  const { products: medusaProducts, loading: medusaLoading } = useMedusaProducts({ autoFetch: true });

  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  const [b2cHistory, setB2cHistory] = useState<B2COrder[]>([]);

  useEffect(() => {
    if (medusaProducts.length > 0) {
      const saved = localStorage.getItem('retail_inventory');
      if (saved) {
        setLocalProducts(JSON.parse(saved));
      } else {
        setLocalProducts(medusaProducts);
      }
    }
  }, [medusaProducts]);

  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedNewsArticleId, setSelectedNewsArticleId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-300 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = useCallback(() => {
    dispatch(logoutFromMedusa());
    router.push('/login');
  }, [dispatch, router]);

  const handleBrandChange = useCallback((newBrand: string) => {
    setIsGlobalLoading(true);
    setTimeout(() => {
      setIsGlobalLoading(false);
    }, 1500);
  }, []);

  const handleSetView = useCallback((view: any) => {
    dispatch(setView(view));
  }, [dispatch]);

  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const handleToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const handleGoToPOS = useCallback(() => {
    dispatch(setView('POS'));
  }, [dispatch]);

  const handleShowNotifications = useCallback(() => {
    setIsNotificationModalOpen(true);
  }, []);

  const handleSelectNewsArticle = (id: string) => {
    setSelectedNewsArticleId(id);
    handleSetView('NEWS');
  };

  const handleSelectDisease = (id: string) => {
    setSelectedDiseaseId(id);
    handleSetView('DISEASE_DETAIL');
  };

  const handleDiseaseLookup = () => {
    setSelectedDiseaseId(null);
    handleSetView('DISEASE_DETAIL');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handlePOSOrder = (order: B2COrder) => {
    setB2cHistory([order, ...b2cHistory]);
  };

  // Render content based on current view
  const renderContent = () => {
    // View-based pages
    switch (currentView) {
      case 'POS':
        return <POS onBack={() => handleSetView('HOME')} onCompleteOrder={handlePOSOrder} b2cHistory={b2cHistory} />;
      case 'WHOLESALE_MARKETPLACE':
        return <WholesaleMarketplace role={user.role} />;
      case 'MARKETPLACE':
        return <OrderHistory onGoToWholesale={() => handleSetView('WHOLESALE_MARKETPLACE')} />;
      case 'INVENTORY':
        return (
          <ProductCatalog
            onGoToWholesale={() => handleSetView('WHOLESALE_MARKETPLACE')}
          />
        );
      case 'NEWS':
        return (
          <NewsView
            initialArticleId={selectedNewsArticleId}
            onBack={() => {
              setSelectedNewsArticleId(null);
              handleSetView('HOME');
            }}
            isAdmin={user.role === UserRole.ADMIN}
          />
        );
      case 'DISEASE_DETAIL':
        return (
          <DiseaseDetailScreen
            id={selectedDiseaseId}
            onBack={() => handleSetView('HOME')}
            onProductClick={handleProductClick}
            onAddToCart={(product, config) => {
              dispatch(addToCart({
                product,
                quantity: config.quantity || 1,
                unit: 'Thùng',
                price: 0
              }));
            }}
          />
        );
      case 'CATALOG':
        return <RetailOrders />;
      case 'STOCK_CHECK':
        return <StockCheck localProducts={localProducts} />;
      case 'STOCK_DISPOSAL':
        return <StockDisposal localProducts={localProducts} />;
      case 'CASHBOOK':
        return <Cashbook />;
      case 'CUSTOMERS':
        return <Customers />;
      case 'PRICING':
        return <Pricing />;
      case 'PROMOTIONS':
        return <Promotions />;
      case 'AI_DIAGNOSIS':
        return (
          <DiagnosisScreen
            onBack={() => handleSetView('HOME')}
            onProductClick={handleProductClick}
            onAddToCart={(product, config) => {
              dispatch(addToCart({
                product,
                quantity: config.quantity || 1,
                unit: 'Thùng',
                price: 0
              }));
            }}
          />
        );
      case 'HOME':
      default:
        // Render role-based dashboard for HOME view
        switch (user.role) {
          case UserRole.RETAILER:
            return (
              <RetailerDashboard
                onSelectNewsArticle={handleSelectNewsArticle}
                onSelectDisease={handleSelectDisease}
                onProductClick={handleProductClick}
                onViewAllNews={() => {
                  setSelectedNewsArticleId(null);
                  handleSetView('NEWS');
                }}
                onDiagnose={() => handleSetView('AI_DIAGNOSIS')}
                onGoToPOS={handleGoToPOS}
              />
            );
          case UserRole.SELLER:
            return <SellerDashboard />;
          case UserRole.ADMIN:
            return <AdminDashboard />;
          default:
            return (
              <RetailerDashboard
                onSelectNewsArticle={handleSelectNewsArticle}
                onSelectDisease={handleSelectDisease}
                onProductClick={handleProductClick}
                onViewAllNews={() => {
                  setSelectedNewsArticleId(null);
                  handleSetView('NEWS');
                }}
                onDiagnose={() => handleSetView('AI_DIAGNOSIS')}
                onGoToPOS={handleGoToPOS}
              />
            );
        }
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex bg-surface-light dark:bg-surface-dark transition-colors duration-300">
        <Sidebar
          currentView={currentView}
          setView={handleSetView}
          role={user.role}
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={handleToggleSidebar}
          isDarkMode={isDarkMode}
          toggleTheme={handleToggleTheme}
          onBrandChange={handleBrandChange}
        />

        <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <Header
            title={user.role === UserRole.RETAILER ? 'Đại lý Anh Bửu' : user.role === UserRole.SELLER ? 'NPP Hoàng Gia' : 'Admin Console'}
            subtitle={user.role === UserRole.RETAILER ? 'Đồng Tháp' : undefined}
            role={user.role}
            onLogout={handleLogout}
            onGoToPOS={handleGoToPOS}
            onAIDiagnosis={() => handleSetView('AI_DIAGNOSIS')}
            onDiseaseLookup={handleDiseaseLookup}
            avatarUrl={user.avatarUrl}
            onShowNotifications={handleShowNotifications}
          />

          <main className="p-8">
            {renderContent()}
          </main>
        </div>
      </div>

      {isGlobalLoading && (
        <div className="absolute inset-0 z-[1000] bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center animate-fade-in">
          <div className="relative mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 animate-pulse">
              <Zap size={48} className="text-white" fill="currentColor" />
            </div>
            <div className="absolute -inset-4 border-2 border-primary/20 rounded-full animate-[spin_3s_linear_infinite]" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">Đang đồng bộ dữ liệu</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-2">
              Vui lòng chờ trong giây lát <Loader2 size={16} className="animate-spin" />
            </p>
          </div>
        </div>
      )}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </div>
  );
}
