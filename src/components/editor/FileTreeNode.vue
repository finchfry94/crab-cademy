<script setup lang="ts">
import { ChevronRight, ChevronDown, File, FolderOpen, Folder } from 'lucide-vue-next'

export interface TreeNode {
  name: string
  fullPath: string
  isDir: boolean
  children: TreeNode[]
}

defineProps<{
  node: TreeNode
  depth: number
  activeFile: string
  expandedDirs: Set<string>
}>()

const emit = defineEmits<{
  (e: 'selectFile', path: string): void
  (e: 'toggleDir', path: string): void
}>()
</script>

<template>
  <div>
    <button
      @click="node.isDir ? emit('toggleDir', node.fullPath) : emit('selectFile', node.fullPath)"
      :style="{ paddingLeft: (depth * 12 + 8) + 'px' }"
      :class="[
        'flex items-center gap-1.5 w-full py-1 pr-2 text-[11px] font-medium transition-colors truncate',
        !node.isDir && activeFile === node.fullPath
          ? 'text-orange-400 bg-orange-500/10'
          : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
      ]"
    >
      <template v-if="node.isDir">
        <ChevronDown v-if="expandedDirs.has(node.fullPath)" class="w-3 h-3 shrink-0 text-neutral-600" />
        <ChevronRight v-else class="w-3 h-3 shrink-0 text-neutral-600" />
        <FolderOpen v-if="expandedDirs.has(node.fullPath)" class="w-3.5 h-3.5 shrink-0 text-amber-500/70" />
        <Folder v-else class="w-3.5 h-3.5 shrink-0 text-amber-500/70" />
      </template>
      <template v-else>
        <span class="w-3 shrink-0">&nbsp;</span>
        <File class="w-3.5 h-3.5 shrink-0 text-neutral-600" />
      </template>
      <span class="truncate">{{ node.name }}</span>
    </button>
    <div v-if="node.isDir && expandedDirs.has(node.fullPath)">
      <FileTreeNode
        v-for="child in node.children"
        :key="child.fullPath"
        :node="child"
        :depth="depth + 1"
        :activeFile="activeFile"
        :expandedDirs="expandedDirs"
        @selectFile="emit('selectFile', $event)"
        @toggleDir="emit('toggleDir', $event)"
      />
    </div>
  </div>
</template>
