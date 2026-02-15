<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { getAllLessons } from "../data/lessons";
import { BookOpen, CheckCircle, ChevronRight} from "lucide-vue-next";

const router = useRouter();

// Get all lessons and group by chapter prefix
const lessons = getAllLessons();

interface Chapter {
  id: string;
  title: string;
  lessons: typeof lessons;
}

const chapters = computed<Chapter[]>(() => {
  const chapterMap = new Map<string, typeof lessons>();

  for (const lesson of lessons) {
    // Group by first digit of chapter (e.g. "1.1" → "1", "3.2" → "3")
    const chapterNum = lesson.chapter.split(".")[0];
    if (!chapterMap.has(chapterNum)) {
      chapterMap.set(chapterNum, []);
    }
    chapterMap.get(chapterNum)!.push(lesson);
  }

  const chapterTitles: Record<string, string> = {
    "1": "Getting Started",
    "2": "Programming a Guessing Game",
    "3": "Common Programming Concepts",
    "4": "Understanding Ownership",
    "5": "Using Structs",
    "6": "Enums and Pattern Matching",
  };

  return Array.from(chapterMap.entries()).map(([num, chapterLessons]) => ({
    id: num,
    title: chapterTitles[num] || `Chapter ${num}`,
    lessons: chapterLessons,
  }));
});

// Load progress from localStorage
function getProgress(lessonId: string) {
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

function completedCount(chapter: Chapter): number {
  return chapter.lessons.filter((l) => isCompleted(l.id)).length;
}

function navigateToLesson(lessonId: string) {
  router.push({ name: "lesson", params: { id: lessonId } });
}
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-white">
    <!-- Hero Section -->
    <header class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-neutral-950 to-red-900/10"></div>
      <div class="relative max-w-5xl mx-auto px-6 py-16 text-center">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <span class="text-3xl">🦀</span>
          </div>
        </div>
        <h1 class="text-5xl font-extrabold tracking-tight mb-3">
          <span class="bg-gradient-to-r from-orange-400 via-orange-300 to-red-400 bg-clip-text text-transparent">CrabCademy</span>
        </h1>
        <p class="text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Learn Rust interactively — inspired by
          <span class="text-orange-400 font-medium">The Rust Book</span> and
          <span class="text-orange-400 font-medium">Rustlings</span>.
          Write and run real Rust code right in your browser.
        </p>
      </div>
    </header>

    <!-- Lesson Map -->
    <main class="max-w-4xl mx-auto px-6 pb-20 -mt-4">
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
                  isCompleted(lesson.id)
                    ? 'bg-emerald-500/15 border border-emerald-500/30'
                    : 'bg-neutral-800 border border-neutral-700 group-hover/card:border-orange-500/30',
                ]"
              >
                <CheckCircle v-if="isCompleted(lesson.id)" class="w-5 h-5 text-emerald-400" />
                <BookOpen v-else class="w-5 h-5 text-neutral-400 group-hover/card:text-orange-400 transition-colors" />
              </div>

              <!-- Lesson info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono text-neutral-500">{{ lesson.chapter }}</span>
                  <span
                    v-if="isCompleted(lesson.id)"
                    class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded"
                  >
                    Done
                  </span>
                </div>
                <h3 class="text-sm font-medium text-neutral-200 group-hover/card:text-white transition-colors truncate">
                  {{ lesson.title }}
                </h3>
              </div>

              <!-- Arrow -->
              <ChevronRight class="w-4 h-4 text-neutral-600 group-hover/card:text-orange-400 transition-colors shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
