// src/contexts/AuthContext.tsx
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, login as loginApi, logout as logoutApi, register as registerApi, getCurrentUser } from '@/utils/auth';
import { toast } from 'sonner';

// Definir interfaz para el contexto
interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, full_name: string) => Promise<boolean>;
}

// Crear contexto con valor inicial
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Props para el proveedor de contexto
interface AuthProviderProps {
  children: ReactNode;
}

// Proveedor de contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Efecto para cargar el usuario actual al montar el componente
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { user: userData, error } = await loginApi(email, password);

      if (error || !userData) {
        toast.error(error || 'Error al iniciar sesión');
        return false;
      }

      setUser(userData);
      toast.success('Sesión iniciada correctamente');
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      toast.error('Error al conectar con el servidor');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const success = await logoutApi();

      if (success) {
        setUser(null);
        toast.success('Sesión cerrada correctamente');
        router.push('/login');
      } else {
        toast.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error en logout:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para registrar nuevo usuario
  const register = async (email: string, password: string, full_name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { user: userData, error } = await registerApi(email, password, full_name);

      if (error || !userData) {
        toast.error(error || 'Error al registrar usuario');
        return false;
      }

      setUser(userData);
      toast.success('Usuario registrado correctamente');
      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      toast.error('Error al conectar con el servidor');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Valores que se proporcionarán a través del contexto
  const contextValue: AuthContextProps = {
    user,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
};