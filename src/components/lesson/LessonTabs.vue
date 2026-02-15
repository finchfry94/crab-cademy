<script setup lang="ts">
import { ref } from "vue";
import { useLessonState } from "../../composables/useLessonState";
import { CheckCircle, XCircle, CircleDot, Lock, Circle } from "lucide-vue-next";
import MarkdownIt from "markdown-it";

const {
  currentLesson,
  activeTab,
  isLoading,
  quizCompleted,
  quizAnswers,
  testResults,
  hasRunTests,
  allTestsPassed,
  setQuizAnswer,
  submitQuiz,
  setActiveTab,
} = useLessonState();

const md = new MarkdownIt();
const quizSubmitted = ref(false);
const quizPassed = ref(false);

function renderMarkdown(content: string): string {
  return md.render(content);
}

function handleQuizSubmit() {
  quizSubmitted.value = true;
  quizPassed.value = submitQuiz();
}

function isQuestionCorrect(index: number): boolean | null {
  if (!quizSubmitted.value) return null;
  if (!currentLesson.value) return null;
  return quizAnswers.value[index] === currentLesson.value.quiz[index].correctIndex;
}

/**
 * Extract test function names from the test_code so we can show
 * per-test status even before tests are run.
 */
function getTestNames(): string[] {
  if (!currentLesson.value) return [];
  const regex = /fn\s+(test_\w+)\s*\(\)/g;
  const names: string[] = [];
  let match;
  while ((match = regex.exec(currentLesson.value.test_code)) !== null) {
    names.push(match[1]);
  }
  return names;
}

function getTestStatus(testName: string): "pass" | "fail" | "pending" {
  if (!hasRunTests.value) return "pending";
  const result = testResults.value.find((t) => t.name === testName);
  if (!result) return "pending";
  return result.passed ? "pass" : "fail";
}
</script>

