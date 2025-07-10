// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register', '/forgot-password'];


/*
// Rutas protegidas por roles
const roleProtectedRoutes = {
  admin: ['/settings'], // Solo los administradores pueden acceder a estas rutas
};
*/

interface JwtPayload {
  sub: string;
  type: string;
  exp: number;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si la ruta requiere autenticación
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Si es ruta de API, no aplicar middleware (las API manejan su propia autenticación)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Si es ruta pública, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Obtener token de acceso de las cookies
  const accessToken = request.cookies.get('access_token')?.value;

  // Si no hay token de acceso, redirigir al login
  if (!accessToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  try {
    // Decodificar token para verificar expiración y tipo
    const decodedToken = jwtDecode<JwtPayload>(accessToken);

    // Verificar si el token ha expirado
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      // Intentar usar el refresh token
      const refreshToken = request.cookies.get('refresh_token')?.value;

      if (!refreshToken) {
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', encodeURI(pathname));
        return NextResponse.redirect(url);
      }

      // Redirigir a la página actual, lo que debería activar el refresh del token
      // en el lado del cliente en AuthContext
      const url = new URL('/api/auth/refresh', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    // Verificar que sea un token de acceso
    if (decodedToken.type !== 'access') {
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }

    // Verificar si la ruta requiere un rol específico
    // Nota: En una implementación real, el token también contendría el rol del usuario

    // Todo está bien, continuar con la solicitud
    return NextResponse.next();
  } catch (error) {
    console.error('Error validando token:', error);

    // Error al decodificar el token, redirigir al login
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  // Aplicar middleware a todas las rutas excepto archivos estáticos
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};