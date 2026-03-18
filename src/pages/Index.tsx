import { useState, useMemo } from "react";
import { useStudyData } from "@/hooks/useStudyData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TopicType } from "@/types/study";
import { LogOut, Download, Upload, Plus, BookOpen } from "lucide-react";
import SubjectProgressChart from "@/components/SubjectProgressChart";
import TopicTypeFilter from "@/components/TopicTypeFilter";
import SubjectForm from "@/components/SubjectForm";
import SubjectChecklist from "@/components/SubjectChecklist";
import EditSubjectDialog from "@/components/EditSubjectDialog";
import type { Subject } from "@/types/study";

export default function Index() {
  const { subjects, loading, addSubject, updateSubject, deleteSubject, toggleTopic, setSubjects, fetchSubjects } = useStudyData();
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [filterType, setFilterType] = useState<TopicType | "all">("all");

  const filteredSubjects = useMemo(() => {
    if (filterType === "all") return subjects;
    return subjects.map((s) => ({
      ...s,
      chapters: s.chapters.map((c) => ({
        ...c,
        topics: c.topics.filter((t) => t.topic_type === filterType),
      })).filter((c) => c.topics.length > 0),
    })).filter((s) => s.chapters.length > 0);
  }, [subjects, filterType]);

  const totalTopics = filteredSubjects.reduce((acc, s) => acc + s.chapters.reduce((a, c) => a + c.topics.length, 0), 0);
  const completedTopics = filteredSubjects.reduce((acc, s) => acc + s.chapters.reduce((a, c) => a + c.topics.filter((t) => t.completed).length, 0), 0);
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out!");
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(subjects, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "study-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported!");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const text = await file.text();
      try {
        const data = JSON.parse(text);
        for (const subject of data) {
          await addSubject(subject);
        }
        toast.success("Data imported!");
      } catch {
        toast.error("Invalid file format");
      }
    };
    input.click();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="text-primary" /> StudyBuddy Planify
          </h1>
          <div className="flex items-center gap-2">
            <button onClick={handleImport} className="p-2 rounded-md hover:bg-muted" title="Import">
              <Upload size={20} className="text-muted-foreground" />
            </button>
            <button onClick={handleExport} className="p-2 rounded-md hover:bg-muted" title="Export">
              <Download size={20} className="text-muted-foreground" />
            </button>
            <button onClick={handleLogout} className="p-2 rounded-md hover:bg-muted" title="Logout">
              <LogOut size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Subjects</p>
            <p className="text-2xl font-bold text-foreground">{filteredSubjects.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-foreground">{completedTopics}/{totalTopics}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-foreground">{progress}%</p>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Chart */}
        <TopicTypeFilter filterType={filterType} onFilterChange={setFilterType} />
        <SubjectProgressChart subjects={filteredSubjects} />

        {/* Add Subject */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          >
            <Plus size={18} /> Add Subject
          </button>
        </div>

        {showForm && (
          <SubjectForm
            onAdd={(s) => {
              addSubject(s);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Subject List */}
        <div className="space-y-4">
          {filteredSubjects.map((subject) => (
            <SubjectChecklist
              key={subject.id}
              subject={subject}
              onToggleTopic={toggleTopic}
              onEdit={() => setEditingSubject(subject)}
              onDelete={() => deleteSubject(subject.id)}
            />
          ))}
          {filteredSubjects.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No subjects yet. Add one to get started!</p>
          )}
        </div>

        {/* Edit Dialog */}
        {editingSubject && (
          <EditSubjectDialog
            subject={editingSubject}
            onSave={(s) => {
              updateSubject(s);
              setEditingSubject(null);
            }}
            onClose={() => setEditingSubject(null)}
          />
        )}
      </div>
    </div>
  );
}
