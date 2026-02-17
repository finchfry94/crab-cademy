import { Lesson } from "../../types";

export const ch03Lessons: Lesson[] = [
    {
        id: "ch03-01",
        chapter: "3.1",
        title: "Variables and Mutability",
        sort_order: 10,
        content: `# Variables and Mutability

In Rust, variables are **immutable by default**. This is one of Rust's key safety features.

## Immutable Variables

_BT__BT__BT_rust
let x = 5;
// x = 6;  // ❌ This won't compile!
_BT__BT__BT_

## Mutable Variables

Add _BT_mut_BT_ to make a variable mutable:

_BT__BT__BT_rust
let mut x = 5;
println!("x is: {x}");
x = 6;  // ✅ This works!
println!("x is: {x}");
_BT__BT__BT_

## Constants

Constants are always immutable and must have a type annotation:

_BT__BT__BT_rust
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;
_BT__BT__BT_

## Shadowing

You can declare a new variable with the same name, which **shadows** the previous one:

_BT__BT__BT_rust
let x = 5;
let x = x + 1;  // x is now 6
let x = x * 2;  // x is now 12
_BT__BT__BT_

Shadowing is different from _BT_mut_BT_ — you're creating a new variable each time, and you can even change the type!`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Are variables mutable or immutable by default in Rust?",
                options: [
                    "Mutable by default",
                    "Immutable by default",
                    "It depends on the type",
                    "There's no default",
                ],
                correctIndex: 1,
            },
            {
                question: "What is shadowing?",
                options: [
                    "Making a variable mutable",
                    "Deleting a variable",
                    "Declaring a new variable with the same name",
                    "Creating a reference to a variable",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Write two functions that demonstrate mutability and shadowing:

1. _BT_double_mut(x: i32) -> i32_BT_ — Takes a value, doubles it using a mutable variable, and returns it
2. _BT_shadow_add(x: i32, y: i32) -> i32_BT_ — Uses shadowing (not _BT_mut_BT_) to add two numbers

### Requirements:
- _BT_double_mut_BT_ must use _BT_let mut_BT_ internally
- _BT_shadow_add_BT_ must use _BT_let_BT_ shadowing (re-declare the variable)`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_double_mut_5() {
        assert_eq!(double_mut(5), 10);
    }

    #[test]
    fn test_double_mut_0() {
        assert_eq!(double_mut(0), 0);
    }

    #[test]
    fn test_shadow_add() {
        assert_eq!(shadow_add(3, 7), 10);
    }

    #[test]
    fn test_shadow_add_negatives() {
        assert_eq!(shadow_add(-5, 5), 0);
    }
}`,
        starter_code: `// Write double_mut(x: i32) -> i32 using a mutable variable
// Write shadow_add(x: i32, y: i32) -> i32 using shadowing

fn main() {
    println!("double_mut(5) = {}", double_mut(5));
    println!("shadow_add(3, 7) = {}", shadow_add(3, 7));
}
`,
    },
    {
        id: "ch03-02",
        chapter: "3.2",
        title: "Data Types",
        sort_order: 11,
        content: `# Data Types

Rust is a **statically typed** language — every variable must have a known type at compile time.

## Scalar Types

Rust has four primary scalar types:

### Integers
| Length  | Signed | Unsigned |
|---------|--------|----------|
| 8-bit   | _BT_i8_BT_   | _BT_u8_BT_     |
| 32-bit  | _BT_i32_BT_  | _BT_u32_BT_    |
| 64-bit  | _BT_i64_BT_  | _BT_u64_BT_    |

_BT__BT__BT_rust
let x: i32 = -42;
let y: u8 = 255;
_BT__BT__BT_

### Floating-Point
_BT__BT__BT_rust
let x: f64 = 3.14;  // default float type
let y: f32 = 2.0;
_BT__BT__BT_

### Boolean
_BT__BT__BT_rust
let t: bool = true;
let f = false;  // type inferred
_BT__BT__BT_

### Character
_BT__BT__BT_rust
let c: char = 'z';
let emoji: char = '🦀';  // 4 bytes, supports Unicode!
_BT__BT__BT_

## Compound Types

### Tuples
Group multiple values of different types:

_BT__BT__BT_rust
let tup: (i32, f64, bool) = (500, 6.4, true);
let (x, y, z) = tup;  // destructuring
let five_hundred = tup.0;  // access by index
_BT__BT__BT_

### Arrays
Fixed-size collection of same-type values:

_BT__BT__BT_rust
let a: [i32; 5] = [1, 2, 3, 4, 5];
let first = a[0];
let repeated = [0; 10];  // [0, 0, 0, ..., 0] (10 times)
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What is the default integer type in Rust?",
                options: ["i8", "i16", "i32", "i64"],
                correctIndex: 2,
            },
            {
                question: "How do you access the second element of a tuple _BT_t_BT_?".replace(/_BT_/g, '`'),
                options: ["t[1]", "t.1", "t(1)", "t->1"],
                correctIndex: 1,
            },
            {
                question: "What does _BT_[0; 5]_BT_ create?".replace(/_BT_/g, '`'),
                options: [
                    "An array with one element: 5",
                    "An array [0, 1, 2, 3, 4]",
                    "An array [0, 0, 0, 0, 0]",
                    "A compilation error",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Work with Rust's type system:

1. _BT_swap_pair(pair: (i32, i32)) -> (i32, i32)_BT_ — Takes a tuple of two integers and returns them swapped
2. _BT_array_sum(arr: &[i32]) -> i32_BT_ — Returns the sum of all elements in a slice
3. _BT_classify_number(n: i32) -> &'static str_BT_ — Returns _BT_"positive"_BT_, _BT_"negative"_BT_, or _BT_"zero"_BT_`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_swap_pair() {
        assert_eq!(swap_pair((1, 2)), (2, 1));
        assert_eq!(swap_pair((0, -5)), (-5, 0));
    }

    #[test]
    fn test_array_sum() {
        assert_eq!(array_sum(&[1, 2, 3, 4, 5]), 15);
        assert_eq!(array_sum(&[]), 0);
        assert_eq!(array_sum(&[-1, 1]), 0);
    }

    #[test]
    fn test_classify_positive() {
        assert_eq!(classify_number(42), "positive");
    }

    #[test]
    fn test_classify_negative() {
        assert_eq!(classify_number(-7), "negative");
    }

    #[test]
    fn test_classify_zero() {
        assert_eq!(classify_number(0), "zero");
    }
}`,
        starter_code: `// Write: swap_pair(pair: (i32, i32)) -> (i32, i32)
// Write: array_sum(arr: &[i32]) -> i32
// Write: classify_number(n: i32) -> &'static str

fn main() {
    println!("swap (1, 2) = {:?}", swap_pair((1, 2)));
    println!("sum [1..5] = {}", array_sum(&[1, 2, 3, 4, 5]));
    println!("42 is {}", classify_number(42));
}
`,
    },
    {
        id: "ch03-03",
        chapter: "3.3",
        title: "Functions",
        sort_order: 12,
        content: `# Functions

Functions are defined with _BT_fn_BT_. Rust uses **snake_case** for function names.

## Defining Functions

_BT__BT__BT_rust
fn another_function() {
    println!("Hello from another function!");
}
_BT__BT__BT_

## Parameters

Functions can take parameters. You **must** declare the type of each parameter:

_BT__BT__BT_rust
fn greet(name: &str) {
    println!("Hello, {name}!");
}
_BT__BT__BT_

## Return Values

Functions return values using _BT_->_BT_ syntax. The last expression is the return value:

_BT__BT__BT_rust
fn add(a: i32, b: i32) -> i32 {
    a + b  // no semicolon = return value
}
_BT__BT__BT_

> ⚠️ Note: adding a semicolon turns an expression into a statement, which returns _BT_()_BT_ (unit type) instead!

## Multiple Parameters

_BT__BT__BT_rust
fn print_labeled_measurement(value: i32, unit: &str) {
    println!("The measurement is: {value}{unit}");
}
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What happens if you add a semicolon to the last expression in a function?",
                options: [
                    "Nothing changes",
                    "It becomes a statement and returns () instead",
                    "It causes a runtime error",
                    "It makes the return explicit",
                ],
                correctIndex: 1,
            },
            {
                question: "What naming convention does Rust use for functions?",
                options: ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Write three math helper functions:

1. _BT_square(n: i32) -> i32_BT_ — Returns n squared
2. _BT_is_even(n: i32) -> bool_BT_ — Returns true if n is even
3. _BT_celsius_to_fahrenheit(c: f64) -> f64_BT_ — Converts Celsius to Fahrenheit (formula: C × 9/5 + 32)`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_square_positive() {
        assert_eq!(square(5), 25);
    }

    #[test]
    fn test_square_negative() {
        assert_eq!(square(-3), 9);
    }

    #[test]
    fn test_square_zero() {
        assert_eq!(square(0), 0);
    }

    #[test]
    fn test_is_even_true() {
        assert!(is_even(4));
    }

    #[test]
    fn test_is_even_false() {
        assert!(!is_even(7));
    }

    #[test]
    fn test_celsius_to_fahrenheit() {
        assert!((celsius_to_fahrenheit(0.0) - 32.0).abs() < 0.01);
        assert!((celsius_to_fahrenheit(100.0) - 212.0).abs() < 0.01);
    }
}`,
        starter_code: `// Write: square(n: i32) -> i32
// Write: is_even(n: i32) -> bool
// Write: celsius_to_fahrenheit(c: f64) -> f64

fn main() {
    println!("5 squared = {}", square(5));
    println!("4 is even: {}", is_even(4));
    println!("100°C = {}°F", celsius_to_fahrenheit(100.0));
}
`,
    },
    {
        id: "ch03-05",
        chapter: "3.5",
        title: "Control Flow",
        sort_order: 14,
        content: `# Control Flow

## if Expressions

_BT__BT__BT_rust
let number = 7;
if number < 5 {
    println!("less than 5");
} else {
    println!("5 or greater");
}
_BT__BT__BT_

In Rust, _BT_if_BT_ is an **expression** — it returns a value:

_BT__BT__BT_rust
let number = if condition { 5 } else { 6 };
_BT__BT__BT_

## Loops

### loop (infinite)
_BT__BT__BT_rust
let mut counter = 0;
let result = loop {
    counter += 1;
    if counter == 10 {
        break counter * 2;  // returns 20
    }
};
_BT__BT__BT_

### while
_BT__BT__BT_rust
let mut n = 3;
while n != 0 {
    println!("{n}!");
    n -= 1;
}
_BT__BT__BT_

### for (most common)
_BT__BT__BT_rust
for number in 1..=5 {
    println!("{number}");
}
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Can _BT_if_BT_ be used as an expression (return a value) in Rust?".replace(/_BT_/g, '`'),
                options: [
                    "No, if is always a statement",
                    "Yes, if is an expression and can return a value",
                    "Only with the return keyword",
                    "Only in unsafe blocks",
                ],
                correctIndex: 1,
            },
            {
                question: "Which loop is most common in Rust?",
                options: ["loop", "while", "for", "do-while"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1. _BT_fizzbuzz(n: u32) -> String_BT_ — Classic FizzBuzz:
   - Divisible by both 3 and 5 → _BT_"FizzBuzz"_BT_
   - Divisible by 3 → _BT_"Fizz"_BT_
   - Divisible by 5 → _BT_"Buzz"_BT_
   - Otherwise → the number as a string

2. _BT_sum_range(start: i32, end: i32) -> i32_BT_ — Sum all integers from start to end (inclusive)`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fizzbuzz_fizz() {
        assert_eq!(fizzbuzz(3), "Fizz");
        assert_eq!(fizzbuzz(9), "Fizz");
    }

    #[test]
    fn test_fizzbuzz_buzz() {
        assert_eq!(fizzbuzz(5), "Buzz");
        assert_eq!(fizzbuzz(10), "Buzz");
    }

    #[test]
    fn test_fizzbuzz_fizzbuzz() {
        assert_eq!(fizzbuzz(15), "FizzBuzz");
        assert_eq!(fizzbuzz(30), "FizzBuzz");
    }

    #[test]
    fn test_fizzbuzz_number() {
        assert_eq!(fizzbuzz(7), "7");
        assert_eq!(fizzbuzz(1), "1");
    }

    #[test]
    fn test_sum_range() {
        assert_eq!(sum_range(1, 5), 15);
        assert_eq!(sum_range(0, 0), 0);
        assert_eq!(sum_range(-2, 2), 0);
    }
}`,
        starter_code: `// Write: fizzbuzz(n: u32) -> String
// Write: sum_range(start: i32, end: i32) -> i32

fn main() {
    for i in 1..=20 {
        println!("{}: {}", i, fizzbuzz(i));
    }
    println!("sum 1..=100 = {}", sum_range(1, 100));
}
`,
    },
];
