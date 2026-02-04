import { ref } from 'vue';
import { invoke } from '@tauri-apps/api/core';

export function useCodeRunner() {
    const isRunning = ref(false);
    const result = ref<string>('');
    const error = ref<string | null>(null);

    async function runCode(code: string) {
        isRunning.value = true;
        error.value = null;
        result.value = '';

        try {
            const output = await invoke<string>('run_code', { code });
            result.value = output;
            return output;
        } catch (e: any) {
            const errorMsg = e.toString();
            error.value = errorMsg;
            return `Error: ${errorMsg}`;
        } finally {
            isRunning.value = false;
        }
    }

    return {
        runCode,
        isRunning,
        result,
        error
    };
}
