// src/components/reports/InventoryDistributionChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Definir la interfaz para los datos del gráfico
interface ChartData {
  name: string;
  value: number;
}

// Definir la interfaz para las propiedades de la etiqueta personalizada
interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

const InventoryDistributionChart: React.FC = () => {
  // Datos de ejemplo para el gráfico
  const data: ChartData[] = [
    { name: 'Electrónica', value: 45000 },
    { name: 'Motores', value: 25000 },
    { name: 'Sensores', value: 18000 },
    { name: 'Hidráulica', value: 15000 },
    { name: 'Refrigeración', value: 12000 },
    { name: 'Otros', value: 10680 },
  ];

  // Colores para cada segmento del gráfico
  const COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
    'var(--muted-foreground)',
  ];

  // Formatear valores en el tooltip
  const formatTooltipValue = (value: number): [string, string] => {
    return [`$${value.toLocaleString()}`, 'Valor'];
  };

  // Renderizar etiqueta personalizada
  const renderCustomizedLabel = (props: CustomizedLabelProps): React.ReactNode => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    // Solo mostrar etiqueta para segmentos con porcentaje significativo
    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius="80%"
          innerRadius="40%"
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={formatTooltipValue}
          contentStyle={{
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            fontSize: '12px'
          }}
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default InventoryDistributionChart;