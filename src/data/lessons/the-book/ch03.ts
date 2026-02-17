import { Lesson } from "../../types";

export const ch02Lessons: Lesson[] = [
    {
        id: "ch02-01",
        chapter: "2.1",
        title: "Programming a Guessing Game",
        sort_order: 10,
        environment: "browser",
        content: `# Programming a Guessing Game

Let's learn Rust by building a project together! In this lesson, we'll explore several important Rust concepts through the lens of a guessing game.

## Why Start with a Game?

Games are great learning tools because they combine **input, logic, and output** — the three pillars of any program. Our guessing game touches on:
- Variables and types
- User interaction (input/output)
- Comparison logic
- Enums

## Key Concepts

### The _BT_match_BT_ Expression

One of Rust's most powerful features. It compares a value against a set of **patterns** and runs code based on which pattern matches:

_BT__BT__BT_rust
use std::cmp::Ordering;

match guess.cmp(&secret_number) {
    Ordering::Less    => println!("Too small!"),
    Ordering::Greater => println!("Too big!"),
    Ordering::Equal   => println!("You win!"),
}
_BT__BT__BT_

Unlike _BT_if/else if_BT_ chains, _BT_match_BT_ is **exhaustive** — the compiler ensures you handle every possible case. This prevents bugs where you forget an edge case.

### The _BT_Ordering_BT_ Enum

_BT_std::cmp::Ordering_BT_ is an **enum** (enumeration) with exactly three variants:
- _BT_Ordering::Less_BT_ — the first value is smaller
- _BT_Ordering::Greater_BT_ — the first value is larger
- _BT_Ordering::Equal_BT_ — both values are the same

### Parsing Strings to Numbers

User input always comes as text. To do math with it, you need to **parse** it into a number:

_BT__BT__BT_rust
let guess: u32 = "42".parse().expect("Not a number!");
_BT__BT__BT_

The _BT_:u32_BT_ tells Rust what type to parse into. Without it, Rust doesn't know if you want an integer, float, or something else.

### The _BT_.cmp()_BT_ Method

Any type that implements the _BT_Ord_BT_ trait (most numeric types, strings, etc.) has a _BT_.cmp()_BT_ method:

_BT__BT__BT_rust
let a = 5;
let b = 10;
let result = a.cmp(&b); // Returns Ordering::Less
_BT__BT__BT_

Note the _BT_&_BT_ — we're passing a **reference** to _BT_b_BT_ (borrowing, not moving). We'll cover this in depth in Chapter 4.

## 🌍 Real-World Usage

Pattern matching isn't just for games. In production Rust code, _BT_match_BT_ is used everywhere:
- Parsing HTTP status codes
- Handling different API response types
- State machines in network protocols
- Error handling with _BT_Result_BT_ and _BT_Option_BT_

## ⚠️ Common Mistakes

1. **Comparing different types** — You can't _BT_.cmp()_BT_ a _BT_u32_BT_ with an _BT_i32_BT_. Both sides must be the same type.
2. **Forgetting _BT_use std::cmp::Ordering_BT_** — The _BT_Ordering_BT_ enum isn't in scope by default. You need to import it.
3. **Non-exhaustive match** — If you write a match but don't cover all variants, the compiler will reject your code.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What type does _BT_.cmp()_BT_ return?".replace(/_BT_/g, '`'),
                options: [
                    "bool",
                    "i32",
                    "std::cmp::Ordering",
                    "String",
                ],
                correctIndex: 2,
            },
            {
                question: "What are the three variants of _BT_Ordering_BT_?".replace(/_BT_/g, '`'),
                options: [
                    "Up, Down, Same",
                    "Less, Greater, Equal",
                    "Min, Max, Eq",
                    "Smaller, Bigger, Even",
                ],
                correctIndex: 1,
            },
            {
                question: "What happens if a _BT_match_BT_ expression doesn't cover all possible cases?".replace(/_BT_/g, '`'),
                options: [
                    "It compiles but panics at runtime",
                    "It returns a default value",
                    "The compiler rejects the code",
                    "It silently does nothing",
                ],
                correctIndex: 2,
            },
            {
                question: 'What does _BT_"42".parse::<u32>()_BT_ do?'.replace(/_BT_/g, '`'),
                options: [
                    "Checks if the string contains the number 42",
                    'Converts the string "42" into the unsigned integer 42',
                    "Splits the string into characters",
                    "Counts the characters in the string",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write two functions that use comparison logic:

1. _BT_compare_numbers(a: i32, b: i32) -> String_BT_ — Uses _BT_.cmp()_BT_ and _BT_match_BT_ to return one of:
   - _BT_"Less"_BT_ if a < b
   - _BT_"Greater"_BT_ if a > b
   - _BT_"Equal"_BT_ if a == b

2. _BT_clamp(value: i32, min: i32, max: i32) -> i32_BT_ — Returns:
   - _BT_min_BT_ if value < min
   - _BT_max_BT_ if value > max
   - _BT_value_BT_ otherwise

### Requirements:
- Use _BT_std::cmp::Ordering_BT_ and _BT_match_BT_ in _BT_compare_numbers_BT_
- _BT_clamp_BT_ can use _BT_if/else_BT_ or _BT_match_BT_ — your choice!`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_compare_less() {
        assert_eq!(compare_numbers(1, 5), "Less");
    }

    #[test]
    fn test_compare_greater() {
        assert_eq!(compare_numbers(10, 3), "Greater");
    }

    #[test]
    fn test_compare_equal() {
        assert_eq!(compare_numbers(7, 7), "Equal");
    }

    #[test]
    fn test_compare_negative() {
        assert_eq!(compare_numbers(-5, -3), "Less");
    }

    #[test]
    fn test_clamp_below_min() {
        assert_eq!(clamp(-10, 0, 100), 0);
    }

    #[test]
    fn test_clamp_above_max() {
        assert_eq!(clamp(200, 0, 100), 100);
    }

    #[test]
    fn test_clamp_in_range() {
        assert_eq!(clamp(50, 0, 100), 50);
    }

    #[test]
    fn test_clamp_at_boundary() {
        assert_eq!(clamp(0, 0, 100), 0);
        assert_eq!(clamp(100, 0, 100), 100);
    }
}`,
        starter_code: `use std::cmp::Ordering;

// Write: compare_numbers(a: i32, b: i32) -> String
//   Use a.cmp(&b) and match!

// Write: clamp(value: i32, min: i32, max: i32) -> i32

fn main() {
    println!("{}", compare_numbers(5, 10));
    println!("{}", compare_numbers(10, 5));
    println!("{}", compare_numbers(5, 5));
    println!("Clamped: {}", clamp(150, 0, 100));
}
`,
    },
];
