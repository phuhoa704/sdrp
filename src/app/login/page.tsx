'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginWithMedusa } from '@/store/slices/authSlice';
import { addNotification } from '@/store/slices/uiSlice';
import { UserRole } from '@/types/enum';
import { LogIn, Mail, Lock, User, Zap, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error: authError } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.RETAILER);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      // Real Medusa.js authentication
      const result = await dispatch(loginWithMedusa({ email, password })).unwrap();

      // Add welcome notification
      dispatch(addNotification({
        message: `Chào mừng ${result.user.name}! Đăng nhập thành công.`,
        type: 'success',
      }));

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  const roles = [
    {
      value: UserRole.RETAILER,
      label: 'Retailer',
      icon: <div className="bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-[28px] text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
        <Zap size={40} className='fill-emerald-600 dark:fill-emerald-400' />
      </div>,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      value: UserRole.SELLER,
      label: 'Seller',
      icon: <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-[28px] text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
        <Zap size={40} className='fill-blue-600 dark:fill-blue-400' />
      </div>,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      value: UserRole.ADMIN,
      label: 'Admin',
      icon: <div className="bg-purple-100 dark:bg-purple-900/30 p-6 rounded-[28px] text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
        <Zap size={40} className='fill-purple-600 dark:fill-purple-400' />
      </div>,
      color: 'from-purple-500 to-pink-600'
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              Agricultural Tech Hub
            </span>
            <Zap size={14} className='text-amber-500 animate-pulse' />
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-800 dark:text-white tracking-tight leading-[0.9]">
            SDRP<br />
            <div className="text-emerald-600 font-semibold">Platform</div>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg md:text-xl max-w-lg mx-auto">
            Hệ thống kết nối chuỗi cung ứng và bán lẻ nông nghiệp thông minh
          </p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/10 mt-8">

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-dark-200 flex items-center gap-2">
                <Mail size={16} className="text-primary-400" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="input w-full pl-4 pr-4"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-dark-200 flex items-center gap-2">
                <Lock size={16} className="text-primary-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input w-full pl-4 pr-4"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {(error || authError) && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400 font-medium">{error || authError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-14 text-base font-black flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-dark-400">
            Don't have an account?{' '}
            <button className="text-primary-400 font-bold hover:text-primary-300 transition-colors">
              Contact Admin
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
