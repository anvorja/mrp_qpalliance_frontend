// src/components/products/ProductForm.tsx
import React, {useState, useEffect} from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {AlertCircle, Loader2, Save, X} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Product, ProductCreate } from "@/types/product";
import { displayCategoryMap, displayLocationMap } from "@/utils/entityMapper";

interface ProductFormProps {
  product: Product | null;
  onSubmit: (product: Product | ProductCreate) => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel, isProcessing = false }) => {
  // Estado para los valores de los campos select
  const [categoryValue, setCategoryValue] = useState<string>('none');
  const [locationValue, setLocationValue] = useState<string>('none');
  const [supplierValue, setSupplierValue] = useState<string>('none');
  const [qcStatusValue, setQcStatusValue] = useState<string>('pending');
  const [isInitializing, setIsInitializing] = useState(true);

  const [formData, setFormData] = useState<ProductCreate & { id?: number }>({
    code: '',
    name: '',
    current_stock: 0,
    min_stock: 0,
    description: '',
    category: '',
    location: '',
    supplier: '',
    price: 0,
    qc_status: 'pending'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stockAlert, setStockAlert] = useState(false);

  // Inicializar el formulario cuando product cambia
  useEffect(() => {
    if (product) {
      setIsInitializing(true);

      // Mapear explícitamente los valores del backend a los valores en los SelectItem
      let categoryToUse = 'none';
      let locationToUse = 'none';
      let supplierToUse = 'none';
      const qcStatusToUse = product.qc_status || 'pending';


      // Para categoría
      if (product.category) {
        const category = product.category;
        // Comparar directamente con las opciones disponibles
        const matchingCategory = Object.values(displayCategoryMap).find(
            value => value === category
        );

        if (matchingCategory) {
          categoryToUse = matchingCategory;
        } else {
          // Intentar buscar ignorando tildes/case
          const looseMatch = Object.values(displayCategoryMap).find(
              value => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
                  category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          );

          if (looseMatch) {
            categoryToUse = looseMatch;
          } else {
            categoryToUse = product.category;
          }
        }
      }

      // Para ubicación
      if (product.location) {
        const location = product.location;
        // Comparar directamente
        const matchingLocation = Object.values(displayLocationMap).find(
            value => value === location
        );

        if (matchingLocation) {
          locationToUse = matchingLocation;
        } else {
          // Intentar buscar ignorando tildes/case
          const looseMatch = Object.values(displayLocationMap).find(
              value => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
                  location.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          );

          if (looseMatch) {
            locationToUse = looseMatch;
          } else {
            locationToUse = product.location;
          }
        }
      }

      if (product.supplier && product.supplier !== '') {
        supplierToUse = product.supplier;
      }

      // Actualizar el estado general del formulario primero
      setFormData({
        id: product.id,
        code: product.code || '',
        name: product.name || '',
        current_stock: product.current_stock,
        min_stock: product.min_stock,
        description: product.description || '',
        category: product.category || '',
        location: product.location || '',
        supplier: product.supplier || '',
        price: product.price || 0,
        qc_status: product.qc_status || 'pending'
      });


      // Establecer alerta de stock
      setStockAlert(product.current_stock < product.min_stock);

      // Forzar actualización después de un breve retraso
      const timer = setTimeout(() => {
        setCategoryValue(categoryToUse);
        setLocationValue(locationToUse);
        setSupplierValue(supplierToUse);
        setQcStatusValue(qcStatusToUse);

        // Desactivar inicialización después de un tiempo
        setTimeout(() => {
          setIsInitializing(false);
        }, 50);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Reiniciar el formulario cuando no hay producto
      setCategoryValue('none');
      setLocationValue('none');
      setSupplierValue('none');
      setQcStatusValue('pending');
      setIsInitializing(false);
    }
  }, [product]);


  // Cuando cambian los valores de los Select, actualizar el estado del formulario
  useEffect(() => {
    if (isInitializing) {
      return;
    }

    setFormData(prevData => ({
      ...prevData,
      category: categoryValue === 'none' ? '' : categoryValue,
      location: locationValue === 'none' ? '' : locationValue,
      supplier: supplierValue === 'none' ? '' : supplierValue,
      qc_status: qcStatusValue
    }));
  }, [categoryValue, locationValue, supplierValue, qcStatusValue, isInitializing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let parsedValue: string | number = value;

    // Convertir valores numéricos
    if (name === 'current_stock' || name === 'min_stock' || name === 'price') {
      parsedValue = value === '' ? 0 : parseFloat(value);
    }

    setFormData({
      ...formData,
      [name]: parsedValue
    });

    // Limpiar error cuando el usuario corrige el campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    // Mostrar alerta si el stock actual es menor que el mínimo
    if ((name === 'current_stock' || name === 'min_stock') &&
        ((name === 'current_stock' && parseFloat(value) < formData.min_stock) ||
            (name === 'min_stock' && formData.current_stock < parseFloat(value)))) {
      setStockAlert(true);
    } else if ((name === 'current_stock' || name === 'min_stock') &&
        ((name === 'current_stock' && parseFloat(value) >= formData.min_stock) ||
            (name === 'min_stock' && formData.current_stock >= parseFloat(value)))) {
      setStockAlert(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'El código del producto es obligatorio';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es obligatorio';
    }

    if (formData.current_stock < 0) {
      newErrors.current_stock = 'El stock actual no puede ser negativo';
    }

    if (formData.min_stock < 0) {
      newErrors.min_stock = 'El stock mínimo no puede ser negativo';
    }

    if (formData.price && formData.price < 0) {
      newErrors.price = 'El precio no puede ser negativo';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      // Crear una copia de los datos para procesar
      const processedData = { ...formData };

      // Convertir 'none' a cadenas vacías para mantener consistencia
      if (processedData.category === 'none') processedData.category = '';
      if (processedData.location === 'none') processedData.location = '';
      if (processedData.supplier === 'none') processedData.supplier = '';

      // Si estamos editando, necesitamos incluir el ID del producto
      if (product?.id) {
        onSubmit({
          ...processedData,
          id: product.id,
          created_at: product.created_at,
          updated_at: product.updated_at
        } as Product);
      } else {
        onSubmit(processedData);
      }
    }
  };

  // Deshabilitar el formulario durante el procesamiento
  const isDisabled = isProcessing;

  // Mapear las categorías para mostrar versiones con tildes
  const categoryOptions = Object.entries(displayCategoryMap).map(([key, value]) => (
      <SelectItem key={key} value={value}>{value}</SelectItem>
  ));

  // Mapear las ubicaciones para mostrar versiones con tildes
  const locationOptions = Object.entries(displayLocationMap).map(([key, value]) => (
      <SelectItem key={key} value={value}>{value}</SelectItem>
  ));

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {stockAlert && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Alerta de stock</AlertTitle>
              <AlertDescription>
                El stock actual ({formData.current_stock}) está por debajo del stock mínimo ({formData.min_stock}).
                Considere reabastecer este producto pronto.
              </AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="code">Código del producto <span className="text-red-500">*</span></Label>
            <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={errors.code ? 'border-red-500' : ''}
                disabled={isDisabled || !!product}  // Deshabilitar el campo de código si es edición
            />
            {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del producto <span className="text-red-500">*</span></Label>
            <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-red-500' : ''}
                disabled={isDisabled}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_stock">Stock actual <span className="text-red-500">*</span></Label>
            <Input
                id="current_stock"
                name="current_stock"
                type="number"
                min="0"
                step="1"
                value={formData.current_stock}
                onChange={handleChange}
                className={errors.current_stock ? 'border-red-500' : ''}
                disabled={isDisabled}
            />
            {errors.current_stock && <p className="text-xs text-red-500">{errors.current_stock}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="min_stock">Stock mínimo <span className="text-red-500">*</span></Label>
            <Input
                id="min_stock"
                name="min_stock"
                type="number"
                min="0"
                step="1"
                value={formData.min_stock}
                onChange={handleChange}
                className={errors.min_stock ? 'border-red-500' : ''}
                disabled={isDisabled}
            />
            {errors.min_stock && <p className="text-xs text-red-500">{errors.min_stock}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select
                key={`category-select-${product?.id || 'new'}`}
                value={categoryValue}
                onValueChange={setCategoryValue}
                disabled={isDisabled}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="none-value" value="none">Sin categoría</SelectItem>
                {categoryOptions}
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-500">Valor seleccionado: {categoryValue}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Select
                key={`location-select-${product?.id || 'new'}`}
                value={locationValue}
                onValueChange={setLocationValue}
                disabled={isDisabled}
            >
              <SelectTrigger id="location">
                <SelectValue placeholder="Seleccionar ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="none-value" value="none">Sin ubicación</SelectItem>
                {locationOptions}
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-500">Valor seleccionado: {locationValue}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">Proveedor</Label>
            <Select
                key={`supplier-select-${product?.id || 'new'}`}
                value={supplierValue}
                onValueChange={setSupplierValue}
                disabled={isDisabled}
            >
              <SelectTrigger id="supplier">
                <SelectValue placeholder="Seleccionar proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="none-value" value="none">Sin proveedor</SelectItem>
                <SelectItem key="techsupplies" value="TechSupplies Corp.">TechSupplies Corp.</SelectItem>
                <SelectItem key="conveyortech" value="ConveyorTech Inc.">ConveyorTech Inc.</SelectItem>
                <SelectItem key="opticnet" value="OpticNet Solutions">OpticNet Solutions</SelectItem>
                <SelectItem key="cooltech" value="CoolTech Systems">CoolTech Systems</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-500">Valor seleccionado: {supplierValue}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio unitario</Label>
            <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? 'border-red-500' : ''}
                disabled={isDisabled}
            />
            {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="qc_status">Estado de calidad</Label>
            <Select
                key={`qc-status-select-${product?.id || 'new'}`}
                value={qcStatusValue}
                onValueChange={setQcStatusValue}
                disabled={isDisabled}
            >
              <SelectTrigger id="qc_status">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="pending-value" value="pending">Pendiente</SelectItem>
                <SelectItem key="approved-value" value="approved">Aprobado</SelectItem>
                <SelectItem key="rejected-value" value="rejected">Rechazado</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-500">Valor seleccionado: {qcStatusValue}</div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                disabled={isDisabled}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isDisabled}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
              type="submit"
              disabled={isDisabled}
          >
            {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {product ? 'Actualizando...' : 'Guardando...'}
                </>
            ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {product ? 'Actualizar producto' : 'Guardar producto'}
                </>
            )}
          </Button>
        </div>
      </form>
  );
};

export default ProductForm;