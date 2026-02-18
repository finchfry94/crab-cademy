<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { getPathLessons, getPath } from "../data/lessons";
import { resetLesson } from "../services/progressStore";
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight, RotateCcw } from "lucide-vue-next";

const props = defineProps<{ pathId: string }>();
const router = useRouter();

const pathMeta = computed(() => getPath(props.pathId));
const lessons = computed(() => getPathLessons(props.pathId));

interface Chapter {
  id: string;
  title: string;
  lessons: ReturnType<typeof getPathLessons>;
}

const chapters = computed<Chapter[]>(() => {
  const chapterMap = new Map<string, ReturnType<typeof getPathLessons>>();

  for (const lesson of lessons.value) {
    const chapterNum = lesson.chapter.split(".")[0];
    if (!chapterMap.has(chapterNum)) {
      chapterMap.set(chapterNum, []);
    }
    chapterMap.get(chapterNum)!.push(lesson);
  }

  const chapterTitles: Record<string, string> = {
    "1": "Getting Started",
    "2": "Common Programming Concepts",
    "3": "Programming a Guessing Game",
    "4": "Understanding Ownership",
    "5": "Using Structs",
    "6": "Enums and Pattern Matching",
    "7": "Managing Growing Projects",
    "8": "Common Collections",
    "9": "Error Handling",
    "10": "Generics, Traits, and Lifetimes",
    "11": "Writing Automated Tests",
    "12": "An I/O Project: Command Line Program",
    "13": "Functional Language Features",
    "14": "More about Cargo and Crates",
    "15": "Smart Pointers",
    "16": "Fearless Concurrency",
    "17": "Object-Oriented Programming Features",
    "18": "Patterns and Matching",
    "19": "Advanced Features",
    "20": "Final Project: Multithreaded Web Server",
    "21": "Appendix",
  };

  return Array.from(chapterMap.entries()).map(([num, chapterLessons]) => ({
    id: num,
    title: chapterTitles[num] || `Chapter ${num}`,
    lessons: chapterLessons,
  }));
});

// Reactive progress version counter — bumped on reset to trigger re-render
const progressVersion = ref(0);

// Load progress from localStorage
function getProgress(lessonId: string) {
  // Access progressVersion so Vue tracks it as a dependency
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

function isRead(lessonId: string): boolean {
  return getProgress(lessonId)?.lesson_read ?? false;
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

function navigateToLesson(lessonId: string) {
  router.push({ name: "lesson", params: { pathId: props.pathId, id: lessonId } });
}

function resetLessonProgress(event: Event, lessonId: string) {
  event.stopPropagation();
  resetLesson(lessonId);
  progressVersion.value++;
}

function goBack() {
  router.push({ name: "landing" });
}
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-white">
    <!-- Path Header -->
    <header class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-neutral-950 to-red-900/10"></div>
      <div class="relative max-w-5xl mx-auto px-6 py-12 text-center">
        <button
          @click="goBack"
          class="absolute left-6 top-6 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-orange-400 bg-neutral-900/80 hover:bg-neutral-800 rounded-lg border border-neutral-800 hover:border-orange-500/40 transition-all duration-200"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          All Paths
        </button>

        <div class="flex items-center justify-center gap-3 mb-4" v-if="pathMeta">
          <div
            :class="[
              'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg shadow-orange-500/25',
              pathMeta.color,
            ]"
          >
            <span class="text-3xl">{{ pathMeta.icon }}</span>
          </div>
        </div>
        <h1 class="text-4xl font-extrabold tracking-tight mb-2">
          <span class="bg-gradient-to-r from-orange-400 via-orange-300 to-red-400 bg-clip-text text-transparent">
            {{ pathMeta?.title ?? "Learning Path" }}
          </span>
        </h1>
        <p class="text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
          {{ pathMeta?.description }}
        </p>
      </div>
    </header>

    <!-- Lesson Map -->
    <main class="max-w-4xl mx-auto px-6 pb-20 mt-8">
      <div class="space-y-6">
        <div
          v-for="chapter in chapters"
          :key="chapter.id"
          class="group"
        >
          <!-- Chapter Header -->
          <div class="flex items-center gap-3 mb-3">
            <div class="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400 font-bold text-sm">
              {{ chapter.id }}
            </div>
            <h2 class="text-lg font-semibold text-neutral-200">{{ chapter.title }}</h2>
            <span class="text-xs text-neutral-500 ml-auto">
              {{ completedCount(chapter) }}/{{ chapter.lessons.length }} complete
            </span>
          </div>

          <!-- Lesson Cards -->
          <div class="grid gap-2 pl-4 border-l-2 border-neutral-800 ml-4">
            <button
              v-for="lesson in chapter.lessons"
              :key="lesson.id"
              @click="navigateToLesson(lesson.id)"
              class="group/card flex items-center gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-orange-500/40 hover:bg-neutral-800/80 transition-all duration-200 text-left"
            >
              <!-- Status icon -->
              <div
                :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                  getLessonStatus(lesson.id) === 'completed'
                    ? 'bg-emerald-500/15 border border-emerald-500/30'
                    : getLessonStatus(lesson.id) === 'read'
                      ? 'bg-blue-500/15 border border-blue-500/30'
                      : 'bg-neutral-800 border border-neutral-700 group-hover/card:border-orange-500/30',
                ]"
              >
                <CheckCircle v-if="getLessonStatus(lesson.id) === 'completed'" class="w-5 h-5 text-emerald-400" />
                <BookOpen v-else-if="getLessonStatus(lesson.id) === 'read'" class="w-5 h-5 text-blue-400" />
                <BookOpen v-else class="w-5 h-5 text-neutral-400 group-hover/card:text-orange-400 transition-colors" />
              </div>

              <!-- Lesson info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono text-neutral-500">{{ lesson.chapter }}</span>
                  
                  <!-- Status Badges -->
                  <span
                    v-if="getLessonStatus(lesson.id) === 'completed'"
                    class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20"
                  >
                    Complete
                  </span>
                  <span
                    v-else-if="getLessonStatus(lesson.id) === 'read'"
                    class="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20"
                  >
                    Read
                  </span>

                  <span
                    :class="[
                      'text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded',
                      lesson.environment === 'browser'
                        ? 'text-orange-400 bg-orange-500/10'
                        : 'text-amber-400 bg-amber-500/10',
                    ]"
                  >
                    {{ lesson.environment === 'browser' ? '🌐 Browser' : '🖥️ Desktop' }}
                  </span>
                </div>
                <h3 class="text-sm font-medium text-neutral-200 group-hover/card:text-white transition-colors truncate">
                  {{ lesson.title }}
                </h3>
              </div>

              <!-- Reset button (only for completed lessons) -->
              <button
                v-if="isCompleted(lesson.id)"
                @click="resetLessonProgress($event, lesson.id)"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all shrink-0"
                title="Reset lesson progress"
              >
                <RotateCcw class="w-4 h-4" />
              </button>

              <!-- Arrow -->
              <ChevronRight class="w-4 h-4 text-neutral-600 group-hover/card:text-orange-400 transition-colors shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
