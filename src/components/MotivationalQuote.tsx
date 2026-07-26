import { Sparkles } from "lucide-react";

const QUOTES = [
  "Small steps every day lead to big results.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The expert in anything was once a beginner.",
  "Don't watch the clock; do what it does. Keep going.",
  "Discipline is choosing between what you want now and what you want most.",
  "Study while others are sleeping; work while others are loafing.",
  "The beautiful thing about learning is nobody can take it away from you.",
  "Push yourself, because no one else is going to do it for you.",
];

export default function MotivationalQuote() {
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const quote = QUOTES[day % QUOTES.length];
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/20 text-sm text-foreground/80 italic">
      <Sparkles size={16} className="text-primary shrink-0" />
      <span>{quote}</span>
    </div>
  );
}
