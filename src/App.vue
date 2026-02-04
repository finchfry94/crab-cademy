<script setup lang="ts">
import { ref } from "vue";
import SplitPane from "./components/layout/SplitPane.vue";
import CodeEditor from "./components/editor/CodeEditor.vue";
import OutputTerminal from "./components/terminal/OutputTerminal.vue";
import { useCodeRunner } from "./composables/useCodeRunner";
import { Play } from "lucide-vue-next";

const { runCode, isRunning } = useCodeRunner();
const code = ref("// Write your Rust code here\nfn main() {\n    println!(\"Hello, CrabCademy!\");\n}\n");
const terminalRef = ref<InstanceType<typeof OutputTerminal> | null>(null);

async function handleRun() {
  if (terminalRef.value) {
    terminalRef.value.clear();
    terminalRef.value.writeln("\x1b[33mRunning...\x1b[0m");
    const output = await runCode(code.value);
    terminalRef.value.write(output);
  }
}
</script>

<template>
  <SplitPane>
    <template #lesson>
      <div class="prose prose-invert max-w-none">
        <!-- Security Warning Banner -->
        <div class="mb-4 p-3 bg-amber-900/30 border border-amber-600/50 rounded-lg flex items-start gap-3">
          <span class="text-amber-500 text-lg">⚠️</span>
          <div class="text-sm">
            <p class="font-semibold text-amber-400 mb-1">Code runs on your machine</p>
            <p class="text-amber-200/80 text-xs">A soft sandbox blocks dangerous operations (fs, net, process, unsafe). Do not bypass it with untrusted code.</p>
          </div>
        </div>
        
        <h1 class="text-3xl font-bold text-orange-500 mb-4">Welcome to CrabCademy 🦀</h1>
        <p>This is where your lesson content will go. It will support Markdown rendering.</p>
        <div class="mt-4 p-4 bg-neutral-800 rounded border border-neutral-700">
          <p class="font-bold text-emerald-400">Mission:</p>
          <p>Learn Rust by doing.</p>
        </div>
      </div>
    </template>

    <template #editor>
      <div class="h-full flex flex-col">
        <div class="flex items-center justify-between p-2 bg-neutral-900 border-b border-neutral-800">
          <span class="text-sm font-bold text-neutral-400 pl-2">main.rs</span>
          <button 
            @click="handleRun" 
            :disabled="isRunning"
            class="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play class="w-4 h-4" :class="{ 'fill-current': true }" />
            {{ isRunning ? 'Running...' : 'Run' }}
          </button>
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