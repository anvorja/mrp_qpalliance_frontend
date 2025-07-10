// src/app/login/page.tsx
"use client"

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Componente para manejar los parámetros de búsqueda
function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      if (result) {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado. Por favor, intente nuevamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              ¿Olvidó su contraseña?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </Button>

        <div className="text-center text-sm">
          ¿No tiene una cuenta?{' '}
          <Link
            href="/register"
            className="text-primary hover:underline"
          >
            Registrarse
          </Link>
        </div>
      </CardFooter>
    </form>
  );
}

// Componente principal con Suspense
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-md font-bold text-xl">
              QP
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Ingrese sus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>

        <Suspense fallback={
          <CardContent className="h-[320px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        }>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}