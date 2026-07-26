import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Props {
  completed: number;
  remaining: number;
}

export default function CompletionPieChart({ completed, remaining }: Props) {
  const total = completed + remaining;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const data = [
    { name: "Completed", value: completed },
    { name: "Remaining", value: remaining },
  ];
  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];

  return (
    <div className="bg-card border border-border rounded-xl p-4 relative">
      <h3 className="text-sm font-semibold text-foreground mb-2">Overall Progress</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-6">
          <span className="text-2xl font-bold text-primary">{percent}%</span>
          <span className="text-xs text-muted-foreground">done</span>
        </div>
      </div>
    </div>
  );
}
