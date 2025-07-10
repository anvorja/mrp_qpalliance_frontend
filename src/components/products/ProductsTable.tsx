// src/components/products/ProductsTable.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductsTableProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  highlightLowStock?: boolean;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onView,
  onEdit,
  onDelete,
  highlightLowStock = false
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead className="text-center">Stock Actual</TableHead>
            <TableHead className="text-center">Stock Mínimo</TableHead>
            <TableHead className="text-center">Ubicación</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => {
              const isLowStock = product.current_stock < product.min_stock;
              
              return (
                <TableRow key={product.id} className={isLowStock && highlightLowStock ? "bg-red-50/50 dark:bg-red-900/10" : ""}>
                  <TableCell className="font-medium">{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-center">
                    <span className={isLowStock ? "text-red-600 dark:text-red-400 font-medium" : ""}>
                      {product.current_stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{product.min_stock}</TableCell>
                  <TableCell className="text-center">{product.location}</TableCell>
                  <TableCell className="text-center">
                    {isLowStock ? (
                      <Badge variant="destructive">Stock bajo</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                        Stock OK
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(product)}
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                No se encontraron productos
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;