<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { getAllPaths, getPathLessons, type LearningPath } from "../data/lessons";
import { BookOpen, ChevronRight, Clock, Sparkles, Download, Apple, Box, Monitor, Github } from "lucide-vue-next";
import CrabCademyIcon from "../components/icons/CrabCademyIcon.vue";
import BaseModal from "../components/layout/BaseModal.vue";
import { isTauri } from "../services/codeRunner";

const showDownloadModal = ref(false);

const GITHUB_REPO = "https://github.com/finchfry94/crab-cademy";

function handleDownload(platform: 'mac' | 'linux' | 'windows' | 'source') {
  let url = `${GITHUB_REPO}/releases/latest`;
  if (platform === 'source') {
    url = GITHUB_REPO;
  }
  window.open(url, '_blank');
}

const router = useRouter();

const paths = getAllPaths();

// Reactive progress version counter for re-rendering when progress changes
const progressVersion = ref(0);

function getLessonCount(pathId: string): number {
  void progressVersion.value;
  return getPathLessons(pathId).length;
}

const AVAILABLE_IDS = ["the-book"];
const availablePaths = computed(() => paths.filter(p => AVAILABLE_IDS.includes(p.id) && getLessonCount(p.id) > 0));
const comingSoonPaths = computed(() => paths.filter(p => !AVAILABLE_IDS.includes(p.id) || getLessonCount(p.id) === 0));

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
          Start coding Rust instantly in your browser with zero friction.
          <template v-if="!isTauri()">
            Ready for more? 
            Download our desktop app to unlock system-level capabilities like file I/O, powered directly by your local machine.
          </template>
        </p>

        <div class="mt-8 flex justify-center gap-4">
             <button
               v-if="!isTauri()"
               @click="showDownloadModal = true"
               class="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-all shadow-lg shadow-orange-600/20 active:scale-95 flex items-center gap-2"
             >
               <Download class="w-5 h-5" />
               Download App
             </button>
             <button
               @click="router.push({ name: 'how-to' })"
               class="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 font-medium transition-colors"
             >
               How it Works
             </button>
        </div>
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
        <div 
          class="grid gap-4"
          :class="[
            availablePaths.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 
            availablePaths.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          ]"
        >
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
        <div 
          class="grid gap-4"
          :class="[
            comingSoonPaths.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 
            comingSoonPaths.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          ]"
        >
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

    <!-- Download Modal -->
    <BaseModal 
      :show="showDownloadModal" 
      title="Download CrabCademy" 
      @close="showDownloadModal = false"
    >
      <div class="space-y-4">
        <p class="text-neutral-400 text-sm mb-6">
          Choose your platform to download the CrabCademy desktop app. 
          Unlock local execution and system-level features.
        </p>

        <div class="grid gap-3">
          <button 
            @click="handleDownload('mac')"
            class="flex items-center gap-4 p-4 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 hover:bg-neutral-800 hover:border-orange-500/40 transition-all group"
          >
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
              <Apple class="w-6 h-6" />
            </div>
            <div class="text-left">
              <div class="font-semibold text-white">Apple macOS</div>
              <div class="text-xs text-neutral-500">Apple Silicon / Intel (.dmg)</div>
            </div>
          </button>

          <button 
            @click="handleDownload('linux')"
            class="flex items-center gap-4 p-4 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 hover:bg-neutral-800 hover:border-orange-500/40 transition-all group"
          >
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
              <Box class="w-6 h-6" />
            </div>
            <div class="text-left">
              <div class="font-semibold text-white">Debian / Ubuntu</div>
              <div class="text-xs text-neutral-500">Linux x64 (.deb)</div>
            </div>
          </button>

          <button 
            @click="handleDownload('windows')"
            class="flex items-center gap-4 p-4 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 hover:bg-neutral-800 hover:border-orange-500/40 transition-all group"
          >
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
              <Monitor class="w-6 h-6" />
            </div>
            <div class="text-left">
              <div class="font-semibold text-white">Windows</div>
              <div class="text-xs text-neutral-500">Windows x64 (.msi)</div>
            </div>
          </button>

          <button 
            @click="handleDownload('source')"
            class="flex items-center gap-4 p-4 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 hover:bg-neutral-800 hover:border-orange-500/40 transition-all group"
          >
            <div class="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
              <Github class="w-6 h-6" />
            </div>
            <div class="text-left">
              <div class="font-semibold text-white">Build from Source</div>
              <div class="text-xs text-neutral-500">View on GitHub</div>
            </div>
          </button>
        </div>

        <div class="mt-6 pt-6 border-t border-neutral-800">
          <p class="text-[11px] text-neutral-500 text-center uppercase tracking-widest font-semibold">
            Alpha Release v0.1.0
          </p>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
