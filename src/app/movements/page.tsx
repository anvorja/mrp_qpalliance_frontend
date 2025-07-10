// src/app/movements/page.tsx
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    ClipboardList, Plus, ArrowUpRight, ArrowDownRight, RotateCcw,
    Search, Filter, Download, FileText,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from "react-day-picker";

interface Movement {
    id: number;
    date: string;
    type: string;
    product: string;
    code: string;
    quantity: number;
    resultingStock: number;
    user: string;
    reference: string;
    notes: string;
}

interface NewMovement {
    type: string;
    productId: string;
    quantity: number;
    reference: string;
    notes: string;
}

// Formatear fecha
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

const mockMovements = [
    {
        id: 1,
        date: '2025-04-20T14:30:00Z',
        type: 'in',
        product: 'Motor eléctrico 2HP',
        code: 'P001',
        quantity: 10,
        resultingStock: 25,
        user: 'María López',
        reference: 'OC-12345',
        notes: 'Recepción de orden de compra #12345'
    },
    {
        id: 2,
        date: '2025-04-18T09:15:00Z',
        type: 'out',
        product: 'Sensores de proximidad',
        code: 'P002',
        quantity: 15,
        resultingStock: 30,
        user: 'Carlos Gómez',
        reference: 'OP-78901',
        notes: 'Entrega para orden de producción #78901'
    },
    {
        id: 3,
        date: '2025-04-17T11:20:00Z',
        type: 'adjustment',
        product: 'Placa base industrial',
        code: 'P003',
        quantity: 2,
        resultingStock: 10,
        user: 'Ana Martínez',
        reference: 'INV-001',
        notes: 'Ajuste por inventario físico'
    },
    {
        id: 4,
        date: '2025-04-15T16:45:00Z',
        type: 'out',
        product: 'Válvula hidráulica',
        code: 'P004',
        quantity: 5,
        resultingStock: 15,
        user: 'Pedro Sánchez',
        reference: 'OP-78902',
        notes: 'Entrega para orden de producción #78902'
    },
    {
        id: 5,
        date: '2025-04-14T10:30:00Z',
        type: 'in',
        product: 'Cinta transportadora',
        code: 'P005',
        quantity: 2,
        resultingStock: 4,
        user: 'María López',
        reference: 'OC-12346',
        notes: 'Recepción parcial de orden de compra #12346'
    },
    {
        id: 6,
        date: '2025-04-13T08:20:00Z',
        type: 'out',
        product: 'Rodamiento industrial',
        code: 'P006',
        quantity: 20,
        resultingStock: 48,
        user: 'Carlos Gómez',
        reference: 'OP-78903',
        notes: 'Entrega para mantenimiento de línea #2'
    },
    {
        id: 7,
        date: '2025-04-10T13:15:00Z',
        type: 'adjustment',
        product: 'Piezas de aluminio',
        code: 'P007',
        quantity: -3,
        resultingStock: 120,
        user: 'Ana Martínez',
        reference: 'INV-002',
        notes: 'Ajuste por deterioro de material'
    },
    {
        id: 8,
        date: '2025-04-05T15:40:00Z',
        type: 'in',
        product: 'Cable de fibra óptica',
        code: 'P008',
        quantity: 8,
        resultingStock: 26,
        user: 'María López',
        reference: 'OC-12347',
        notes: 'Recepción de orden de compra #12347'
    },
    {
        id: 9,
        date: '2025-04-03T11:25:00Z',
        type: 'out',
        product: 'Tornillo hexagonal',
        code: 'P009',
        quantity: 100,
        resultingStock: 680,
        user: 'Carlos Gómez',
        reference: 'OP-78904',
        notes: 'Entrega para orden de producción #78904'
    },
    {
        id: 10,
        date: '2025-04-01T09:50:00Z',
        type: 'in',
        product: 'Sistema de refrigeración',
        code: 'P010',
        quantity: 3,
        resultingStock: 7,
        user: 'María López',
        reference: 'OC-12348',
        notes: 'Recepción de orden de compra #12348'
    },
    {
        id: 11,
        date: '2025-03-28T14:30:00Z',
        type: 'out',
        product: 'Batería industrial',
        code: 'P011',
        quantity: 2,
        resultingStock: 6,
        user: 'Pedro Sánchez',
        reference: 'OP-78905',
        notes: 'Entrega para reemplazo de equipos'
    },
    {
        id: 12,
        date: '2025-03-25T11:20:00Z',
        type: 'in',
        product: 'Panel solar',
        code: 'P012',
        quantity: 5,
        resultingStock: 12,
        user: 'María López',
        reference: 'OC-12349',
        notes: 'Recepción de orden de compra #12349'
    },
    {
        id: 13,
        date: '2025-03-22T09:15:00Z',
        type: 'adjustment',
        product: 'Tarjeta de control',
        code: 'P013',
        quantity: -1,
        resultingStock: 9,
        user: 'Ana Martínez',
        reference: 'INV-003',
        notes: 'Baja por daño en pruebas'
    },
    {
        id: 14,
        date: '2025-03-20T16:45:00Z',
        type: 'out',
        product: 'Aislante térmico',
        code: 'P014',
        quantity: 30,
        resultingStock: 55,
        user: 'Carlos Gómez',
        reference: 'OP-78906',
        notes: 'Entrega para orden de producción #78906'
    },
    {
        id: 15,
        date: '2025-03-18T10:30:00Z',
        type: 'in',
        product: 'Compresor de aire',
        code: 'P015',
        quantity: 2,
        resultingStock: 4,
        user: 'María López',
        reference: 'OC-12350',
        notes: 'Recepción de orden de compra #12350'
    }
];

