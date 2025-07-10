// src/components/products/FiltersDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { displayCategoryMap } from '@/utils/entityMapper';

interface FiltersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categoryFilter: string;
  stockFilter: string;
  setCategoryFilter: (value: string) => void;
  setStockFilter: (value: string) => void;
  onResetFilters: () => void;
}

const FiltersDialog: React.FC<FiltersDialogProps> = ({
  isOpen,
  onOpenChange,
  categoryFilter,
  stockFilter,
  setCategoryFilter,
  setStockFilter,
  onResetFilters
}) => {
  // Extraer las categorías con formato para mostrar
  const categoryOptions = Object.values(displayCategoryMap).map((categoryName) => (
    <SelectItem key={categoryName} value={categoryName}>{categoryName}</SelectItem>
  ));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
          <DialogDescription>
            Refine la lista de productos con los siguientes filtros.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categoryOptions}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Estado de Stock</Label>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger id="stock">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="low">Stock bajo</SelectItem>
                <SelectItem value="ok">Stock adecuado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onResetFilters} variant="outline">
            Limpiar Filtros
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FiltersDialog;