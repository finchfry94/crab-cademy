<script setup lang="ts">
import { ref } from "vue";
import SplitPane from "./components/layout/SplitPane.vue";
import CodeEditor from "./components/editor/CodeEditor.vue";
import OutputTerminal from "./components/terminal/OutputTerminal.vue";
import LessonTabs from "./components/lesson/LessonTabs.vue";
import { useCodeRunner } from "./composables/useCodeRunner";
import { useLessonState } from "./composables/useLessonState";
import { markCompleted } from "./db/database";
import { Play, FlaskConical } from "lucide-vue-next";

const { runCode, isRunning } = useCodeRunner();
const { currentLesson } = useLessonState();
const code = ref("// Write your Rust code here\nfn main() {\n    println!(\"Hello, CrabCademy!\");\n}\n");
const terminalRef = ref<InstanceType<typeof OutputTerminal> | null>(null);
const isTestRunning = ref(false);

async function handleRun() {
  if (terminalRef.value) {
    terminalRef.value.clear();
    terminalRef.value.writeln("\x1b[33mRunning...\x1b[0m");
    const output = await runCode(code.value);
    terminalRef.value.write(output);
  }
}

async function handleRunTests() {
  if (!terminalRef.value || !currentLesson.value) return;
  
  isTestRunning.value = true;
  terminalRef.value.clear();
  terminalRef.value.writeln("\x1b[36m🧪 Running tests...\x1b[0m\n");
  
  const output = await runCode(code.value);
  terminalRef.value.write(output);
  
  // Check if code ran successfully (no errors)
  const hasError = output.includes("Error") || output.includes("error") || output.includes("Sandbox Violation");
  
  if (hasError) {
    terminalRef.value.writeln("\n\x1b[31m❌ Test failed! Check the errors above.\x1b[0m");
  } else {
    terminalRef.value.writeln("\n\x1b[32m✅ All tests passed! Lesson complete!\x1b[0m");
    await markCompleted(currentLesson.value.id);
  }
  
  isTestRunning.value = false;
}
</script>

<template>
  <SplitPane>
    <template #lesson>
      <LessonTabs />
    </template>

    <template #editor>
      <div class="h-full flex flex-col">
        <div class="flex items-center justify-between p-2 bg-neutral-900 border-b border-neutral-800">
          <span class="text-sm font-bold text-neutral-400 pl-2">main.rs</span>
          <div class="flex items-center gap-2">
            <button 
              @click="handleRun" 
              :disabled="isRunning || isTestRunning"
              class="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play class="w-4 h-4 fill-current" />
              {{ isRunning ? 'Running...' : 'Run' }}
            </button>
            <button 
              @click="handleRunTests" 
              :disabled="isRunning || isTestRunning"
              class="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FlaskConical class="w-4 h-4" />
              {{ isTestRunning ? 'Testing...' : 'Test' }}
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

<style>
/* Remove default root styles to allow SplitPane to reach full height */
:root {
  background-color: transparent !important;
  color: inherit !important;
}
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
}
#app {
  height: 100%;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
  text-align: left;
}
</style>