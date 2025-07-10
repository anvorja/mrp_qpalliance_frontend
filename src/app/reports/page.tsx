// src/app/reports/page.tsx
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  BarChart3,
  Download,
  Calendar,
  ArrowUpRight,
  Info,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import InventoryDistributionChart from '@/components/reports/InventoryDistributionChart';
import StockAlertsByCategory from '@/components/reports/StockAlertsByCategory';
import ProductMovementTable from '@/components/reports/ProductMovementTable';
import { DateRange } from 'react-day-picker';

// Definir interface para los datos de KPI
interface KpiData {
  totalInventoryValue: number;
  totalProducts: number;
  stockoutItems: number;
  lowStockItems: number;
  stockTurnoverRate: number;
  inventoryValueChange: number;
  inventoryAccuracy: number;
  daysOfSupply: number;
}

// Datos de ejemplo para los KPIs
const kpiData: KpiData = {
  totalInventoryValue: 125680.45,
  totalProducts: 245,
  stockoutItems: 12,
  lowStockItems: 28,
  stockTurnoverRate: 4.2,
  inventoryValueChange: 5.3,
  inventoryAccuracy: 97.8,
  daysOfSupply: 45.2
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [isExportDialogOpen, setIsExportDialogOpen] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<string>("pdf");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Simular actualización de datos
  const handleRefresh = (): void => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  // Manejar cambios en el rango de fechas
  const handleDateRangeChange = (range: DateRange | undefined): void => {
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
                  <BarChart3 className="h-6 w-6" />
                  Reportes y Análisis de Inventario
                </CardTitle>
                <CardDescription>
                  Métricas y estadísticas detalladas sobre el estado de su inventario
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <DateRangePicker
                    dateRange={dateRange}
                    onDateRangeChangeAction={handleDateRangeChange}
                />
                <Button
                    variant="outline"
                    onClick={() => setIsExportDialogOpen(true)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button
                    variant="default"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Actualizar
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Vista General</TabsTrigger>
                <TabsTrigger value="value">Valor de Inventario</TabsTrigger>
                <TabsTrigger value="turnover">Rotación</TabsTrigger>
                <TabsTrigger value="distribution">Distribución</TabsTrigger>
                <TabsTrigger value="movements">Movimientos</TabsTrigger>
              </TabsList>

              {/* Vista General */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* KPI 1 - Valor de inventario */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm text-muted-foreground">Valor total del inventario</span>
                        <div className="flex items-end justify-between">
                          <span className="text-2xl font-semibold">${kpiData.totalInventoryValue.toLocaleString()}</span>
                          <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            <span>{kpiData.inventoryValueChange}%</span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">vs. mes anterior</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* KPI 2 - Productos */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm text-muted-foreground">Total de productos</span>
                        <div className="flex items-end justify-between">
                          <span className="text-2xl font-semibold">{kpiData.totalProducts}</span>
                          <div className="flex items-center text-xs">
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full">
                            {kpiData.stockoutItems} agotados
                          </span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{kpiData.lowStockItems} con stock bajo</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* KPI 3 - Rotación del inventario */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm text-muted-foreground">Rotación de inventario</span>
                        <div className="flex items-end justify-between">
                          <span className="text-2xl font-semibold">{kpiData.stockTurnoverRate}</span>
                          <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                            <Info className="h-4 w-4 mr-1" />
                            <span>veces/año</span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">Último año fiscal</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* KPI 4 - Días de suministro */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm text-muted-foreground">Días de suministro</span>
                        <div className="flex items-end justify-between">
                          <span className="text-2xl font-semibold">{kpiData.daysOfSupply} días</span>
                          <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span>Objetivo: 60</span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">Promedio global</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Distribución del Valor de Inventario</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                      <InventoryDistributionChart />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Alertas de Stock por Categoría</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                      <StockAlertsByCategory />
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Productos Más Movidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProductMovementTable limit={5} />
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("movements")}>
                      Ver todos los movimientos
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Aquí irían las otras pestañas (value, turnover, distribution, movements) */}
              <TabsContent value="value" className="space-y-6">
                {/* Contenido de la pestaña Valor de Inventario */}
              </TabsContent>

              <TabsContent value="turnover" className="space-y-6">
                {/* Contenido de la pestaña Rotación */}
              </TabsContent>

              <TabsContent value="distribution" className="space-y-6">
                {/* Contenido de la pestaña Distribución */}
              </TabsContent>

              <TabsContent value="movements" className="space-y-6">
                {/* Contenido de la pestaña Movimientos */}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Diálogo de exportación */}
        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Exportar Reporte</DialogTitle>
              <DialogDescription>
                Seleccione el formato de exportación y las opciones del reporte.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="export-report">Reporte</Label>
                <Select defaultValue="current">
                  <SelectTrigger id="export-report">
                    <SelectValue placeholder="Seleccione un reporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Reporte actual ({activeTab})</SelectItem>
                    <SelectItem value="overview">Vista general</SelectItem>
                    <SelectItem value="value">Valor de inventario</SelectItem>
                    <SelectItem value="turnover">Rotación de inventario</SelectItem>
                    <SelectItem value="distribution">Distribución de inventario</SelectItem>
                    <SelectItem value="movements">Movimientos de inventario</SelectItem>
                    <SelectItem value="comprehensive">Reporte completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="export-format">Formato</Label>
                <Select
                    value={exportFormat}
                    onValueChange={setExportFormat}
                >
                  <SelectTrigger id="export-format">
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
                <Label>Período</Label>
                <div className="p-2 bg-muted rounded-md text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                    {dateRange.from?.toLocaleDateString()} - {dateRange.to?.toLocaleDateString()}
                  </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  El reporte incluirá datos para este período de fechas.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Opciones adicionales</Label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-charts" className="rounded border-gray-300" />
                  <Label htmlFor="include-charts" className="text-sm font-normal">Incluir gráficos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-details" className="rounded border-gray-300" />
                  <Label htmlFor="include-details" className="text-sm font-normal">Incluir detalles completos</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                  type="submit"
                  onClick={() => setIsExportDialogOpen(false)}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}