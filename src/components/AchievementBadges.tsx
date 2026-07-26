import { Award, Flame, Target, Trophy, Star, Rocket } from "lucide-react";

interface Props {
  completed: number;
  progress: number;
}

export default function AchievementBadges({ completed, progress }: Props) {
  const badges = [
    { icon: Rocket, label: "First Steps", unlocked: completed >= 1 },
    { icon: Star, label: "10 Topics", unlocked: completed >= 10 },
    { icon: Flame, label: "50 Topics", unlocked: completed >= 50 },
    { icon: Target, label: "25% Done", unlocked: progress >= 25 },
    { icon: Award, label: "50% Done", unlocked: progress >= 50 },
    { icon: Trophy, label: "Champion", unlocked: progress >= 100 },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Achievements</h3>
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.label}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                b.unlocked
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-muted text-muted-foreground/50 border border-transparent"
              }`}
              title={b.unlocked ? "Unlocked!" : "Locked"}
            >
              <Icon size={12} />
              {b.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
