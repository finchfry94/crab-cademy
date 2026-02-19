import { Lesson } from "../../types";

export const ch11Lessons: Lesson[] = [
    {
        id: "ch11-01",
        chapter: "11.1",
        title: "How to Write Tests",
        sort_order: 110,
        environment: "browser",
        content: `# Writing Tests

Welcome to Software Engineering 101.

In many university courses, you write code, submit it, get a grade, and never touch it again. In the real world, code lives for years. It gets modified, refactored, and extended by people who (gasp!) might not be you.

How do you ensure that your changes today didn't break the feature you wrote last year? **Automated Tests.**

Tests are not "extra work." They are the **safety net** that allows you to move fast without breaking things.

## The Anatomy of a Rust Test

A test in Rust is just a function annotated with the \`#[test]\` attribute. When you run \`cargo test\`, Rust builds a special binary that finds and executes these annotated functions.

\`\`\`rust
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
\`\`\`

### Key Components

| Code Fragment | Meaning |
|---|---|
| \`#[cfg(test)]\` | "Only compile this module when running tests." (Saves compile time and binary size for production). |
| \`mod tests\` | It's convention to group unit tests in a module named \`tests\`. |
| \`#[test]\` | "This function is a test. Run it!" |
| \`assert_eq!\` | "Panic (fail) if these two values are not equal." |

## Assertions: The Referee

Tests typically use macros to check conditions. If an assertion fails, the test thread panics, and Rust reports a failure.

*   **\`assert!(condition)\`**: "I assert this is TRUE." Usage: \`assert!(x > 5)\`.
*   **\`assert_eq!(left, right)\`**: "I assert these are EQUAL." Usage: \`assert_eq!(2 + 2, 4)\`.
*   **\`assert_ne!(left, right)\`**: "I assert these are NOT EQUAL." Usage: \`assert_ne!(result, "error")\`

## Testing Panics

Sometimes, you *expect* code to crash (e.g., if someone divides by zero). You can verify this with \`#[should_panic]\`.

\`\`\`rust
#[test]
#[should_panic(expected = "Divide by zero")]
fn test_crash() {
    divide(10, 0); // If this DOESN'T panic, the test FAILS!
}
\`\`\`

## ⚠️ Common Mistakes

1.  **Forgetting \`#[test]\`**: If you write a check function but forget the attribute, \`cargo test\` will simply ignore it. You'll think your code is perfect because 0 tests failed... but 0 tests ran!
2.  **Logic inside \`main\`**: Beginners often try to test by printing in \`main()\`. This is manual testing. It's slow and error-prone. Move logic to functions and test them automatically.
3.  **Testing Implementation vs Behavior**: Try to test *what* the code does (Output for a given Input), not *how* it does it. If you change the internal algorithm but the result is the same, your tests should still pass.`,
        quiz: [
            {
                question: "Which attribute marks a function as a test?",
                options: ["#[test]", "#[check]", "#[verify]", "test:"],
                correctIndex: 0,
            },
            {
                question: "What macro checks for equality?",
                options: ["assert!", "assert_eq!", "verify_equals!", "check_eq!"],
                correctIndex: 1,
            },
            {
                question: "Where do unit tests usually live?",
                options: [
                    "In a separate tests/ folder",
                    "In the same file as the code, inside a `tests` module",
                    "In the Cargo.toml file",
                    "In documentation comments only",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

We're going to write a simple calculator function and verify it.

1.  Write a function \`add(a: i32, b: i32) -> i32\`.
2.  Write a **test module** \`tests\`.
3.  Inside logic, write two tests:
    *   \`test_add_positive\`: Verify \`add(2, 2)\` is \`4\`.
    *   \`test_add_negative\`: Verify \`add(-1, -1)\` is \`-2\`.

(The playground handles the \`mod tests\` wrapper for the runner, but write it out to practice!)`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_positive() {
        assert_eq!(add(2, 2), 4);
    }

    #[test]
    fn test_negative() {
        assert_eq!(add(-1, -1), -2);
    }
}`,
        starter_code: `// Write: fn add(a: i32, b: i32) -> i32

#[cfg(test)]
mod tests {
    use super::*;

    // Write: #[test] fn test_add_positive()
    // Write: #[test] fn test_add_negative()
}

fn main() {}
`,
    },
    {
        id: "ch11-02",
        chapter: "11.2",
        title: "Controlling How Tests Are Run",
        sort_order: 111,
        environment: "desktop",
        content: `# Controlling How Tests Are Run

Just as \`cargo run\` compiles and then runs your binary, \`cargo test\` compiles your code in test mode and runs the resulting binary.

## Parallelism

By default, Rust runs tests in **parallel** using threads. This makes testing fast! However, it can cause issues if your tests share state (like writing to the same file or database row).

If tests behave weirdly randomly, try running them one by one:
\`cargo test -- --test-threads=1\`

## Output Capture

By default, if a test passes, Rust **captures** (hides) anything printed to stdout. It keeps your console clean. You only see output if a test fails.

To see output even for passing tests:
\`cargo test -- --show-output\`

## Running Specific Tests

You don't always have to run the whole suite. You can pass a name to filter:

*   \`cargo test add\` (Runs any test containing "add" in its name)
*   \`cargo test test_name\` (Runs that specific test)

## ⚠️ Common Mistakes

1.  **Shared State in Parallel Tests**: If Test A writes "Hello" to \`test.txt\` and Test B writes "World" to \`test.txt\` at the same time, one of them will fail unpredictably. *Solution*: Use unique filenames, mock databases, or run with \`--test-threads=1\`.
2.  **Confusing CLI Args**: Arguments for *Cargo* come before \`--\`. Arguments for the *test binary* come after \`--\`.
    *   \`cargo test --lib\` (Tell Cargo to test the library)
    *   \`cargo test -- --nocapture\` (Tell the test binary to show output)`,
        quiz: [
            {
                question: "How do you run tests one at a time (no parallelism)?",
                options: [
                    "cargo test --single",
                    "cargo test -- --test-threads=1",
                    "cargo test --sequential",
                    "cargo test --no-parallel",
                ],
                correctIndex: 1,
            },
            {
                question: "Do passing tests show their println! output by default?",
                options: ["Yes", "No", "Only if there are warnings", "Only in debug mode"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission
 
1. Create a passing test function named \`test_print_success\`.
2. Inside, use \`println!("I am visible!");\`.
3. Use \`assert!(true)\` to make it pass.
4. Run it locally with \`cargo test -- --show-output\` to verify you see the message.`,
        test_code: `#[cfg(test)]
mod tests {
    #[test]
    fn test_print_success() {
        println!("I am visible!");
        assert!(true);
    }
}
`,
        starter_code: `#[cfg(test)]
mod tests {
    #[test]
    fn test_print_success() {
        // Print and assert
    }
}

fn main() {}
`,
    },
    {
        id: "ch11-03",
        chapter: "11.3",
        title: "Test Organization",
        sort_order: 112,
        environment: "desktop",
        content: `# Test Organization

The Rust community implies a strict discipline on how tests are organized. We think in two main categories: **Unit Tests** and **Integration Tests**.

## Unit Tests: The Microscope

*   **Goal**: Test one small piece of logic in isolation.
*   **Location**: Same file as the code.
*   **Privileges**: Can access **private** helper functions.

\`\`\`rust
fn internal_helper() -> i32 { 5 } // Private!

#[cfg(test)]
mod tests {
    use super::*; // Bring parent scope items into test scope

    #[test]
    fn test_internal() {
        assert_eq!(internal_helper(), 5); // Works!
    }
}
\`\`\`

## Integration Tests: The Black Box

*   **Goal**: Test how your library works when used by others.
*   **Location**: A special folder named \`tests/\` at the root of your project (next to \`src/\`).
*   **Privileges**: EXACTLY the same as any other user. Can ONLY access **public** (\`pub\`) functions.

This ensures you have exposed the correct public API. If it works in a unit test but fails in an integration test, you probably forgot to make something \`pub\`.

## ⚠️ Common Mistakes

1.  **Testing Private Code in Integration Tests**: You cannot call private functions from the \`tests/\` directory. If you need to test deep internals, use a Unit Test.
2.  ** forgetting \`use super::*;\`**: In a unit test module, you are inside a *child module* (like a folder). You need \`use super::*;\` to "see" the functions defined in the parent file.`,
        quiz: [
            {
                question: "Where do integration tests live?",
                options: [
                    "Inside src/lib.rs",
                    "In a top-level /tests folder",
                    "Inside each module",
                    "In /src/tests",
                ],
                correctIndex: 1,
            },
            {
                question: "Can unit tests access private functions?",
                options: ["Yes", "No", "Only if marked #[pub_test]", "Only in binary crates"],
                correctIndex: 0,
            },
        ],
        objectives: `## Your Mission

1. Define a **private** function _BT_internal_math(n: i32) -> i32_BT_ that returns _BT_n * n_BT_.
2. Write a unit test module _BT_tests_BT_.
3. Verify you can call this private function from the unit test.

(If you tried to do this from _BT_tests/integration.rs_BT_, it would fail!)`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_internal() {
        assert_eq!(internal_math(5), 25);
    }
}`,
        starter_code: `// Write: fn internal_math(n: i32) -> i32

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_internal() {
        // Call internal_math here
    }
}

fn main() {}
`,
    },
];
