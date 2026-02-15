import { Lesson } from "../types";

export const ch01Lessons: Lesson[] = [
    {
        id: "ch01-01",
        chapter: "1.1",
        title: "Hello, World!",
        sort_order: 1,
        content: `# Hello, World!

Welcome to Rust! In this first lesson, you'll write the classic "Hello, World!" program.

## Your First Program

Every Rust program starts with a _BT_main_BT_ function. The _BT_main_BT_ function is special: it's always the first code that runs.

_BT__BT__BT_rust
fn main() {
    println!("Hello, world!");
}
_BT__BT__BT_

### Breaking it down:
- _BT_fn_BT_ declares a new function
- _BT_main_BT_ is the function name (required entry point)
- _BT_println!_BT_ is a **macro** that prints text to the console
- The _BT_!_BT_ means it's a macro, not a regular function
- Rust statements end with a **semicolon** _BT_;_BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What does the _BT_!_BT_ in _BT_println!_BT_ indicate?".replace(/_BT_/g, '`'),
                options: [
                    "It's an error handler",
                    "It's a macro, not a regular function",
                    "It makes the function run faster",
                    "It's a comment marker",
                ],
                correctIndex: 1,
            },
            {
                question: "What is the required entry point function in a Rust program?",
                options: ["start()", "run()", "main()", "init()"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Write a function called _BT_greet_BT_ that takes a name as a _BT_&str_BT_ and returns a greeting string.

For example, _BT_greet("Rustacean")_BT_ should return _BT_"Hello, Rustacean!"_BT_.

### Requirements:
1. Define a function _BT_greet(name: &str) -> String_BT_
2. Return _BT_"Hello, {name}!"_BT_ using _BT_format!_BT_
3. The _BT_main_BT_ function should call _BT_greet_BT_ and print the result`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greet_world() {
        assert_eq!(greet("World"), "Hello, World!");
    }

    #[test]
    fn test_greet_rustacean() {
        assert_eq!(greet("Rustacean"), "Hello, Rustacean!");
    }

    #[test]
    fn test_greet_empty() {
        assert_eq!(greet(""), "Hello, !");
    }
}`,
        starter_code: `// Define a function greet(name: &str) -> String
// that returns "Hello, {name}!"

fn main() {
    let message = greet("World");
    println!("{message}");
}
`,
    },
];
