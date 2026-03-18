import { useState } from "react";
import { Subject, Chapter, Topic, TopicType } from "@/types/study";
import { Plus, Trash2, X } from "lucide-react";
import { v4 } from "@/lib/uuid";

interface Props {
  onAdd: (subject: Subject) => void;
  onCancel: () => void;
}

export default function SubjectForm({ onAdd, onCancel }: Props) {
  const [name, setName] = useState("");
  const [chapters, setChapters] = useState<{ name: string; topics: { name: string; type: TopicType }[] }[]>([
    { name: "", topics: [{ name: "", type: "written" }] },
  ]);

  const addChapter = () => setChapters([...chapters, { name: "", topics: [{ name: "", type: "written" }] }]);

  const addTopic = (chIdx: number) => {
    const updated = [...chapters];
    updated[chIdx].topics.push({ name: "", type: "written" });
    setChapters(updated);
  };

  const removeChapter = (chIdx: number) => {
    setChapters(chapters.filter((_, i) => i !== chIdx));
  };

  const removeTopic = (chIdx: number, tIdx: number) => {
    const updated = [...chapters];
    updated[chIdx].topics = updated[chIdx].topics.filter((_, i) => i !== tIdx);
    setChapters(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const subject: Subject = {
      id: v4(),
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
              completed: false,
              topic_type: t.type,
            })),
        })),
    };
    onAdd(subject);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">New Subject</h3>
        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Subject name"
        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
        required
      />

      {chapters.map((ch, chIdx) => (
        <div key={chIdx} className="border border-border rounded-md p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              value={ch.name}
              onChange={(e) => {
                const updated = [...chapters];
                updated[chIdx].name = e.target.value;
                setChapters(updated);
              }}
              placeholder={`Chapter ${chIdx + 1}`}
              className="flex-1 px-3 py-1.5 border border-input rounded-md bg-background text-foreground text-sm"
            />
            <button type="button" onClick={() => removeChapter(chIdx)} className="text-destructive hover:opacity-70">
              <Trash2 size={16} />
            </button>
          </div>
          {ch.topics.map((t, tIdx) => (
            <div key={tIdx} className="flex items-center gap-2 ml-4">
              <input
                value={t.name}
                onChange={(e) => {
                  const updated = [...chapters];
                  updated[chIdx].topics[tIdx].name = e.target.value;
                  setChapters(updated);
                }}
                placeholder={`Topic ${tIdx + 1}`}
                className="flex-1 px-2 py-1 border border-input rounded-md bg-background text-foreground text-sm"
              />
              <select
                value={t.type}
                onChange={(e) => {
                  const updated = [...chapters];
                  updated[chIdx].topics[tIdx].type = e.target.value as TopicType;
                  setChapters(updated);
                }}
                className="px-2 py-1 border border-input rounded-md bg-background text-foreground text-sm"
              >
                <option value="written">Written</option>
                <option value="practical">Practical</option>
              </select>
              <button type="button" onClick={() => removeTopic(chIdx, tIdx)} className="text-destructive hover:opacity-70">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addTopic(chIdx)}
            className="ml-4 text-xs text-primary hover:underline flex items-center gap-1"
          >
            <Plus size={12} /> Add Topic
          </button>
        </div>
      ))}

      <button type="button" onClick={addChapter} className="text-sm text-primary hover:underline flex items-center gap-1">
        <Plus size={14} /> Add Chapter
      </button>

      <button type="submit" className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90">
        Save Subject
      </button>
    </form>
  );
}
