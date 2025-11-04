import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type User = {
  userId : number,
  user_name: string,
  first_name: string,
  last_name: string,
  profile_img: string,
  pin: string,
  balance: number;
  birthday: string;
};

type AuthContextType = {
  user : User | null,
  isLoggedIn: boolean;
  login: (userData : User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
});
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true'
  });

  const login = (userData : User) => {
    setUser(userData);
    setIsLoggedIn(true);  
    localStorage.setItem('isLoggedIn','true');
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const logout = () =>{ 
    setUser(null)
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn','false')
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
