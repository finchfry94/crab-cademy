import { Lesson } from "../../types";

export const ch01Lessons: Lesson[] = [
    {
        id: "ch01-01",
        chapter: "1.1",
        title: "Hello, World!",
        sort_order: 1,
        environment: "browser",
        content: `# Hello, World!

Welcome to Rust! Every programming journey starts here — the classic "Hello, World!" program. But even this tiny program teaches you several key Rust concepts.

## Why Rust?

Before we write code, let's talk about *why* Rust exists. Most languages make you choose between **speed** and **safety**:
- **C/C++** are blazing fast but notorious for memory bugs (buffer overflows, use-after-free, null pointers).
- **Python/JavaScript** are safe and easy but much slower.

Rust gives you **both**: C-level performance with compile-time memory safety. No garbage collector, no runtime overhead — just a really smart compiler that catches bugs before your code ever runs.

## Your First Program

Every Rust program starts with a _BT_main_BT_ function. This is the **entry point** — the first code that runs when your program starts.

_BT__BT__BT_rust
fn main() {
    println!("Hello, world!");
}
_BT__BT__BT_

### Anatomy of this program:

| Token | Meaning |
|-------|---------|
| _BT_fn_BT_ | Declares a new **function** |
| _BT_main_BT_ | The function's name — must be _BT_main_BT_ for the entry point |
| _BT_()_BT_ | Parameter list (empty here — no inputs) |
| _BT_{ }_BT_ | The function body |
| _BT_println!_BT_ | A **macro** that prints text to the console |
| _BT_"Hello, world!"_BT_ | A **string literal** |
| _BT_;_BT_ | Statement terminator — every statement ends with a semicolon |

## Macros vs Functions

Notice the _BT_!_BT_ in _BT_println!_BT_. That exclamation mark means it's a **macro**, not a regular function. You don't need to understand macros deeply yet, but here's the key difference:
- **Functions** take a fixed number of typed arguments.
- **Macros** can take a variable number of arguments and generate code at compile time.

_BT_println!_BT_ is a macro because it does something a function can't: it accepts a variable number of arguments with format specifiers.

_BT__BT__BT_rust
println!("Name: {}, Age: {}", name, age); // Multiple args of any type!
_BT__BT__BT_

## The _BT_format!_BT_ Macro

While _BT_println!_BT_ prints directly to the console, _BT_format!_BT_ returns the text as a _BT_String_BT_ — perfect for building messages:

_BT__BT__BT_rust
let greeting = format!("Hello, {}!", "Rust");
// greeting is now the String "Hello, Rust!"
_BT__BT__BT_

## ⚠️ Common Mistakes

1. **Forgetting the semicolon** — Rust statements need _BT_;_BT_ at the end. Missing it causes a compiler error.
2. **Using _BT_print_BT_ instead of _BT_println_BT_** — _BT_print!_BT_ works too, but doesn't add a newline at the end.
3. **Missing the _BT_!_BT_** — Writing _BT_println()_BT_ instead of _BT_println!()_BT_ will give you a "function not found" error.`.replace(/_BT_/g, '`'),
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
            {
                question: "What is the difference between _BT_println!_BT_ and _BT_format!_BT_?".replace(/_BT_/g, '`'),
                options: [
                    "println! is faster",
                    "format! returns a String instead of printing to the console",
                    "format! only works with numbers",
                    "They are identical",
                ],
                correctIndex: 1,
            },
            {
                question: "Which of the following would cause a compiler error?",
                options: [
                    'println!("hello");',
                    'println!("hello")',
                    'println!("value: {}", 42);',
                    'println!("line 1\\nline 2");',
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write two functions:

1. _BT_greet(name: &str) -> String_BT_ — Returns a greeting like _BT_"Hello, Rustacean!"_BT_
2. _BT_farewell(name: &str) -> String_BT_ — Returns a farewell like _BT_"Goodbye, Rustacean!"_BT_

### Requirements:
- Use the _BT_format!_BT_ macro to build the strings
- _BT_main_BT_ should call both functions and print the results
- Handle empty names gracefully (return _BT_"Hello, !"_BT_ for an empty string is fine)`.replace(/_BT_/g, '`'),
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

    #[test]
    fn test_farewell_world() {
        assert_eq!(farewell("World"), "Goodbye, World!");
    }

    #[test]
    fn test_farewell_rustacean() {
        assert_eq!(farewell("Rustacean"), "Goodbye, Rustacean!");
    }
}`,
        starter_code: `// Define: greet(name: &str) -> String
// Define: farewell(name: &str) -> String
// Hint: Use the format! macro

fn main() {
    let hello = greet("World");
    let bye = farewell("World");
    println!("{hello}");
    println!("{bye}");
}
`,
    },
];
