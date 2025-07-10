// src/components/shared/Header.tsx
"use client"

import React from 'react';
import { Package, Bell, Search, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ModeToggle } from "@/components/ModeToggle";
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
    const pathname = usePathname();

    // Función para obtener el título según la ruta actual
    const getPageTitle = () => {
        if (pathname === '/') return 'Inicio';
        if (pathname === '/products') return 'Gestión de Productos';
        if (pathname.startsWith('/products/alerts')) return 'Alertas de Stock';
        if (pathname === '/reports') return 'Reportes y Análisis';
        if (pathname === '/movements') return 'Movimientos de Inventario';
        if (pathname === '/settings') return 'Configuración';
        return 'Sistema MRP';
    };

    return (
        <Card className="h-16 rounded-none border-b relative">
            <div className="flex items-center justify-between h-full px-6">
                {/* Título de la página */}
                <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
                </div>

                {/* Barra de búsqueda */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar en inventario..."
                            className="pl-9 w-full"
                        />
                    </div>
                </div>

                {/* Acciones rápidas */}
                <div className="flex items-center gap-2">
                    {/* Notificaciones */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-72">
                            <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="max-h-96 overflow-auto">
                                <DropdownMenuItem className="py-2 cursor-pointer">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium text-sm">Stock bajo: Motor eléctrico 2HP</span>
                                        <span className="text-xs text-muted-foreground">Hace 10 minutos</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="py-2 cursor-pointer">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium text-sm">Producto agotado: Válvula hidráulica</span>
                                        <span className="text-xs text-muted-foreground">Hace 2 horas</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="py-2 cursor-pointer">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium text-sm">Nueva orden de compra recibida: #12345</span>
                                        <span className="text-xs text-muted-foreground">Hace 1 día</span>
                                    </div>
                                </DropdownMenuItem>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex justify-center">
                                <span className="text-sm text-primary">Ver todas las notificaciones</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Ayuda */}
                    <Button variant="ghost" size="icon">
                        <HelpCircle className="h-5 w-5" />
                    </Button>

                    {/* Cambio de tema */}
                    <ModeToggle />
                </div>
            </div>
        </Card>
    );
}