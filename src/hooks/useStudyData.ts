import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Subject, Chapter, Topic, TopicType } from "@/types/study";
import { toast } from "sonner";

export function useStudyData() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: subjectsData, error: subjectsError } = await supabase
        .from("subjects")
        .select("*")
        .eq("user_id", user.id);
      if (subjectsError) throw subjectsError;

      const result: Subject[] = [];
      for (const sub of subjectsData || []) {
        const { data: chaptersData } = await supabase
          .from("chapters")
          .select("*")
          .eq("subject_id", sub.id)
          .order("sort_order");

        const chapters: Chapter[] = [];
        for (const ch of chaptersData || []) {
          const { data: topicsData } = await supabase
            .from("topics")
            .select("*")
            .eq("chapter_id", ch.id)
            .order("sort_order");

          chapters.push({
            id: ch.id,
            name: ch.name,
            topics: (topicsData || []).map((t) => ({
              id: t.id,
              name: t.name,
              completed: t.completed,
              topic_type: t.topic_type as TopicType,
            })),
          });
        }
        result.push({ id: sub.id, name: sub.name, chapters });
      }
      setSubjects(result);
    } catch (error: any) {
      toast.error("Failed to load data: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const addSubject = async (subject: Subject) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: subData, error: subError } = await supabase
        .from("subjects")
        .insert({ name: subject.name, user_id: user.id })
        .select()
        .single();
      if (subError) throw subError;

      for (let i = 0; i < subject.chapters.length; i++) {
        const ch = subject.chapters[i];
        const { data: chData, error: chError } = await supabase
          .from("chapters")
          .insert({ name: ch.name, subject_id: subData.id, sort_order: i })
          .select()
          .single();
        if (chError) throw chError;

        for (let j = 0; j < ch.topics.length; j++) {
          const t = ch.topics[j];
          await supabase.from("topics").insert({
            name: t.name,
            chapter_id: chData.id,
            sort_order: j,
            completed: false,
            topic_type: t.topic_type || "written",
          });
        }
      }
      await fetchSubjects();
      toast.success("Subject added!");
    } catch (error: any) {
      toast.error("Failed to add subject: " + error.message);
    }
  };

  const updateSubject = async (updatedSubject: Subject) => {
    try {
      await supabase.from("subjects").update({ name: updatedSubject.name }).eq("id", updatedSubject.id);

      const { data: existingChapters } = await supabase
        .from("chapters")
        .select("id")
        .eq("subject_id", updatedSubject.id);

      for (const ch of existingChapters || []) {
        await supabase.from("topics").delete().eq("chapter_id", ch.id);
      }
      await supabase.from("chapters").delete().eq("subject_id", updatedSubject.id);

      for (let i = 0; i < updatedSubject.chapters.length; i++) {
        const ch = updatedSubject.chapters[i];
        const { data: chData } = await supabase
          .from("chapters")
          .insert({ name: ch.name, subject_id: updatedSubject.id, sort_order: i })
          .select()
          .single();

        if (chData) {
          for (let j = 0; j < ch.topics.length; j++) {
            const t = ch.topics[j];
            await supabase.from("topics").insert({
              name: t.name,
              chapter_id: chData.id,
              sort_order: j,
              completed: t.completed || false,
              topic_type: t.topic_type || "written",
            });
          }
        }
      }
      await fetchSubjects();
      toast.success("Subject updated!");
    } catch (error: any) {
      toast.error("Failed to update: " + error.message);
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      const { data: chapters } = await supabase.from("chapters").select("id").eq("subject_id", id);
      for (const ch of chapters || []) {
        await supabase.from("topics").delete().eq("chapter_id", ch.id);
      }
      await supabase.from("chapters").delete().eq("subject_id", id);
      await supabase.from("subjects").delete().eq("id", id);
      await fetchSubjects();
      toast.success("Subject deleted!");
    } catch (error: any) {
      toast.error("Failed to delete: " + error.message);
    }
  };

  const toggleTopic = async (subjectId: string, chapterId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              chapters: s.chapters.map((c) =>
                c.id === chapterId
                  ? {
                      ...c,
                      topics: c.topics.map((t) =>
                        t.id === topicId ? { ...t, completed: !t.completed } : t
                      ),
                    }
                  : c
              ),
            }
          : s
      )
    );

    const subject = subjects.find((s) => s.id === subjectId);
    const topic = subject?.chapters.find((c) => c.id === chapterId)?.topics.find((t) => t.id === topicId);
    if (topic) {
      await supabase.from("topics").update({ completed: !topic.completed }).eq("id", topicId);
    }
  };

  return { subjects, loading, addSubject, updateSubject, deleteSubject, toggleTopic, setSubjects, fetchSubjects };
}
