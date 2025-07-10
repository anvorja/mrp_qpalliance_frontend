// src/app/products/alerts/page.tsx
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertTriangle,
  Download,
  FileText,
  TrendingUp,
  Clock,
  Send,
  RefreshCw,
  ShoppingCart,
  CalendarDays,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Definir interfaces para los datos de alerta
interface AlertProduct {
  id: number;
  code: string;
  name: string;
  current_stock: number;
  min_stock: number;
  difference: number;
  daysToStockOut: number;
  category: string;
  location: string;
  supplier: string;
  last_order_date?: string;
  lead_time: number;
}

// Tipos para la severidad de alertas
type SeverityColor = "default" | "destructive" | "outline" | "secondary";

// Datos de ejemplo para alertas
const alertProducts: AlertProduct[] = [
  { id: 3, code: 'P003', name: 'Placa base industrial', current_stock: 8, min_stock: 12, difference: 4, daysToStockOut: 10, category: 'Electrónica', location: 'Almacén A', supplier: 'TechSupplies Corp.', last_order_date: '2023-06-10', lead_time: 15 },
  { id: 5, code: 'P005', name: 'Cinta transportadora', current_stock: 4, min_stock: 5, difference: 1, daysToStockOut: 5, category: 'Transporte', location: 'Almacén D', supplier: 'ConveyorTech Inc.', last_order_date: '2023-07-25', lead_time: 21 },
  { id: 8, code: 'P008', name: 'Cable de fibra óptica', current_stock: 18, min_stock: 20, difference: 2, daysToStockOut: 12, category: 'Electrónica', location: 'Almacén C', supplier: 'OpticNet Solutions', last_order_date: '2023-05-15', lead_time: 7 },
  { id: 10, code: 'P010', name: 'Sistema de refrigeración', current_stock: 7, min_stock: 8, difference: 1, daysToStockOut: 18, category: 'Refrigeración', location: 'Almacén B', supplier: 'CoolTech Systems', last_order_date: '2023-08-05', lead_time: 14 },
];

