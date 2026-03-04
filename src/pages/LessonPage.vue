<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import SplitPane from "../components/layout/SplitPane.vue";
import CodeEditor from "../components/editor/CodeEditor.vue";
import MultiFileEditor from "../components/editor/MultiFileEditor.vue";
import OutputTerminal from "../components/terminal/OutputTerminal.vue";
import LessonTabs from "../components/lesson/LessonTabs.vue";
import { useCodeRunner } from "../composables/useCodeRunner";
import { useLessonState } from "../composables/useLessonState";
import { markCompleted } from "../services/progressStore";
import { runTests, runTestsMulti, colorizeRustOutput } from "../services/codeRunner";
import { Play, FlaskConical, ArrowLeft, ChevronRight, BookOpen, Code2 } from "lucide-vue-next";

const props = defineProps<{ pathId: string; id: string }>();
const router = useRouter();

// Default to read mode on mobile (width < 768px)
const isReadMode = ref(window.innerWidth < 768);

// Handle window resize to auto-switch if needed (optional, but good UX)
// We only auto-switch to read mode on shrink, but let user stay in read mode if they expand
window.addEventListener('resize', () => {
  if (window.innerWidth < 768 && !isReadMode.value) {
    // Only auto-switch IF we are strictly going to mobile. 
    // But this might be annoying if user explicitly turned it off.
    // simpler: just init. Let's stick to init for now to avoid annoying the user.
  }
});


const { runCode, runCodeMulti, isRunning } = useCodeRunner();
const { currentLesson, loadLessonById, setTestResults, setActiveTab, allTestsPassed, nextLesson } = useLessonState();
const code = ref("// Write your Rust code here\nfn main() {\n    println!(\"Hello, CrabCademy!\");\n}\n");
const files = ref<Record<string, string>>({});
const terminalRef = ref<InstanceType<typeof OutputTerminal> | null>(null);
const isTestRunning = ref(false);

const isMultiFile = computed(() =>
  currentLesson.value &&
  typeof currentLesson.value.starter_code === 'object'
);

// Load lesson when ID changes
watch(
  () => props.id,
  async (newId) => {
    await loadLessonById(props.pathId, newId);
    if (currentLesson.value) {
      if (typeof currentLesson.value.starter_code === 'object') {
        files.value = { ...currentLesson.value.starter_code };
      } else {
        code.value = currentLesson.value.starter_code;
      }
    }
  },
  { immediate: true }
);

async function handleRun() {
  if (terminalRef.value && currentLesson.value) {
    terminalRef.value.clear();
    terminalRef.value.writeln("\x1b[33mRunning...\x1b[0m");
    let output: string;
    if (isMultiFile.value) {
      output = await runCodeMulti(files.value, currentLesson.value.environment, currentLesson.value.default_args);
    } else {
      output = await runCode(code.value, currentLesson.value.environment, currentLesson.value.default_args);
    }
    terminalRef.value.write(colorizeRustOutput(output));
  }
}

async function handleRunTests() {
  if (!terminalRef.value || !currentLesson.value) return;

  isTestRunning.value = true;
  terminalRef.value.clear();
  terminalRef.value.writeln("\x1b[36m🧪 Running tests...\x1b[0m\n");

  let result;
  if (isMultiFile.value) {
    result = await runTestsMulti(
      files.value,
      currentLesson.value.test_files || {},
      currentLesson.value.environment
    );
  } else {
    result = await runTests(code.value, currentLesson.value.test_code, currentLesson.value.environment);
  }

  // Show colorized output in terminal
  terminalRef.value.write(colorizeRustOutput(result.rawOutput));

  // Update test results in state (for Results tab)
  setTestResults(result.results);

  // Switch to Objectives tab to show per-test results inline
  setActiveTab("objectives");

  if (result.allPassed) {
    terminalRef.value.writeln("\n\x1b[32m✅ All tests passed! Lesson complete!\x1b[0m");
    await markCompleted(currentLesson.value.id);
  } else {
    const failCount = result.results.filter((t) => !t.passed).length;
    if (result.results.length === 0) {
      terminalRef.value.writeln("\n\x1b[31m❌ Could not parse test results. Check for compilation errors above.\x1b[0m");
    } else {
      terminalRef.value.writeln(`\n\x1b[31m❌ ${failCount} test(s) failed. Check the Results tab and fix your code.\x1b[0m`);
    }
  }

  isTestRunning.value = false;
}

function goHome() {
  router.push({ name: "learningPath", params: { pathId: props.pathId } });
}

function goToNextLesson() {
  if (nextLesson.value) {
    router.push({ name: "lesson", params: { pathId: props.pathId, id: nextLesson.value.id } });
  }
}
</script>

<template>
  <div class="h-screen flex flex-col bg-neutral-950">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800 shrink-0">
      <div class="flex items-center gap-3">
        <button
          @click="goHome"
          class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-orange-400 bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 hover:border-orange-500/40 transition-all duration-200"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          Lessons
        </button>
        <span v-if="currentLesson" class="text-xs text-neutral-500 font-mono hidden sm:inline">
          {{ currentLesson.chapter }} — {{ currentLesson.title }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="isReadMode = !isReadMode"
          :class="[
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border',
            isReadMode
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20'
              : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'
          ]"
        >
          <BookOpen v-if="isReadMode" class="w-3.5 h-3.5" />
          <Code2 v-else class="w-3.5 h-3.5" />
          {{ isReadMode ? 'Read Mode' : 'Interactive' }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-h-0 relative">
      <!-- Read Mode: Full Screen Lesson Tabs -->
      <div v-if="isReadMode" class="absolute inset-0 z-10 bg-neutral-950">
        <LessonTabs />
      </div>

      <!-- Interactive Mode: Split Pane -->
      <SplitPane v-else>
        <template #lesson>
          <LessonTabs />
        </template>

        <template #editor>
          <div class="h-full flex flex-col">
            <div class="flex items-center justify-between p-2 bg-neutral-950 border-b border-neutral-800">
              <span v-if="!isMultiFile" class="text-sm font-bold text-neutral-400 pl-2">main.rs</span>
              <div class="flex items-center gap-2">
                <button
                  @click="handleRunTests"
                  :disabled="isRunning || isTestRunning"
                  class="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-orange-400 hover:text-orange-300 rounded-lg text-sm font-medium border border-orange-500/30 hover:border-orange-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FlaskConical class="w-4 h-4" />
                  {{ isTestRunning ? 'Testing...' : 'Test' }}
                </button>
                <button
                  @click="handleRun"
                  :disabled="isRunning || isTestRunning || !allTestsPassed"
                  :title="!allTestsPassed ? 'Pass all tests first!' : 'Run your code'"
                  class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play class="w-4 h-4 fill-current" />
                  {{ isRunning ? 'Running...' : 'Run' }}
                </button>
                <button
                  v-if="allTestsPassed && nextLesson"
                  @click="goToNextLesson"
                  class="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-green-400 hover:text-green-300 rounded-lg text-sm font-medium border border-green-500/30 hover:border-green-500/50 transition-all duration-200 animate-pulse"
                >
                  <span>Next Lesson</span>
                  <ChevronRight class="w-4 h-4" />
                </button>
                
              </div>
            </div>
            <div class="flex-1 min-h-0">
              <MultiFileEditor v-if="isMultiFile" v-model:files="files" language="rust" />
              <CodeEditor v-else v-model:value="code" language="rust" />
            </div>
          </div>
        </template>

        <template #terminal>
          <OutputTerminal 
            ref="terminalRef" 
            :environment="currentLesson?.environment"
          />
        </template>
      </SplitPane>
    </div>
  </div>
</template>
