// src/components/shared/AuthHeader.tsx
"use client"

import React from 'react';
import { Package, Bell, Search, HelpCircle, LogOut, User } from 'lucide-react';
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
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthHeader() {
    const pathname = usePathname();
    const { user, logout, isLoading } = useAuth();

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

    // Función para obtener las iniciales del nombre del usuario
    const getUserInitials = () => {
        if (!user || !user.full_name) return 'U';

        const nameParts = user.full_name.split(' ');
        if (nameParts.length >= 2) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }

        return nameParts[0][0].toUpperCase();
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

                    {/* Perfil de usuario */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
                                {isLoading ? (
                                    <Skeleton className="w-8 h-8 rounded-full" />
                                ) : (
                                    <Avatar className="w-8 h-8">
                                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                                    </Avatar>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {isLoading ? (
                                <div className="px-2 py-1.5">
                                    <Skeleton className="w-full h-5" />
                                </div>
                            ) : (
                                <div className="px-2 py-1.5">
                                    <p className="text-sm font-medium">{user?.full_name}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                </div>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Perfil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => logout()}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Cerrar sesión</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </Card>
    );
}