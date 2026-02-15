import { ref } from 'vue';
import { executeRustCode } from '../services/codeRunner';

export function useCodeRunner() {
    const isRunning = ref(false);
    const result = ref<string>('');
    const error = ref<string | null>(null);

    async function runCode(code: string) {
        isRunning.value = true;
        error.value = null;
        result.value = '';

        try {
            const output = await executeRustCode(code);
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
