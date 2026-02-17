import { Lesson } from "../../types";

export const ch06Lessons: Lesson[] = [
    {
        id: "ch06-01",
        chapter: "6.1",
        title: "Defining Enums",
        sort_order: 40,
        environment: "browser",
        content: `# Defining Enums

Enums (enumerations) allow you to define a type by enumerating its possible **variants**. But unlike enums in C or Java which are often just fancy integers, Rust enums are **Algebraic Data Types** — they can hold data!

## Basic Enums

_BT__BT__BT_rust
enum IpAddrKind {
    V4,
    V6,
}
_BT__BT__BT_

## Enums with Data

This is where Rust shines. Each variant can hold different types and amounts of data:

_BT__BT__BT_rust
enum Message {
    Quit,                       // No data
    Move { x: i32, y: i32 },    // Named fields (like a struct)
    Write(String),              // Single String
    ChangeColor(i32, i32, i32), // Tuple of 3 integers
}
_BT__BT__BT_

## The _BT_Option_BT_ Enum

Rust does NOT have **null**. "Null" has led to billions of dollars in bugs (the "Null Pointer Exception").

Instead, Rust has the _BT_Option<T>_BT_ enum, which forces you to handle the case where a value might be missing:

_BT__BT__BT_rust
enum Option<T> {
    None,    // Example of "nothing"
    Some(T), // Example of "something"
}
_BT__BT__BT_

If you have an _BT_Option<i32>_BT_, you have to check if it's _BT_Some_BT_ or _BT_None_BT_ before doing math. You can't accidentally treat _BT_None_BT_ as 0.

## ⚠️ Common Mistakes

1. **Comparing _BT_Option<T>_BT_ with _BT_T_BT_** — You can't add an _BT_Option<i32>_BT_ to an _BT_i32_BT_. You must unwrap or match it first.
2. **Assuming Enums are just Integers** — They are distinct types. You can't cast them to numbers unless you implement that logic.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What makes Rust enums different from C/C++ enums?",
                options: [
                    "They are always stored on the heap",
                    "Variants can hold data of different types",
                    "They can only have 256 variants",
                    "They are immutable",
                ],
                correctIndex: 1,
            },
            {
                question: "Why does Rust use _BT_Option<T>_BT_ instead of null?".replace(/_BT_/g, '`'),
                options: [
                    "To save memory",
                    "To force you to explicitly handle the 'missing value' case",
                    "To make code look functional",
                    "Because null is a reserved keyword",
                ],
                correctIndex: 1,
            },
            {
                question: "Can you directly add an _BT_Option<i32>_BT_ and an _BT_i32_BT_?".replace(/_BT_/g, '`'),
                options: [
                    "Yes, None is treated as 0",
                    "Yes, if you use the + operator",
                    "No, they are different types",
                    "Yes, but it might panic",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1. Define a _BT_WebEvent_BT_ enum with these variants:
   - _BT_PageLoad_BT_ (no data)
   - _BT_KeyPress(char)_BT_
   - _BT_Click { x: i64, y: i64 }_BT_
2. Write a function _BT_create_keypress(c: char) -> WebEvent_BT_ that returns a _BT_KeyPress_BT_ variant.
3. Write a function _BT_create_click(x: i64, y: i64) -> WebEvent_BT_ that returns a _BT_Click_BT_ variant.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_keypress() {
        let event = create_keypress('a');
        match event {
            WebEvent::KeyPress(c) => assert_eq!(c, 'a'),
            _ => panic!("Expected KeyPress"),
        }
    }

    #[test]
    fn test_create_click() {
        let event = create_click(10, 20);
        match event {
            WebEvent::Click { x, y } => {
                assert_eq!(x, 10);
                assert_eq!(y, 20);
            },
            _ => panic!("Expected Click"),
        }
    }

    #[test]
    fn test_pageload_exists() {
        let _ = WebEvent::PageLoad;
    }
}`,
        starter_code: `// Define enum WebEvent { ... }

// Write: create_keypress(c: char) -> WebEvent

// Write: create_click(x: i64, y: i64) -> WebEvent

fn main() {
    let click = create_click(100, 200);
    println!("Created a click event!");
    // We'll learn how to inspect it in the next lesson
}
`,
    },
    {
        id: "ch06-02",
        chapter: "6.2",
        title: "The Match Control Flow",
        sort_order: 41,
        environment: "browser",
        content: `# The Match Control Flow

_BT_match_BT_ is Rust's traffic controller. It allows you to compare a value against a series of **patterns** and execute code based on which pattern matches.

## Basic Syntax

_BT__BT__BT_rust
enum Coin {
    Penny,
    Nickel,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
    }
}
_BT__BT__BT_

## Binding to Values

When you match an enum with data, you can bind to that data to use it!

_BT__BT__BT_rust
match msg {
    Message::Move { x, y } => println!("Move to {}, {}", x, y),
    Message::Write(text)   => println!("Text: {}", text),
    _ => (), // Ignore other variants
}
_BT__BT__BT_

## Exhaustiveness

Matches in Rust are **exhaustive**. You MUST handle every possible case. This prevents bugs where you add a new enum variant but forget to handle it in your code. The compiler will catch it!

## The _BT___BT_ Placeholder

If you want to handle one case and ignore the rest, use _BT___BT_ (underscore) as the last arm. It matches anything.

_BT__BT__BT_rust
let u8_value = 0u8;
match u8_value {
    1 => println!("one"),
    3 => println!("three"),
    _ => (),
}
_BT__BT__BT_

## ⚠️ Common Mistakes

1. **Forgetting a variant** — Compiler error: "pattern ... not covered".
2. **Not using variables bound in the match** — If you match _BT_Some(x)_BT_ but don't use _BT_x_BT_, consider _BT_Some(_)_BT_ instead.
3. **Shadowing** — Variables inside the match arm shadow variables outside with the same name.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What happens if you don't handle all variants in a match expression?",
                options: [
                    "The code crashes at runtime",
                    "The compiler gives an error",
                    "It defaults to doing nothing",
                    "It returns the enum itself",
                ],
                correctIndex: 1,
            },
            {
                question: "What does the _BT___BT_ pattern do?".replace(/_BT_/g, '`'),
                options: [
                    "Matches the previous value",
                    "Matches nothing (never runs)",
                    "Matches any value (catch-all)",
                    "Matches only errors",
                ],
                correctIndex: 2,
            },
            {
                question: "How do you extract data from an enum variant in a match?",
                options: [
                    "Using the .data property",
                    "Using pattern matching syntax like Variant(val)",
                    "Using unwrap()",
                    "Using the get() method",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

You are building an event logger. Write a function _BT_inspect_event(event: WebEvent) -> String_BT_ that implementation the _BT_WebEvent_BT_ enum from the previous lesson:

- _BT_PageLoad_BT_ -> Return _BT_"page loaded"_BT_
- _BT_KeyPress(c)_BT_ -> Return _BT_"keypress: {c}"_BT_ (e.g., "keypress: a")
- _BT_Click { x, y }_BT_ -> Return _BT_"clicked: {x}, {y}"_BT_ (e.g., "clicked: 10, 20")

**Note:** You need to redefine the Enum in this lesson as lessons are isolated.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_inspect_pageload() {
        assert_eq!(inspect_event(WebEvent::PageLoad), "page loaded");
    }

    #[test]
    fn test_inspect_keypress() {
        assert_eq!(inspect_event(WebEvent::KeyPress('z')), "keypress: z");
    }

    #[test]
    fn test_inspect_click() {
        assert_eq!(inspect_event(WebEvent::Click { x: 5, y: 10 }), "clicked: 5, 10");
    }
}`,
        starter_code: `enum WebEvent {
    PageLoad,
    KeyPress(char),
    Click { x: i64, y: i64 },
}

// Write: inspect_event(event: WebEvent) -> String
// Use match!

fn main() {
    let load = WebEvent::PageLoad;
    let key = WebEvent::KeyPress('x');
    let click = WebEvent::Click { x: 120, y: 240 };
    
    println!("{}", inspect_event(load));
    println!("{}", inspect_event(key));
    println!("{}", inspect_event(click));
}
`,
    },
    {
        id: "ch06-03",
        chapter: "6.3",
        title: "Concise Control Flow with if let",
        sort_order: 42,
        environment: "browser",
        content: `# Concise Control Flow with if let

_BT_if let_BT_ is a shorthand for a _BT_match_BT_ that only runs code for **one** specific pattern and ignores everything else.

## The Verbose Way (match)

_BT__BT__BT_rust
let config_max = Some(3u8);
match config_max {
    Some(max) => println!("The maximum is configured to be {}", max),
    _ => (), // Boring boilerplate
}
_BT__BT__BT_

## The Concise Way (if let)

_BT__BT__BT_rust
let config_max = Some(3u8);
if let Some(max) = config_max {
    println!("The maximum is configured to be {}", max);
}
_BT__BT__BT_

You can read this as: "If _BT_config_max_BT_ **matches the pattern** _BT_Some(max)_BT_, run this block."

## Using else

You can also include an _BT_else_BT_ block:

_BT__BT__BT_rust
if let Some(max) = config_max {
    // ...
} else {
    println!("No max configured");
}
_BT__BT__BT_

## When to use if let?

Use it when you care about **one** pattern and want to ignore the rest. Use _BT_match_BT_ when you want to handle multiple cases or ensure exhaustiveness (make sure you didn't miss a case).

## ⚠️ Common Mistakes

1. **Using _BT_==_BT_ instead of _BT_=_BT_** — The syntax is _BT_if let Pattern = Value_BT_. It's a pattern match assignment, not a boolean equality check.
2. **Missing usage of _BT_match_BT_** — If you have 3+ branches, _BT_match_BT_ is usually cleaner than a chain of _BT_if let ... else if let ..._BT_.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What is the primary use case for _BT_if let_BT_?".replace(/_BT_/g, '`'),
                options: [
                    "When you want to check if a variable is equal to another",
                    "When you want to handle all possible enum variants",
                    "When you want to match one pattern and ignore the rest",
                    "When defining variables",
                ],
                correctIndex: 2,
            },
            {
                question: "Does _BT_if let_BT_ support an _BT_else_BT_ block?".replace(/_BT_/g, '`'),
                options: ["Yes", "No", "Only for Options", "Only for Results"],
                correctIndex: 0,
            },
            {
                question: "Does _BT_if let_BT_ verify exhaustiveness (that all cases are handled)?".replace(/_BT_/g, '`'),
                options: [
                    "Yes, always",
                    "No, it ignores unmatched patterns by design",
                    "Yes, but only in strict mode",
                    "It depends on the compiler version",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write a function _BT_get_or_default(opt: Option<i32>, default: i32) -> i32_BT_.

- Use **_BT_if let_BT_** to check if _BT_opt_BT_ contains a value.
- If it does, return that value.
- If not (the _BT_else_BT_ case), return _BT_default_BT_.

(This is effectively implementing Rust's built-in _BT_unwrap_or_BT_ method!)`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_or_default_some() {
        assert_eq!(get_or_default(Some(42), 0), 42);
    }

    #[test]
    fn test_get_or_default_none() {
        assert_eq!(get_or_default(None, 0), 0);
    }

    #[test]
    fn test_get_or_default_default_val() {
        assert_eq!(get_or_default(None, 100), 100);
    }
}`,
        starter_code: `// Write: get_or_default(opt: Option<i32>, default: i32) -> i32
// Requirement: Use 'if let' syntax

fn main() {
    let x = Some(10);
    let y = None;
    
    println!("x: {}", get_or_default(x, 5));
    println!("y: {}", get_or_default(y, 5));
}
`,
    },
];
