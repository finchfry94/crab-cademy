import { Lesson } from "../../types";

export const ch03Lessons: Lesson[] = [
    {
        id: "ch03-01",
        chapter: "3.1",
        title: "Programming a Guessing Game",
        sort_order: 30,
        environment: "browser",
        content: `# Programming a Guessing Game

Now that you've mastered variables, functions, and control flow, let's put it all together! We're going to build a "Guessing Game" logic module.

## The Goal

We want to create a reusable module that can:
1.  **Validate** user input (ensure it's within a specific range).
2.  **Check** a guess against a secret number.
3.  **Simulate** a game loop to see how many tries it takes to find a number.

## Key Concepts Refresher

### _BT_match_BT_ with _BT_Ordering_BT_

Remember _BT_match_BT_? It's perfect for comparing numbers. _BT_std::cmp::Ordering_BT_ is an enum with three variants: _BT_Less_BT_, _BT_Greater_BT_, and _BT_Equal_BT_.

_BT__BT__BT_rust
use std::cmp::Ordering;

fn check(guess: i32, secret: i32) -> Ordering {
    guess.cmp(&secret)
}
_BT__BT__BT_

### Loops and Counters

You can use a _BT_loop_BT_ or _BT_while_BT_ to simulate a game.

_BT__BT__BT_rust
let mut attempts = 0;
loop {
    attempts += 1;
    if guess == secret {
        break;
    }
}
_BT__BT__BT_

## Handling Invalid Input

In a real game, users might input garbage. We need to **validate** that their guess is 1-100 before we even check it against the secret.

## ⚠️ Common Mistakes

1.  **Off-by-one errors** — Ensure your validation includes 1 and 100!
2.  **Infinite loops** — If you're simulating a game, make sure your loop has a break condition that will actually be met.
3.  **Ignoring return values** — _BT_cmp_BT_ returns an _BT_Ordering_BT_, ensure you handle it or return it correctly.`.replace(/_BT_/g, '\`'),
        quiz: [
            {
                question: "What is the best type to represent the result of a comparison?",
                options: ["i32 (-1, 0, 1)", "bool", "std::cmp::Ordering", "String"],
                correctIndex: 2,
            },
            {
                question: "Which loop is best for a game that runs until the user wins?",
                options: ["for loop", "loop (infinite with break)", "recursion", "iterator"],
                correctIndex: 1,
            },
            {
                question: "If we want to count attempts, where should we declare the counter variable?",
                options: [
                    "Inside the loop",
                    "Outside the loop (mutable)",
                    "Outside the loop (immutable)",
                    "In a separate function",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Implement the core logic for our guessing game engine:

1.  _BT_validate(guess: i32) -> bool_BT_
    *   Return _BT_true_BT_ if the guess is between 1 and 100 (inclusive).
    *   Return _BT_false_BT_ otherwise.

2.  _BT_check_guess(guess: i32, secret: i32) -> i32_BT_
    *   Return **0** if they are equal.
    *   Return **-1** if guess is less than secret.
    *   Return **1** if guess is greater than secret.
    *   *(Note: Usually we'd return Ordering, but let's use i32 for this specific challenge to practice simple if/else or match mappings)*.

3.  _BT_count_attempts(guesses: &[i32], secret: i32) -> i32_BT_
    *   Iterate through the _BT_guesses_BT_ array.
    *   Count every guess.
    *   If a guess equals _BT_secret_BT_, return the count immediately (don't process further guesses).
    *   If you go through all guesses and don't find the secret, return **-1**.`.replace(/_BT_/g, '\`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_in_range() {
        assert!(validate(1));
        assert!(validate(50));
        assert!(validate(100));
    }

    #[test]
    fn test_validate_out_of_range() {
        assert!(!validate(0));
        assert!(!validate(101));
        assert!(!validate(-10));
    }

    #[test]
    fn test_check_guess() {
        assert_eq!(check_guess(50, 50), 0);
        assert_eq!(check_guess(10, 50), -1);
        assert_eq!(check_guess(90, 50), 1);
    }

    #[test]
    fn test_count_attempts_win() {
        let inputs = [10, 20, 30, 40, 50];
        // Secret is 30. Should take 3 attempts (10, 20, 30).
        assert_eq!(count_attempts(&inputs, 30), 3);
    }

    #[test]
    fn test_count_attempts_win_first() {
        let inputs = [50];
        assert_eq!(count_attempts(&inputs, 50), 1);
    }

    #[test]
    fn test_count_attempts_fail() {
        let inputs = [1, 2, 3];
        // Secret is 100. Inputs don't have it. Return -1.
        assert_eq!(count_attempts(&inputs, 100), -1);
    }
}`,
        starter_code: `// Write: validate(guess: i32) -> bool
// Write: check_guess(guess: i32, secret: i32) -> i32
// Write: count_attempts(guesses: &[i32], secret: i32) -> i32

fn main() {
    println!("Is 50 valid? {}", validate(50));
    println!("Check 10 vs 50: {}", check_guess(10, 50));
    
    let game = [10, 40, 70, 42, 90];
    println!("Attempts to find 42: {}", count_attempts(&game, 42));
}
`,
    },
];
