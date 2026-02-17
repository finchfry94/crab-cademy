import { Lesson } from "../../types";

export const ch06Lessons: Lesson[] = [
    {
        id: "ch06-01",
        chapter: "6.1",
        title: "Defining Enums",
        sort_order: 40,
        environment: "browser",
        content: `# Defining Enums

Enums (enumerations) allow you to define a type by enumerating its possible variants.

## Basic Enums

_BT__BT__BT_rust
enum IpAddrKind {
    V4,
    V6,
}

let four = IpAddrKind::V4;
_BT__BT__BT_

## Enums with Data

Rust enums are powerful because variants can store data:

_BT__BT__BT_rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
_BT__BT__BT_

## The Option Enum

Rust doesn't have _BT_null_BT_. Instead, it has the _BT_Option<T>_BT_ enum, which encodes the scenario of either something being present or nothing:

_BT__BT__BT_rust
enum Option<T> {
    None,
    Some(T),
}
_BT__BT__BT_

This forces you to handle the case where a value might be missing.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Can Rust enum variants hold different types of data?",
                options: [
                    "No, only integers",
                    "Yes, but they must all be the same type",
                    "Yes, each variant can hold different types and amounts of data",
                    "No, enums cannot hold data",
                ],
                correctIndex: 2,
            },
            {
                question: "What is Rust's replacement for _BT_null_BT_?".replace(/_BT_/g, '`'),
                options: ["nil", "undefined", "Option<T>", "void"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1.  Define a _BT_Shape_BT_ enum with variants:
    - _BT_Circle(f64)_BT_: holds a radius
    - _BT_Rectangle(f64, f64)_BT_: holds width and height
2.  Write a function _BT_create_circle(radius: f64) -> Shape_BT_.

**Requirements:**
- Define the _BT_Shape_BT_ enum correctly.
- _BT_create_circle_BT_ must return the _BT_Shape::Circle_BT_ variant.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_circle() {
        let c = create_circle(5.0);
        if let Shape::Circle(r) = c {
            assert_eq!(r, 5.0);
        } else {
            panic!("Expected Shape::Circle");
        }
    }
}`,
        starter_code: `// Define enum Shape { Circle(f64), Rectangle(f64, f64) }

// Write: create_circle(radius: f64) -> Shape

fn main() {
    let circle = create_circle(10.0);
    // We'll learn how to use this in the next lesson!
    println!("Created a circle!");
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

Constructs like _BT_match_BT_ are extremely powerful in Rust. _BT_match_BT_ allows you to compare a value against a series of patterns and then execute code based on which pattern matches.

## Basic Match

_BT__BT__BT_rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
_BT__BT__BT_

## Exhaustiveness

Matches in Rust are **exhaustive**: you must handle every possible case. If you forget one, the compiler will yell at you!

## The _BT___BT_ Placeholder

If you want to handle some cases and ignore the rest, use _BT___BT_:

_BT__BT__BT_rust
let some_u8_value = 0u8;
match some_u8_value {
    1 => println!("one"),
    3 => println!("three"),
    _ => (), // do nothing
}
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What happens if a match expression does not cover all possible cases?",
                options: [
                    "Runtime error",
                    "Compiler error",
                    "It defaults to the first branch",
                    "It returns ()",
                ],
                correctIndex: 1,
            },
            {
                question: "What pattern matches any value?",
                options: ["*", "default", "_", "any"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1.  Write a function _BT_plus_one(x: Option<i32>) -> Option<i32>_BT_.
2.  If _BT_x_BT_ is _BT_None_BT_, return _BT_None_BT_.
3.  If _BT_x_BT_ is _BT_Some(i)_BT_, return _BT_Some(i + 1)_BT_.

**Requirements:**
- Use a _BT_match_BT_ expression to handle both variants of _BT_Option_BT_.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_plus_one_some() {
        assert_eq!(plus_one(Some(5)), Some(6));
    }

    #[test]
    fn test_plus_one_none() {
        assert_eq!(plus_one(None), None);
    }
}`,
        starter_code: `// Write: plus_one(x: Option<i32>) -> Option<i32>

fn main() {
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);
    
    println!("5 + 1 = {:?}", six);
    println!("None + 1 = {:?}", none);
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

The _BT_if let_BT_ syntax lets you combine _BT_if_BT_ and _BT_let_BT_ into a less verbose way to handle values that match one pattern while ignoring the rest.

## Motivation

Consider this match:

_BT__BT__BT_rust
let config_max = Some(3u8);
match config_max {
    Some(max) => println!("The maximum is configured to be {}", max),
    _ => (),
}
_BT__BT__BT_

We can write this more concisely with _BT_if let_BT_:

_BT__BT__BT_rust
let config_max = Some(3u8);
if let Some(max) = config_max {
    println!("The maximum is configured to be {}", max);
}
_BT__BT__BT_

## Using else

You can include an _BT_else_BT_ block with _BT_if let_BT_:

_BT__BT__BT_rust
if let Some(max) = config_max {
    println!("The max is {max}");
} else {
    println!("No max configured");
}
_BT__BT__BT_

Think of _BT_if let_BT_ as syntax sugar for a _BT_match_BT_ that runs code when the value matches one pattern and then ignores all other values.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "When is _BT_if let_BT_ most useful?".replace(/_BT_/g, '`'),
                options: [
                    "When you want to handle all possible cases",
                    "When you want to check for errors",
                    "When you match one pattern and ignore the rest",
                    "When defining variables",
                ],
                correctIndex: 2,
            },
            {
                question: "Does _BT_if let_BT_ check for exhaustiveness?".replace(/_BT_/g, '`'),
                options: ["Yes", "No"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1.  Write a function _BT_value_or_default(opt: Option<i32>, default: i32) -> i32_BT_.
2.  Use _BT_if let_BT_ to check if _BT_opt_BT_ is _BT_Some(v)_BT_. If so, return _BT_v_BT_.
3.  Otherwise, return _BT_default_BT_.

(Note: In real Rust you'd use _BT_unwrap_or_BT_, but practice _BT_if let_BT_ here!)

**Requirements:**
- You must use _BT_if let_BT_ syntax.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_value_or_default_some() {
        assert_eq!(value_or_default(Some(10), 0), 10);
    }

    #[test]
    fn test_value_or_default_none() {
        assert_eq!(value_or_default(None, 0), 0);
    }
}`,
        starter_code: `// Write: value_or_default(opt: Option<i32>, default: i32) -> i32
// Use 'if let' syntax!

fn main() {
    let some = Some(42);
    let none = None;
    
    println!("Some: {}", value_or_default(some, 0));
    println!("None: {}", value_or_default(none, 0));
}
`,
    },
];