<template>
  <div class="h-full flex flex-col bg-neutral-900">
    <!-- Tab Header -->
    <div class="flex items-center bg-neutral-900 border-b border-neutral-800">
      <button
        @click="setActiveTab('lesson')"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors border-b-2',
          activeTab === 'lesson'
            ? 'text-orange-400 border-orange-500 bg-neutral-800/50'
            : 'text-neutral-400 border-transparent hover:text-neutral-200',
        ]"
      >
        📖 Lesson
      </button>
      <button
        @click="setActiveTab('objectives')"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5',
          activeTab === 'objectives'
            ? 'text-emerald-400 border-emerald-500 bg-neutral-800/50'
            : quizCompleted
              ? 'text-neutral-400 border-transparent hover:text-neutral-200'
              : 'text-neutral-600 border-transparent cursor-not-allowed',
        ]"
        :disabled="!quizCompleted"
      >
        <Lock v-if="!quizCompleted" class="w-3 h-3" />
        🎯 Objectives
        <span
          v-if="hasRunTests && allTestsPassed"
          class="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold"
        >
          ALL PASS
        </span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 min-h-0 overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-4 text-neutral-500">Loading lesson...</div>

      <!-- ═══ LESSON TAB ═══ -->
      <div
        v-else-if="activeTab === 'lesson' && currentLesson"
        class="h-full overflow-y-auto p-4"
      >
        <!-- Lesson Content -->
        <div
          class="prose prose-invert prose-orange max-w-none"
          v-html="renderMarkdown(currentLesson.content)"
        />

        <!-- Quiz Section -->
        <div class="mt-8 border-t border-neutral-800 pt-6">
          <h3 class="text-lg font-bold text-orange-400 mb-4">📝 Quick Quiz</h3>
          <p class="text-neutral-400 text-sm mb-4">
            Answer all questions correctly to unlock the Objectives tab.
          </p>

          <div class="space-y-6">
            <div
              v-for="(question, qi) in currentLesson.quiz"
              :key="qi"
              class="p-4 bg-neutral-900 rounded-lg border"
              :class="[
                isQuestionCorrect(qi) === true
                  ? 'border-emerald-500/40'
                  : isQuestionCorrect(qi) === false
                    ? 'border-red-500/40'
                    : 'border-neutral-800',
              ]"
            >
              <p class="text-neutral-200 font-medium mb-3">
                {{ qi + 1 }}. {{ question.question }}
              </p>
              <div class="space-y-2">
                <label
                  v-for="(option, oi) in question.options"
                  :key="oi"
                  :class="[
                    'flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors text-sm',
                    quizAnswers[qi] === oi
                      ? quizSubmitted
                        ? oi === question.correctIndex
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                          : 'bg-red-500/15 border border-red-500/30 text-red-300'
                        : 'bg-orange-500/15 border border-orange-500/30 text-orange-300'
                      : quizSubmitted && oi === question.correctIndex
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-neutral-800/50 border border-neutral-700 text-neutral-300 hover:border-neutral-600',
                  ]"
                >
                  <input
                    type="radio"
                    :name="'quiz-' + qi"
                    :value="oi"
                    :checked="quizAnswers[qi] === oi"
                    :disabled="quizCompleted"
                    @change="setQuizAnswer(qi, oi)"
                    class="accent-orange-500"
                  />
                  <span class="flex-1">{{ option }}</span>
                  <CheckCircle
                    v-if="quizSubmitted && oi === question.correctIndex"
                    class="w-4 h-4 text-emerald-400 shrink-0"
                  />
                  <XCircle
                    v-if="quizSubmitted && quizAnswers[qi] === oi && oi !== question.correctIndex"
                    class="w-4 h-4 text-red-400 shrink-0"
                  />
                </label>
              </div>
            </div>
          </div>

          <!-- Quiz Submit -->
          <div class="mt-4" v-if="!quizCompleted">
            <button
              @click="handleQuizSubmit"
              :disabled="Object.keys(quizAnswers).length < (currentLesson?.quiz.length ?? 0)"
              class="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check Answers
            </button>
            <p
              v-if="quizSubmitted && !quizPassed"
              class="text-red-400 text-sm mt-2"
            >
              ❌ Some answers are incorrect. Try again!
            </p>
          </div>
          <div
            v-else
            class="mt-4 p-3 bg-emerald-900/30 rounded-lg border border-emerald-700 text-emerald-400 text-sm"
          >
            ✅ Quiz complete! Switch to the <strong>Objectives</strong> tab to start coding.
          </div>
        </div>
      </div>

      <!-- ═══ OBJECTIVES TAB ═══ -->
      <div
        v-else-if="activeTab === 'objectives' && currentLesson"
        class="h-full overflow-y-auto p-4"
      >
        <!-- Objectives Description -->
        <div
          class="prose prose-invert prose-emerald max-w-none mb-6"
          v-html="renderMarkdown(currentLesson.objectives)"
        />

        <!-- Test Checklist -->
        <div class="mt-6">
          <h3 class="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
            <CircleDot class="w-4 h-4" />
            Tests to Pass
          </h3>

          <div class="space-y-2 mb-4">
            <div
              v-for="testName in getTestNames()"
              :key="testName"
              :class="[
                'flex items-center gap-3 p-3 rounded-lg border transition-all',
                getTestStatus(testName) === 'pass'
                  ? 'bg-emerald-500/10 border-emerald-500/25'
                  : getTestStatus(testName) === 'fail'
                    ? 'bg-red-500/10 border-red-500/25'
                    : 'bg-neutral-900/60 border-neutral-800',
              ]"
            >
              <CheckCircle
                v-if="getTestStatus(testName) === 'pass'"
                class="w-5 h-5 text-emerald-400 shrink-0"
              />
              <XCircle
                v-else-if="getTestStatus(testName) === 'fail'"
                class="w-5 h-5 text-red-400 shrink-0"
              />
              <Circle v-else class="w-5 h-5 text-neutral-600 shrink-0" />

              <span
                :class="[
                  'font-mono text-sm',
                  getTestStatus(testName) === 'pass'
                    ? 'text-emerald-300'
                    : getTestStatus(testName) === 'fail'
                      ? 'text-red-300'
                      : 'text-neutral-400',
                ]"
              >
                {{ testName }}
              </span>

              <span
                v-if="getTestStatus(testName) !== 'pending'"
                :class="[
                  'ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded',
                  getTestStatus(testName) === 'pass'
                    ? 'text-emerald-400 bg-emerald-500/15'
                    : 'text-red-400 bg-red-500/15',
                ]"
              >
                {{ getTestStatus(testName) === 'pass' ? 'PASS' : 'FAIL' }}
              </span>
            </div>
          </div>

          <!-- Summary bar -->
          <div
            v-if="hasRunTests && testResults.length > 0"
            class="p-3 rounded-lg border mb-6"
            :class="[
              allTestsPassed
                ? 'bg-emerald-900/20 border-emerald-500/30'
                : 'bg-red-900/20 border-red-500/30',
            ]"
          >
            <p
              :class="[
                'text-sm font-medium',
                allTestsPassed ? 'text-emerald-400' : 'text-red-400',
              ]"
            >
              {{ allTestsPassed
                ? '🎉 All tests passed! Lesson complete!'
                : `❌ ${testResults.filter(t => !t.passed).length} of ${testResults.length} tests failed. Fix your code and run tests again.`
              }}
            </p>
          </div>
          <div v-else-if="!hasRunTests" class="p-3 bg-neutral-900 rounded-lg border border-neutral-800 text-neutral-500 text-sm mb-6">
            Click the <strong class="text-blue-400">Test</strong> button in the editor to run your code against these tests.
          </div>
        </div>

        <!-- Test Code (Read-Only) -->
        <div>
          <h3 class="text-sm font-bold text-neutral-500 mb-2">Test Source Code</h3>
          <pre
            class="p-4 bg-neutral-900 rounded-lg border border-neutral-700 text-sm overflow-x-auto"
          ><code class="text-neutral-400">{{ currentLesson.test_code }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>
