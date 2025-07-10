// src/app/forgot-password/page.tsx
"use client"

import React, { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-md font-bold text-xl">
              QP
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Recuperar Contraseña</CardTitle>
          <CardDescription className="text-center">
            Esta función estará disponible próximamente
          </CardDescription>
        </CardHeader>

        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
          <CardContent className="space-y-4 py-4">
            <p className="text-center text-muted-foreground py-8">
              La funcionalidad de recuperación de contraseña estará disponible en futuras actualizaciones.
            </p>

            <div className="flex justify-center">
              <Link href="/login">
                <Button>Volver al inicio de sesión</Button>
              </Link>
            </div>
          </CardContent>
        </Suspense>
      </Card>
    </div>
  );
}