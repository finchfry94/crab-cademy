/**
 * Embedded lesson data with quizzes, objectives, and test-driven exercises.
 *
 * Lesson flow: Read content → Answer quiz → See objectives + test code → Write code → Run tests → ✅
 */

export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
}

export interface Lesson {
    id: string;
    chapter: string;
    title: string;
    content: string;
    quiz: QuizQuestion[];
    objectives: string;
    test_code: string;
    starter_code: string;
    sort_order: number;
}

const lessons: Lesson[] = [
    // ─── Chapter 1: Getting Started ────────────────────────────────
    {
        id: "ch01-01",
        chapter: "1.1",
        title: "Hello, World!",
        sort_order: 1,
        content: `# Hello, World!

Welcome to Rust! In this first lesson, you'll write the classic "Hello, World!" program.

## Your First Program

Every Rust program starts with a \`main\` function. The \`main\` function is special: it's always the first code that runs.

\`\`\`rust
fn main() {
    println!("Hello, world!");
}
\`\`\`

### Breaking it down:
- \`fn\` declares a new function
- \`main\` is the function name (required entry point)
- \`println!\` is a **macro** that prints text to the console
- The \`!\` means it's a macro, not a regular function
- Rust statements end with a **semicolon** \`;\``,
        quiz: [
            {
                question: "What does the `!` in `println!` indicate?",
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

Write a function called \`greet\` that takes a name as a \`&str\` and returns a greeting string.

For example, \`greet("Rustacean")\` should return \`"Hello, Rustacean!"\`.

### Requirements:
1. Define a function \`greet(name: &str) -> String\`
2. Return \`"Hello, {name}!"\` using \`format!\`
3. The \`main\` function should call \`greet\` and print the result`,
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

    // ─── Chapter 2: Guessing Game ──────────────────────────────────
    {
        id: "ch02-01",
        chapter: "2.1",
        title: "Guessing Game",
        sort_order: 5,
        content: `# Guessing Game

Let's build a classic "Guessing Game"!

## Ordering

Rust has a standard enum \`std::cmp::Ordering\` with three variants:
- \`Ordering::Less\`
- \`Ordering::Greater\`
- \`Ordering::Equal\`

## Comparing Values

You can compare two values using the \`cmp\` method:

\`\`\`rust
use std::cmp::Ordering;

match guess.cmp(&secret_number) {
    Ordering::Less => println!("Too small!"),
    Ordering::Greater => println!("Too big!"),
    Ordering::Equal => println!("You win!"),
}
\`\`\`

## Parsing Input

Converting a string to a number is common:

\`\`\`rust
// "42".parse() returns a Result
let guess: u32 = "42".parse().unwrap_or(0);
\`\`\``,
        quiz: [
            {
                question: "What does the `cmp` method return?",
                options: ["bool", "i32", "std::cmp::Ordering", "String"],
                correctIndex: 2,
            },
            {
                question: "What are the variants of `Ordering`?",
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

1. \`check_guess(guess: u32, secret: u32) -> std::cmp::Ordering\` — Compare the guess to the secret.
2. \`parse_input(input: &str) -> u32\` — Parse string to u32. Return 0 if parsing fails (use \`unwrap_or(0)\`).`,
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

    // ─── Chapter 3: Common Programming Concepts ────────────────────
    {
        id: "ch03-01",
        chapter: "3.1",
        title: "Variables and Mutability",
        sort_order: 10,
        content: `# Variables and Mutability

In Rust, variables are **immutable by default**. This is one of Rust's key safety features.

## Immutable Variables

\`\`\`rust
let x = 5;
// x = 6;  // ❌ This won't compile!
\`\`\`

## Mutable Variables

Add \`mut\` to make a variable mutable:

\`\`\`rust
let mut x = 5;
println!("x is: {x}");
x = 6;  // ✅ This works!
println!("x is: {x}");
\`\`\`

## Constants

Constants are always immutable and must have a type annotation:

\`\`\`rust
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;
\`\`\`

## Shadowing

You can declare a new variable with the same name, which **shadows** the previous one:

\`\`\`rust
let x = 5;
let x = x + 1;  // x is now 6
let x = x * 2;  // x is now 12
\`\`\`

Shadowing is different from \`mut\` — you're creating a new variable each time, and you can even change the type!`,
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

1. \`double_mut(x: i32) -> i32\` — Takes a value, doubles it using a mutable variable, and returns it
2. \`shadow_add(x: i32, y: i32) -> i32\` — Uses shadowing (not \`mut\`) to add two numbers

### Requirements:
- \`double_mut\` must use \`let mut\` internally
- \`shadow_add\` must use \`let\` shadowing (re-declare the variable)`,
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
| 8-bit   | \`i8\`   | \`u8\`     |
| 32-bit  | \`i32\`  | \`u32\`    |
| 64-bit  | \`i64\`  | \`u64\`    |

\`\`\`rust
let x: i32 = -42;
let y: u8 = 255;
\`\`\`

### Floating-Point
\`\`\`rust
let x: f64 = 3.14;  // default float type
let y: f32 = 2.0;
\`\`\`

### Boolean
\`\`\`rust
let t: bool = true;
let f = false;  // type inferred
\`\`\`

### Character
\`\`\`rust
let c: char = 'z';
let emoji: char = '🦀';  // 4 bytes, supports Unicode!
\`\`\`

## Compound Types

### Tuples
Group multiple values of different types:

\`\`\`rust
let tup: (i32, f64, bool) = (500, 6.4, true);
let (x, y, z) = tup;  // destructuring
let five_hundred = tup.0;  // access by index
\`\`\`

### Arrays
Fixed-size collection of same-type values:

\`\`\`rust
let a: [i32; 5] = [1, 2, 3, 4, 5];
let first = a[0];
let repeated = [0; 10];  // [0, 0, 0, ..., 0] (10 times)
\`\`\``,
        quiz: [
            {
                question: "What is the default integer type in Rust?",
                options: ["i8", "i16", "i32", "i64"],
                correctIndex: 2,
            },
            {
                question: "How do you access the second element of a tuple `t`?",
                options: ["t[1]", "t.1", "t(1)", "t->1"],
                correctIndex: 1,
            },
            {
                question: "What does `[0; 5]` create?",
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

1. \`swap_pair(pair: (i32, i32)) -> (i32, i32)\` — Takes a tuple of two integers and returns them swapped
2. \`array_sum(arr: &[i32]) -> i32\` — Returns the sum of all elements in a slice
3. \`classify_number(n: i32) -> &'static str\` — Returns \`"positive"\`, \`"negative"\`, or \`"zero"\``,
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

Functions are defined with \`fn\`. Rust uses **snake_case** for function names.

## Defining Functions

\`\`\`rust
fn another_function() {
    println!("Hello from another function!");
}
\`\`\`

## Parameters

Functions can take parameters. You **must** declare the type of each parameter:

\`\`\`rust
fn greet(name: &str) {
    println!("Hello, {name}!");
}
\`\`\`

## Return Values

Functions return values using \`->\` syntax. The last expression is the return value:

\`\`\`rust
fn add(a: i32, b: i32) -> i32 {
    a + b  // no semicolon = return value
}
\`\`\`

> ⚠️ Note: adding a semicolon turns an expression into a statement, which returns \`()\` (unit type) instead!

## Multiple Parameters

\`\`\`rust
fn print_labeled_measurement(value: i32, unit: &str) {
    println!("The measurement is: {value}{unit}");
}
\`\`\``,
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

1. \`square(n: i32) -> i32\` — Returns n squared
2. \`is_even(n: i32) -> bool\` — Returns true if n is even
3. \`celsius_to_fahrenheit(c: f64) -> f64\` — Converts Celsius to Fahrenheit (formula: C × 9/5 + 32)`,
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

\`\`\`rust
let number = 7;
if number < 5 {
    println!("less than 5");
} else {
    println!("5 or greater");
}
\`\`\`

In Rust, \`if\` is an **expression** — it returns a value:

\`\`\`rust
let number = if condition { 5 } else { 6 };
\`\`\`

## Loops

### loop (infinite)
\`\`\`rust
let mut counter = 0;
let result = loop {
    counter += 1;
    if counter == 10 {
        break counter * 2;  // returns 20
    }
};
\`\`\`

### while
\`\`\`rust
let mut n = 3;
while n != 0 {
    println!("{n}!");
    n -= 1;
}
\`\`\`

### for (most common)
\`\`\`rust
for number in 1..=5 {
    println!("{number}");
}
\`\`\``,
        quiz: [
            {
                question: "Can `if` be used as an expression (return a value) in Rust?",
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

1. \`fizzbuzz(n: u32) -> String\` — Classic FizzBuzz:
   - Divisible by both 3 and 5 → \`"FizzBuzz"\`
   - Divisible by 3 → \`"Fizz"\`
   - Divisible by 5 → \`"Buzz"\`
   - Otherwise → the number as a string

2. \`sum_range(start: i32, end: i32) -> i32\` — Sum all integers from start to end (inclusive)`,
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

    // ─── Chapter 4: Understanding Ownership ────────────────────────
    {
        id: "ch04-01",
        chapter: "4.1",
        title: "What is Ownership?",
        sort_order: 20,
        content: `# What is Ownership?

**Ownership** is Rust's most unique feature. It enables memory safety without a garbage collector.

## The Rules

1. Each value in Rust has an **owner**
2. There can only be **one owner** at a time
3. When the owner goes out of **scope**, the value is **dropped**

## The String Type

\`\`\`rust
let s1 = String::from("hello");
let s2 = s1;  // s1 is MOVED to s2
// println!("{s1}");  // ❌ Error! s1 is no longer valid
println!("{s2}");    // ✅ This works
\`\`\`

## Clone (Deep Copy)

\`\`\`rust
let s1 = String::from("hello");
let s2 = s1.clone();  // deep copy
println!("{s1} and {s2}");  // ✅ Both valid!
\`\`\`

## Ownership and Functions

Passing a value to a function **moves** it:

\`\`\`rust
fn takes_ownership(s: String) {
    println!("{s}");
} // s is dropped here
\`\`\``,
        quiz: [
            {
                question: "What happens when you assign a String to another variable?",
                options: [
                    "The value is copied",
                    "The value is moved (original becomes invalid)",
                    "Both variables share the value",
                    "It causes a compile error",
                ],
                correctIndex: 1,
            },
            {
                question: "When is a value dropped in Rust?",
                options: [
                    "When the garbage collector runs",
                    "When you call drop() explicitly",
                    "When the owner goes out of scope",
                    "At the end of the program",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Write functions that demonstrate ownership properly:

1. \`make_greeting(name: String) -> String\` — Takes ownership of a name, returns a greeting like \`"Welcome, Alice!"\`
2. \`first_word(s: &str) -> String\` — Borrows a string, returns the first word (everything before the first space, or the whole string if no space)`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_make_greeting() {
        let name = String::from("Alice");
        assert_eq!(make_greeting(name), "Welcome, Alice!");
    }

    #[test]
    fn test_make_greeting_bob() {
        assert_eq!(make_greeting(String::from("Bob")), "Welcome, Bob!");
    }

    #[test]
    fn test_first_word_with_space() {
        assert_eq!(first_word("hello world"), "hello");
    }

    #[test]
    fn test_first_word_no_space() {
        assert_eq!(first_word("hello"), "hello");
    }

    #[test]
    fn test_first_word_empty() {
        assert_eq!(first_word(""), "");
    }
}`,
        starter_code: `// Write: make_greeting(name: String) -> String
// Write: first_word(s: &str) -> String

fn main() {
    let name = String::from("Rustacean");
    let greeting = make_greeting(name);
    println!("{greeting}");

    let sentence = "hello world";
    println!("First word: {}", first_word(sentence));
}
`,
    },
    {
        id: "ch04-02",
        chapter: "4.2",
        title: "References and Borrowing",
        sort_order: 21,
        content: `# References and Borrowing

Instead of transferring ownership, you can **borrow** a value using references.

## Immutable References

\`\`\`rust
fn calculate_length(s: &String) -> usize {
    s.len()
}

fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s);
    println!("Length of '{s}' is {len}");  // ✅ s is still valid!
}
\`\`\`

## Mutable References

\`\`\`rust
fn change(s: &mut String) {
    s.push_str(", world!");
}
\`\`\`

### The Rule
You can have **either**:
- Any number of **immutable** references, OR
- Exactly **one mutable** reference

But **not both** at the same time!`,
        quiz: [
            {
                question: "How many mutable references to a value can exist at the same time?",
                options: ["Unlimited", "Two", "Exactly one", "Zero"],
                correctIndex: 2,
            },
            {
                question: "What does `&` mean in a function parameter?",
                options: [
                    "The function takes ownership",
                    "The function borrows the value (immutable reference)",
                    "The function copies the value",
                    "The function deletes the value",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write functions that use references correctly:

1. \`count_chars(s: &str) -> usize\` — Borrows a string, returns its character count
2. \`append_exclaim(s: &mut String)\` — Takes a mutable reference, appends "!" to the string
3. \`longest<'a>(a: &'a str, b: &'a str) -> &'a str\` — Returns a reference to the longer string`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_count_chars() {
        assert_eq!(count_chars("hello"), 5);
        assert_eq!(count_chars(""), 0);
    }

    #[test]
    fn test_append_exclaim() {
        let mut s = String::from("hello");
        append_exclaim(&mut s);
        assert_eq!(s, "hello!");
    }

    #[test]
    fn test_append_exclaim_twice() {
        let mut s = String::from("wow");
        append_exclaim(&mut s);
        append_exclaim(&mut s);
        assert_eq!(s, "wow!!");
    }

    #[test]
    fn test_longest_first() {
        assert_eq!(longest("longer", "short"), "longer");
    }

    #[test]
    fn test_longest_second() {
        assert_eq!(longest("hi", "hello"), "hello");
    }
}`,
        starter_code: `// Write: count_chars(s: &str) -> usize
// Write: append_exclaim(s: &mut String)
// Write: longest<'a>(a: &'a str, b: &'a str) -> &'a str

fn main() {
    let s = String::from("hello");
    println!("chars: {}", count_chars(&s));

    let mut greeting = String::from("hi");
    append_exclaim(&mut greeting);
    println!("{greeting}");

    println!("longest: {}", longest("short", "longer string"));
}
`,
    },


    {
        id: "ch04-03",
        chapter: "4.3",
        title: "The Slice Type",
        sort_order: 22,
        content: `# The Slice Type

Slices let you reference a **contiguous sequence of elements** in a collection rather than the whole collection.

## String Slices

A reference to part of a \`String\`:

\`\`\`rust
let s = String::from("hello world");
let hello = &s[0..5];
let world = &s[6..11];
\`\`\`

- \`..\` is the range syntax
- \`0..5\` includes 0, excludes 5
- \`&str\` is the type for string slices

### Range Shortcuts

\`\`\`rust
let len = s.len();
let slice = &s[0..2];
let slice = &s[..2];   // starts at 0

let slice = &s[3..len];
let slice = &s[3..];   // ends at len

let slice = &s[..];    // whole string
\`\`\`

## String Literals are Slices

\`\`\`rust
let s = "Hello, world!";
\`\`\`

The type of \`s\` is \`&str\` — it's a slice pointing to that specific point of the binary.

## Other Slices

You can slice arrays too:

\`\`\`rust
let a = [1, 2, 3, 4, 5];
let slice = &a[1..3];  // &[2, 3]
assert_eq!(slice, &[2, 3]);
\`\`\``,
        quiz: [
            {
                question: "What is the type of a string slice?",
                options: ["String", "&String", "&str", "Slice<char>"],
                correctIndex: 2,
            },
            {
                question: "Does a slice take ownership of the underlying data?",
                options: [
                    "Yes, it moves the data",
                    "No, it borrows the data",
                    "Yes, it copies the data",
                    "It depends on the type",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write functions that work with slices:

1. \`first_word(s: &str) -> &str\` — Returns the first word. If no space is found, return the whole string.
2. \`trim_ends(arr: &[i32]) -> &[i32]\` — Returns a slice of the array excluding the first and last elements. If length < 2, return an empty slice.`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_first_word_space() {
        assert_eq!(first_word("hello world"), "hello");
    }

    #[test]
    fn test_first_word_no_space() {
        assert_eq!(first_word("rust"), "rust");
    }

    #[test]
    fn test_first_word_empty() {
        assert_eq!(first_word(""), "");
    }

    #[test]
    fn test_trim_ends_normal() {
        assert_eq!(trim_ends(&[1, 2, 3, 4]), &[2, 3]);
    }

    #[test]
    fn test_trim_ends_short() {
        assert_eq!(trim_ends(&[1]), &[]);
        assert_eq!(trim_ends(&[]), &[]);
    }

    #[test]
    fn test_trim_ends_two() {
        assert_eq!(trim_ends(&[10, 20]), &[]);
    }
}`,
        starter_code: `// Write: first_word(s: &str) -> &str
// Write: trim_ends(arr: &[i32]) -> &[i32]

fn main() {
    let s = "hello world";
    println!("First word: '{}'", first_word(s));

    let a = [1, 2, 3, 4, 5];
    println!("Trimmed: {:?}", trim_ends(&a));
}
`,
    },

    // ─── Chapter 5: Using Structs ──────────────────────────────────
    {
        id: "ch05-01",
        chapter: "5.1",
        title: "Defining and Using Structs",
        sort_order: 30,
        content: `# Defining and Using Structs

Structs let you group related data together into a named type.

## Defining a Struct

\`\`\`rust
struct User {
    username: String,
    email: String,
    active: bool,
}
\`\`\`

## Creating an Instance

\`\`\`rust
let user = User {
    email: String::from("someone@example.com"),
    username: String::from("someone"),
    active: true,
};
\`\`\`

## Methods with impl

\`\`\`rust
struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }

    fn new(w: f64, h: f64) -> Self {
        Self { width: w, height: h }
    }
}
\`\`\``,
        quiz: [
            {
                question: "What keyword is used to add methods to a struct?",
                options: ["fn", "struct", "impl", "mod"],
                correctIndex: 2,
            },
            {
                question: "What does `&self` mean in a method?",
                options: [
                    "The method takes ownership of the struct",
                    "The method borrows the struct immutably",
                    "The method creates a copy of the struct",
                    "The method is static",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Create a \`Rectangle\` struct with methods:

1. \`Rectangle::new(width: f64, height: f64) -> Rectangle\` — Constructor
2. \`area(&self) -> f64\` — Returns the area
3. \`perimeter(&self) -> f64\` — Returns the perimeter
4. \`is_square(&self) -> bool\` — Returns true if width equals height
5. \`can_hold(&self, other: &Rectangle) -> bool\` — Returns true if self can contain other`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_area() {
        let r = Rectangle::new(10.0, 5.0);
        assert!((r.area() - 50.0).abs() < 0.01);
    }

    #[test]
    fn test_perimeter() {
        let r = Rectangle::new(10.0, 5.0);
        assert!((r.perimeter() - 30.0).abs() < 0.01);
    }

    #[test]
    fn test_is_square_true() {
        let r = Rectangle::new(5.0, 5.0);
        assert!(r.is_square());
    }

    #[test]
    fn test_is_square_false() {
        let r = Rectangle::new(5.0, 10.0);
        assert!(!r.is_square());
    }

    #[test]
    fn test_can_hold_true() {
        let big = Rectangle::new(10.0, 10.0);
        let small = Rectangle::new(5.0, 5.0);
        assert!(big.can_hold(&small));
    }

    #[test]
    fn test_can_hold_false() {
        let small = Rectangle::new(5.0, 5.0);
        let big = Rectangle::new(10.0, 10.0);
        assert!(!small.can_hold(&big));
    }
}`,
        starter_code: `struct Rectangle {
    width: f64,
    height: f64,
}

// Add an impl block with:
// new, area, perimeter, is_square, can_hold

fn main() {
    let r = Rectangle::new(10.0, 5.0);
    println!("Area: {}", r.area());
    println!("Perimeter: {}", r.perimeter());
    println!("Square? {}", r.is_square());
}
`,
    },

    {
        id: "ch05-03",
        chapter: "5.3",
        title: "Method Syntax",
        sort_order: 32,
        content: `# Method Syntax

## Methods vs Functions

Methods are functions defined within the context of a struct (or enum/trait object). Their first parameter is always \`self\`.

## The \`self\` arguments

| Argument | Syntax | Description |
|----------|--------|-------------|
| \`&self\`  | \`fn area(&self)\` | Borrows the struct immutably (most common) |
| \`&mut self\` | \`fn tick(&mut self)\` | Borrows the struct mutably (can change data) |
| \`self\` | \`fn consume(self)\` | Takes ownership (consumes the struct) |

## Associated Functions

Functions without \`self\` are called **associated functions**. They are often used as constructors (like \`String::from\`).

\`\`\`rust
impl Rectangle {
    // Constructor (associated function)
    fn new(size: f64) -> Self {
        Self { width: size, height: size }
    }
}
// Usage: Rectangle::new(10.0);
\`\`\`

## Multiple \`impl\` Blocks

You can split methods into multiple \`impl\` blocks for organization:

\`\`\`rust
impl Rectangle {
    fn area(&self) -> f64 { ... }
}

impl Rectangle {
    fn perimeter(&self) -> f64 { ... }
}
\`\`\``,
        quiz: [
            {
                question: "Which parameter allows a method to modify the struct instance?",
                options: ["&self", "self", "&mut self", "mut self"],
                correctIndex: 2,
            },
            {
                question: "What happens to the struct when a method takes `self`?",
                options: [
                    "It is borrowed immutably",
                    "It is borrowed mutably",
                    "It is moved (ownership is transferred)",
                    "It is copied",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Implement a \`Counter\` struct:

1. \`Counter::new(start: u32) -> Counter\` — Constructor
2. \`tick(&mut self)\` — Increments the count by 1
3. \`combine(self, other: Counter) -> Counter\` — Consumes both counters, returns a new one with the sum of their counts`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new() {
        let c = Counter::new(10);
        // We can't check fields directly if they are private, 
        // but we can check behavior if we had a getter.
        // For this exercise, we'll assume the internal state is correct if other tests pass.
    }

    #[test]
    fn test_tick() {
        let mut c = Counter::new(0);
        c.tick();
        c.tick();
        // Since we don't have a getter, we will test combine to verify values
        let c2 = Counter::new(0);
        let sum = c.combine(c2); 
        // sum should be 2 + 0 = 2
        // We need a way to verify the value. 
        // Let's rely on combine logic or add a getter requirement?
        // Let's assume combine works and define a getter for testing?
        // Or simply add a get_count method to the requirements.
    }
    
    // Revised test to be fair:
    // Let's add 'get_count(&self) -> u32' requirement to verify state.
    
    #[test]
    fn test_tick_value() {
        let mut c = Counter::new(5);
        c.tick();
        assert_eq!(c.get_count(), 6);
    }

    #[test]
    fn test_combine() {
        let c1 = Counter::new(10);
        let c2 = Counter::new(20);
        let c3 = c1.combine(c2);
        assert_eq!(c3.get_count(), 30);
    }
}
// We need to verify 'combine' consumes self. The compiler enforces this, 
// but we can't easily test "compile error" in this runner.
// We trust the signature requirement.
`,
        starter_code: `struct Counter {
    count: u32,
}

impl Counter {
    // Write: new(start: u32) -> Counter
    // Write: tick(&mut self)
    // Write: get_count(&self) -> u32
    // Write: combine(self, other: Counter) -> Counter
}

fn main() {
    let mut c = Counter::new(0);
    c.tick();
    println!("Count after tick: {}", c.get_count());

    let c2 = Counter::new(10);
    let c3 = c.combine(c2);
    println!("Combined count: {}", c3.get_count());
    // println!("{:?}", c); // Error! c was moved
}
`,
    },

    // ─── Chapter 6: Enums and Pattern Matching ─────────────────────
    {
        id: "ch06-01",
        chapter: "6.1",
        title: "Enums and match",
        sort_order: 40,
        content: `# Enums and Pattern Matching

Enums define a type by enumerating its possible **variants**.

## Defining an Enum

\`\`\`rust
enum Direction {
    North, South, East, West,
}
\`\`\`

## Enums with Data

\`\`\`rust
enum Shape {
    Circle(f64),           // radius
    Rectangle(f64, f64),   // width, height
}
\`\`\`

## The match Expression

\`\`\`rust
fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle(r) => std::f64::consts::PI * r * r,
        Shape::Rectangle(w, h) => w * h,
    }
}
\`\`\`

## Option<T>

Rust has no null. Use \`Option\` instead:

\`\`\`rust
let some_number: Option<i32> = Some(42);
let no_number: Option<i32> = None;

match some_number {
    Some(n) => println!("Got {n}"),
    None => println!("Nothing"),
}
\`\`\``,
        quiz: [
            {
                question: "Why does Rust use `Option<T>` instead of null?",
                options: [
                    "For better performance",
                    "To force you to handle the None case explicitly",
                    "Because null doesn't exist in any language",
                    "It's just a style preference",
                ],
                correctIndex: 1,
            },
            {
                question: "What does `match` require in Rust?",
                options: [
                    "At least one arm",
                    "A default case",
                    "All possible patterns must be covered (exhaustive)",
                    "Only enum types",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Create a \`Coin\` enum and work with \`Option\`:

1. Define \`enum Coin { Penny, Nickel, Dime, Quarter }\`
2. \`value_in_cents(coin: &Coin) -> u32\` — Returns the cent value using \`match\`
3. \`double_option(x: Option<i32>) -> Option<i32>\` — Doubles the value inside Some, returns None if None`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_penny() {
        assert_eq!(value_in_cents(&Coin::Penny), 1);
    }

    #[test]
    fn test_nickel() {
        assert_eq!(value_in_cents(&Coin::Nickel), 5);
    }

    #[test]
    fn test_dime() {
        assert_eq!(value_in_cents(&Coin::Dime), 10);
    }

    #[test]
    fn test_quarter() {
        assert_eq!(value_in_cents(&Coin::Quarter), 25);
    }

    #[test]
    fn test_double_some() {
        assert_eq!(double_option(Some(5)), Some(10));
    }

    #[test]
    fn test_double_none() {
        assert_eq!(double_option(None), None);
    }
}`,
        starter_code: `// Define: enum Coin { Penny, Nickel, Dime, Quarter }
// Write: value_in_cents(coin: &Coin) -> u32
// Write: double_option(x: Option<i32>) -> Option<i32>

fn main() {
    println!("Penny = {} cents", value_in_cents(&Coin::Penny));
    println!("Quarter = {} cents", value_in_cents(&Coin::Quarter));
    println!("double Some(5) = {:?}", double_option(Some(5)));
    println!("double None = {:?}", double_option(None));
}
`,
    },
    {
        id: "ch06-02",
        chapter: "6.2",
        title: "The if let Syntax",
        sort_order: 41,
        content: `# The if let Syntax

Sometimes \`match\` is too verbose when you only care about **one** pattern.

## The Syntax

\`\`\`rust
let config_max = Some(3u8);
if let Some(max) = config_max {
    println!("The maximum is configured to be {}", max);
}
\`\`\`

This is the same as:

\`\`\`rust
match config_max {
    Some(max) => println!("The maximum is configured to be {}", max),
    _ => (),
}
\`\`\`

## else

You can include an \`else\` block:

\`\`\`rust
if let Some(i) = number {
    println!("Matched {:?}!", i);
} else {
    println!("No match!");
}
\`\`\``,
        quiz: [
            {
                question: "When is `if let` preferred over `match`?",
                options: [
                    "When you want to handle all possible cases",
                    "When you only care about one pattern and want to ignore others",
                    "When checking for errors",
                    "It is never preferred, just an alternative",
                ],
                correctIndex: 1,
            },
            {
                question: "Does `if let` enforce exhaustiveness checking?",
                options: [
                    "Yes, like match",
                    "No, it only checks the specified pattern",
                    "Only if you add an else block",
                    "Yes, at runtime",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write a function that handles configuration:

1. \`get_config(config: Option<u32>) -> u32\` — If the config is \`Some(x)\`, return x. If it is \`None\`, return 100 (default). Use \`if let\` (or \`match\`, but \`if let\` is cleaner here).`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_config_some() {
        assert_eq!(get_config(Some(50)), 50);
    }

    #[test]
    fn test_config_none() {
        assert_eq!(get_config(None), 100);
    }
}`,
        starter_code: `// Write: get_config(config: Option<u32>) -> u32
// If config is Some(x), return x
// If config is None, return 100
// Try using 'if let'!

fn main() {
    let defined = Some(10);
    let default = None;
    
    println!("Defined: {}", get_config(defined));
    println!("Default: {}", get_config(default));
}
`,
    },
    {
        id: "ch06-03",
        chapter: "6.3",
        title: "Advanced Match",
        sort_order: 42,
        content: `# Advanced Match

Rust's \`match\` is extremely powerful.

## Catch-all Pattern

The \`_\` pattern matches any value and does not bind it.

\`\`\`rust
let dice_roll = 9;
match dice_roll {
    3 => add_fancy_hat(),
    7 => remove_fancy_hat(),
    _ => reroll(),
}
\`\`\`

## Multiple Patterns

Use \`|\` to match multiple patterns:

\`\`\`rust
let x = 1;
match x {
    1 | 2 => println!("One or Two"),
    3 => println!("Three"),
    _ => println!("Other"),
}
\`\`\`

## Matching Ranges

\`\`\`rust
let x = 5;
match x {
    1..=5 => println!("One through Five"),
    _ => println!("Something else"),
}
\`\`\`

## Match Guards

A **match guard** is an extra \`if\` condition:

\`\`\`rust
let pair = Some(4);
match pair {
    Some(x) if x < 5 => println!("Less than five: {}", x),
    Some(x) => println!("{}", x),
    None => (),
}
\`\`\``,
        quiz: [
            {
                question: "Which symbol is used for the catch-all pattern?",
                options: ["*", "default", "_", "all"],
                correctIndex: 2,
            },
            {
                question: "What separates multiple patterns in a single arm?",
                options: [",", "||", "|", "or"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Write a function \`decide_action(n: i32) -> &'static str\` that implements these rules:

1. If \`n\` is 0, return \`"Stop"\`
2. If \`n\` is 1 or 2, return \`"Go"\`
3. If \`n\` is between 3 and 9 (inclusive), return \`"Caution"\`
4. If \`n\` is greater than 100 (use a guard!), return \`"Teleport"\`
5. For anything else, return \`"Unknown"\``,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_stop() {
        assert_eq!(decide_action(0), "Stop");
    }

    #[test]
    fn test_go() {
        assert_eq!(decide_action(1), "Go");
        assert_eq!(decide_action(2), "Go");
    }

    #[test]
    fn test_caution() {
        assert_eq!(decide_action(3), "Caution");
        assert_eq!(decide_action(5), "Caution");
        assert_eq!(decide_action(9), "Caution");
    }

    #[test]
    fn test_teleport() {
        assert_eq!(decide_action(101), "Teleport");
        assert_eq!(decide_action(1000), "Teleport");
    }

    #[test]
    fn test_unknown() {
        assert_eq!(decide_action(10), "Unknown");
        assert_eq!(decide_action(-1), "Unknown");
        assert_eq!(decide_action(100), "Unknown");
    }
}`,
        starter_code: `// Write: decide_action(n: i32) -> &'static str
// 0 -> "Stop"
// 1 | 2 -> "Go"
// 3..=9 -> "Caution"
// x if x > 100 -> "Teleport"
// _ -> "Unknown"

fn main() {
    println!("0: {}", decide_action(0));
    println!("1: {}", decide_action(1));
    println!("5: {}", decide_action(5));
    println!("150: {}", decide_action(150));
    println!("50: {}", decide_action(50));
}
`,
    },
];

export function getAllLessons(): Lesson[] {
    return [...lessons].sort((a, b) => a.sort_order - b.sort_order);
}

export function getLesson(id: string): Lesson | null {
    return lessons.find((l) => l.id === id) || null;
}

export function getFirstLesson(): Lesson | null {
    const sorted = getAllLessons();
    return sorted[0] || null;
}
