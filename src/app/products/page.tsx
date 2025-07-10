// src/app/products/page.tsx
"use client"

import React, {useCallback, useEffect, useState} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  Search,
  Plus,
  Trash2,
  SlidersHorizontal,
  AlertTriangle,
  X, Loader2
} from 'lucide-react';
import ProductsTable from '@/components/products/ProductsTable';

import ProductDetail from "@/components/products/ProductDetail";
import ProductForm from "@/components/products/ProductForm";
import { Product, ProductCreate } from '@/types/product';
import { productService } from '@/services/productService';
import { toast } from 'sonner';
import FiltersDialog from "@/components/products/FiltersDialog";

// Tipado de la función handleSubmit para consistencia
type ProductFormSubmitHandler = (product: Product | ProductCreate) => void;

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Filtros
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  // Productos con alertas de stock bajo
  const [alertProducts, setAlertProducts] = useState<Product[]>([]);

  // Función para cargar los productos (useCallback para evitar dependencias cíclicas)
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Determinar el filtro de stock para la API
      let stockStatus = '';
      if (stockFilter === 'low') {
        stockStatus = 'low';
      } else if (stockFilter === 'ok') {
        stockStatus = 'ok';
      }

      // Preparar los filtros
      const filters = {
        search: searchTerm,
        category: categoryFilter === 'all' ? '' : categoryFilter,
        stock_status: stockStatus,
        limit: 100
      };

      // Llamar al servicio
      const response = await productService.getProducts(filters);
      setProducts(response.items as Product[]);
      setError(null);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('Error al cargar los productos. Por favor, intente nuevamente.');
      toast.error('Error al cargar productos', {
        description: 'No se pudieron cargar los productos desde el servidor.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, categoryFilter, stockFilter]);

  // Función para cargar productos con alerta de stock bajo
  const fetchAlertProducts = useCallback(async () => {
    try {
      const lowStockProducts = await productService.getLowStockProducts();
      setAlertProducts(lowStockProducts);
    } catch (err) {
      console.error('Error al cargar productos con alerta:', err);
      toast.error('Error al cargar alertas', {
        description: 'No se pudieron cargar las alertas de stock bajo.'
      });
    }
  }, []);

  // Cargar productos al iniciar la página
  useEffect(() => {
    (async () => {
      try {
        await fetchProducts();
        await fetchAlertProducts();
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    })();
  }, [fetchProducts, fetchAlertProducts]);

// Funciones para manejar el CRUD
  const handleAddProduct: ProductFormSubmitHandler = async (newProduct) => {
    setIsProcessing(true);
    try {
      const createdProduct = await productService.createProduct(newProduct as ProductCreate);
      setProducts([...products, createdProduct]);
      setIsFormOpen(false);
      toast.success('Producto creado', {
        description: `El producto ${createdProduct.name} ha sido creado exitosamente.`
      });
      // Recargar productos para asegurar sincronización
      await fetchProducts();
    } catch (err) {
      console.error('Error al crear el producto:', err);
      toast.error('Error al crear producto', {
        description: 'No se pudo crear el producto. Por favor, intente nuevamente.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditProduct: ProductFormSubmitHandler = async (updatedProduct) => {
    // Si es un ProductCreate, no tendrá id y no debería entrar aquí
    // Si es un Product, podemos procesarlo de forma segura
    if ('id' in updatedProduct) {
      setIsProcessing(true);
      try {
        const result = await productService.updateProduct(updatedProduct.id, updatedProduct);
        setProducts(products.map(p => p.id === updatedProduct.id ? result : p));
        setIsFormOpen(false);
        setIsEditMode(false);
        toast.success('Producto actualizado', {
          description: `El producto ${result.name} ha sido actualizado exitosamente.`
        });
        // Recargar productos para asegurar sincronización
        await fetchProducts();
        await fetchAlertProducts();
      } catch (err) {
        console.error('Error al actualizar el producto:', err);
        toast.error('Error al actualizar producto', {
          description: 'No se pudo actualizar el producto. Por favor, intente nuevamente.'
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      setIsProcessing(true);
      try {
        await productService.deleteProduct(productToDelete.id);
        setProducts(products.filter(p => p.id !== productToDelete.id));
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
        toast.success('Producto eliminado', {
          description: `El producto ha sido eliminado exitosamente.`
        });
        // Recargar productos para asegurar sincronización
        await fetchProducts();
        await fetchAlertProducts();
      } catch (err) {
        console.error('Error al eliminar el producto:', err);
        toast.error('Error al eliminar producto', {
          description: 'No se pudo eliminar el producto. Por favor, intente nuevamente.'
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const openEditForm = async (product: Product) => {
    try {
      setIsProcessing(true);

      // Cerrar completamente el formulario anterior
      setIsFormOpen(false);
      setIsEditMode(false);
      setSelectedProduct(null);

      // Dar tiempo a React para limpiar el estado
      await new Promise(resolve => setTimeout(resolve, 50));

      // Obtener detalles del producto
      const productDetails = await productService.getProductById(product.id);

      // Preparar para edición
      setSelectedProduct(productDetails);
      setIsEditMode(true);

      // Dar tiempo para que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 50));

      // Abrir el formulario
      setIsFormOpen(true);
    } catch (error) {
      console.error("Error al preparar la edición:", error);
      toast.error("No se pudo cargar el producto para editar");
    } finally {
      setIsProcessing(false);
    }
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const viewProductDetails = async (product: Product) => {
    setIsProcessing(true);
    try {
      // Obtener los detalles completos del producto antes de mostrarlos
      const productDetails = await productService.getProductById(product.id);
      setSelectedProduct(productDetails as Product);
      setIsDetailOpen(true);
    } catch (err) {
      console.error('Error al cargar detalles del producto:', err);
      toast.error('Error al cargar producto', {
        description: 'No se pudieron cargar los detalles del producto.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  Gestión de Productos
                </CardTitle>
                <CardDescription>
                  Administre los productos en su inventario
                </CardDescription>
              </div>
              <Button onClick={() => {setIsFormOpen(true); setIsEditMode(false); setSelectedProduct(null);}}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="all">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                <TabsList>
                  <TabsTrigger value="all">Todos los Productos</TabsTrigger>
                  <TabsTrigger value="alerts" className="relative">
                    Alertas de Stock
                    {alertProducts.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {alertProducts.length}
                    </span>
                    )}
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar productos..."
                        className="pl-9 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsFiltersOpen(true)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>

                  {/* Componente de filtros */}
                  <FiltersDialog
                      isOpen={isFiltersOpen}
                      onOpenChange={setIsFiltersOpen}
                      categoryFilter={categoryFilter}
                      stockFilter={stockFilter}
                      setCategoryFilter={setCategoryFilter}
                      setStockFilter={setStockFilter}
                      onResetFilters={() => {setCategoryFilter(''); setStockFilter('')}}
                  />
                </div>
              </div>

              <TabsContent value="all" className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Cargando productos...</span>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                ) : (
                    <ProductsTable
                        products={products}
                        onView={viewProductDetails}
                        onEdit={openEditForm}
                        onDelete={openDeleteDialog}
                    />
                )}
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800 dark:text-yellow-400">Productos con stock bajo</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-500">
                      Se muestran productos cuyo stock actual está por debajo del mínimo requerido. Considere reabastecer estos productos pronto.
                    </p>
                  </div>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Cargando alertas...</span>
                    </div>
                ) : (
                    <ProductsTable
                        products={alertProducts}
                        onView={viewProductDetails}
                        onEdit={openEditForm}
                        onDelete={openDeleteDialog}
                        highlightLowStock
                    />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Diálogo de Detalle de Producto */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalle del Producto</DialogTitle>
            </DialogHeader>
            {selectedProduct && <ProductDetail product={selectedProduct} />}
          </DialogContent>
        </Dialog>

        {/* Diálogo de Formulario de Producto */}
        <Dialog open={isFormOpen && !isEditMode} onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            setSelectedProduct(null);
          }
        }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
            </DialogHeader>
            <ProductForm
                product={null}
                onSubmit={handleAddProduct}
                onCancel={() => setIsFormOpen(false)}
                isProcessing={isProcessing}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isFormOpen && isEditMode} onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            setIsEditMode(false);
            setSelectedProduct(null);
          }
        }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Editar Producto</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
                <ProductForm
                    key={`edit-product-${selectedProduct.id}-${Date.now()}`} // Forzar recreación del componente
                    product={selectedProduct}
                    onSubmit={(product) => handleEditProduct(product as Product)}
                    onCancel={() => {
                      setIsFormOpen(false);
                      setIsEditMode(false);
                    }}
                    isProcessing={isProcessing}
                />
            )}
          </DialogContent>
        </Dialog>

        {/* Diálogo de Confirmación de Eliminación */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
              <DialogDescription>
                ¿Está seguro de que desea eliminar el producto &quot;{productToDelete?.name}&quot;? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isProcessing}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                  variant="destructive"
                  onClick={handleDeleteProduct}
                  disabled={isProcessing}
              >
                {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Eliminando...
                    </>
                ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}