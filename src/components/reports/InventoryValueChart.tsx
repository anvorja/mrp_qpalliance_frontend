// src/components/reports/InventoryValueChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Definir la interfaz para los datos del gráfico
interface ChartData {
  month: string;
  value: number;
}

const InventoryValueChart: React.FC = () => {
  // Datos de ejemplo para el gráfico
  const data: ChartData[] = [
    { month: 'Ene', value: 98500 },
    { month: 'Feb', value: 102300 },
    { month: 'Mar', value: 110500 },
    { month: 'Abr', value: 115800 },
    { month: 'May', value: 108200 },
    { month: 'Jun', value: 119000 },
    { month: 'Jul', value: 125680 },
  ];

  // Formatear valores en el eje Y como moneda
  const formatYAxis = (value: number): string => {
    return `$${value.toLocaleString()}`;
  };

  // Formatear valores en el tooltip
  const formatTooltipValue = (value: number): [string, string] => {
    return [`$${value.toLocaleString()}`, 'Valor'];
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="month"
          className="text-xs fill-muted-foreground"
        />
        <YAxis
          tickFormatter={formatYAxis}
          className="text-xs fill-muted-foreground"
        />
        <Tooltip
          formatter={formatTooltipValue}
          contentStyle={{
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            fontSize: '12px'
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Line
          type="monotone"
          dataKey="value"
          name="Valor de Inventario"
          stroke="var(--primary)"
          strokeWidth={2}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default InventoryValueChart;