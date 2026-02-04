<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

const props = defineProps<{
  markdown: string
}>()

// Initialize markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

// Render markdown to HTML
const renderedContent = computed(() => {
  return md.render(props.markdown)
})
</script>

<template>
  <div class="prose prose-invert max-w-none p-4 prose-a:text-orange-400 prose-headings:text-orange-500 prose-pre:bg-neutral-800 prose-pre:border prose-pre:border-neutral-700">
    <div v-html="renderedContent"></div>
  </div>
</template>
