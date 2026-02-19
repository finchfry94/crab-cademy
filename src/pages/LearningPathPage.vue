<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { getPathLessons, getPath } from "../data/lessons";
import { resetLesson } from "../services/progressStore";
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight, RotateCcw } from "lucide-vue-next";
import { Lesson } from "../data/types";

const props = defineProps<{ pathId: string }>();
const router = useRouter();

const pathMeta = computed(() => getPath(props.pathId));
const lessons = computed(() => getPathLessons(props.pathId));

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

const chapterTitles: { [key: string]: string } = {
  "1": "Getting Started",
  "2": "Common Concepts",
  "3": "Guessing Game",
  "4": "Ownership",
  "5": "Structs",
  "6": "Enums",
  "7": "Project Management",
  "8": "Collections",
  "9": "Error Handling",
  "10": "Generics & Traits",
  "11": "Testing",
  "12": "I/O Project",
  "13": "Iterators & Closures",
  "14": "Cargo & Crates",
  "15": "Smart Pointers",
  "16": "Concurrency",
  "17": "Async/Await",
  "18": "OOP / Trait Objects",
  "19": "Patterns",
  "20": "Advanced Features",
  "21": "Final Project",
};

const chapters = computed<Chapter[]>(() => {
  const chapterMap = new Map<string, Lesson[]>();

  for (const lesson of lessons.value) {
    const chapterNum = lesson.chapter.split(".")[0];
    if (!chapterMap.has(chapterNum)) {
      chapterMap.set(chapterNum, []);
    }
    chapterMap.get(chapterNum)!.push(lesson);
  }

  return Array.from(chapterMap.entries()).map(([num, chapterLessons]) => ({
    id: num,
    title: chapterTitles[num] || `Chapter ${num}`,
    lessons: chapterLessons,
  }));
});

interface ModuleView {
  id: string;
  title: string;
  description?: string;
  chapters: Chapter[];
}

const moduleViews = computed<ModuleView[]>(() => {
  const meta = pathMeta.value;
  if (!meta) return [];

  if (meta.modules && meta.modules.length > 0) {
    return meta.modules.map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      chapters: chapters.value.filter(c => m.chapters.includes(c.id))
    })).filter(mv => mv.chapters.length > 0);
  }

  // Fallback: one big module
  return [{
    id: "main",
    title: "All Lessons",
    description: "Complete the curriculum in order.",
    chapters: chapters.value
  }];
});

// Reactive progress version counter — bumped on reset to trigger re-render
const progressVersion = ref(0);

// Load progress from localStorage
function getProgress(lessonId: string) {
  void progressVersion.value;
  try {
    const raw = localStorage.getItem("crabcademy_progress");
    if (!raw) return null;
    const all = JSON.parse(raw);
    return all[lessonId] || null;
  } catch {
    return null;
  }
}

function isCompleted(lessonId: string): boolean {
  return getProgress(lessonId)?.completed ?? false;
}

function getLessonStatus(lessonId: string): 'completed' | 'read' | 'none' {
  const p = getProgress(lessonId);
  if (p?.completed) return 'completed';
  if (p?.lesson_read) return 'read';
  return 'none';
}

function completedCount(chapter: Chapter): number {
  return chapter.lessons.filter((l) => isCompleted(l.id)).length;
}

function moduleProgress(mv: ModuleView) {
  const total = mv.chapters.reduce((acc, c) => acc + c.lessons.length, 0);
  const done = mv.chapters.reduce((acc, c) => acc + c.lessons.filter(l => isCompleted(l.id)).length, 0);
  return { done, total, percent: total > 0 ? (done / total) * 100 : 0 };
}

function navigateToLesson(lessonId: string) {
  router.push({ name: "lesson", params: { pathId: props.pathId, id: lessonId } });
}

function resetLessonProgress(event: Event, lessonId: string) {
  event.stopPropagation();
  if (confirm("Reset progress for this lesson?")) {
    resetLesson(lessonId);
    progressVersion.value++;
  }
}

