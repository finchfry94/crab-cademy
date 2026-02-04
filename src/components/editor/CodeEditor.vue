<script setup lang="ts">
import { shallowRef } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'

const props = defineProps<{
  language?: string
}>()

const code = defineModel<string>('value', {
  default: '// Write your Rust code here\nfn main() {\n    println!("Hello, CrabCademy!");\n}\n'
})
const editorRef = shallowRef()

const handleMount = (editor: any) => {
  editorRef.value = editor
}

const MONACO_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  minimap: { enabled: false },
  fontSize: 14,
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  theme: 'vs-dark', // We will customize this later to match app theme
  scrollBeyondLastLine: false,
  padding: { top: 16 }
}
</script>

<template>
  <vue-monaco-editor
    v-model:value="code"
    :language="language || 'rust'"
    :options="MONACO_OPTIONS"
    theme="vs-dark"
    @mount="handleMount"
    class="h-full w-full"
  />
</template>
