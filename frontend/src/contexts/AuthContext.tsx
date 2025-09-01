import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import apiClient from '../services/api';

// UserDto 타입 정의
interface User {
  id: string;
  name: string;
  userType: string;
  phone: string;
  address: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  checkLoginStatus: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiClient.post('/users/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
    }
  };

  const checkLoginStatus = async () => {
    setIsLoading(true);
    try {
      // 세션이 유효한지 확인하는 API (백엔드에 만들어야 함)
      const response = await apiClient.get<User>('/users/me');
      setUser(response.data);
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, checkLoginStatus, isLoading }}>{children}</AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