function goBack() {
  router.push({ name: "landing" });
}
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-white selection:bg-orange-500/30">
    <!-- Path Header -->
    <header class="relative overflow-hidden border-b border-white/5">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.15),transparent_70%)]"></div>
      <div class="relative max-w-6xl mx-auto px-6 py-16">
        <button
          @click="goBack"
          class="absolute left-6 top-8 flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all duration-300 backdrop-blur-sm"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          Back to paths
        </button>

        <div class="flex flex-col items-center text-center mt-4">
          <div v-if="pathMeta" class="mb-6 relative">
            <div :class="['w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-2xl relative z-10', pathMeta.color]">
              <span class="text-4xl drop-shadow-lg">{{ pathMeta.icon }}</span>
            </div>
            <div :class="['absolute inset-0 blur-2xl opacity-40 rounded-3xl', pathMeta.color]"></div>
          </div>
          
          <h1 class="text-5xl font-black tracking-tight mb-4">
            <span class="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
              {{ pathMeta?.title ?? "Learning Path" }}
            </span>
          </h1>
          <p class="text-lg text-neutral-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {{ pathMeta?.description }}
          </p>
        </div>
      </div>
    </header>

    <!-- Content Area -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      <div 
        class="grid gap-8"
        :class="[
          moduleViews.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 
          moduleViews.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : 
          'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
        ]"
      >
        <section 
          v-for="(mv, idx) in moduleViews" 
          :key="mv.id"
          class="flex flex-col bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm transition-all duration-500 hover:border-orange-500/20 group/module"
        >
          <!-- Module Header -->
          <div class="p-8 bg-gradient-to-b from-white/[0.03] to-transparent border-b border-white/5">
            <div class="flex items-start justify-between mb-4">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/80">Module {{ idx + 1 }}</span>
              <div class="flex items-center gap-2">
                <div class="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-orange-500 transition-all duration-1000"
                    :style="{ width: `${moduleProgress(mv).percent}%` }"
                  ></div>
                </div>
                <span class="text-[10px] font-bold text-neutral-500">{{ Math.round(moduleProgress(mv).percent) }}%</span>
              </div>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2 group-hover/module:text-orange-400 transition-colors">{{ mv.title }}</h2>
            <p class="text-sm text-neutral-400 leading-relaxed">{{ mv.description }}</p>
          </div>

          <!-- Chapters List -->
          <div class="flex-1 p-4 space-y-4">
            <div v-for="chapter in mv.chapters" :key="chapter.id" class="space-y-2">
              <div class="flex items-center gap-2 px-3 mb-1">
                <span class="text-[10px] font-mono text-neutral-600 font-bold uppercase tracking-widest">Chapter {{ chapter.id }}</span>
                <span class="h-px flex-1 bg-white/5"></span>
                <span class="text-[10px] text-neutral-500 font-bold">{{ completedCount(chapter) }}/{{ chapter.lessons.length }}</span>
              </div>

              <!-- Lesson Buttons -->
              <div class="grid gap-1.5">
                <button
                  v-for="lesson in chapter.lessons"
                  :key="lesson.id"
                  @click="navigateToLesson(lesson.id)"
                  class="group/btn flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-orange-500/30 transition-all duration-300 text-left relative overflow-hidden"
                >
                  <!-- Progress Overlay -->
                  <div 
                    v-if="getLessonStatus(lesson.id) === 'completed'"
                    class="absolute inset-0 bg-emerald-500/5 pointer-events-none"
                  ></div>
                  
                  <div
                    :class="[
                      'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 relative z-10',
                      getLessonStatus(lesson.id) === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                        : getLessonStatus(lesson.id) === 'read'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                          : 'bg-neutral-800 text-neutral-500 border border-white/5 group-hover/btn:border-orange-500/30 group-hover/btn:text-orange-400',
                    ]"
                  >
                    <CheckCircle v-if="getLessonStatus(lesson.id) === 'completed'" class="w-4 h-4" />
                    <BookOpen v-else class="w-4 h-4" />
                  </div>

                  <div class="flex-1 min-w-0 relative z-10">
                    <h3 class="text-xs font-bold text-neutral-300 group-hover/btn:text-white transition-colors truncate">
                      {{ lesson.title }}
                    </h3>
                  </div>

                  <div class="flex items-center gap-2 relative z-10">
                    <button
                      v-if="isCompleted(lesson.id)"
                      @click="resetLessonProgress($event, lesson.id)"
                      class="opacity-0 group-hover/btn:opacity-100 p-1 hover:text-orange-500 transition-opacity"
                    >
                      <RotateCcw class="w-3 h-3" />
                    </button>
                    <span 
                      v-if="lesson.environment === 'desktop'"
                      class="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded-md font-black border border-amber-500/10"
                    >🖥️</span>
                    <ChevronRight class="w-3 h-3 text-neutral-700 group-hover/btn:text-orange-500 transition-colors" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.prose {
  font-feature-settings: "cv02", "cv03", "cv04", "ss01";
}
</style>
