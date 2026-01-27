# Modal Component - Reusable Modal System

## 📦 Overview

A highly reusable, accessible modal component with dark theme glassmorphism design. Built for the SDRP Platform with Next.js 15 and TypeScript.

---

## 🎨 Features

✅ **Dark Theme** - Slate-900 background with border  
✅ **Glassmorphism** - Backdrop blur effect  
✅ **Animations** - Fade in + slide down  
✅ **Accessibility** - ARIA labels, keyboard support  
✅ **Portal Rendering** - Renders in `#modal-root`  
✅ **Customizable** - Icon, colors, size, footer  
✅ **Auto-scroll Lock** - Prevents body scroll when open  
✅ **ESC to Close** - Keyboard navigation  
✅ **Click Outside** - Close on backdrop click  

---

## 📋 Props

```typescript
interface ModalProps {
  isOpen: boolean;              // Control modal visibility
  onClose: () => void;          // Close handler
  title: string;                // Modal title
  icon?: LucideIcon;            // Optional header icon
  iconColor?: string;           // Icon color (Tailwind class)
  iconBgColor?: string;         // Icon background (Tailwind class)
  children: ReactNode;          // Modal content
  footer?: ReactNode;           // Optional footer content
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';  // Modal width
  showCloseButton?: boolean;    // Show/hide X button
}
```

---

## 🚀 Usage Examples

### Basic Modal

```tsx
import { Modal } from '@/components/Modal';
import { Bell } from 'lucide-react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Modal"
      >
        <div className="p-6">
          <p className="text-white">Modal content goes here</p>
        </div>
      </Modal>
    </>
  );
}
```

### Modal with Icon

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Notifications"
  icon={Bell}
  iconColor="text-emerald-500"
  iconBgColor="bg-emerald-500/20"
>
  <div className="p-6">
    <p className="text-white">Your notifications</p>
  </div>
</Modal>
```

### Modal with Footer

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  footer={
    <div className="flex gap-3">
      <button
        onClick={() => setIsOpen(false)}
        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
      >
        Cancel
      </button>
      <button
        onClick={handleConfirm}
        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
      >
        Confirm
      </button>
    </div>
  }
>
  <div className="p-6">
    <p className="text-white">Are you sure?</p>
  </div>
</Modal>
```

### Different Sizes

```tsx
// Small modal
<Modal maxWidth="sm" {...props}>...</Modal>

// Medium modal (default)
<Modal maxWidth="md" {...props}>...</Modal>

// Large modal
<Modal maxWidth="lg" {...props}>...</Modal>

// Extra large
<Modal maxWidth="xl" {...props}>...</Modal>

// 2X large
<Modal maxWidth="2xl" {...props}>...</Modal>
```

### Without Close Button

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Loading..."
  showCloseButton={false}
>
  <div className="p-6 text-center">
    <div className="animate-spin w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full mx-auto" />
  </div>
</Modal>
```

---

## 🎨 Styling Guide

### Content Padding

The modal content area has `max-h-[60vh]` with overflow scroll. Add padding to your content:

```tsx
<Modal {...props}>
  <div className="p-4">
    {/* Your content */}
  </div>
</Modal>
```

### Footer Styling

Footer is automatically styled with border-top and padding. Just provide content:

```tsx
footer={
  <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl">
    Close
  </button>
}
```

### Custom Icon Colors

Use any Tailwind color class:

```tsx
// Success (Green)
iconColor="text-emerald-500"
iconBgColor="bg-emerald-500/20"

// Error (Red)
iconColor="text-red-500"
iconBgColor="bg-red-500/20"

// Warning (Amber)
iconColor="text-amber-500"
iconBgColor="bg-amber-500/20"

// Info (Blue)
iconColor="text-blue-500"
iconBgColor="bg-blue-500/20"
```

---

## 🔧 Advanced Examples

### Scrollable Content

```tsx
<Modal {...props}>
  <div className="p-4 space-y-4">
    {items.map(item => (
      <div key={item.id} className="bg-slate-800 rounded-xl p-4">
        {item.content}
      </div>
    ))}
  </div>
