// src/types/product.ts

export interface ProductBase {
  code: string;
  name: string;
  current_stock: number;
  min_stock: number;
  description?: string;
  category?: string;
  location?: string;
  supplier?: string;
  price?: number;
  qc_status?: QCStatus;
  last_movement?: string;
}

export interface Product extends ProductBase {
  id: number;
  created_at: string;
  updated_at: string;
}

// ProductCreate ahora incluye un campo adicional para diferenciarlo de ProductBase
export interface ProductCreate extends ProductBase {
  // Este campo opcional nos ayuda a diferenciar la interfaz
  isNewProduct?: boolean;
}

export interface ProductUpdate {
  name?: string;
  current_stock?: number;
  min_stock?: number;
  description?: string;
  category?: string;
  location?: string;
  supplier?: string;
  price?: number;
  qc_status?: QCStatus;
}

export interface AlertProduct extends Product {
  difference: number;
  daysToStockOut?: number;
  lead_time?: number;
  last_order_date?: string;
  priority?: AlertPriority;
}

// Tipos de alerta y estados
export type QCStatus = 'approved' | 'pending' | 'rejected' | string;
export type StockStatus = 'ok' | 'low' | 'critical' | 'stockout';
export type AlertPriority = 'high' | 'medium' | 'low';
export type AlertSeverity = 'default' | 'destructive' | 'outline' | 'secondary';

// Tipos para gráficos
export interface InventoryValueData {
  month: string;
  value: number;
}

export interface InventoryDistributionData {
  name: string;
  value: number;
}

export interface StockTurnoverData {
  name: string;
  turnover: number;
  average: number;
}

export interface StockAlertsByCategoryData {
  name: string;
  stockout: number;
  low: number;
  warning: number;
}

// Funciones utilitarias
export function getAlertPriorityFromDays(days: number): AlertPriority {
  if (days <= 7) return 'high';
  if (days <= 15) return 'medium';
  return 'low';
}

export function getAlertSeverityFromPriority(priority: AlertPriority): AlertSeverity {
  switch (priority) {
    case 'high': return 'destructive';
    case 'medium': return 'secondary';
    case 'low': return 'outline';
    default: return 'default';
  }
}

export function getAlertSeverityFromDays(days: number): AlertSeverity {
  return getAlertSeverityFromPriority(getAlertPriorityFromDays(days));
}