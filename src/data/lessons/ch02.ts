import { Lesson } from "../types";

export const ch02Lessons: Lesson[] = [
    {
        id: "ch02-01",
        chapter: "2.1",
        title: "Guessing Game",
        sort_order: 5,
        content: `# Guessing Game

Let's build a classic "Guessing Game"!

## Ordering

Rust has a standard enum _BT_std::cmp::Ordering_BT_ with three variants:
- _BT_Ordering::Less_BT_
- _BT_Ordering::Greater_BT_
- _BT_Ordering::Equal_BT_

## Comparing Values

You can compare two values using the _BT_cmp_BT_ method:

_BT__BT__BT_rust
use std::cmp::Ordering;

match guess.cmp(&secret_number) {
    Ordering::Less => println!("Too small!"),
    Ordering::Greater => println!("Too big!"),
    Ordering::Equal => println!("You win!"),
}
_BT__BT__BT_

## Parsing Input

Converting a string to a number is common:

_BT__BT__BT_rust
// "42".parse() returns a Result
let guess: u32 = "42".parse().unwrap_or(0);
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What does the _BT_cmp_BT_ method return?".replace(/_BT_/g, '`'),
                options: ["bool", "i32", "std::cmp::Ordering", "String"],
                correctIndex: 2,
            },
            {
                question: "What are the variants of _BT_Ordering_BT_?".replace(/_BT_/g, '`'),
                options: [
                    "Small, Big, Equal",
                    "Less, Greater, Equal",
                    "Min, Max, Equal",
                    "Before, After, Same",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission
        
Implement the core logic of the game:

1. _BT_check_guess(guess: u32, secret: u32) -> std::cmp::Ordering_BT_ — Compare the guess to the secret.
2. _BT_parse_input(input: &str) -> u32_BT_ — Parse string to u32. Return 0 if parsing fails (use _BT_unwrap_or(0)_BT_).`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use std::cmp::Ordering;

    #[test]
    fn test_check_guess_less() {
        assert_eq!(check_guess(10, 20), Ordering::Less);
    }

    #[test]
    fn test_check_guess_greater() {
        assert_eq!(check_guess(30, 20), Ordering::Greater);
    }

    #[test]
    fn test_check_guess_equal() {
        assert_eq!(check_guess(20, 20), Ordering::Equal);
    }

    #[test]
    fn test_parse_input_valid() {
        assert_eq!(parse_input("42"), 42);
    }

    #[test]
    fn test_parse_input_invalid() {
        assert_eq!(parse_input("hello"), 0);
    }
}`,
        starter_code: `use std::cmp::Ordering;

// Write: check_guess(guess: u32, secret: u32) -> Ordering
// Write: parse_input(input: &str) -> u32 (return 0 on error)

fn main() {
    let secret = 42;
    let guess_str = "50";
    let guess = parse_input(guess_str);
    
    match check_guess(guess, secret) {
        Ordering::Less => println!("Too small!"),
        Ordering::Greater => println!("Too big!"),
        Ordering::Equal => println!("You win!"),
    }
}
`,
    },
];
