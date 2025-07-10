// src/services/productService.ts
import { Product, ProductCreate, QCStatus } from "@/types/product";
import {
  mapCategoryToId, mapLocationToId, mapSupplierToId,
  displayCategoryMap, displayLocationMap
} from "@/utils/entityMapper";

const API_URL = 'http://localhost:5000/api/v1';

// Definir interfaces para los datos del backend
interface ApiProduct {
  id: number;
  code: string;
  name: string;
  current_stock: number;
  min_stock: number;
  description?: string;
  price?: number;
  qc_status?: string;
  category?: string;
  location?: string;
  supplier?: string;
  category_id?: number;
  location_id?: number;
  supplier_id?: number;
  created_at: string;
  updated_at: string;
}

interface ApiProductResponse {
  items: ApiProduct[];
  total: number;
  page: number;
  pages: number;
}

interface ApiAlertProduct {
  id: number;
  code: string;
  name: string;
  current_stock: number;
  min_stock: number;
  difference: number;
  category?: string;
  location?: string;
  supplier?: string;
  daysToStockOut?: number;
  lead_time?: number;
}

// Función para convertir QC Status
const convertQcStatus = (status?: string): QCStatus => {
  if (!status) return 'pending';

  if (status === 'approved' || status === 'pending' || status === 'rejected') {
    return status;
  }

  return status as QCStatus;
};

