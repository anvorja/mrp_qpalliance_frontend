// src/app/register/page.tsx
"use client"

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Componente para el formulario de registro
function RegisterForm() {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { register } = useAuth();
  const router = useRouter();

  // Validación de contraseña
  const passwordStrength = {
    length: password.length >= 8,
    number: /\d/.test(password),
    uppercase: /[A-Z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid =
    passwordStrength.length &&
    passwordStrength.number &&
    passwordStrength.uppercase &&
    passwordStrength.special;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!isPasswordValid) {
      setError('La contraseña no cumple con los requisitos mínimos');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(email, password, fullName);

      if (result) {
        router.push('/');
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
          <Label htmlFor="fullName">Nombre Completo</Label>
          <Input
            id="fullName"
            placeholder="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

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
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-medium">La contraseña debe contener:</p>
            <ul className="space-y-1">
              <li className="flex items-center">
                {passwordStrength.length ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                )}
                Al menos 8 caracteres
              </li>
              <li className="flex items-center">
                {passwordStrength.uppercase ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                )}
                Al menos una letra mayúscula
              </li>
              <li className="flex items-center">
                {passwordStrength.number ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                )}
                Al menos un número
              </li>
              <li className="flex items-center">
                {passwordStrength.special ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                )}
                Al menos un carácter especial
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !isPasswordValid || password !== confirmPassword}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            'Registrarse'
          )}
        </Button>

        <div className="text-center text-sm">
          ¿Ya tiene una cuenta?{' '}
          <Link
            href="/login"
            className="text-primary hover:underline"
          >
            Iniciar Sesión
          </Link>
        </div>
      </CardFooter>
    </form>
  );
}

// Componente principal con Suspense
export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-md font-bold text-xl">
              QP
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
          <CardDescription className="text-center">
            Ingrese sus datos para registrarse en el sistema
          </CardDescription>
        </CardHeader>

        <Suspense fallback={
          <CardContent className="h-[450px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        }>
          <RegisterForm />
        </Suspense>
      </Card>
    </div>
  );
}