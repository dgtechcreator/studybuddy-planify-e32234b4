import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function UserCountBadge() {
  const [count, setCount] = useState<number | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    (supabase.rpc as any)("get_total_users_count").then(({ data }: any) => {
      if (typeof data === "number") setCount(data);
    });
  }, []);

  useEffect(() => {
    if (count == null) return;
    const start = performance.now();
    const duration = 900;
    const from = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setDisplay(Math.floor(from + (count - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [count]);

  if (count == null) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-primary-foreground text-xs font-medium">
      <Users size={14} />
      <span className="tabular-nums font-semibold">{display.toLocaleString()}</span>
      <span className="opacity-90">learners tracking progress</span>
    </div>
  );
}
