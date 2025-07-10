// src/components/products/ProductDetail.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Package, Trash2, Clock, MapPin, Tag, BarChart, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {Product} from "@/types/product";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const isLowStock = product.current_stock < product.min_stock;
  
  // Formato de fechas
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

return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{product.name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Código: {product.code}</span>
              {product.category && (
                <>
                  <span>•</span>
                  <span>Categoría: {product.category}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4 pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                  <p>{product.name}</p>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Código</label>
                  <p>{product.code}</p>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Categoría</label>
                  <p>{product.category || 'No definida'}</p>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Ubicación</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p>{product.location || 'No definida'}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Proveedor</label>
                  <p>{product.supplier || 'No definido'}</p>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Precio</label>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <p>{product.price ? `$${product.price.toFixed(2)}` : 'No definido'}</p>
                  </div>
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Descripción</label>
                  <p className="text-sm">{product.description || 'Sin descripción'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Información Adicional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Estado de Calidad</label>
                  <div>
                    {product.qc_status === 'approved' ? (
                      <Badge className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">Aprobado</Badge>
                    ) : product.qc_status === 'pending' ? (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">Pendiente</Badge>
                    ) : product.qc_status === 'rejected' ? (
                      <Badge variant="destructive">Rechazado</Badge>
                    ) : (
                      <Badge variant="outline">No verificado</Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Último Movimiento</label>
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <p>{product.last_movement || 'Sin movimientos'}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p>{formatDate(product.created_at)}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p>{formatDate(product.updated_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stock" className="space-y-4 pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Información de Stock</h3>
                  <p className="text-sm text-muted-foreground">Estado actual e histórico del inventario</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BarChart className="h-4 w-4 mr-2" />
                    Ver Gráfico
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-4 rounded-lg border ${
                  isLowStock 
                    ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                    : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                }`}>
                  <div className="text-sm font-medium mb-1 text-muted-foreground">Stock Actual</div>
                  <div className="text-2xl font-bold mb-1">
                    {product.current_stock}
                  </div>
                  <div className="text-sm">
                    {isLowStock 
                      ? <span className="text-red-600 dark:text-red-400">Por debajo del mínimo</span>
                      : <span className="text-green-600 dark:text-green-400">Stock adecuado</span>
                    }
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                  <div className="text-sm font-medium mb-1 text-muted-foreground">Stock Mínimo</div>
                  <div className="text-2xl font-bold mb-1">
                    {product.min_stock}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Nivel de reposición
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800">
                  <div className="text-sm font-medium mb-1 text-muted-foreground">Diferencia</div>
                  <div className="text-2xl font-bold mb-1">
                    {product.current_stock - product.min_stock}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    {product.current_stock >= product.min_stock 
                      ? 'Unidades por encima del mínimo' 
                      : 'Unidades por debajo del mínimo'
                    }
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Nivel de Stock</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>0</span>
                    <span>{product.min_stock}</span>
                    <span>{Math.max(product.min_stock * 2, product.current_stock + 5)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        isLowStock ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ 
                        width: `${(product.current_stock / Math.max(product.min_stock * 2, product.current_stock + 5)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-muted-foreground">Crítico</span>
                    <div className="w-2 h-2 bg-amber-500 rounded-full ml-2"></div>
                    <span className="text-xs text-muted-foreground">Bajo</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                    <span className="text-xs text-muted-foreground">Óptimo</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Movimientos Recientes</h3>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-2">Fecha</th>
                      <th className="text-left p-2">Tipo</th>
                      <th className="text-right p-2">Cantidad</th>
                      <th className="text-right p-2">Stock Resultante</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-2">{formatDate('2023-09-15T10:30:00Z')}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                          Entrada
                        </Badge>
                      </td>
                      <td className="p-2 text-right text-green-600 dark:text-green-400">+5</td>
                      <td className="p-2 text-right">{product.current_stock}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2">{formatDate('2023-09-12T14:15:00Z')}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300">
                          Salida
                        </Badge>
                      </td>
                      <td className="p-2 text-right text-red-600 dark:text-red-400">-3</td>
                      <td className="p-2 text-right">{product.current_stock - 5}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2">{formatDate('2023-09-08T09:45:00Z')}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          Ajuste
                        </Badge>
                      </td>
                      <td className="p-2 text-right text-blue-600 dark:text-blue-400">+2</td>
                      <td className="p-2 text-right">{product.current_stock - 5 + 3}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Historial de Producto</h3>
                  <p className="text-sm text-muted-foreground">Registro completo de cambios y movimientos</p>
                </div>
              </div>
              
              <div className="relative pl-6 border-l">
                {/* Evento 1 */}
                <div className="mb-6 relative">
                  <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full bg-blue-500"></div>
                  <div className="mb-1">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 mb-1">
                      Modificación
                    </Badge>
                    <span className="text-sm text-muted-foreground ml-2">{formatDate('2023-09-15T10:30:00Z')}</span>
                  </div>
                  <h4 className="text-base font-medium">Actualización de stock mínimo</h4>
                  <p className="text-sm text-muted-foreground">
                    Stock mínimo actualizado de 10 a {product.min_stock} unidades
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Por: Juan Pérez (Gerente de Producción)
                  </p>
                </div>
                
                {/* Evento 2 */}
                <div className="mb-6 relative">
                  <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full bg-green-500"></div>
                  <div className="mb-1">
                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 mb-1">
                      Entrada
                    </Badge>
                    <span className="text-sm text-muted-foreground ml-2">{formatDate('2023-09-12T14:15:00Z')}</span>
                  </div>
                  <h4 className="text-base font-medium">Recepción de mercancía</h4>
                  <p className="text-sm text-muted-foreground">
                    Entrada de 15 unidades - Orden de compra #12345
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Por: María López (Encargado de Almacén)
                  </p>
                </div>
                
                {/* Evento 3 */}
                <div className="mb-6 relative">
                  <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full bg-red-500"></div>
                  <div className="mb-1">
                    <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300 mb-1">
                      Salida
                    </Badge>
                    <span className="text-sm text-muted-foreground ml-2">{formatDate('2023-09-08T09:45:00Z')}</span>
                  </div>
                  <h4 className="text-base font-medium">Consumo en producción</h4>
                  <p className="text-sm text-muted-foreground">
                    Salida de 8 unidades - Orden de producción #67890
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Por: Carlos Gómez (Supervisor de Producción)
                  </p>
                </div>
                
                {/* Evento 4 */}
                <div className="relative">
                  <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full bg-purple-500"></div>
                  <div className="mb-1">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300 mb-1">
                      Creación
                    </Badge>
                    <span className="text-sm text-muted-foreground ml-2">{formatDate(product.created_at)}</span>
                  </div>
                  <h4 className="text-base font-medium">Producto creado</h4>
                  <p className="text-sm text-muted-foreground">
                    Creación inicial del producto en el sistema
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Por: Ana Martínez (Administrador)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetail;