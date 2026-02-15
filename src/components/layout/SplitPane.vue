<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

defineProps<{
  lessonSize?: number
  editorSize?: number
  terminalSize?: number
}>()
</script>

<template>
  <div class="h-screen w-full bg-neutral-950 overflow-hidden">
    <splitpanes class="default-theme" horizontal>
      
      <!-- Top Section: Lesson & Editor -->
      <pane :size="75">
        <splitpanes vertical>
          <!-- Lesson Pane -->
          <pane :size="30" class="border-r border-neutral-800 bg-neutral-900">
             <div class="h-full w-full p-4 overflow-auto">
                <slot name="lesson">Lesson Content Placeholder</slot>
             </div>
          </pane>

          <!-- Editor Pane -->
          <pane :size="70" class="bg-neutral-900">
             <div class="h-full w-full">
                <slot name="editor">Editor Placeholder</slot>
             </div>
          </pane>
        </splitpanes>
      </pane>

      <!-- Bottom Section: Terminal -->
      <pane :size="25" class="border-t border-neutral-800 bg-neutral-950">
        <div class="h-full w-full p-2 font-mono text-sm text-neutral-300 overflow-auto">
           <slot name="terminal">Terminal Output Placeholder</slot>
        </div>
      </pane>

    </splitpanes>
  </div>
</template>

<style>
/* Customizing splitpanes theme for dark mode with orange accents */
.splitpanes.default-theme .splitpanes__splitter {
  background-color: #262626 !important; /* neutral-800 */
  border-color: #262626 !important;
}

.splitpanes.default-theme .splitpanes__splitter:hover {
  background-color: #f97316 !important; /* orange-500 */
}
</style>
