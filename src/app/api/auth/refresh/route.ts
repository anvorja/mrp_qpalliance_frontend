// src/app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Ruta para refrescar el token de acceso
export async function GET(req: NextRequest) {
  const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') || '/';
  
  try {
    // Intentar refrescar el token
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // Pasar las cookies del cliente a la solicitud al backend
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!response.ok) {
      // Si no se pudo refrescar el token, redirigir al login
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', callbackUrl);
      return NextResponse.redirect(loginUrl);
    }

    // Si se refrescó correctamente, redirigir a la URL de callback
    const redirectUrl = new URL(callbackUrl, req.url);
    const nextResponse = NextResponse.redirect(redirectUrl);

    // Pasar las cookies de la respuesta del backend al cliente
    const backendSetCookieHeader = response.headers.get('set-cookie');
    if (backendSetCookieHeader) {
      nextResponse.headers.set('set-cookie', backendSetCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    console.error('Error al refrescar el token:', error);

    // En caso de error, redirigir al login
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', callbackUrl);
    return NextResponse.redirect(loginUrl);
  }
}