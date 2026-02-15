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
