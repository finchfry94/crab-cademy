/**
 * Code execution service using the Rust Playground API.
 * Supports both running code and running tests with per-test result parsing.
 */

import { invoke } from "@tauri-apps/api/core";

const PLAYGROUND_URL = "https://play.rust-lang.org/execute";

/**
 * Detect if we are running inside Tauri
 */
export function isTauri(): boolean {
    return !!(window as any).__TAURI_INTERNALS__ || !!(window as any).__TAURI__;
}

export interface PlaygroundRequest {
    channel: "stable" | "beta" | "nightly";
    mode: "debug" | "release";
    edition: "2015" | "2018" | "2021" | "2024";
    crateType: "bin" | "lib";
    tests: boolean;
    code: string;
    backtrace: boolean;
}

export interface PlaygroundResponse {
    success: boolean;
    exitDetail: string;
    stdout: string;
    stderr: string;
}

export interface TestResult {
    name: string;
    passed: boolean;
}

export interface TestRunResult {
    results: TestResult[];
    allPassed: boolean;
    rawOutput: string;
}

/**
 * Execute Rust code. Uses Tauri if running locally and requested, otherwise uses Playground.
 */
export async function executeRustCode(code: string, environment: "browser" | "desktop" = "browser"): Promise<string> {
    const isLocal = isTauri();

    // Always prefer Tauri if we are inside it, unless it's explicitly a browser-only task 
    // (though in this app, desktop environment is a superset of browser).
    if (isLocal) {
        try {
            const rawOutput = await invoke<string>("run_code", { code, useSandbox: false });
            return `\x1b[33m[Running via Local Rust]\x1b[0m\r\n${rawOutput}`;
        } catch (e: any) {
            // Fallback to playground if it wasn't a desktop-required lesson
            if (environment !== "desktop") {
                const playgroundOutput = await runViaPlayground(code, false);
                return `\x1b[31mTauri Error: ${e.message || e.toString()}\x1b[0m\r\n\x1b[33m[Falling back to Rust Playground]\x1b[0m\r\n${playgroundOutput}`;
            }
            return `Tauri Error: ${e.message || e.toString()}`;
        }
    }

    const output = await runViaPlayground(code, false);
    return `\x1b[33m[Running via Rust Playground]\x1b[0m\r\n${output}`;
}

async function runViaPlayground(code: string, isTest: boolean): Promise<string> {
    const request: PlaygroundRequest = {
        channel: "stable",
        mode: "debug",
        edition: "2021",
        crateType: "bin",
        tests: isTest,
        code,
        backtrace: false,
    };

    try {
        const response = await fetch(PLAYGROUND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            return `Error: Playground API returned ${response.status} ${response.statusText}`;
        }

        const result: PlaygroundResponse = await response.json();

        if (result.success) {
            const output = result.stdout + (result.stderr ? `\n${result.stderr}` : "");
            return output || "(no output)";
        } else {
            return result.stderr || result.stdout || "Unknown error occurred";
        }
    } catch (e: any) {
        if (e.name === "TypeError" && e.message.includes("fetch")) {
            return "Error: Unable to reach the Rust Playground. Check your internet connection.";
        }
        return `Error: ${e.message || e.toString()}`;
    }
}

/**
 * Run user code combined with test code. 
 * Routes through Tauri if in desktop environment, otherwise Playground.
 */
export async function runTests(
    userCode: string,
    testCode: string,
    environment: "browser" | "desktop" = "browser"
): Promise<TestRunResult> {
    const combinedCode = `${userCode}\n\n${testCode}`;
    const isLocal = isTauri();

    if (isLocal) {
        try {
            const rawOutput = await invoke<string>("run_code", { code: combinedCode, useSandbox: false });
            const testResults = parseTestOutput(rawOutput);

            // Check for execution errors (like rustc not found)
            const isError = rawOutput.startsWith("Error:") || rawOutput.includes("Error running rustc");

            return {
                results: testResults,
                allPassed: !isError && (testResults.length > 0 ? testResults.every((t) => t.passed) : !rawOutput.toLowerCase().includes("failed")),
                rawOutput: `\x1b[33m[Running via Local Rust]\x1b[0m\r\n${rawOutput}`,
            };
        } catch (e: any) {
            if (environment !== "desktop") {
                const playgroundResult = await runTestsViaPlayground(combinedCode);
                return {
                    ...playgroundResult,
                    rawOutput: `\x1b[31mTauri Error: ${e.message || e.toString()}\x1b[0m\r\n\x1b[33m[Falling back to Rust Playground]\x1b[0m\r\n${playgroundResult.rawOutput}`,
                };
            }
            return {
                results: [],
                allPassed: false,
                rawOutput: `Tauri Error: ${e.message || e.toString()}`,
            };
        }
    }

    const result = await runTestsViaPlayground(combinedCode);
    return {
        ...result,
        rawOutput: `\x1b[33m[Running via Rust Playground]\x1b[0m\r\n${result.rawOutput}`,
    };
}

