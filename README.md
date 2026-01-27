# SDRP Platform - Project Summary

## 🎯 Project Overview

**SDRP Platform** là một hệ thống quản lý nội dung (CMS) cấp doanh nghiệp được xây dựng với Next.js 15, TypeScript, Redux Toolkit, và Tailwind CSS. Hệ thống hỗ trợ 3 vai trò người dùng với dashboard tùy chỉnh cho từng vai trò.

---

## 🏗️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js (App Router) | 15.1.4 |
| **Language** | TypeScript | Latest |
| **State Management** | Redux Toolkit | Latest |
| **Styling** | Tailwind CSS | Latest |
| **UI Components** | Custom + Lucide Icons | - |
| **Fonts** | Google Fonts (Inter) | - |

---

## 👥 User Roles

### 1. RETAILER (Đại lý bán lẻ)
- **Dashboard Features:**
  - AI Diagnosis (Chẩn đoán AI)
  - Flash Sale B2B
  - Quick Actions (Giám hàng sỉ, Lịch sử nhập, etc.)
  - Recent Activity Feed

### 2. SELLER (NPP - Nhà phân phối)
- **Dashboard Features:**
  - Business Metrics (Doanh số, KPI, Đại lý, Tồn kho)
  - Promotional Campaigns
  - Activity Timeline
  - Notes Section

### 3. ADMIN (Quản trị viên)
- **Dashboard Features:**
  - System Control Center
  - GMV & Performance Metrics
  - Regional Performance Charts
  - Master Data Management

---

## 📂 Project Structure

```
frontend-nextjs-cms/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage (auto-redirect)
│   │   ├── login/
│   │   │   └── page.tsx                # Login page
│   │   ├── dashboard/
│   │   │   ├── page.tsx                # Dashboard router
│   │   │   └── dashboards/
│   │   │       ├── RetailerDashboard.tsx
│   │   │       ├── SellerDashboard.tsx
│   │   │       └── AdminDashboard.tsx
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Global styles
│   │   └── not-found.tsx               # 404 page
│   ├── components/
│   │   ├── providers/
│   │   │   └── ReduxProvider.tsx       # Redux wrapper
│   │   ├── guards/
│   │   │   └── AuthGuard.tsx           # Route protection
│   │   ├── Button.tsx                  # Button component
│   │   ├── Card.tsx                    # Card component
│   │   ├── NavBar.tsx                  # Header component
│   │   ├── Sidebar.tsx                 # Sidebar navigation
│   │   └── ProductModal.tsx            # Product modal
│   ├── store/
│   │   ├── index.ts                    # Store config
│   │   ├── hooks.ts                    # Typed hooks
│   │   ├── slices/
│   │   │   ├── authSlice.ts           # Auth state
│   │   │   ├── cartSlice.ts           # Cart state
│   │   │   ├── uiSlice.ts             # UI state
│   │   │   └── productsSlice.ts       # Products state
│   │   └── selectors/
│   │       └── index.ts                # Reusable selectors
│   ├── types/
│   │   ├── enum.ts                     # UserRole enum
│   │   ├── product.ts                  # Product types
│   │   └── view-state.ts               # View state types
│   ├── lib/
│   │   └── utils.ts                    # Utility functions
│   └── middleware.ts                   # Next.js middleware
├── public/                             # Static assets
├── tailwind.config.ts                  # Tailwind config
├── tsconfig.json                       # TypeScript config
├── next.config.ts                      # Next.js config
├── package.json                        # Dependencies
├── README.md                           # Main documentation
├── REDUX_GUIDE.md                      # Redux usage guide
├── LOGIN_GUIDE.md                      # Login implementation
└── ROUTING_GUIDE.md                    # Routing & auth flow
```

---

## 🔄 Application Flow

```
┌─────────────────────────────────────────────────────────┐
│                    USER VISITS /                        │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │ Check Auth     │
         │ State          │
         └────┬───────┬───┘
              │       │
    Not Auth  │       │  Authenticated
              │       │
              ▼       ▼
      ┌───────────┐ ┌──────────────┐
      │  /login   │ │  /dashboard  │
      └─────┬─────┘ └──────┬───────┘
            │              │
            │              ▼
            │      ┌───────────────┐
            │      │ Role-Based    │
            │      │ Dashboard     │
            │      └───┬───┬───┬───┘
            │          │   │   │
            │          ▼   ▼   ▼
            │       Ret Sel Adm
            │
            ▼
    ┌──────────────┐
    │ Enter Creds  │
    │ Select Role  │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │ Redux Login  │
    │ Save to LS   │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  /dashboard  │
    └──────────────┘
```

