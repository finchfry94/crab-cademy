<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import SplitPane from "../components/layout/SplitPane.vue";
import CodeEditor from "../components/editor/CodeEditor.vue";
import OutputTerminal from "../components/terminal/OutputTerminal.vue";
import LessonTabs from "../components/lesson/LessonTabs.vue";
import { useCodeRunner } from "../composables/useCodeRunner";
import { useLessonState } from "../composables/useLessonState";
import { markCompleted } from "../services/progressStore";
import { runTests, colorizeRustOutput } from "../services/codeRunner";
import { Play, FlaskConical, ArrowLeft } from "lucide-vue-next";

const props = defineProps<{ pathId: string; id: string }>();
const router = useRouter();

const { runCode, isRunning } = useCodeRunner();
const { currentLesson, loadLessonById, setTestResults, setActiveTab, allTestsPassed } = useLessonState();
const code = ref("// Write your Rust code here\nfn main() {\n    println!(\"Hello, CrabCademy!\");\n}\n");
const terminalRef = ref<InstanceType<typeof OutputTerminal> | null>(null);
const isTestRunning = ref(false);

// Load lesson when ID changes
watch(
  () => props.id,
  async (newId) => {
    await loadLessonById(props.pathId, newId);
    if (currentLesson.value) {
      code.value = currentLesson.value.starter_code;
    }
  },
  { immediate: true }
);

async function handleRun() {
  if (terminalRef.value) {
    terminalRef.value.clear();
    terminalRef.value.writeln("\x1b[33mRunning...\x1b[0m");
    const output = await runCode(code.value);
    terminalRef.value.write(colorizeRustOutput(output));
  }
}

async function handleRunTests() {
  if (!terminalRef.value || !currentLesson.value) return;

  isTestRunning.value = true;
  terminalRef.value.clear();
  terminalRef.value.writeln("\x1b[36m🧪 Running tests...\x1b[0m\n");

  const result = await runTests(code.value, currentLesson.value.test_code);

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
</script>

<template>
  <SplitPane>
    <template #lesson>
      <div class="flex items-center gap-2 mb-3 bg-neutral-900" >
        <button
          @click="goHome"
          class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-orange-400 bg-neutral-900 hover:bg-neutral-800 rounded-lg border border-neutral-800 hover:border-orange-500/40 transition-all duration-200"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          Lessons
        </button>
        <span v-if="currentLesson" class="text-xs text-neutral-500 font-mono">
          {{ currentLesson.chapter }} — {{ currentLesson.title }}
        </span>
      </div>
      <LessonTabs />
    </template>

    <template #editor>
      <div class="h-full flex flex-col">
        <div class="flex items-center justify-between p-2 bg-neutral-950 border-b border-neutral-800">
          <span class="text-sm font-bold text-neutral-400 pl-2">main.rs</span>
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
            
          </div>
        </div>
        <div class="flex-1 min-h-0">
          <CodeEditor v-model:value="code" language="rust" />
        </div>
      </div>
    </template>

    <template #terminal>
      <OutputTerminal ref="terminalRef" />
    </template>
  </SplitPane>
</template>
