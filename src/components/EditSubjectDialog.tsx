import { useState } from "react";
import { Subject, TopicType } from "@/types/study";
import { Plus, Trash2, X } from "lucide-react";
import { v4 } from "@/lib/uuid";

interface Props {
  subject: Subject;
  onSave: (subject: Subject) => void;
  onClose: () => void;
}

export default function EditSubjectDialog({ subject, onSave, onClose }: Props) {
  const [name, setName] = useState(subject.name);
  const [chapters, setChapters] = useState(
    subject.chapters.map((c) => ({
      name: c.name,
      topics: c.topics.map((t) => ({ name: t.name, type: t.topic_type, completed: t.completed })),
    }))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: subject.id,
      name: name.trim(),
      chapters: chapters
        .filter((c) => c.name.trim())
        .map((c) => ({
          id: v4(),
          name: c.name.trim(),
          topics: c.topics
            .filter((t) => t.name.trim())
            .map((t) => ({
              id: v4(),
              name: t.name.trim(),
              completed: t.completed,
              topic_type: t.type,
            })),
        })),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-4 space-y-4 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Edit Subject</h3>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          required
        />

        {chapters.map((ch, chIdx) => (
          <div key={chIdx} className="border border-border rounded-md p-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                value={ch.name}
                onChange={(e) => {
                  const u = [...chapters];
                  u[chIdx].name = e.target.value;
                  setChapters(u);
                }}
                placeholder={`Chapter ${chIdx + 1}`}
                className="flex-1 px-3 py-1.5 border border-input rounded-md bg-background text-foreground text-sm"
              />
              <button type="button" onClick={() => setChapters(chapters.filter((_, i) => i !== chIdx))} className="text-destructive">
                <Trash2 size={16} />
              </button>
            </div>
            {ch.topics.map((t, tIdx) => (
              <div key={tIdx} className="flex items-center gap-2 ml-4">
                <input
                  value={t.name}
                  onChange={(e) => {
                    const u = [...chapters];
                    u[chIdx].topics[tIdx].name = e.target.value;
                    setChapters(u);
                  }}
                  placeholder={`Topic ${tIdx + 1}`}
                  className="flex-1 px-2 py-1 border border-input rounded-md bg-background text-foreground text-sm"
                />
                <select
                  value={t.type}
                  onChange={(e) => {
                    const u = [...chapters];
                    u[chIdx].topics[tIdx].type = e.target.value as TopicType;
                    setChapters(u);
                  }}
                  className="px-2 py-1 border border-input rounded-md bg-background text-foreground text-sm"
                >
                  <option value="written">Written</option>
                  <option value="practical">Practical</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const u = [...chapters];
                    u[chIdx].topics = u[chIdx].topics.filter((_, i) => i !== tIdx);
                    setChapters(u);
                  }}
                  className="text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const u = [...chapters];
                u[chIdx].topics.push({ name: "", type: "written", completed: false });
                setChapters(u);
              }}
              className="ml-4 text-xs text-primary hover:underline flex items-center gap-1"
            >
              <Plus size={12} /> Add Topic
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setChapters([...chapters, { name: "", topics: [{ name: "", type: "written" as TopicType, completed: false }] }])}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <Plus size={14} /> Add Chapter
        </button>

        <button type="submit" className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90">
          Save Changes
        </button>
      </form>
    </div>
  );
}
