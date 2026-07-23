"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export interface DonutDatum {
  name: string;
  value: number;
  color: string;
}

interface RingLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  value: number;
}

function renderRingLabel({ cx, cy, midAngle, innerRadius, outerRadius, value }: RingLabelProps) {
  const radius = (innerRadius + outerRadius) / 2;
  const radians = (-midAngle * Math.PI) / 180;
  const x = cx + radius * Math.cos(radians);
  const y = cy + radius * Math.sin(radians);

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={13}
      fontWeight={600}
    >
      {value}
    </text>
  );
}

export default function DonutChart({ data }: { data: DonutDatum[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <div className="relative mx-auto h-[190px] w-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={90}
              paddingAngle={2}
              startAngle={90}
              endAngle={450}
              stroke="none"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              label={renderRingLabel as any}
              labelLine={false}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{total}</div>
          <div className="text-xs text-[var(--text-muted)]">Total</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-[var(--text-muted)]">
        {data.map((d) => (
          <span key={d.name} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            {d.name} ({Math.round((d.value / total) * 100)}%)
          </span>
        ))}
      </div>
    </div>
  );
}
