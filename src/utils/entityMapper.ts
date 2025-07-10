// src/utils/entityMapper.ts

// Mapas de entidades para convertir entre nombres e IDs
export const categoryMap: Record<string, number> = {
  'Motores': 1,
  'Sensores': 2,
  'Electronica': 3, // Sin tilde para la clave del objeto
  'Hidraulica': 4, // Sin tilde
  'Transporte': 5,
  'Mecanica': 6, // Sin tilde
  'Materiales': 7,
  'Refrigeracion': 8, // Sin tilde
  'Ferreteria': 9, // Sin tilde
};

export const locationMap: Record<string, number> = {
  'Almacen A': 1, // Sin tilde
  'Almacen B': 2, // Sin tilde
  'Almacen C': 3, // Sin tilde
  'Almacen D': 4, // Sin tilde
};

export const supplierMap: Record<string, number> = {
  'TechSupplies Corp.': 1,
  'ConveyorTech Inc.': 2,
  'OpticNet Solutions': 3,
  'CoolTech Systems': 4,
};

// Mapas para visualización (con tildes correctas)
export const displayCategoryMap: Record<string, string> = {
  'Electronica': 'Electrónica',
  'Hidraulica': 'Hidráulica',
  'Mecanica': 'Mecánica',
  'Refrigeracion': 'Refrigeración',
  'Ferreteria': 'Ferretería',
  'Motores': 'Motores',
  'Sensores': 'Sensores',
  'Transporte': 'Transporte',
  'Materiales': 'Materiales',
};

export const displayLocationMap: Record<string, string> = {
  'Almacen A': 'Almacén A',
  'Almacen B': 'Almacén B',
  'Almacen C': 'Almacén C',
  'Almacen D': 'Almacén D',
};

// Mapas inversos para convertir de IDs a nombres internos (sin tildes)
export const categoryIdToName: Record<number, string> = Object.entries(categoryMap)
  .reduce((acc, [name, id]) => ({ ...acc, [id]: name }), {});

export const locationIdToName: Record<number, string> = Object.entries(locationMap)
  .reduce((acc, [name, id]) => ({ ...acc, [id]: name }), {});

export const supplierIdToName: Record<number, string> = Object.entries(supplierMap)
  .reduce((acc, [name, id]) => ({ ...acc, [id]: name }), {});

/**
 * Funciones para convertir nombres a IDs
 */
export const mapCategoryToId = (categoryName: string): number | null => {
  // Intentar mapear directamente o buscar la versión sin tildes
  return categoryMap[categoryName] ||
         categoryMap[Object.keys(displayCategoryMap).find(key =>
           displayCategoryMap[key] === categoryName) || ''] ||
         null;
};

export const mapLocationToId = (locationName: string): number | null => {
  return locationMap[locationName] ||
         locationMap[Object.keys(displayLocationMap).find(key =>
           displayLocationMap[key] === locationName) || ''] ||
         null;
};

export const mapSupplierToId = (supplierName: string): number | null => {
  return supplierName ? supplierMap[supplierName] || null : null;
};

/**
 * Funciones para convertir IDs a nombres (con formato y tildes adecuadas)
 */
export const mapIdToCategory = (categoryId: number): string => {
  const internalName = categoryIdToName[categoryId] || '';
  return internalName ? (displayCategoryMap[internalName] || internalName) : '';
};

export const mapIdToLocation = (locationId: number): string => {
  const internalName = locationIdToName[locationId] || '';
  return internalName ? (displayLocationMap[internalName] || internalName) : '';
};

export const mapIdToSupplier = (supplierId: number): string => {
  return supplierIdToName[supplierId] || '';
};