---

## 🎨 Design System

### Color Palette

```css
Primary (Blue):   #0ea5e9 → #0284c7
Secondary (Purple): #a855f7 → #9333ea
Accent (Orange):  #f97316 → #ea580c
Emerald (Green):  #10b981 → #059669
Dark (Slate):     #0f172a → #020617
```

### Typography

- **Font Family:** Inter (Google Fonts)
- **Headings:** font-display (Inter)
- **Body:** font-sans (Inter)

### Components

- **Glassmorphism:** `glass` utility class
- **Buttons:** `.btn-primary`, `.btn-secondary`
- **Cards:** `.card-hover` with hover effects
- **Inputs:** `.input` with focus states

---

## 🔐 Authentication

### Demo Credentials

```
Email: demo@sdrp.com
Password: demo123
Roles: RETAILER | SELLER | ADMIN
```

### State Management

- **Redux Toolkit** for global state
- **Redux Persist** for localStorage sync
- **Typed Hooks** for TypeScript safety

### Protected Routes

- `/dashboard` - Requires authentication
- Auto-redirect to `/login` if not authenticated

---

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Access Application

```
Development: http://localhost:3000
Production: http://localhost:3000 (after build)
```

### Test Flow

1. Visit `http://localhost:3000`
2. Auto-redirect to `/login`
3. Enter demo credentials
4. Select role (Retailer/Seller/Admin)
5. Click "Sign In"
6. Redirected to `/dashboard`
7. See role-specific dashboard

---

## 📊 Redux State Structure

```typescript
{
  auth: {
    isAuthenticated: boolean,
    user: {
      id: string,
      name: string,
      email: string,
      role: UserRole,
      avatarUrl?: string
    },
    token: string
  },
  cart: {
    items: CartItem[],
    total: number,
    mode: 'RETAIL' | 'WHOLESALE'
  },
  ui: {
    currentView: ViewState,
    isSidebarCollapsed: boolean,
    isDarkMode: boolean,
    selectedBranch: string,
    notifications: Notification[]
  },
  products: {
    items: Product[],
    filteredItems: Product[],
    searchQuery: string,
    selectedCategory: string,
    isLoading: boolean,
    error: string
  }
}
```

---

## 📝 Key Features

✅ **Role-Based Dashboards** - 3 unique dashboards for different user roles  
✅ **Redux State Management** - Centralized state with persistence  
✅ **Authentication Flow** - Login, logout, session management  
✅ **Dark Mode Support** - Toggle between light/dark themes  
✅ **Responsive Design** - Mobile-first, works on all devices  
✅ **Glassmorphism UI** - Modern, premium design aesthetic  
✅ **TypeScript Strict Mode** - Full type safety  
✅ **Next.js 15 App Router** - Latest Next.js features  

---

## 🛠️ Development Tools

- **ESLint** - Code linting (currently disabled in build)
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first styling
- **Redux DevTools** - State debugging (dev mode)

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `README.md` | Main project documentation |
| `REDUX_GUIDE.md` | Redux Toolkit usage guide |
| `LOGIN_GUIDE.md` | Login implementation details |
| `ROUTING_GUIDE.md` | Authentication & routing flow |

---

## 🎯 Next Steps (Recommendations)

1. **API Integration** - Connect to backend services
2. **Chart Libraries** - Add Chart.js or Recharts for data visualization
3. **Form Validation** - Implement Zod or Yup schemas
4. **Testing** - Add Jest + React Testing Library
5. **E2E Tests** - Playwright or Cypress
6. **CI/CD** - GitHub Actions or Vercel deployment
7. **Error Tracking** - Sentry integration
8. **Analytics** - Google Analytics or Mixpanel

---

## 📞 Support

For questions or issues, refer to the documentation files or contact the development team.

---

**Built with ❤️ using Next.js 15, Redux Toolkit, and Tailwind CSS**