async function runTestsViaPlayground(combinedCode: string): Promise<Omit<TestRunResult, "rawOutput"> & { rawOutput: string }> {
    // Default: Playground API
    const request: PlaygroundRequest = {
        channel: "stable",
        mode: "debug",
        edition: "2021",
        crateType: "bin",
        tests: true,
        code: combinedCode,
        backtrace: false,
    };

    try {
        const response = await fetch(PLAYGROUND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            return {
                results: [],
                allPassed: false,
                rawOutput: `Error: Playground API returned ${response.status} ${response.statusText}`,
            };
        }

        const result: PlaygroundResponse = await response.json();
        const rawOutput = (result.stdout || "") + (result.stderr || "");
        const testResults = parseTestOutput(rawOutput);

        return {
            results: testResults,
            allPassed: result.success && testResults.length > 0 && testResults.every((t) => t.passed),
            rawOutput,
        };
    } catch (e: any) {
        return {
            results: [],
            allPassed: false,
            rawOutput: `Error: ${e.message || e.toString()}`,
        };
    }
}

/**
 * Parse cargo test output to extract individual test results.
 * Matches lines like: "test test_name ... ok" or "test tests::test_name ... FAILED"
 */
function parseTestOutput(output: string): TestResult[] {
    const results: TestResult[] = [];
    const testLineRegex = /^test\s+(.+?)\s+\.\.\.\s+(ok|FAILED)\s*$/gm;

    let match;
    while ((match = testLineRegex.exec(output)) !== null) {
        const fullName = match[1];
        // Strip "tests::" prefix if present for cleaner display
        const displayName = fullName.replace(/^tests::/, "");
        results.push({
            name: displayName,
            passed: match[2] === "ok",
        });
    }

    return results;
}

// ─── ANSI color codes ────────────────────────────────────────────
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const CYAN = "\x1b[36m";
const WHITE = "\x1b[37m";
const BRIGHT_RED = "\x1b[91m";
const BRIGHT_GREEN = "\x1b[92m";
const BRIGHT_CYAN = "\x1b[96m";

/**
 * Colorize raw Rust compiler / cargo test output with ANSI codes
 * so it looks great in xterm.js.
 */
export function colorizeRustOutput(raw: string): string {
    return raw
        .split("\n")
        .map((line) => colorizeLine(line))
        .join("\r\n"); // xterm.js needs \r\n for proper line breaks
}

function colorizeLine(line: string): string {
    // error[E0308]: mismatched types
    if (/^error(\[E\d+\])?:/.test(line)) {
        return `${BOLD}${BRIGHT_RED}${line}${RESET}`;
    }
    // error: could not compile ...
    if (/^error:/.test(line) || /^error\[/.test(line)) {
        return `${BOLD}${RED}${line}${RESET}`;
    }
    // warning[E0599]: ...
    if (/^warning(\[E\d+\])?:/.test(line) || /^warning:/.test(line)) {
        return `${BOLD}${YELLOW}${line}${RESET}`;
    }
    // note: ...
    if (/^\s*=\s*note:/.test(line)) {
        return `${CYAN}${line}${RESET}`;
    }
    // help: ...
    if (/^\s*=\s*help:/.test(line) || /^\s*help:/.test(line)) {
        return `${GREEN}${line}${RESET}`;
    }
    //  --> src/main.rs:5:13
    if (/^\s*-->/.test(line)) {
        return `${BOLD}${BLUE}${line}${RESET}`;
    }
    // Line number gutter:  5 |     let x = 10;
    if (/^\s*\d+\s*\|/.test(line)) {
        const match = line.match(/^(\s*\d+\s*\|)(.*)$/);
        if (match) {
            return `${BRIGHT_CYAN}${match[1]}${RESET}${WHITE}${match[2]}${RESET}`;
        }
    }
    // Blank gutter:    |         ^^^ expected ...
    if (/^\s*\|/.test(line)) {
        // Colorize the caret markers (^ and -)
        const colored = line.replace(/(\^+|-+)/g, `${BRIGHT_RED}$1${CYAN}`);
        return `${CYAN}${colored}${RESET}`;
    }
    // test result lines: test tests::test_name ... ok / FAILED
    if (/^test\s+.+\.\.\.\s+ok\s*$/.test(line)) {
        return line.replace(/ok\s*$/, `${BOLD}${BRIGHT_GREEN}ok${RESET}`);
    }
    if (/^test\s+.+\.\.\.\s+FAILED\s*$/.test(line)) {
        return line.replace(/FAILED\s*$/, `${BOLD}${BRIGHT_RED}FAILED${RESET}`);
    }
    // test result summary: test result: ok. 3 passed; 0 failed
    if (/^test result:/.test(line)) {
        if (line.includes("ok.")) {
            return `${BOLD}${GREEN}${line}${RESET}`;
        }
        return `${BOLD}${RED}${line}${RESET}`;
    }
    // running N test(s)
    if (/^running \d+ tests?/.test(line)) {
        return `${DIM}${line}${RESET}`;
    }
    // Compiling / Finished / Running
    if (/^\s*(Compiling|Finished|Running)\s/.test(line)) {
        return `${BOLD}${GREEN}${line}${RESET}`;
    }
    // For more information about an error ...
    if (/For more information about/.test(line)) {
        return `${DIM}${line}${RESET}`;
    }

    return line;
}
