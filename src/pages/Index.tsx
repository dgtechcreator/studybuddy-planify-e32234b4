import { useState, useMemo } from "react";
import { useStudyData } from "@/hooks/useStudyData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TopicType } from "@/types/study";
import {
  LogOut, Download, Upload, Plus, GraduationCap, BookOpen, Layers,
  ListChecks, CheckCircle2, Circle, TrendingUp, RotateCcw,
} from "lucide-react";
import SubjectProgressChart from "@/components/SubjectProgressChart";
import CompletionPieChart from "@/components/CompletionPieChart";
import TopicTypeChart from "@/components/TopicTypeChart";
import UserCountBadge from "@/components/UserCountBadge";
import InstallAppButton from "@/components/InstallAppButton";
import MotivationalQuote from "@/components/MotivationalQuote";
import AchievementBadges from "@/components/AchievementBadges";
import TopicTypeFilter from "@/components/TopicTypeFilter";
import SubjectForm from "@/components/SubjectForm";
import SubjectChecklist from "@/components/SubjectChecklist";
import EditSubjectDialog from "@/components/EditSubjectDialog";
import Footer from "@/components/Footer";
import type { Subject } from "@/types/study";

function StatCard({ icon: Icon, value, label }: { icon: any; value: string | number; label: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:border-primary/30 transition">
      <Icon size={18} className="text-primary mb-1" />
      <p className="text-xl md:text-2xl font-bold text-foreground leading-tight">{value}</p>
      <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5 text-center">{label}</p>
    </div>
  );
}

export default function Index() {
  const { subjects, loading, addSubject, updateSubject, deleteSubject, toggleTopic, fetchSubjects } = useStudyData();
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

  const totalChapters = filteredSubjects.reduce((a, s) => a + s.chapters.length, 0);
  const totalTopics = filteredSubjects.reduce((acc, s) => acc + s.chapters.reduce((a, c) => a + c.topics.length, 0), 0);
  const completedTopics = filteredSubjects.reduce((acc, s) => acc + s.chapters.reduce((a, c) => a + c.topics.filter((t) => t.completed).length, 0), 0);
  const remaining = totalTopics - completedTopics;
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out!");
  };

  const handleReset = async () => {
    if (!confirm("Reset all progress? This will uncheck all topics.")) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: subs } = await supabase.from("subjects").select("id").eq("user_id", user.id);
    for (const s of subs || []) {
      const { data: chs } = await supabase.from("chapters").select("id").eq("subject_id", s.id);
      for (const c of chs || []) {
        await supabase.from("topics").update({ completed: false }).eq("chapter_id", c.id);
      }
    }
    await fetchSubjects();
    toast.success("Progress reset!");
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
        for (const subject of data) await addSubject(subject);
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

  const HeaderBtn = ({ icon: Icon, label, onClick }: any) => (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-primary-foreground text-xs font-medium backdrop-blur-sm transition"
      title={label}
    >
      <Icon size={14} /> <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Gradient Header */}
      <div className="px-4 py-4 text-primary-foreground" style={{ background: "var(--gradient-header)" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <GraduationCap size={30} />
            <div>
              <h1 className="text-xl md:text-2xl font-bold leading-tight">StudyTracker</h1>
              <p className="text-xs opacity-90">Track your learning progress</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <UserCountBadge />
            <InstallAppButton />
            <HeaderBtn icon={Download} label="Export" onClick={handleExport} />
            <HeaderBtn icon={RotateCcw} label="Reset" onClick={handleReset} />
            <HeaderBtn icon={Upload} label="Import" onClick={handleImport} />
            <HeaderBtn icon={LogOut} label="Logout" onClick={handleLogout} />
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-5 space-y-4">
        <MotivationalQuote />

        {/* Stat cards — 6 in a row on desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
          <StatCard icon={BookOpen} value={filteredSubjects.length} label="Subjects" />
          <StatCard icon={Layers} value={totalChapters} label="Chapters" />
          <StatCard icon={ListChecks} value={totalTopics} label="Topics" />
          <StatCard icon={CheckCircle2} value={completedTopics} label="Completed" />
          <StatCard icon={Circle} value={remaining} label="Remaining" />
          <StatCard icon={TrendingUp} value={`${progress}%`} label="Progress" />
        </div>

        <AchievementBadges completed={completedTopics} progress={progress} />

        {/* Charts — side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <CompletionPieChart completed={completedTopics} remaining={remaining} />
          <TopicTypeChart subjects={filteredSubjects} />
          <SubjectProgressChart subjects={filteredSubjects} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <TopicTypeFilter filterType={filterType} onFilterChange={setFilterType} />
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 font-medium shadow-sm"
          >
            <Plus size={18} /> Add Subject
          </button>
        </div>

        {showForm && (
          <SubjectForm
            onAdd={(s) => { addSubject(s); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            <p className="col-span-full text-center text-muted-foreground py-8">No subjects yet. Add one to get started!</p>
          )}
        </div>

        {editingSubject && (
          <EditSubjectDialog
            subject={editingSubject}
            onSave={(s) => { updateSubject(s); setEditingSubject(null); }}
            onClose={() => setEditingSubject(null)}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
