<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

// We will eventually expose methods to write to this terminal from the parent
const terminalContainer = ref<HTMLElement | null>(null)
const term = ref<Terminal | null>(null)
const fitAddon = ref<FitAddon | null>(null)

onMounted(() => {
  if (terminalContainer.value) {
    const t = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      theme: {
        background: '#09090b', // neutral-950
        foreground: '#e5e5e5', // neutral-200
        cursor: '#22c55e', // green-500
      },
      disableStdin: true, // Output only for now
    })
    
    const fit = new FitAddon()
    t.loadAddon(fit)
    
    t.open(terminalContainer.value)
    fit.fit()
    
    t.writeln('\x1b[32mWelcome to CrabCademy Terminal\x1b[0m')
    t.writeln('Ready to compile...')

    term.value = t
    fitAddon.value = fit
    
    // Handle resize
    window.addEventListener('resize', handleResize)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  term.value?.dispose()
})

function handleResize() {
  fitAddon.value?.fit()
}

// Expose write method for parent to use
defineExpose({
  write: (data: string) => term.value?.write(data),
  writeln: (data: string) => term.value?.writeln(data),
  clear: () => term.value?.clear(),
  fit: () => fitAddon.value?.fit() // Parent (SplitPane) might need to call this on resize
})
</script>

<template>
  <div ref="terminalContainer" class="h-full w-full bg-black pl-2 pt-2 overflow-hidden"></div>
</template>
