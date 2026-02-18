<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { getAllPaths, getPathLessons, type LearningPath } from "../data/lessons";
import { BookOpen, ChevronRight, Clock, Sparkles } from "lucide-vue-next";
import CrabCademyIcon from "../components/icons/CrabCademyIcon.vue";

const router = useRouter();

const paths = getAllPaths();

// Reactive progress version counter for re-rendering when progress changes
const progressVersion = ref(0);

function getLessonCount(pathId: string): number {
  void progressVersion.value;
  return getPathLessons(pathId).length;
}

const availablePaths = computed(() => paths.filter(p => getLessonCount(p.id) > 0));
const comingSoonPaths = computed(() => paths.filter(p => getLessonCount(p.id) === 0));

function getCompletedCount(pathId: string): number {
  void progressVersion.value;
  try {
    const raw = localStorage.getItem("crabcademy_progress");
    if (!raw) return 0;
    const all = JSON.parse(raw);
    const lessons = getPathLessons(pathId);
    return lessons.filter((l) => all[l.id]?.completed).length;
  } catch {
    return 0;
  }
}

function navigateToPath(path: LearningPath) {
  if (getLessonCount(path.id) === 0) return;
  router.push({ name: "learningPath", params: { pathId: path.id } });
}
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-white">
    <!-- Hero Section -->
    <header class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-neutral-950 to-red-900/10"></div>
      <div class="relative max-w-5xl mx-auto px-6 py-16 text-center">
        <div class="flex items-center justify-center gap-3 mb-4">
          <CrabCademyIcon :size="100" />
        </div>
        <h1 class="text-5xl font-extrabold tracking-tight mb-3">
          <span class="bg-gradient-to-r from-orange-400 via-orange-300 to-red-400 bg-clip-text text-transparent">CrabCademy</span>
        </h1>
        <p class="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Start coding Rust instantly in your browser with zero friction. Ready for more? 
          Download our desktop app to unlock system-level capabilities like file I/O, powered directly by your local machine.
        </p>
      </div>
    </header>

    <!-- Learning Path Cards -->
    <main class="max-w-4xl mx-auto px-6 pb-20 mt-8 space-y-12">
      <!-- Available Paths -->
      <section v-if="availablePaths.length > 0">
        <h2 class="text-xl font-semibold text-neutral-200 mb-6 flex items-center gap-2">
          <Sparkles class="w-5 h-5 text-orange-400" />
          Available Paths
        </h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="p in availablePaths"
            :key="p.id"
            @click="navigateToPath(p)"
            class="group relative flex flex-col p-6 rounded-2xl border text-left transition-all duration-300 bg-neutral-900/70 border-neutral-800 hover:border-orange-500/40 hover:bg-neutral-800/80 cursor-pointer hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-0.5"
          >
            <!-- Gradient accent at top -->
            <div
              :class="[
                'absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity',
                p.color,
              ]"
            ></div>

            <!-- Icon -->
            <div
              :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 bg-gradient-to-br shadow-lg shadow-orange-500/10',
                p.color,
              ]"
            >
              {{ p.icon }}
            </div>

            <!-- Title -->
            <h3 class="text-lg font-semibold text-neutral-100 mb-1.5 group-hover:text-white transition-colors">
              {{ p.title }}
            </h3>

            <!-- Description -->
            <p class="text-sm text-neutral-400 leading-relaxed mb-4 flex-1">
              {{ p.description }}
            </p>

            <!-- Footer -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1.5 text-xs text-neutral-500">
                  <BookOpen class="w-3.5 h-3.5" />
                  {{ getLessonCount(p.id) }} lessons
                </span>
                <span
                  v-if="getCompletedCount(p.id) > 0"
                  class="flex items-center gap-1 text-xs text-emerald-400"
                >
                  <Sparkles class="w-3.5 h-3.5" />
                  {{ getCompletedCount(p.id) }}/{{ getLessonCount(p.id) }}
                </span>
              </div>
              <ChevronRight class="w-4 h-4 text-neutral-600 group-hover:text-orange-400 transition-colors" />
            </div>

            <!-- Progress bar -->
            <div
              v-if="getCompletedCount(p.id) > 0"
              class="mt-3 h-1 rounded-full bg-neutral-800 overflow-hidden"
            >
              <div
                class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                :style="{ width: `${(getCompletedCount(p.id) / getLessonCount(p.id)) * 100}%` }"
              ></div>
            </div>
          </button>
        </div>
      </section>

      <!-- Coming Soon Paths -->
      <section v-if="comingSoonPaths.length > 0">
        <h2 class="text-xl font-semibold text-neutral-400 mb-6 flex items-center gap-2">
          <Clock class="w-5 h-5" />
          Coming Soon
        </h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="p in comingSoonPaths"
            :key="p.id"
            class="group relative flex flex-col p-6 rounded-2xl border border-neutral-800/50 bg-neutral-900/40 opacity-60 text-left"
          >
            <!-- Gradient accent at top -->
            <div
              :class="[
                'absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r opacity-20',
                p.color,
              ]"
            ></div>

            <!-- Icon -->
            <div
              :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 bg-gradient-to-br shadow-none',
                p.color,
              ]"
            >
              {{ p.icon }}
            </div>

            <!-- Title -->
            <h3 class="text-lg font-semibold text-neutral-100 mb-1.5">
              {{ p.title }}
            </h3>

            <!-- Description -->
            <p class="text-sm text-neutral-400 leading-relaxed mb-4 flex-1">
              {{ p.description }}
            </p>

            <!-- Footer -->
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-xs text-neutral-500">
                <Clock class="w-3.5 h-3.5" />
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
