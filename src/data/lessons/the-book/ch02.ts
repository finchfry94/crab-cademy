import { Lesson } from "../../types";

export const ch02Lessons: Lesson[] = [
    {
        id: "ch02-01",
        chapter: "2.1",
        title: "Variables and Mutability",
        sort_order: 20,
        environment: "browser",
        content: `# Variables and Mutability

In most languages, variables are mutable by default — you can change them anytime. Rust flips this: **variables are immutable by default**. This is a deliberate design choice that makes your code safer and easier to reason about.

## Why Immutable by Default?

Think of it like a contract. When you see _BT_let x = 5;_BT_, you're **guaranteeing** that _BT_x_BT_ will never change. This means:
- No accidental overwrites in large codebases
- Easier to reason about concurrent code
- The compiler can optimize more aggressively

## Declaring Variables

_BT__BT__BT_rust
let x = 5;        // immutable — cannot change
let mut y = 10;   // mutable — CAN change
y = 20;           // ✅ This works
// x = 10;        // ❌ Compile error! x is immutable
_BT__BT__BT_

## Constants

Constants are _BT_always_BT_ immutable (you can never add _BT_mut_BT_) and must have a type annotation:

_BT__BT__BT_rust
const MAX_POINTS: u32 = 100_000;
const PI: f64 = 3.14159;
_BT__BT__BT_

Key differences from _BT_let_BT_:
- Must use _BT_const_BT_, not _BT_let_BT_
- Type annotation is **required**
- Value must be known at **compile time**
- Convention: _BT_SCREAMING_SNAKE_CASE_BT_

## Shadowing

You can re-declare a variable with the same name. The new variable **shadows** the old one:

_BT__BT__BT_rust
let x = 5;
let x = x + 1;   // x is now 6
let x = x * 2;   // x is now 12
_BT__BT__BT_

This is NOT the same as _BT_mut_BT_! Shadowing creates a **new variable**. You can even change the type:

_BT__BT__BT_rust
let spaces = "   ";        // &str
let spaces = spaces.len(); // usize — different type!
_BT__BT__BT_

With _BT_mut_BT_, you can't change types:
_BT__BT__BT_rust
let mut spaces = "   ";
spaces = spaces.len();  // ❌ Error! Can't change type
_BT__BT__BT_

## ⚠️ Common Mistakes

1. **Forgetting _BT_mut_BT_** — If you try to reassign an immutable variable, the compiler gives a helpful error telling you to add _BT_mut_BT_.
2. **Confusing shadowing with mutation** — Shadowing is a new _BT_let_BT_ binding; _BT_mut_BT_ modifies the same binding.
3. **Using _BT_mut_BT_ when you don't need it** — The compiler will warn you with "variable does not need to be mutable".`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What is the default mutability of variables in Rust?",
                options: [
                    "Mutable by default",
                    "Immutable by default",
                    "It depends on the type",
                    "There is no default",
                ],
                correctIndex: 1,
            },
            {
                question: "What is shadowing?",
                options: [
                    "Making a variable private",
                    "Declaring a new variable with the same name as an existing one",
                    "Changing the value of a mutable variable",
                    "Deleting a variable from memory",
                ],
                correctIndex: 1,
            },
            {
                question: "Which of the following is TRUE about constants?",
                options: [
                    "Constants can be declared with let",
                    "Constants don't need type annotations",
                    "Constants must be known at compile time",
                    "Constants can be mutable with const mut",
                ],
                correctIndex: 2,
            },
            {
                question: "What happens when you shadow a variable?",
                options: [
                    "The original variable is deleted",
                    "A new variable is created, and the old one is no longer accessible by that name",
                    "The variable becomes mutable automatically",
                    "It causes a compiler error",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. _BT_double(x: i32) -> i32_BT_ — Returns _BT_x * 2_BT_.
2. _BT_shadow_example() -> i32_BT_ — Demonstrates shadowing:
   - Start with _BT_let x = 5_BT_
   - Shadow it: _BT_let x = x + 10_BT_
   - Shadow it again: _BT_let x = x * 2_BT_
   - Return the final value of _BT_x_BT_`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_double() {
        assert_eq!(double(5), 10);
    }

    #[test]
    fn test_double_zero() {
        assert_eq!(double(0), 0);
    }

    #[test]
    fn test_double_negative() {
        assert_eq!(double(-3), -6);
    }

    #[test]
    fn test_shadow_example() {
        assert_eq!(shadow_example(), 30);
    }
}`,
        starter_code: `// Write: double(x: i32) -> i32
// Write: shadow_example() -> i32  (use shadowing!)

fn main() {
    println!("double(5) = {}", double(5));
    println!("shadow result = {}", shadow_example());
}
`,
    },
    {
        id: "ch02-02",
        chapter: "2.2",
        title: "Data Types",
        sort_order: 21,
        environment: "browser",
        content: `# Data Types

Rust is a **statically typed** language — every value has a type that's known at compile time. The compiler can usually infer types, but sometimes you need to be explicit.

## Scalar Types

Scalars represent a single value. Rust has four primary scalar types:

### Integers

| Length | Signed | Unsigned |
|--------|--------|----------|
| 8-bit  | _BT_i8_BT_ | _BT_u8_BT_ |
| 16-bit | _BT_i16_BT_ | _BT_u16_BT_ |
| 32-bit | _BT_i32_BT_ | _BT_u32_BT_ |
| 64-bit | _BT_i64_BT_ | _BT_u64_BT_ |
| 128-bit | _BT_i128_BT_ | _BT_u128_BT_ |
| arch   | _BT_isize_BT_ | _BT_usize_BT_ |

**Signed** (_BT_i_BT_) can store negatives: an _BT_i8_BT_ holds -128 to 127.
**Unsigned** (_BT_u_BT_) is non-negative only: a _BT_u8_BT_ holds 0 to 255.

💡 Default integer type: _BT_i32_BT_ (good balance of range and speed).

### Floating-Point Numbers
_BT__BT__BT_rust
let x = 2.0;      // f64 (default — double precision)
let y: f32 = 3.0; // f32 (single precision)
_BT__BT__BT_

### Booleans
_BT__BT__BT_rust
let t: bool = true;
let f: bool = false;
_BT__BT__BT_

### Characters
_BT__BT__BT_rust
let c = 'z';
let heart = '❤';    // Unicode!
let crab = '🦀';    // Even emoji work!
_BT__BT__BT_

Rust _BT_char_BT_ is 4 bytes — it represents a **Unicode Scalar Value**, not just ASCII.

## Compound Types

### Tuples
Fixed-size, mixed-type collections:
_BT__BT__BT_rust
let tup: (i32, f64, bool) = (500, 6.4, true);
let (x, y, z) = tup;       // destructuring
let first = tup.0;          // access by index
_BT__BT__BT_

### Arrays
Fixed-size, same-type collections:
_BT__BT__BT_rust
let a = [1, 2, 3, 4, 5];
let first = a[0];
let a = [3; 5]; // Creates [3, 3, 3, 3, 3]
_BT__BT__BT_

⚡ Arrays live on the **stack** (fast!). For dynamic-size collections, use _BT_Vec_BT_ (Chapter 8).

## ⚠️ Common Mistakes

1. **Integer overflow** — In debug mode, Rust panics on overflow. In release mode, it wraps. Use _BT_checked_add_BT_ for safe math.
2. **Array out of bounds** — Rust checks bounds at runtime and panics. No silent buffer overflows!
3. **Type mismatch** — You can't mix _BT_i32_BT_ and _BT_u32_BT_ in math. Use _BT_as_BT_ to cast: _BT_x as u32_BT_.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What is the default integer type in Rust?",
                options: ["u32", "i64", "i32", "usize"],
                correctIndex: 2,
            },
            {
                question: "How big is a Rust _BT_char_BT_?".replace(/_BT_/g, '`'),
                options: ["1 byte (ASCII)", "2 bytes (UTF-16)", "4 bytes (Unicode Scalar Value)", "Variable size"],
                correctIndex: 2,
            },
            {
                question: "What happens when you access an array index that doesn't exist?",
                options: [
                    "It returns 0",
                    "It returns None",
                    "The program panics at runtime",
                    "It returns garbage data",
                ],
                correctIndex: 2,
            },
            {
                question: "How do you create an array of five 0s?",
                options: [
                    "[0, 0, 0, 0, 0]",
                    "[0; 5]",
                    "Both of the above",
                    "array!(0, 5)",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1. _BT_celsius_to_fahrenheit(c: f64) -> f64_BT_ — Converts Celsius to Fahrenheit using _BT_F = C × 9/5 + 32_BT_
2. _BT_tuple_sum(t: (i32, i32, i32)) -> i32_BT_ — Returns the sum of all three elements`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_celsius_to_fahrenheit_boiling() {
        assert!((celsius_to_fahrenheit(100.0) - 212.0).abs() < 0.01);
    }

    #[test]
    fn test_celsius_to_fahrenheit_freezing() {
        assert!((celsius_to_fahrenheit(0.0) - 32.0).abs() < 0.01);
    }

    #[test]
    fn test_celsius_to_fahrenheit_body() {
        assert!((celsius_to_fahrenheit(37.0) - 98.6).abs() < 0.01);
    }

    #[test]
    fn test_tuple_sum() {
        assert_eq!(tuple_sum((1, 2, 3)), 6);
    }

    #[test]
    fn test_tuple_sum_negatives() {
        assert_eq!(tuple_sum((-1, -2, -3)), -6);
    }
}`,
        starter_code: `// Write: celsius_to_fahrenheit(c: f64) -> f64
// Write: tuple_sum(t: (i32, i32, i32)) -> i32

fn main() {
    println!("100°C = {}°F", celsius_to_fahrenheit(100.0));
    println!("Sum: {}", tuple_sum((1, 2, 3)));
}
`,
    },
    {
        id: "ch02-03",
        chapter: "2.3",
        title: "Functions",
        sort_order: 22,
        environment: "browser",
        content: `# Functions

Functions are the building blocks of Rust programs. You've already used one — _BT_main_BT_. Now let's learn how to write your own.

## Declaring Functions

_BT__BT__BT_rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}
_BT__BT__BT_

Key points:
- Use _BT_fn_BT_ to declare
- Parameters need **type annotations** (Rust never infers parameter types)
- _BT_-> i32_BT_ declares the return type
- Convention: _BT_snake_case_BT_ for function names

## Statements vs Expressions

This is a **crucial** Rust concept that trips up newcomers:

- **Statements** perform an action but don't return a value. They end with _BT_;_BT_.
- **Expressions** evaluate to a value. They do **NOT** end with _BT_;_BT_.

_BT__BT__BT_rust
fn five() -> i32 {
    5        // Expression — returns 5 ✅
}

fn also_five() -> i32 {
    return 5; // Explicit return — also works ✅
}

fn oops() -> i32 {
    5;       // Statement (note the ;) — returns () ❌ NOT 5!
}
_BT__BT__BT_

The last line in a function is the **implicit return value** — but only if it doesn't have a semicolon!

### The Semicolon Rule

This is one of Rust's most distinctive features:
_BT__BT__BT_rust
let y = {
    let x = 3;
    x + 1      // No semicolon → this is the value of the block
}; // y is 4

let y = {
    let x = 3;
    x + 1;     // Semicolon → this returns ()
}; // y is ()
_BT__BT__BT_

## ⚠️ Common Mistakes

1. **Adding a semicolon to the return value** — _BT_5;_BT_ returns _BT_()_BT_, not _BT_5_BT_. This is the #1 beginner error.
2. **Forgetting parameter types** — Unlike some languages, Rust requires explicit types on all parameters.
3. **Mismatched return type** — If you declare _BT_-> i32_BT_ but your function body evaluates to _BT_()_BT_, you'll get a type mismatch error.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What naming convention does Rust use for functions?",
                options: ["camelCase", "PascalCase", "snake_case", "SCREAMING_CASE"],
                correctIndex: 2,
            },
            {
                question: "What does _BT_5;_BT_ (with a semicolon) evaluate to inside a function body?".replace(/_BT_/g, '`'),
                options: ["5", "The unit type ()", "Nothing — it's a syntax error", "0"],
                correctIndex: 1,
            },
            {
                question: "Can Rust infer the types of function parameters?",
                options: [
                    "Yes, always",
                    "Only for simple types",
                    "No — parameter types must always be explicitly annotated",
                    "Only in generic functions",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1. _BT_multiply(a: i32, b: i32) -> i32_BT_ — Returns a × b using an **expression** (no _BT_return_BT_ keyword, no semicolon)
2. _BT_is_even(n: i32) -> bool_BT_ — Returns true if n is even, false otherwise
3. _BT_apply_twice(x: i32, amount: i32) -> i32_BT_ — Adds _BT_amount_BT_ to _BT_x_BT_ **twice** and returns the result`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_multiply() {
        assert_eq!(multiply(3, 4), 12);
    }

    #[test]
    fn test_multiply_by_zero() {
        assert_eq!(multiply(5, 0), 0);
    }

    #[test]
    fn test_multiply_negatives() {
        assert_eq!(multiply(-3, -4), 12);
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
    fn test_is_even_zero() {
        assert!(is_even(0));
    }

    #[test]
    fn test_apply_twice() {
        assert_eq!(apply_twice(5, 3), 11);
    }

    #[test]
    fn test_apply_twice_negative() {
        assert_eq!(apply_twice(10, -2), 6);
    }
}`,
        starter_code: `// Write: multiply(a: i32, b: i32) -> i32
// Write: is_even(n: i32) -> bool
// Write: apply_twice(x: i32, amount: i32) -> i32

fn main() {
    println!("3 × 4 = {}", multiply(3, 4));
    println!("4 is even? {}", is_even(4));
    println!("apply_twice(5, 3) = {}", apply_twice(5, 3));
}
`,
    },
    {
        id: "ch02-04",
        chapter: "2.4",
        title: "Comments",
        sort_order: 23,
        environment: "browser",
        content: `# Comments

Good code tells you **what**; good comments tell you **why**. Let's learn Rust's comment styles.

## Line Comments

The most common style — everything after _BT_//_BT_ is ignored:

_BT__BT__BT_rust
// This is a comment
let x = 5; // Inline comment
_BT__BT__BT_

## Doc Comments

Rust has first-class documentation support using _BT_///_BT_ (three slashes):

_BT__BT__BT_rust
/// Adds two numbers together.
///
/// # Examples
///
/// _BT__BT__BT_
/// let result = add(2, 3);
/// assert_eq!(result, 5);
/// _BT__BT__BT_
fn add(a: i32, b: i32) -> i32 {
    a + b
}
_BT__BT__BT_

Doc comments are parsed as **Markdown** and can be turned into HTML documentation with _BT_cargo doc_BT_.

## When to Comment

**Do comment:**
- **Why** you made a design decision
- Non-obvious algorithms or business logic
- Public API documentation with _BT_///_BT_

**Don't comment:**
- Obvious code (_BT_// increment x by 1_BT_ before _BT_x += 1_BT_)
- Commented-out code (use version control instead)

## ⚠️ Common Mistakes

1. **Over-commenting** — Too many comments makes code harder to read, not easier.
2. **Stale comments** — When you change code, update the comments too! Nothing is worse than a comment that lies.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What syntax is used for documentation comments?",
                options: ["//", "/* */", "///", "#"],
                correctIndex: 2,
            },
            {
                question: "What format are doc comments written in?",
                options: ["Plain text", "HTML", "Markdown", "reStructuredText"],
                correctIndex: 2,
            },
            {
                question: "Which command generates HTML documentation from doc comments?",
                options: ["cargo build", "cargo test", "cargo doc", "cargo run"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Write a well-documented function:

1. _BT_abs_val(n: i32) -> i32_BT_ — Returns the absolute value of n
2. Add a doc comment (_BT_///_BT_) explaining what the function does
3. Include a code example in the doc comment

The implementation is simple — the focus is on writing good documentation!`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_abs_val_positive() {
        assert_eq!(abs_val(5), 5);
    }

    #[test]
    fn test_abs_val_negative() {
        assert_eq!(abs_val(-5), 5);
    }

    #[test]
    fn test_abs_val_zero() {
        assert_eq!(abs_val(0), 0);
    }
}`,
        starter_code: `/// Returns the absolute value of a number.
///
/// # Examples
///
/// \`\`\`
/// let result = abs_val(-5);
/// assert_eq!(result, 5);
/// \`\`\`
fn abs_val(n: i32) -> i32 {
    // Implement this!
    0
}

fn main() {
    println!("|−5| = {}", abs_val(-5));
    println!("|3| = {}", abs_val(3));
}
`,
    },
    {
        id: "ch02-05",
        chapter: "2.5",
        title: "Control Flow",
        sort_order: 24,
        environment: "browser",
        content: `# Control Flow

Control flow lets your program make decisions and repeat actions. Rust has several tools for this.

## _BT_if_BT_ Expressions

Note: in Rust, _BT_if_BT_ is an **expression**, not just a statement. It returns a value!

_BT__BT__BT_rust
let number = 6;

if number % 4 == 0 {
    println!("Divisible by 4");
} else if number % 3 == 0 {
    println!("Divisible by 3");
} else {
    println!("Not divisible");
}
_BT__BT__BT_

### Using _BT_if_BT_ in a _BT_let_BT_ Statement

Because _BT_if_BT_ is an expression, you can use it on the right side of _BT_let_BT_:

_BT__BT__BT_rust
let condition = true;
let number = if condition { 5 } else { 6 };
_BT__BT__BT_

⚠️ Both arms must return the **same type**!

## Loops

### _BT_loop_BT_ — Infinite Loop

_BT__BT__BT_rust
loop {
    println!("Forever!");
    break; // Use break to exit
}
_BT__BT__BT_

_BT_loop_BT_ can also return a value:
_BT__BT__BT_rust
let result = loop {
    counter += 1;
    if counter == 10 {
        break counter * 2; // Returns 20
    }
};
_BT__BT__BT_

### _BT_while_BT_ — Conditional Loop

_BT__BT__BT_rust
let mut number = 3;
while number != 0 {
    println!("{number}!");
    number -= 1;
}
_BT__BT__BT_

### _BT_for_BT_ — Iterating over Collections

The most common loop. Safe and concise:

_BT__BT__BT_rust
let a = [10, 20, 30, 40, 50];
for element in a {
    println!("{element}");
}

// With ranges:
for number in 1..=5 {
    println!("{number}"); // 1, 2, 3, 4, 5 (inclusive)
}

for number in (1..4).rev() {
    println!("{number}"); // 3, 2, 1 (reversed)
}
_BT__BT__BT_

## ⚠️ Common Mistakes

1. **Condition must be _BT_bool_BT_** — Unlike C, you can't write _BT_if number { ... }_BT_. Rust requires an explicit boolean.
2. **Infinite loops** — If you use _BT_loop_BT_ or _BT_while true_BT_, make sure you have a _BT_break_BT_!
3. **Off-by-one with ranges** — _BT_1..5_BT_ is exclusive (1,2,3,4). _BT_1..=5_BT_ is inclusive (1,2,3,4,5).`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What makes _BT_if_BT_ special in Rust compared to most languages?".replace(/_BT_/g, '`'),
                options: [
                    "It's faster than in other languages",
                    "It's an expression that returns a value",
                    "It can only check booleans",
                    "It doesn't need curly braces",
                ],
                correctIndex: 1,
            },
            {
                question: "What is the difference between _BT_1..5_BT_ and _BT_1..=5_BT_?".replace(/_BT_/g, '`'),
                options: [
                    "There is no difference",
                    "1..5 includes 5, 1..=5 excludes 5",
                    "1..5 excludes 5, 1..=5 includes 5",
                    "1..5 starts at 0, 1..=5 starts at 1",
                ],
                correctIndex: 2,
            },
            {
                question: "Can a _BT_loop_BT_ return a value?".replace(/_BT_/g, '`'),
                options: [
                    "No, loops are statements",
                    "Yes, via break with a value (e.g. break 42;)",
                    "Only while loops can",
                    "Only if you use return",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. _BT_fizzbuzz(n: i32) -> String_BT_ — The classic:
   - Return _BT_"FizzBuzz"_BT_ if divisible by both 3 and 5
   - Return _BT_"Fizz"_BT_ if divisible by 3
   - Return _BT_"Buzz"_BT_ if divisible by 5
   - Return the number as a string otherwise

2. _BT_sum_range(start: i32, end: i32) -> i32_BT_ — Sum all numbers from _BT_start_BT_ to _BT_end_BT_ **inclusive**. Use a _BT_for_BT_ loop!`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fizzbuzz_fizz() {
        assert_eq!(fizzbuzz(9), "Fizz");
    }

    #[test]
    fn test_fizzbuzz_buzz() {
        assert_eq!(fizzbuzz(10), "Buzz");
    }

    #[test]
    fn test_fizzbuzz_fizzbuzz() {
        assert_eq!(fizzbuzz(15), "FizzBuzz");
    }

    #[test]
    fn test_fizzbuzz_number() {
        assert_eq!(fizzbuzz(7), "7");
    }

    #[test]
    fn test_fizzbuzz_one() {
        assert_eq!(fizzbuzz(1), "1");
    }

    #[test]
    fn test_sum_range_positive() {
        assert_eq!(sum_range(1, 5), 15);
    }

    #[test]
    fn test_sum_range_single() {
        assert_eq!(sum_range(3, 3), 3);
    }

    #[test]
    fn test_sum_range_negative() {
        assert_eq!(sum_range(-2, 2), 0);
    }
}`,
        starter_code: `// Write: fizzbuzz(n: i32) -> String
// Write: sum_range(start: i32, end: i32) -> i32

fn main() {
    for i in 1..=20 {
        println!("{}: {}", i, fizzbuzz(i));
    }
    println!("Sum 1..=100 = {}", sum_range(1, 100));
}
`,
    },
];
