// src/components/reports/ProductMovementTable.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, RotateCcw } from 'lucide-react';

interface ProductMovementTableProps {
  limit?: number;
}

const ProductMovementTable: React.FC<ProductMovementTableProps> = ({ limit }) => {
  // Datos de ejemplo para la tabla
  const movements = [
    { 
      id: 1, 
      date: '2025-04-20T14:30:00Z', 
      type: 'in', 
      product: 'Motor eléctrico 2HP', 
      code: 'P001',
      quantity: 10, 
      user: 'María López', 
      reference: 'OC-12345' 
    },
    { 
      id: 2, 
      date: '2025-04-18T09:15:00Z', 
      type: 'out', 
      product: 'Sensores de proximidad', 
      code: 'P002',
      quantity: 15, 
      user: 'Carlos Gómez', 
      reference: 'OP-78901' 
    },
    { 
      id: 3, 
      date: '2025-04-17T11:20:00Z', 
      type: 'adjustment', 
      product: 'Placa base industrial', 
      code: 'P003',
      quantity: 2, 
      user: 'Ana Martínez', 
      reference: 'INV-001' 
    },
    { 
      id: 4, 
      date: '2025-04-15T16:45:00Z', 
      type: 'out', 
      product: 'Válvula hidráulica', 
      code: 'P004',
      quantity: 5, 
      user: 'Pedro Sánchez', 
      reference: 'OP-78902' 
    },
    { 
      id: 5, 
      date: '2025-04-14T10:30:00Z', 
      type: 'in', 
      product: 'Cinta transportadora', 
      code: 'P005',
      quantity: 2, 
      user: 'María López', 
      reference: 'OC-12346' 
    },
    { 
      id: 6, 
      date: '2025-04-13T08:20:00Z', 
      type: 'out', 
      product: 'Rodamiento industrial', 
      code: 'P006',
      quantity: 20, 
      user: 'Carlos Gómez', 
      reference: 'OP-78903' 
    },
    { 
      id: 7, 
      date: '2025-04-10T13:15:00Z', 
      type: 'adjustment', 
      product: 'Piezas de aluminio', 
      code: 'P007',
      quantity: -3, 
      user: 'Ana Martínez', 
      reference: 'INV-002' 
    },
    { 
      id: 8, 
      date: '2025-04-05T15:40:00Z', 
      type: 'in', 
      product: 'Cable de fibra óptica', 
      code: 'P008',
      quantity: 8, 
      user: 'María López', 
      reference: 'OC-12347' 
    },
    { 
      id: 9, 
      date: '2025-04-03T11:25:00Z', 
      type: 'out', 
      product: 'Tornillo hexagonal', 
      code: 'P009',
      quantity: 100, 
      user: 'Carlos Gómez', 
      reference: 'OP-78904' 
    },
    { 
      id: 10, 
      date: '2025-04-01T09:50:00Z', 
      type: 'in', 
      product: 'Sistema de refrigeración', 
      code: 'P010',
      quantity: 3, 
      user: 'María López', 
      reference: 'OC-12348' 
    }
  ];

  // Limitar el número de filas si es necesario
  const limitedMovements = limit ? movements.slice(0, limit) : movements;

  // Formatear fecha
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
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Referencia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {limitedMovements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell className="text-sm">{formatDate(movement.date)}</TableCell>
              <TableCell className="font-mono text-sm">{movement.code}</TableCell>
              <TableCell className="text-sm">
                <div className="max-w-40 truncate">
                  {movement.product}
                </div>
              </TableCell>
              <TableCell>
                {movement.type === 'in' ? (
                  <Badge className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 flex w-24 justify-center items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    Entrada
                  </Badge>
                ) : movement.type === 'out' ? (
                  <Badge className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300 flex w-24 justify-center items-center gap-1">
                    <ArrowDownRight className="h-3 w-3" />
                    Salida
                  </Badge>
                ) : (
                  <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 flex w-24 justify-center items-center gap-1">
                    <RotateCcw className="h-3 w-3" />
                    Ajuste
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right font-mono">
                <span className={
                  movement.type === 'in' 
                    ? 'text-green-600 dark:text-green-400' 
                    : movement.type === 'out' 
                      ? 'text-red-600 dark:text-red-400' 
                      : movement.quantity >= 0 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-amber-600 dark:text-amber-400'
                }>
                  {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : ''}
                  {Math.abs(movement.quantity)}
                </span>
              </TableCell>
              <TableCell className="text-sm">{movement.user}</TableCell>
              <TableCell className="text-sm font-mono">{movement.reference}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductMovementTable;