import { ref } from 'vue';
import { executeRustCode, executeRustCodeMulti } from '../services/codeRunner';

export function useCodeRunner() {
    const isRunning = ref(false);
    const result = ref<string>('');
    const error = ref<string | null>(null);

    async function runCode(code: string, environment: "browser" | "desktop" = "browser", args: string[] = []) {
        isRunning.value = true;
        error.value = null;
        result.value = '';

        try {
            const output = await executeRustCode(code, environment, args);
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

    async function runCodeMulti(files: Record<string, string>, environment: "browser" | "desktop" = "desktop", args: string[] = []) {
        isRunning.value = true;
        error.value = null;
        result.value = '';

        try {
            const output = await executeRustCodeMulti(files, environment, args);
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
        runCodeMulti,
        isRunning,
        result,
        error
    };
}
