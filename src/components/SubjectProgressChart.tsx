import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Subject } from "@/types/study";

interface Props {
  subjects: Subject[];
}

export default function SubjectProgressChart({ subjects }: Props) {
  const data = subjects.map((s) => {
    const total = s.chapters.reduce((a, c) => a + c.topics.length, 0);
    const completed = s.chapters.reduce((a, c) => a + c.topics.filter((t) => t.completed).length, 0);
    return {
      name: s.name.length > 12 ? s.name.slice(0, 12) + "…" : s.name,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  if (data.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-2">Subject-wise Progress</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
