import { TopicType } from "@/types/study";

interface Props {
  filterType: TopicType | "all";
  onFilterChange: (type: TopicType | "all") => void;
}

export default function TopicTypeFilter({ filterType, onFilterChange }: Props) {
  const options: { label: string; value: TopicType | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Written", value: "written" },
    { label: "Practical", value: "practical" },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Filter:</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onFilterChange(opt.value)}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
            filterType === opt.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:bg-muted"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