export default function AlertsPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<AlertProduct | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(0);
  const [orderNotes, setOrderNotes] = useState<string>("");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState<boolean>(false);

  // Calcular estadísticas
  const criticalAlerts = alertProducts.filter(p => p.daysToStockOut <= 7).length;
  const warningAlerts = alertProducts.filter(p => p.daysToStockOut > 7 && p.daysToStockOut <= 15).length;
  const infoAlerts = alertProducts.filter(p => p.daysToStockOut > 15).length;

  // Filtrar por proveedor
  const filteredAlerts = selectedSupplier === "all" || !selectedSupplier
      ? alertProducts
      : alertProducts.filter(p => p.supplier === selectedSupplier);

  // Obtener lista única de proveedores
  const suppliers = [...new Set(alertProducts.map(p => p.supplier))];

  // Simular envío de orden
  const handleSendOrder = (): void => {
    // Aquí iría la lógica para enviar la orden al proveedor
    setIsOrderDialogOpen(false);
    // Resetear el formulario
    setOrderQuantity(0);
    setOrderNotes("");
  };

  // Abrir diálogo de orden
  const handleOpenOrderDialog = (product: AlertProduct): void => {
    setSelectedProduct(product);
    setOrderQuantity(product.difference);
    setIsOrderDialogOpen(true);
  };

  // Generar un color de severidad basado en los días para quedarse sin stock
  const getSeverityColor = (days: number): SeverityColor => {
    if (days <= 7) return "destructive";
    if (days <= 15) return "secondary";
    return "outline";
  };

  return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                  Alertas de Stock Bajo
                </CardTitle>
                <CardDescription>
                  Productos que requieren reabastecimiento inmediato
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsReportDialogOpen(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generar Reporte
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="default">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">Crítico</p>
                      <h3 className="text-2xl font-bold text-red-700 dark:text-red-300">{criticalAlerts}</h3>
                      <p className="text-xs text-red-600 dark:text-red-400">Requieren atención inmediata</p>
                    </div>
                    <div className="p-3 bg-red-100 dark:bg-red-800 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Advertencia</p>
                      <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-300">{warningAlerts}</h3>
                      <p className="text-xs text-amber-600 dark:text-amber-400">Requieren atención pronto</p>
                    </div>
                    <div className="p-3 bg-amber-100 dark:bg-amber-800 rounded-full">
                      <Clock className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Seguimiento</p>
                      <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">{infoAlerts}</h3>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Monitorear regularmente</p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
                      <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <Label htmlFor="supplier-filter" className="text-sm">Filtrar por Proveedor:</Label>
                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                  <SelectTrigger id="supplier-filter" className="w-64">
                    <SelectValue placeholder="Todos los proveedores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los proveedores</SelectItem>
                    {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Mostrando {filteredAlerts.length} de {alertProducts.length} alertas
              </p>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-center">Stock Actual</TableHead>
                    <TableHead className="text-center">Stock Mínimo</TableHead>
                    <TableHead className="text-center">Diferencia</TableHead>
                    <TableHead className="text-center">Tiempo Estimado</TableHead>
                    <TableHead className="text-center">Proveedor</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.code}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <Badge variant={getSeverityColor(product.daysToStockOut)}>
                            {product.daysToStockOut <= 7 ? 'Crítico' :
                                product.daysToStockOut <= 15 ? 'Advertencia' : 'Seguimiento'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{product.current_stock}</TableCell>
                        <TableCell className="text-center">{product.min_stock}</TableCell>
                        <TableCell className="text-center text-red-600 dark:text-red-400">-{product.difference}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">{product.daysToStockOut} días</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{product.supplier}</TableCell>
                        <TableCell className="text-center">
                          <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleOpenOrderDialog(product)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span className="sr-only">Generar pedido</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Nota:</strong> Los días estimados están calculados en base al consumo histórico. El tiempo de entrega del proveedor no está incluido en este cálculo.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diálogo para generar pedido */}
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generar Pedido</DialogTitle>
              <DialogDescription>
                Complete la información para enviar un pedido al proveedor.
              </DialogDescription>
            </DialogHeader>

            {selectedProduct && (
                <div className="space-y-4 py-4">
                  <div className="flex flex-col space-y-1.5">
                    <div className="bg-muted p-3 rounded-md mb-2">
                      <p className="text-sm"><strong>Producto:</strong> {selectedProduct.name}</p>
                      <p className="text-sm"><strong>Código:</strong> {selectedProduct.code}</p>
                      <p className="text-sm"><strong>Proveedor:</strong> {selectedProduct.supplier}</p>
                      <p className="text-sm"><strong>Tiempo de entrega estimado:</strong> {selectedProduct.lead_time} días</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order-quantity">Cantidad a solicitar</Label>
                    <Input
                        id="order-quantity"
                        type="number"
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 0)}
                        min={selectedProduct.difference}
                    />
                    <p className="text-xs text-muted-foreground">
                      La cantidad mínima sugerida es {selectedProduct.difference} unidades.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expected-date">Fecha de entrega esperada</Label>
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">
                        {new Date(Date.now() + selectedProduct.lead_time * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order-notes">Notas adicionales</Label>
                    <Textarea
                        id="order-notes"
                        placeholder="Instrucciones especiales para el proveedor..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                    />
                  </div>
                </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" onClick={handleSendOrder}>
                <Send className="h-4 w-4 mr-2" />
                Enviar Pedido
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo para generar reporte */}
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generar Reporte de Alertas</DialogTitle>
              <DialogDescription>
                Seleccione el tipo de reporte que desea generar.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Tipo de Reporte</Label>
                <Select defaultValue="inventory-alerts">
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Seleccione un tipo de reporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inventory-alerts">Alertas de Inventario</SelectItem>
                    <SelectItem value="supplier-lead-time">Tiempo de Entrega por Proveedor</SelectItem>
                    <SelectItem value="stock-turnover">Rotación de Inventario</SelectItem>
                    <SelectItem value="stock-valuation">Valoración de Inventario</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-format">Formato</Label>
                <Select defaultValue="pdf">
                  <SelectTrigger id="report-format">
                    <SelectValue placeholder="Seleccione un formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-period">Período</Label>
                <Select defaultValue="current">
                  <SelectTrigger id="report-period">
                    <SelectValue placeholder="Seleccione un período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Situación Actual</SelectItem>
                    <SelectItem value="last-7-days">Últimos 7 días</SelectItem>
                    <SelectItem value="last-30-days">Últimos 30 días</SelectItem>
                    <SelectItem value="last-90-days">Últimos 90 días</SelectItem>
                    <SelectItem value="custom">Período personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" onClick={() => setIsReportDialogOpen(false)}>
                <FileText className="h-4 w-4 mr-2" />
                Generar Reporte
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}