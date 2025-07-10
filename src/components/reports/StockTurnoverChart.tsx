// src/components/reports/StockTurnoverChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// Definir la interfaz para los datos del gráfico
interface ChartData {
  name: string;
  turnover: number;
  average: number;
}

// Definir interfaz para el tooltip personalizado
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
  }>;
  label?: string;
}

const StockTurnoverChart: React.FC = () => {
  // Datos de ejemplo para el gráfico
  const data: ChartData[] = [
    {
      name: 'Q1 2024',
      turnover: 3.8,
      average: 4.0
    },
    {
      name: 'Q2 2024',
      turnover: 4.2,
      average: 4.0
    },
    {
      name: 'Q3 2024',
      turnover: 4.5,
      average: 4.0
    },
    {
      name: 'Q4 2024',
      turnover: 4.1,
      average: 4.0
    },
    {
      name: 'Q1 2025',
      turnover: 4.7,
      average: 4.0
    }
  ];

  // Tooltip personalizada
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-sm text-xs">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            <span className="font-medium">Rotación:</span> {payload[0].value.toFixed(1)}
          </p>
          <p className="text-xs text-muted-foreground">
            * Veces que el inventario se ha renovado
          </p>
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
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
        <YAxis className="text-xs fill-muted-foreground" />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <ReferenceLine
          y={4.0}
          label={{
            value: 'Objetivo',
            position: 'insideTopRight',
            fontSize: '10px',
            fill: 'var(--muted-foreground)'
          }}
          stroke="var(--muted-foreground)"
          strokeDasharray="3 3"
        />
        <Bar
          dataKey="turnover"
          name="Rotación de Inventario"
          fill="var(--primary)"
          barSize={40}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StockTurnoverChart;