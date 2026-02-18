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

In many university courses, you write code, submit it, get a grade, and never touch it again. In the real world, code lives for years. It gets modified, refactored, and extended.

How do you ensure that your changes today didn't break the feature you wrote last year? **Automated Tests.**

## The Anatomy of a Rust Test

A test in Rust is just a function annotated with the \`#[test]\` attribute. Using \`cargo test\`, Rust builds a test runner binary that executes these annotated functions.

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

## Assertions

Tests typically use macros to check conditions:

*   **\`assert!(condition)\`**: Panics if the condition is false.
*   **\`assert_eq!(left, right)\`**: Panics if \`left != right\`. (Prints both values on failure).
*   **\`assert_ne!(left, right)\`**: Panics if \`left == right\`.

## Testing Panics

Sometimes, you *expect* code to fail (e.g., validating bad input). You can use \`#[should_panic]\` to verify this behavior:

\`\`\`rust
#[test]
#[should_panic(expected = "Divide by zero")]
fn test_crash() {
    divide(10, 0); // Should panic!
}
\`\`\`

## Unit vs Integration Tests (The Mental Model)

*   **Unit Tests:** Small, focused, fast. They test one function in isolation. They live in the *same file* as the code (usually in a \`mod tests\`). They can test private functions.
*   **Integration Tests:** Broad, realistic, slower. They test how multiple parts of your library work together. They live in a separate \`tests/\` directory. They can only call \`pub\` functions.

## ⚠️ Common Mistakes

1.  **Testing implementation details** — Try to test *behavior* (what it does), not *implementation* (how it does it). If you refactor the code but the behavior stays the same, your tests shouldn't break.
2.  **Ignoring test output** — Use \`cargo test -- --nocapture\` if you want to see \`println!\` output from passing tests.`,
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

We're not writing "production" code today—we're writing the safety net!

1.  Write a function _BT_add(a: i32, b: i32) -> i32_BT_ (the code to be tested).
2.  Write a *test function* named _BT_test_add_BT_.
    *   Annotate it with _BT_#[test]_BT_.
    *   Inside, assert that _BT_add(2, 2)_BT_ equals _BT_4_BT_.

*Note: In this lesson environment, just write the functions. The runner will execute them.*`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_logic() {
        assert_eq!(add_three(10), 13);
        assert_eq!(add_three(-3), 0);
    }
}`,
        starter_code: `// Write: add_three(n: i32) -> i32

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add_three() {
        // Use assert_eq! here
    }
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

Just as _BT_cargo run_BT_ compiles and then runs your binary, _BT_cargo test_BT_ compiles your code in test mode and runs the resulting binary.

## Running Tests in Parallel or Consecutively
By default, Rust runs tests in parallel using threads. You can control this with:
_BT_cargo test -- --test-threads=1_BT_

## Showing Function Output
By default, if a test passes, Rust captures anything printed to stdout. To see output even for passing tests:
_BT_cargo test -- --show-output_BT_

## Running a Subset of Tests by Name
_BT_cargo test test_name_BT_`.replace(/_BT_/g, '`'),
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

This is a conceptual lesson for desktop users. 

1. Create a passing test that prints something.
2. Run it locally with _BT_cargo test -- --show-output_BT_ to verify you can see the print message.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    #[test]
    fn test_print() {
        println!("I am visible with --show-output");
        assert!(true);
    }
}`,
        starter_code: `#[cfg(test)]
mod tests {
    #[test]
    fn test_print() {
        // Print something and assert true
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

Rust community thinks about tests in two main categories: **unit tests** and **integration tests**.

## Unit Tests
- Small and more focused
- Test one module in isolation
- Can test private interfaces
- Live in the same files as the code, in a _BT_tests_BT_ module with _BT_#[cfg(test)]_BT_

## Integration Tests
- Entirely external to your library
- Use your library in the same way any other client code would
- Can only test public interfaces
- Live in a top-level _BT_tests_BT_ directory`.replace(/_BT_/g, '`'),
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

1. Define a private function _BT_internal_compute(n: i32) -> i32_BT_.
2. Write a unit test inside a _BT_tests_BT_ module that calls this private function.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_internal() {
        assert_eq!(internal_compute(5), 10);
    }
}`,
        starter_code: `fn internal_compute(n: i32) -> i32 {
    n * 2
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_internal() {
        // Call internal_compute here
    }
}

fn main() {}
`,
    },
];