export default function MovementsPage() {
    // Estados para filtros y paginación
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
    const [currentPage, setCurrentPage] = useState(1);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isNewMovementOpen, setIsNewMovementOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);


    // Nuevo movimiento
    const [newMovement, setNewMovement] = useState<NewMovement>({
        type: 'in',
        productId: '',
        quantity: 1,
        reference: '',
        notes: ''
    });

    // Filtrar movimientos
    const filteredMovements = mockMovements.filter(movement => {
        // Filtro por búsqueda (producto o código)
        const matchesSearch = !searchTerm ||
            movement.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movement.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movement.reference.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro por tipo
        const matchesType = !typeFilter || typeFilter === "all" || movement.type === typeFilter;

        // Filtro por fecha
        const movementDate = new Date(movement.date);
        const matchesDateFrom = !dateRange.from || movementDate >= dateRange.from;
        const matchesDateTo = !dateRange.to || movementDate <= dateRange.to;

        return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
    });

    // Paginación
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
    const paginatedMovements = filteredMovements.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reiniciar filtros
    const resetFilters = () => {
        setSearchTerm('');
        setTypeFilter('');
        setDateRange({ from: undefined, to: undefined });
        setCurrentPage(1);
        setIsFiltersOpen(false);
    };

    const handleMovementClick = (movement: Movement) => {
        setSelectedMovement(movement);
        setIsDetailOpen(true);
    };

    // Manejar cambio en nuevo movimiento
    const handleNewMovementChange = (field: string, value: string | number) => {
        setNewMovement({
            ...newMovement,
            [field]: value
        });
    };

    // Manejar envío de nuevo movimiento
    const handleSubmitNewMovement = () => {
        // Aquí iría la lógica para guardar el nuevo movimiento
        console.log('Nuevo movimiento:', newMovement);
        setIsNewMovementOpen(false);
        setNewMovement({
            type: 'in',
            productId: '',
            quantity: 1,
            reference: '',
            notes: ''
        });
    };

    // Función intermedia para manejar el cambio de rango de fechas
    const handleDateRangeChange = (range: DateRange | undefined) => {
        if (range) {
            setDateRange(range);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <ClipboardList className="h-6 w-6" />
                                Movimientos de Inventario
                            </CardTitle>
                            <CardDescription>
                                Registro de entradas, salidas y ajustes de inventario
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsFiltersOpen(true)}
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Filtros
                            </Button>
                            <DateRangePicker
                                dateRange={dateRange}
                                onDateRangeChangeAction={handleDateRangeChange}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsExportOpen(true)}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Exportar
                            </Button>
                            <Button onClick={() => setIsNewMovementOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nuevo Movimiento
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Buscar por producto, código o referencia..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Todos los tipos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los tipos</SelectItem>
                                    <SelectItem value="in">Entradas</SelectItem>
                                    <SelectItem value="out">Salidas</SelectItem>
                                    <SelectItem value="adjustment">Ajustes</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={resetFilters}
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Mostrando {Math.min(filteredMovements.length, itemsPerPage)} de {filteredMovements.length} movimientos
                        </div>
                    </div>

                    <Tabs defaultValue="all">
                        <TabsList className="mb-6">
                            <TabsTrigger value="all">Todos los Movimientos</TabsTrigger>
                            <TabsTrigger value="in">Entradas</TabsTrigger>
                            <TabsTrigger value="out">Salidas</TabsTrigger>
                            <TabsTrigger value="adjustment">Ajustes</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Código</TableHead>
                                            <TableHead>Producto</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead className="text-right">Cantidad</TableHead>
                                            <TableHead className="text-right">Stock Resultante</TableHead>
                                            <TableHead>Usuario</TableHead>
                                            <TableHead>Referencia</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedMovements.length > 0 ? (
                                            paginatedMovements.map((movement) => (
                                                <TableRow
                                                    key={movement.id}
                                                    className="cursor-pointer hover:bg-muted/50"
                                                    onClick={() => handleMovementClick(movement)}
                                                >
                                                    <TableCell className="text-sm">{formatDate(movement.date)}</TableCell>
                                                    <TableCell className="font-mono text-sm">{movement.code}</TableCell>
                                                    <TableCell className="text-sm">
                                                        <div className="max-w-40 truncate">
                                                            {movement.product}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {movement.type === 'in' ? (
                                                            <Badge className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 flex w-24 justify-center items-center gap-1">
                                                                <ArrowUpRight className="h-3 w-3" />
                                                                Entrada
                                                            </Badge>
                                                        ) : movement.type === 'out' ? (
                                                            <Badge className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300 flex w-24 justify-center items-center gap-1">
                                                                <ArrowDownRight className="h-3 w-3" />
                                                                Salida
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 flex w-24 justify-center items-center gap-1">
                                                                <RotateCcw className="h-3 w-3" />
                                                                Ajuste
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">
                            <span className={
                                movement.type === 'in'
                                    ? 'text-green-600 dark:text-green-400'
                                    : movement.type === 'out'
                                        ? 'text-red-600 dark:text-red-400'
                                        : movement.quantity >= 0
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-amber-600 dark:text-amber-400'
                            }>
                              {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : ''}
                                {Math.abs(movement.quantity)}
                            </span>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">{movement.resultingStock}</TableCell>
                                                    <TableCell className="text-sm">{movement.user}</TableCell>
                                                    <TableCell className="text-sm font-mono">{movement.reference}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={8} className="h-24 text-center">
                                                    No se encontraron movimientos con los filtros actuales.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="in">
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Código</TableHead>
                                            <TableHead>Producto</TableHead>
                                            <TableHead className="text-right">Cantidad</TableHead>
                                            <TableHead className="text-right">Stock Resultante</TableHead>
                                            <TableHead>Usuario</TableHead>
                                            <TableHead>Referencia</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedMovements
                                            .filter(m => m.type === 'in')
                                            .map((movement) => (
                                                <TableRow
                                                    key={movement.id}
                                                    className="cursor-pointer hover:bg-muted/50"
                                                    onClick={() => handleMovementClick(movement)}
                                                >
                                                    <TableCell className="text-sm">{formatDate(movement.date)}</TableCell>
                                                    <TableCell className="font-mono text-sm">{movement.code}</TableCell>
                                                    <TableCell className="text-sm">
                                                        <div className="max-w-40 truncate">
                                                            {movement.product}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-green-600 dark:text-green-400">
                                                        +{movement.quantity}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">{movement.resultingStock}</TableCell>
                                                    <TableCell className="text-sm">{movement.user}</TableCell>
                                                    <TableCell className="text-sm font-mono">{movement.reference}</TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="out">
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Código</TableHead>
                                            <TableHead>Producto</TableHead>
                                            <TableHead className="text-right">Cantidad</TableHead>
                                            <TableHead className="text-right">Stock Resultante</TableHead>
                                            <TableHead>Usuario</TableHead>
                                            <TableHead>Referencia</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedMovements
                                            .filter(m => m.type === 'out')
                                            .map((movement) => (
                                                <TableRow
                                                    key={movement.id}
                                                    className="cursor-pointer hover:bg-muted/50"
                                                    onClick={() => handleMovementClick(movement)}
                                                >
                                                    <TableCell className="text-sm">{formatDate(movement.date)}</TableCell>
                                                    <TableCell className="font-mono text-sm">{movement.code}</TableCell>
                                                    <TableCell className="text-sm">
                                                        <div className="max-w-40 truncate">
                                                            {movement.product}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-red-600 dark:text-red-400">
                                                        -{movement.quantity}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">{movement.resultingStock}</TableCell>
                                                    <TableCell className="text-sm">{movement.user}</TableCell>
                                                    <TableCell className="text-sm font-mono">{movement.reference}</TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="adjustment">
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Código</TableHead>
                                            <TableHead>Producto</TableHead>
                                            <TableHead className="text-right">Cantidad</TableHead>
                                            <TableHead className="text-right">Stock Resultante</TableHead>
                                            <TableHead>Usuario</TableHead>
                                            <TableHead>Referencia</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedMovements
                                            .filter(m => m.type === 'adjustment')
                                            .map((movement) => (
                                                <TableRow
                                                    key={movement.id}
                                                    className="cursor-pointer hover:bg-muted/50"
                                                    onClick={() => handleMovementClick(movement)}
                                                >
                                                    <TableCell className="text-sm">{formatDate(movement.date)}</TableCell>
                                                    <TableCell className="font-mono text-sm">{movement.code}</TableCell>
                                                    <TableCell className="text-sm">
                                                        <div className="max-w-40 truncate">
                                                            {movement.product}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">
                            <span className={movement.quantity >= 0
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }>
                              {movement.quantity >= 0 ? '+' : ''}{movement.quantity}
                            </span>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">{movement.resultingStock}</TableCell>
                                                    <TableCell className="text-sm">{movement.user}</TableCell>
                                                    <TableCell className="text-sm font-mono">{movement.reference}</TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>

                <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                        {filteredMovements.length} movimientos en total
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                            let pageNumber;

                            // Lógica para mostrar las páginas correctas cuando hay muchas
                            if (totalPages <= 5) {
                                pageNumber = index + 1;
                            } else if (currentPage <= 3) {
                                pageNumber = index + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNumber = totalPages - 4 + index;
                            } else {
                                pageNumber = currentPage - 2 + index;
                            }

                            return (
                                <Button
                                    key={index}
                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNumber)}
                                >
                                    {pageNumber}
                                </Button>
                            );
                        })}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {/* Diálogo de Filtros Avanzados */}
            <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Filtros Avanzados</DialogTitle>
                        <DialogDescription>
                            Aplique filtros avanzados para encontrar movimientos específicos.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* Campos de filtro */}
                        <div className="space-y-2">
                            <Label>Tipo de Movimiento</Label>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos los tipos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los tipos</SelectItem>
                                    <SelectItem value="in">Entradas</SelectItem>
                                    <SelectItem value="out">Salidas</SelectItem>
                                    <SelectItem value="adjustment">Ajustes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Más campos de filtro: usuario, producto, etc. */}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={resetFilters}>
                            Reiniciar
                        </Button>
                        <Button onClick={() => setIsFiltersOpen(false)}>
                            Aplicar Filtros
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo para Nuevo Movimiento */}
            <Dialog open={isNewMovementOpen} onOpenChange={setIsNewMovementOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Registrar Nuevo Movimiento</DialogTitle>
                        <DialogDescription>
                            Complete los datos para registrar un nuevo movimiento de inventario.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Tipo de Movimiento</Label>
                            <Select
                                value={newMovement.type}
                                onValueChange={(value) => handleNewMovementChange('type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="in">Entrada</SelectItem>
                                    <SelectItem value="out">Salida</SelectItem>
                                    <SelectItem value="adjustment">Ajuste</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Más campos: producto, cantidad, referencia, etc. */}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNewMovementOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmitNewMovement}>
                            Guardar Movimiento
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo de Detalle de Movimiento */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Detalle del Movimiento</DialogTitle>
                    </DialogHeader>
                    {selectedMovement && (
                        <div className="space-y-4 py-2">
                            <div className="bg-muted p-4 rounded-lg flex items-center gap-3">
                                {selectedMovement.type === 'in' ? (
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                                        <ArrowUpRight className="h-5 w-5" />
                                    </div>
                                ) : selectedMovement.type === 'out' ? (
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                                        <ArrowDownRight className="h-5 w-5" />
                                    </div>
                                ) : (
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                                        <RotateCcw className="h-5 w-5" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-medium">
                                        {selectedMovement.type === 'in'
                                            ? 'Entrada'
                                            : selectedMovement.type === 'out'
                                                ? 'Salida'
                                                : 'Ajuste'} de Inventario
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(selectedMovement.date)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">
                    <span className={
                        selectedMovement.type === 'in'
                            ? 'text-green-600 dark:text-green-400'
                            : selectedMovement.type === 'out'
                                ? 'text-red-600 dark:text-red-400'
                                : selectedMovement.quantity >= 0
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-amber-600 dark:text-amber-400'
                    }>
                      {selectedMovement.type === 'in' ? '+' : selectedMovement.type === 'out' ? '-' : ''}
                        {Math.abs(selectedMovement.quantity)}
                    </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">unidades</div>
                                </div>
                            </div>

                            {/* Detalles del producto */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Campos de producto, usuario, etc. */}
                            </div>

                            {/* Notas */}
                            <div className="space-y-2">
                                <Label>Notas</Label>
                                <div className="p-3 bg-muted rounded-md text-sm">
                                    {selectedMovement.notes || 'Sin notas adicionales'}
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                            Cerrar
                        </Button>
                        <Button variant="outline">
                            <FileText className="h-4 w-4 mr-2" />
                            Imprimir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo de Exportación */}
            <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Exportar Movimientos</DialogTitle>
                        <DialogDescription>
                            Seleccione las opciones para exportar los movimientos de inventario.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* Opciones de exportación */}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsExportOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={() => setIsExportOpen(false)}>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}