'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectIsAuthenticated, selectCurrentUser } from '@/store/selectors';
import { logoutFromMedusa } from '@/store/slices/authSlice';
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
import { Product } from '@/types/product';
import { NewsView } from './dashboards/News';
import { DiagnosisScreen } from './pages/DiagnosisScreen';
import { DiseaseDetailScreen } from './pages/DiseaseDetailScreen';
import { addToCart } from '@/store/slices/cartSlice';
import { useMedusaProducts } from '@/hooks';
import Category from './pages/Category';
import Collection from './pages/Collection';
import { AppLoading } from '@/components/AppLoading';
import { ProductTypes } from './pages/ProductTypes';
import { SalesChannels } from './pages/SalesChannels';
import { ProductTags } from './pages/ProductTags';
import { StockLocations } from './pages/StockLocations';

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

  // Render content based on current view
  const renderContent = () => {
    // View-based pages
    switch (currentView) {
      case 'POS':
        return <POS onBack={() => handleSetView('HOME')} />;
      case 'WHOLESALE_MARKETPLACE':
        return <WholesaleMarketplace role={user.role} />;
      case 'DATA_GROUPS':
        return <ProductTypes />;
      case 'MARKETPLACE':
        return <OrderHistory onGoToWholesale={() => handleSetView('WHOLESALE_MARKETPLACE')} />;
      case 'INVENTORY':
        return (
          <ProductCatalog
            onGoToWholesale={() => handleSetView('WHOLESALE_MARKETPLACE')}
          />
        );
      case 'CATEGORY':
        return <Category />;
      case 'COLLECTION':
        return <Collection />;
      case 'PRODUCT_TAGS':
        return <ProductTags />;
      case 'SALES_CHANNELS':
        return <SalesChannels />;
      case 'STOCK_LOCATIONS':
        return <StockLocations />;
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
    <div className={`relative min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex bg-surface-light dark:bg-surface-dark transition-colors duration-300 min-h-screen">
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
            title={user?.vendor ? user?.vendor?.name : 'Admin Console'}
            subtitle={user?.vendor ? user?.vendor?.address : undefined}
            role={user.role}
            onLogout={handleLogout}
            onGoToPOS={handleGoToPOS}
            onAIDiagnosis={() => handleSetView('AI_DIAGNOSIS')}
            onDiseaseLookup={handleDiseaseLookup}
            avatarUrl={user?.vendor?.logo || ""}
            onShowNotifications={handleShowNotifications}
          />

          <main className="flex-1 overflow-y-auto px-3 lg:px-8 py-4">
            {renderContent()}
          </main>
        </div>
      </div>

      {isGlobalLoading && (
        <AppLoading />
      )}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </div>
  );
}
