import { Lesson } from "../../types";

export const ch11Lessons: Lesson[] = [
    {
        id: "ch11-01",
        chapter: "11.1",
        title: "How to Write Tests",
        sort_order: 110,
        environment: "browser",
        content: `# How to Write Tests

Tests are Rust functions that verify that the non-test code is functioning in the expected manner. 

## The Anatomy of a Test Function

A test function is a function that’s annotated with the _BT_#[test]_BT_ attribute. 

_BT__BT__BT_rust
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
_BT__BT__BT_

## Macros for Testing
- _BT_assert!(condition)_BT_: Panics if condition is false.
- _BT_assert_eq!(a, b)_BT_: Panics if _BT_a != b_BT_.
- _BT_assert_ne!(a, b)_BT_: Panics if _BT_a == b_BT_.

## Checking for Panics
Use the _BT_#[should_panic]_BT_ attribute to verify that code panics when it should!`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Which attribute identifies a function as a test?",
                options: ["#[cfg(test)]", "#[test]", "#[check]", "#[verify]"],
                correctIndex: 1,
            },
            {
                question: "Which macro would you use to verify that two values are NOT equal?",
                options: ["assert!", "assert_eq!", "assert_ne!", "panic!"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1. Write a function _BT_add_three(n: i32) -> i32_BT_.
2. Write a test function _BT_test_add_three_BT_ that uses _BT_assert_eq!_BT_ to verify the function works correctly.`.replace(/_BT_/g, '`'),
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
