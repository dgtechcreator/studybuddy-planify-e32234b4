import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Subject } from "@/types/study";

interface Props {
  subjects: Subject[];
}

export default function TopicTypeChart({ subjects }: Props) {
  let written = 0;
  let practical = 0;
  let writtenDone = 0;
  let practicalDone = 0;
  subjects.forEach((s) =>
    s.chapters.forEach((c) =>
      c.topics.forEach((t) => {
        if (t.topic_type === "practical") {
          practical++;
          if (t.completed) practicalDone++;
        } else {
          written++;
          if (t.completed) writtenDone++;
        }
      })
    )
  );

  const data = [
    { name: "Written", value: written },
    { name: "Practical", value: practical },
  ];
  const COLORS = ["hsl(var(--primary))", "hsl(var(--primary-glow))"];

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-2">Written vs Practical</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={{ fontSize: 11 }}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-1 text-xs text-muted-foreground">
        <div className="text-center">Written: {writtenDone}/{written}</div>
        <div className="text-center">Practical: {practicalDone}/{practical}</div>
      </div>
    </div>
  );
}
