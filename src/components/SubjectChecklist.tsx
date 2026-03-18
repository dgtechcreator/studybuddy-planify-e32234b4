import { Subject } from "@/types/study";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  subject: Subject;
  onToggleTopic: (subjectId: string, chapterId: string, topicId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function SubjectChecklist({ subject, onToggleTopic, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const total = subject.chapters.reduce((a, c) => a + c.topics.length, 0);
  const completed = subject.chapters.reduce((a, c) => a + c.topics.filter((t) => t.completed).length, 0);
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <h3 className="font-semibold text-foreground">{subject.name}</h3>
          <span className="text-xs text-muted-foreground">({completed}/{total} · {pct}%)</span>
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={onEdit} className="p-1 hover:bg-muted rounded">
            <Edit size={16} className="text-muted-foreground" />
          </button>
          <button onClick={onDelete} className="p-1 hover:bg-muted rounded">
            <Trash2 size={16} className="text-destructive" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          {subject.chapters.map((chapter) => (
            <div key={chapter.id} className="space-y-1">
              <p className="text-sm font-medium text-foreground ml-2">{chapter.name}</p>
              {chapter.topics.map((topic) => (
                <label
                  key={topic.id}
                  className="flex items-center gap-2 ml-6 py-0.5 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={topic.completed}
                    onChange={() => onToggleTopic(subject.id, chapter.id, topic.id)}
                    className="accent-primary"
                  />
                  <span className={topic.completed ? "line-through text-muted-foreground" : "text-foreground"}>
                    {topic.name}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    topic.topic_type === "practical"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {topic.topic_type === "practical" ? "P" : "W"}
                  </span>
                </label>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
