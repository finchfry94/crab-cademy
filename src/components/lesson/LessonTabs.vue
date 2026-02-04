<script setup lang="ts">
import { useLessonState } from "../../composables/useLessonState";
import { Lock } from "lucide-vue-next";
import MarkdownIt from "markdown-it";

const {
  currentLesson,
  activeTab,
  isLoading,
  isObjectivesUnlocked,
  unlockObjectives,
  setActiveTab,
} = useLessonState();

const md = new MarkdownIt();

function handleScroll(e: Event) {
  const el = e.target as HTMLElement;
  const scrolledToBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
  if (scrolledToBottom && !isObjectivesUnlocked.value) {
    unlockObjectives();
  }
}

function renderMarkdown(content: string): string {
  return md.render(content);
}
</script>

<template>
  <div class="h-full flex flex-col bg-neutral-950">
    <!-- Tab Header -->
    <div class="flex items-center bg-neutral-900 border-b border-neutral-800">
      <button
        @click="setActiveTab('lesson')"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors border-b-2',
          activeTab === 'lesson'
            ? 'text-orange-400 border-orange-500 bg-neutral-800/50'
            : 'text-neutral-400 border-transparent hover:text-neutral-200',
        ]"
      >
        📖 Lesson
      </button>
      <button
        @click="setActiveTab('objectives')"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5',
          activeTab === 'objectives'
            ? 'text-emerald-400 border-emerald-500 bg-neutral-800/50'
            : isObjectivesUnlocked
              ? 'text-neutral-400 border-transparent hover:text-neutral-200'
              : 'text-neutral-600 border-transparent cursor-not-allowed',
        ]"
        :disabled="!isObjectivesUnlocked"
      >
        <Lock v-if="!isObjectivesUnlocked" class="w-3 h-3" />
        🎯 Objectives
      </button>
      <button
        @click="setActiveTab('tests')"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors border-b-2',
          activeTab === 'tests'
            ? 'text-blue-400 border-blue-500 bg-neutral-800/50'
            : 'text-neutral-400 border-transparent hover:text-neutral-200',
        ]"
      >
        🧪 Tests
      </button>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 min-h-0 overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-4 text-neutral-500">Loading lesson...</div>

      <!-- Lesson Tab -->
      <div
        v-else-if="activeTab === 'lesson' && currentLesson"
        ref="lessonContentRef"
        @scroll="handleScroll"
        class="h-full overflow-y-auto p-4"
      >
        <div
          class="prose prose-invert prose-orange max-w-none"
          v-html="renderMarkdown(currentLesson.content)"
        />
        <div
          v-if="!isObjectivesUnlocked"
          class="mt-8 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700 text-center"
        >
          <p class="text-neutral-400 text-sm">
            ⬇️ Scroll to the bottom to unlock objectives
          </p>
        </div>
        <div
          v-else
          class="mt-8 p-4 bg-emerald-900/30 rounded-lg border border-emerald-700 text-center"
        >
          <p class="text-emerald-400 text-sm">
            ✅ Lesson complete! Switch to the Objectives tab.
          </p>
        </div>
      </div>

      <!-- Objectives Tab -->
      <div
        v-else-if="activeTab === 'objectives' && currentLesson"
        class="h-full overflow-y-auto p-4"
      >
        <h2 class="text-xl font-bold text-emerald-400 mb-4">Your Mission</h2>
        <div class="p-4 bg-neutral-800 rounded-lg border border-neutral-700 mb-4">
          <p class="text-neutral-200">
            Modify the code in the editor to print your own custom message.
          </p>
        </div>
        <p class="text-neutral-400 text-sm">
          The starter code has been loaded in the editor. Click <strong>Run</strong> to test your
          changes!
        </p>
      </div>

      <!-- Tests Tab -->
      <div
        v-else-if="activeTab === 'tests' && currentLesson"
        class="h-full overflow-y-auto p-4"
      >
        <h2 class="text-xl font-bold text-blue-400 mb-4">Test Code</h2>
        <pre
          class="p-4 bg-neutral-900 rounded-lg border border-neutral-700 text-sm overflow-x-auto"
        ><code class="text-neutral-300">{{ currentLesson.test_code }}</code></pre>
        <p class="text-neutral-400 text-sm mt-4">
          As you progress, tests will become more complex and use <code>cargo test</code>.
        </p>
      </div>
    </div>
  </div>
</template>
