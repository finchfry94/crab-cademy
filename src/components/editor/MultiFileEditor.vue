<script setup lang="ts">
import { ref, watch, onBeforeUnmount, shallowRef, computed } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import FileTreeNode from './FileTreeNode.vue'
import type { TreeNode } from './FileTreeNode.vue'

const props = defineProps<{
  language?: string
}>()

const files = defineModel<Record<string, string>>('files', {
  default: () => ({ 'src/main.rs': '// Write your Rust code here\nfn main() {\n    println!("Hello, CrabCademy!");\n}\n' })
})

const activeFile = ref<string>('')
const editorRef = shallowRef<any>(null)
const monacoRef = shallowRef<any>(null)
const treeCollapsed = ref(false)

// Map of URI string -> Monaco model
const modelMap = new Map<string, any>()

const MONACO_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  minimap: { enabled: false },
  fontSize: 14,
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  scrollBeyondLastLine: false,
  padding: { top: 16 }
}

// ── Tree data structure ──────────────────────────────────────

// Tracks which dirs are expanded (all open by default)
const expandedDirs = ref<Set<string>>(new Set())

// Build the tree from flat file paths
const fileTree = computed<TreeNode[]>(() => {
  const root: TreeNode[] = []
  const dirMap = new Map<string, TreeNode>()

  const keys = Object.keys(files.value).sort((a, b) => {
    if (a.includes('main.rs')) return -1
    if (b.includes('main.rs')) return 1
    return a.localeCompare(b)
  })

  for (const filePath of keys) {
    const parts = filePath.split('/')
    let current = root
    let pathSoFar = ''

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      pathSoFar = pathSoFar ? `${pathSoFar}/${part}` : part
      const isLast = i === parts.length - 1

      if (isLast) {
        current.push({ name: part, fullPath: filePath, isDir: false, children: [] })
      } else {
        let dirNode = dirMap.get(pathSoFar)
        if (!dirNode) {
          dirNode = { name: part, fullPath: pathSoFar, isDir: true, children: [] }
          dirMap.set(pathSoFar, dirNode)
          current.push(dirNode)
          expandedDirs.value.add(pathSoFar)
        }
        current = dirNode.children
      }
    }
  }

  return root
})

function toggleDir(path: string) {
  const next = new Set(expandedDirs.value)
  if (next.has(path)) {
    next.delete(path)
  } else {
    next.add(path)
  }
  expandedDirs.value = next
}

// ── Editor logic ─────────────────────────────────────────────

watch(
  () => files.value,
  (newFiles) => {
    const keys = Object.keys(newFiles)
    if (keys.length > 0 && (!activeFile.value || !newFiles[activeFile.value])) {
      activeFile.value = keys.find(k => k.includes('main.rs')) || keys[0]
    }
  },
  { immediate: true, deep: true }
)

function handleMount(editor: any, monaco: any) {
  editorRef.value = editor
  monacoRef.value = monaco
  syncModels()
  if (activeFile.value) {
    const model = modelMap.get(activeFile.value)
    if (model) editor.setModel(model)
  }
  editor.onDidChangeModelContent(() => {
    const model = editor.getModel()
    if (model) {
      const uri = model.uri.toString()
      for (const [key, m] of modelMap.entries()) {
        if (m.uri.toString() === uri) {
          files.value = { ...files.value, [key]: model.getValue() }
          break
        }
      }
    }
  })
}

function syncModels() {
  const monaco = monacoRef.value
  if (!monaco) return
  for (const [path, content] of Object.entries(files.value)) {
    if (!modelMap.has(path)) {
      const uri = monaco.Uri.parse(`file:///${path}`)
      let model = monaco.editor.getModel(uri)
      if (!model) {
        model = monaco.editor.createModel(content, props.language || 'rust', uri)
      }
      modelMap.set(path, model)
    }
  }
}

function switchToFile(path: string) {
  const editor = editorRef.value
  if (!editor) return
  activeFile.value = path
  syncModels()
  const model = modelMap.get(path)
  if (model) editor.setModel(model)
}

onBeforeUnmount(() => {
  for (const model of modelMap.values()) model.dispose()
  modelMap.clear()
})
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Active file breadcrumb bar -->
    <div class="flex items-center bg-neutral-900 border-b border-neutral-800 shrink-0 px-2 py-1.5 gap-2">
      <button
        @click="treeCollapsed = !treeCollapsed"
        class="p-1 text-neutral-500 hover:text-neutral-300 rounded transition-colors"
        :title="treeCollapsed ? 'Show file tree' : 'Hide file tree'"
      >
        <PanelLeftOpen v-if="treeCollapsed" class="w-4 h-4" />
        <PanelLeftClose v-else class="w-4 h-4" />
      </button>
      <span class="text-[11px] text-neutral-500 font-mono truncate">{{ activeFile }}</span>
    </div>

    <div class="flex-1 flex min-h-0">
      <!-- File Tree Sidebar -->
      <aside
        v-show="!treeCollapsed"
        class="w-48 shrink-0 bg-neutral-950 border-r border-neutral-800 overflow-y-auto overflow-x-hidden file-tree-sidebar"
      >
        <div class="py-2">
          <FileTreeNode
            v-for="node in fileTree"
            :key="node.fullPath"
            :node="node"
            :depth="0"
            :activeFile="activeFile"
            :expandedDirs="expandedDirs"
            @selectFile="switchToFile"
            @toggleDir="toggleDir"
          />
        </div>
      </aside>

      <!-- Editor -->
      <div class="flex-1 min-h-0 min-w-0">
        <vue-monaco-editor
          :language="language || 'rust'"
          :options="MONACO_OPTIONS"
          theme="vs-dark"
          @mount="handleMount"
          class="h-full w-full"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-tree-sidebar::-webkit-scrollbar {
  width: 4px;
}
.file-tree-sidebar::-webkit-scrollbar-track {
  background: transparent;
}
.file-tree-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
</style>
