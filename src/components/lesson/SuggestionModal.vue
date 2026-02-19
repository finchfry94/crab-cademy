<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-vue-next';

const props = defineProps<{
  visible: boolean;
  initialText: string;
  lessonId: string;
  lessonTitle: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const suggestion = ref('');
const isSubmitting = ref(false);
const submitSuccess = ref(false);
const errorMessage = ref('');
const issueUrl = ref('');

const canSubmit = computed(() => suggestion.value.trim().length > 0);

function close() {
  emit('close');
  // Reset state after a delay or immediately if not submitted
  if (submitSuccess.value) {
    setTimeout(() => {
      submitSuccess.value = false;
      suggestion.value = '';
      issueUrl.value = '';
    }, 500);
  }
}

async function submit() {
  if (!canSubmit.value || isSubmitting.value) return;

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lessonId: props.lessonId,
        lessonTitle: props.lessonTitle,
        selectedText: props.initialText,
        suggestion: suggestion.value,
        context: window.location.href,
      }),
    });

    if (!response.ok) {
        let errorMsg = 'Failed to submit feedback.';
        try {
            const data = await response.json();
            errorMsg = data.error || errorMsg;
        } catch(e) { /* ignore json parse error */ }
        throw new Error(errorMsg);
    }

    const data = await response.json();
    issueUrl.value = data.url;
    submitSuccess.value = true;
  } catch (e: any) {
    errorMessage.value = e.message || 'An unexpected error occurred.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="close"
    >
      <div class="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-neutral-800">
          <h2 class="text-lg font-bold text-white">Suggest an Edit</h2>
          <button @click="close" class="text-neutral-400 hover:text-white transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto space-y-4">
          <div v-if="submitSuccess" class="flex flex-col items-center text-center py-6 space-y-4">
            <div class="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle class="w-8 h-8 text-emerald-500" />
            </div>
            <h3 class="text-xl font-bold text-white">Feedback Submitted!</h3>
            <p class="text-neutral-400">
              Thank you for helping improve Crab Cademy.
            </p>
            <a
              :href="issueUrl"
              target="_blank"
              class="text-orange-400 hover:text-orange-300 underline"
            >
              View on GitHub
            </a>
            <button
              @click="close"
              class="mt-4 px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>

          <div v-else class="space-y-4">
            <!-- Selected Context -->
            <div v-if="initialText" class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-wider text-neutral-500">Selected Text</label>
              <div class="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-400 text-sm italic border-l-2 border-l-orange-500/50">
                "{{ initialText }}"
              </div>
            </div>

            <!-- Suggestion Input -->
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-wider text-neutral-500">Your Suggestion</label>
              <textarea
                v-model="suggestion"
                rows="5"
                class="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                placeholder="What should this say instead? Or do you have a question about this section?"
                autofocus
              ></textarea>
            </div>

            <div v-if="errorMessage" class="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              <AlertCircle class="w-4 h-4" />
              <span>{{ errorMessage }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="!submitSuccess" class="p-4 border-t border-neutral-800 flex justify-end gap-3">
          <button
            @click="close"
            class="px-4 py-2 text-neutral-400 hover:text-white transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            @click="submit"
            :disabled="!canSubmit || isSubmitting"
            class="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-orange-900/20"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            {{ isSubmitting ? 'Submitting...' : 'Submit Suggestion' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
