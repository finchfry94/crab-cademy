<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits<{
  (e: 'selection', payload: { text: string; rect: DOMRect | null }) : void;
}>();

const containerRef = ref<HTMLElement | null>(null);

function handleSelection() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) {
    emit('selection', { text: '', rect: null });
    return;
  }

  const text = selection.toString().trim();
  if (!text) {
    emit('selection', { text: '', rect: null });
    return;
  }

  // Ensure the selection is within our container
  if (containerRef.value && !containerRef.value.contains(selection.anchorNode)) {
    return;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  emit('selection', { text, rect });
}

onMounted(() => {
  document.addEventListener('selectionchange', handleSelection);
});

onUnmounted(() => {
  document.removeEventListener('selectionchange', handleSelection);
});
</script>

<template>
  <div ref="containerRef" class="relative">
    <slot />
  </div>
</template>