</Modal>
```

### Form Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Add New Item"
  icon={Plus}
  footer={
    <div className="flex gap-3">
      <button onClick={() => setIsOpen(false)} className="flex-1 btn-secondary">
        Cancel
      </button>
      <button onClick={handleSubmit} className="flex-1 btn-primary">
        Save
      </button>
    </div>
  }
>
  <form className="p-6 space-y-4">
    <div>
      <label className="text-sm font-bold text-slate-300">Name</label>
      <input type="text" className="input w-full mt-2" />
    </div>
    <div>
      <label className="text-sm font-bold text-slate-300">Description</label>
      <textarea className="input w-full mt-2" rows={4} />
    </div>
  </form>
</Modal>
```

### Confirmation Modal

```tsx
<Modal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  title="Delete Item"
  icon={Trash2}
  iconColor="text-red-500"
  iconBgColor="bg-red-500/20"
  maxWidth="sm"
  footer={
    <div className="flex gap-3">
      <button
        onClick={() => setIsDeleteModalOpen(false)}
        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
      >
        Cancel
      </button>
      <button
        onClick={handleDelete}
        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
      >
        Delete
      </button>
    </div>
  }
>
  <div className="p-6">
    <p className="text-slate-300">
      Are you sure you want to delete this item? This action cannot be undone.
    </p>
  </div>
</Modal>
```

---

## 🎯 Real-World Example: NotificationModal

```tsx
'use client';

import { Bell } from 'lucide-react';
import { Modal } from './Modal';

export function NotificationModal({ isOpen, onClose }) {
  const notifications = useAppSelector(selectNotifications);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thông báo"
      icon={Bell}
      iconColor="text-emerald-500"
      iconBgColor="bg-emerald-500/20"
      footer={
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl uppercase"
        >
          Đóng
        </button>
      }
    >
      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={48} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Không có thông báo mới</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="bg-slate-800/50 rounded-2xl p-4">
              {/* Notification content */}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
```

---

## ♿ Accessibility

The Modal component follows accessibility best practices:

- **ARIA Labels**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **Keyboard Navigation**: ESC key closes modal
- **Focus Management**: Auto-focus on open (future enhancement)
- **Screen Reader**: Proper semantic HTML structure
- **Backdrop**: `aria-hidden="true"` on backdrop

---

## 🔒 Body Scroll Lock

The modal automatically prevents body scrolling when open:

```tsx
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
  
  return () => {
    document.body.style.overflow = 'unset';
  };
}, [isOpen]);
```

---

## 🎨 Design Tokens

### Colors

```css
Background: bg-slate-900 dark:bg-slate-950
Border: border-slate-800
Backdrop: bg-black/60 backdrop-blur-sm
Text: text-white
```

### Spacing

```css
Header Padding: p-6
Content Max Height: max-h-[60vh]
Footer Padding: p-4
Border Radius: rounded-3xl
```

### Animations

```css
Backdrop: animate-fade-in
Modal: animate-slide-down
```

---

## 📦 Dependencies

- `react` - Portal and hooks
- `react-dom` - createPortal
- `lucide-react` - Icons
- `tailwindcss` - Styling

---

## 🐛 Troubleshooting

### Modal not showing

**Issue**: Modal doesn't appear  
**Solution**: Ensure `#modal-root` exists in your layout:

```tsx
// app/layout.tsx
<body>
  {children}
  <div id="modal-root" />
</body>
```

### Scroll not locked

**Issue**: Can still scroll page when modal is open  
**Solution**: Modal automatically handles this. Check if multiple modals are open.

### ESC key not working

**Issue**: ESC doesn't close modal  
**Solution**: Ensure modal is focused. Check for event listener conflicts.

---

## 🚀 Future Enhancements

- [ ] Auto-focus first interactive element
- [ ] Focus trap (tab navigation stays in modal)
- [ ] Animation variants (slide from bottom, zoom, etc.)
- [ ] Stacking support (multiple modals)
- [ ] Custom backdrop color/blur
- [ ] Mobile-optimized (full screen on mobile)

---

## 📚 Related Components

- `NotificationModal` - Uses Modal for notifications
- `ProductModal` - Can be refactored to use Modal
- Future modals should all use this base component

---

**Built with ❤️ for SDRP Platform**