export const productService = {
  // Obtener todos los productos con filtros opcionales
  async getProducts(filters?: {
    search?: string;
    category?: string;
    location?: string;
    supplier?: string;
    stock_status?: string;
    skip?: number;
    limit?: number;
  }): Promise<{ items: Product[]; total: number; page: number; pages: number }> {
    try {
      // Construir los parámetros de consulta
      const queryParams = new URLSearchParams();

      if (filters) {
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.category) {
          const categoryId = mapCategoryToId(filters.category);
          if (categoryId) queryParams.append('category', categoryId.toString());
        }
        if (filters.location) {
          const locationId = mapLocationToId(filters.location);
          if (locationId) queryParams.append('location', locationId.toString());
        }
        if (filters.supplier) {
          const supplierId = mapSupplierToId(filters.supplier);
          if (supplierId) queryParams.append('supplier', supplierId.toString());
        }
        if (filters.stock_status) queryParams.append('stock_status', filters.stock_status);
        if (filters.skip !== undefined) queryParams.append('skip', filters.skip.toString());
        if (filters.limit !== undefined) queryParams.append('limit', filters.limit.toString());
      }

      const url = `${API_URL}/products?${queryParams.toString()}`;
      const response = await fetch(url);

      // Manejar respuesta no exitosa
      if (!response.ok) {
        const errorMessage = `Error: ${response.status}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json() as ApiProductResponse;

      // Transformar datos del backend al formato que espera la interfaz
      const products: Product[] = data.items.map((item: ApiProduct) => {
        // Asegurar que las categorías y ubicaciones tengan sus tildes correctas
        const categoryName = item.category ? displayCategoryMap[item.category] || item.category : '';
        const locationName = item.location ? displayLocationMap[item.location] || item.location : '';

        return {
          id: item.id,
          code: item.code,
          name: item.name,
          current_stock: item.current_stock,
          min_stock: item.min_stock,
          category: categoryName,
          location: locationName,
          supplier: item.supplier || '',
          description: item.description || '',
          price: item.price || 0,
          qc_status: convertQcStatus(item.qc_status),
          created_at: item.created_at,
          updated_at: item.updated_at
        };
      });

      return {
        items: products,
        total: data.total,
        page: data.page,
        pages: data.pages
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Obtener un producto por su ID
  async getProductById(id: number): Promise<Product> {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);

      // Manejar respuesta no exitosa
      if (!response.ok) {
        const errorMessage = `Error: ${response.status}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json() as ApiProduct;

      // Transformar datos del backend al formato que espera la interfaz
      const categoryName = data.category ? displayCategoryMap[data.category] || data.category : '';
      const locationName = data.location ? displayLocationMap[data.location] || data.location : '';

      // Devolver directamente el objeto
      return {
        id: data.id,
        code: data.code,
        name: data.name,
        current_stock: data.current_stock,
        min_stock: data.min_stock,
        category: categoryName,
        location: locationName,
        supplier: data.supplier || '',
        description: data.description || '',
        price: data.price || 0,
        qc_status: convertQcStatus(data.qc_status),
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo producto
  async createProduct(product: ProductCreate): Promise<Product> {
    try {
      // Mapeo para backend - Convertir 'none' a valores nulos
      const categoryId = product.category && product.category !== 'none'
          ? mapCategoryToId(product.category)
          : null;

      const locationId = product.location && product.location !== 'none'
          ? mapLocationToId(product.location)
          : null;

      const supplierId = product.supplier && product.supplier !== 'none'
          ? mapSupplierToId(product.supplier)
          : null;

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          code: product.code,
          current_stock: product.current_stock,
          min_stock: product.min_stock,
          description: product.description || '',
          price: product.price || 0,
          qc_status: product.qc_status || 'pending',
          category_id: categoryId,
          location_id: locationId,
          supplier_id: supplierId,
        }),
      });

      // Manejar respuesta no exitosa
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = `Error: ${response.status} - ${errorData.error}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json() as ApiProduct;

      // Transformar la respuesta al formato del frontend
      const categoryName = data.category ? displayCategoryMap[data.category] || data.category : '';
      const locationName = data.location ? displayLocationMap[data.location] || data.location : '';

      return {
        id: data.id,
        code: data.code,
        name: data.name,
        current_stock: data.current_stock,
        min_stock: data.min_stock,
        category: categoryName,
        location: locationName,
        supplier: data.supplier || '',
        description: data.description || '',
        price: data.price || 0,
        qc_status: convertQcStatus(data.qc_status),
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Actualizar un producto existente
  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    try {
      // Mapeo para backend - Convertir 'none' a valores nulos
      const categoryId = product.category && product.category !== 'none'
          ? mapCategoryToId(product.category)
          : null;

      const locationId = product.location && product.location !== 'none'
          ? mapLocationToId(product.location)
          : null;

      const supplierId = product.supplier && product.supplier !== 'none'
          ? mapSupplierToId(product.supplier)
          : null;

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          current_stock: product.current_stock,
          min_stock: product.min_stock,
          description: product.description,
          price: product.price,
          qc_status: product.qc_status,
          category_id: categoryId,
          location_id: locationId,
          supplier_id: supplierId,
        }),
      });

      // Manejar respuesta no exitosa
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = `Error: ${response.status} - ${errorData.error}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json() as ApiProduct;

      // Transformar la respuesta al formato del frontend
      const categoryName = data.category ? displayCategoryMap[data.category] || data.category : '';
      const locationName = data.location ? displayLocationMap[data.location] || data.location : '';

      return {
        id: data.id,
        code: data.code,
        name: data.name,
        current_stock: data.current_stock,
        min_stock: data.min_stock,
        category: categoryName,
        location: locationName,
        supplier: data.supplier || '',
        description: data.description || '',
        price: data.price || 0,
        qc_status: convertQcStatus(data.qc_status),
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un producto
  async deleteProduct(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
      });

      // Manejar respuesta no exitosa
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = `Error: ${response.status} - ${errorData.error}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      return true;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener productos con stock bajo
  async getLowStockProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products/alerts`);

      // Manejar respuesta no exitosa
      if (!response.ok) {
        const errorMessage = `Error: ${response.status}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json() as ApiAlertProduct[];

      // Transformar y devolver directamente los datos al formato que espera la interfaz
      return data.map((item: ApiAlertProduct) => {
        // Asegurar que las categorías y ubicaciones tengan sus tildes correctas
        const categoryName = item.category ? displayCategoryMap[item.category] || item.category : '';
        const locationName = item.location ? displayLocationMap[item.location] || item.location : '';

        return {
          id: item.id,
          code: item.code,
          name: item.name,
          current_stock: item.current_stock,
          min_stock: item.min_stock,
          category: categoryName,
          location: locationName,
          supplier: item.supplier || '',
          description: '',
          price: 0,
          qc_status: 'pending' as QCStatus,
          created_at: '',
          updated_at: ''
        };
      });
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      throw error;
    }
  }
};