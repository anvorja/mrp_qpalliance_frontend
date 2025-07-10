// src/components/reports/StockAlertsByCategory.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Definir la interfaz para los datos del gráfico
interface ChartData {
  name: string;
  stockout: number;
  low: number;
  warning: number;
}

// Definir interfaz para el tooltip personalizado
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const StockAlertsByCategory: React.FC = () => {
  // Datos de ejemplo para el gráfico
  const data: ChartData[] = [
    {
      name: 'Electrónica',
      stockout: 2,
      low: 5,
      warning: 3
    },
    {
      name: 'Motores',
      stockout: 1,
      low: 2,
      warning: 2
    },
    {
      name: 'Sensores',
      stockout: 3,
      low: 4,
      warning: 2
    },
    {
      name: 'Hidráulica',
      stockout: 0,
      low: 2,
      warning: 4
    },
    {
      name: 'Refrigeración',
      stockout: 1,
      low: 3,
      warning: 2
    },
    {
      name: 'Mecánica',
      stockout: 0,
      low: 1,
      warning: 3
    }
  ];

  // Personalizar tooltip
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-sm text-xs">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {entry.value} productos
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        barGap={0}
        barCategoryGap="15%"
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
        <YAxis className="text-xs fill-muted-foreground" />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar
          dataKey="stockout"
          name="Sin Stock"
          stackId="a"
          fill="var(--destructive)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="low"
          name="Stock Crítico"
          stackId="a"
          fill="var(--chart-5)"
        />
        <Bar
          dataKey="warning"
          name="Stock Bajo"
          stackId="a"
          fill="var(--chart-4)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StockAlertsByCategory;