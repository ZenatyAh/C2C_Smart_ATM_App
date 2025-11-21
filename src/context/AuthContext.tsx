import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type {AuthContextType} from '../utils/types'


const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true'
  });

  const login = () => {
    setIsLoggedIn(true)
    localStorage.setItem('isLoggedIn','true')
  };
  const logout = () =>{ 
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn','false')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
