import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginWithHub, registerWithHub, logoutFromHub, clearError } from '@/store/slices/authSlice';
import { selectIsAuthenticated, selectCurrentUser, selectAuthLoading, selectAuthError } from '@/store/selectors';
import { LoginCredentials, RegisterData } from '@/lib/api/hub/authService';

export const useHubAuth = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const login = useCallback((credentials: LoginCredentials) => {
    return dispatch(loginWithHub(credentials));
  }, [dispatch]);

  const register = useCallback((data: RegisterData) => {
    return dispatch(registerWithHub(data));
  }, [dispatch]);

  const logout = useCallback(() => {
    return dispatch(logoutFromHub());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearAuthError
  };
};
