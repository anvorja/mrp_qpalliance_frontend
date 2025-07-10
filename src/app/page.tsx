// src/app/page.tsx
"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, AlertTriangle, BarChart3, Clipboard, Settings } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-6">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-2xl">Sistema de Gestión de Inventario</CardTitle>
          <CardDescription>
            Módulo de inventario para el sistema MRP de QPAlliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Este módulo le permite gestionar su inventario de manera eficiente, monitorear niveles de stock,
            y recibir alertas cuando los productos estén por debajo del stock mínimo.
          </p>
          <p>
            Seleccione una de las opciones a continuación para comenzar:
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Productos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos
            </CardTitle>
            <CardDescription>
              Gestione el catálogo completo de productos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Vea, agregue, edite y elimine productos de su inventario. Mantenga un registro actualizado
              de todos los productos disponibles.
            </p>
          </CardContent>
          <div className="p-4 pt-0">
            <Link href="/products" className="w-full">
              <Button className="w-full">
                Ver productos
              </Button>
            </Link>
          </div>
        </Card>

        {/* Tarjeta de Alertas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Stock
            </CardTitle>
            <CardDescription>
              Visualización de productos con stock bajo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Identifique rápidamente los productos que están por debajo del nivel mínimo de stock
              y requieren reposición inmediata.
            </p>
          </CardContent>
          <div className="p-4 pt-0">
            <Link href="/products/alerts" className="w-full">
              <Button className="w-full">
                Ver alertas
              </Button>
            </Link>
          </div>
        </Card>

        {/* Tarjeta de Reportes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Reportes
            </CardTitle>
            <CardDescription>
              Análisis y estadísticas de inventario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Acceda a reportes y gráficos detallados sobre la rotación de inventario,
              productos más solicitados y tendencias de stock.
            </p>
          </CardContent>
          <div className="p-4 pt-0">
            <Link href="/reports" className="w-full">
              <Button className="w-full">
                Ver reportes
              </Button>
            </Link>
          </div>
        </Card>

        {/* Tarjeta de Movimientos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clipboard className="h-5 w-5" />
              Movimientos
            </CardTitle>
            <CardDescription>
              Registro de entradas y salidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Lleve un control detallado de todos los movimientos de inventario,
              incluyendo entradas, salidas y transferencias entre ubicaciones.
            </p>
          </CardContent>
          <div className="p-4 pt-0">
            <Link href="/movements" className="w-full">
              <Button className="w-full">
                Ver movimientos
              </Button>
            </Link>
          </div>
        </Card>

        {/* Tarjeta de Configuración */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración
            </CardTitle>
            <CardDescription>
              Ajustes del módulo de inventario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure las opciones del sistema de inventario, como categorías de productos,
              ubicaciones de almacenamiento y reglas de alertas.
            </p>
          </CardContent>
          <div className="p-4 pt-0">
            <Link href="/settings" className="w-full">
              <Button className="w-full">
                Configurar
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}