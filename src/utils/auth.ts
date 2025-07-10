// src/utils/auth.ts
import { jwtDecode } from "jwt-decode";

// Tipos para los datos de usuario y autenticación
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  last_login?: string;
}

export interface AuthToken {
  sub: string;
  type: 'access' | 'refresh';
  exp: number;
}

// Obtener el token de acceso de las cookies
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Obtener todos los cookies
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());

  // Buscar el cookie de access_token
  const accessTokenCookie = cookies.find(cookie => cookie.startsWith('access_token='));

  if (!accessTokenCookie) return null;

  return accessTokenCookie.split('=')[1];
};

// Verificar si el token de acceso es válido (no expirado)
export const isAccessTokenValid = (): boolean => {
  const accessToken = getAccessToken();

  if (!accessToken) return false;

  try {
    const decodedToken = jwtDecode<AuthToken>(accessToken);

    // Verificar si el token ha expirado
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) return false;

    // Verificar que sea un token de acceso
    return decodedToken.type === 'access';
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return false;
  }
};

// Obtener el usuario actual basado en el token
export const getCurrentUser = async (): Promise<User | null> => {
  // Verificar si estamos en el cliente
  if (typeof window === 'undefined') return null;

  // Verificar si el token es válido
  if (!isAccessTokenValid()) {
    // Intentar refrescar el token
    try {
      const refreshed = await refreshToken();
      if (!refreshed) return null;
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      return null;
    }
  }

  try {
    // Hacer la solicitud para obtener los datos del usuario
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
      method: 'GET',
      credentials: 'include', // Importante para incluir cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el perfil del usuario');
    }

    const userData = await response.json();
    return userData as User;
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
    return null;
  }
};

// Iniciar sesión
export const login = async (email: string, password: string): Promise<{ user: User | null; error?: string }> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
      method: 'POST',
      credentials: 'include', // Importante para recibir cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { user: null, error: data.error || 'Error al iniciar sesión' };
    }

    return { user: data.user };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { user: null, error: 'Error al conectar con el servidor' };
  }
};

// Registrar un nuevo usuario
export const register = async (email: string, password: string, full_name: string): Promise<{ user: User | null; error?: string }> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, full_name }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { user: null, error: data.error || 'Error al registrar usuario' };
    }

    return { user: data.user };
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return { user: null, error: 'Error al conectar con el servidor' };
  }
};

// Cerrar sesión
export const logout = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return false;
  }
};

// Refrescar el token de acceso
export const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error al refrescar el token:', error);
    return false;
  }
};