import { Lesson } from "../../types";

export const ch04Lessons: Lesson[] = [
    {
        id: "ch04-01",
        chapter: "4.1",
        title: "What is Ownership?",
        sort_order: 40,
        environment: "browser",
        content: `# What is Ownership?

Ownership is Rust's most unique feature and the key to its memory safety guarantees. If you understand ownership, the rest of Rust clicks into place.

## The Problem Ownership Solves

In most languages, you manage memory in one of two ways:
- **Garbage collection** (Java, Python, Go) — A runtime periodically scans for unused memory. Safe, but adds overhead and unpredictable pauses.
- **Manual management** (C, C++) — You call _BT_malloc_BT_ and _BT_free_BT_ yourself. Fast, but infamous for bugs: use-after-free, double-free, memory leaks.

Rust invents a **third way**: the compiler tracks who "owns" each piece of data and automatically frees it when the owner goes out of scope. Zero overhead. Zero runtime. Zero bugs (if it compiles, it's correct).

## The Three Rules of Ownership

Memorize these — they're the foundation of everything:

1. **Each value in Rust has exactly one owner.**
2. **There can only be one owner at a time.**
3. **When the owner goes out of scope, the value is dropped (freed).**

## The Analogy: Ownership = Having a Library Book

Think of each value as a **library book**:
- Only one person can check it out at a time (one owner)
- You can lend it to someone (borrowing — Chapter 4.2)
- When your borrowing period is up (scope ends), the book is returned (dropped)

## Stack vs Heap

Understanding ownership requires knowing where data lives:

| | Stack | Heap |
|---|---|---|
| **Speed** | Very fast | Slower |
| **Size** | Known at compile time | Dynamic |
| **Examples** | _BT_i32_BT_, _BT_bool_BT_, _BT_f64_BT_ | _BT_String_BT_, _BT_Vec_BT_ |
| **Copy behavior** | Cheap copy | Move (transfer ownership) |

## Move Semantics

This is where Rust differs from other languages. When you assign one variable to another:

_BT__BT__BT_rust
let s1 = String::from("hello");
let s2 = s1;  // s1 is MOVED to s2

// println!("{}", s1); ❌ Error! s1 is no longer valid
println!("{}", s2);    // ✅ s2 owns the string now
_BT__BT__BT_

For stack types (integers, bools, etc.), Rust **copies** instead of moving:
_BT__BT__BT_rust
let x = 5;
let y = x;     // x is COPIED (not moved)
println!("{x} {y}"); // ✅ Both are valid!
_BT__BT__BT_

The difference: stack values implement the _BT_Copy_BT_ trait. Heap values don't — they use **move semantics** by default.

## The _BT_clone()_BT_ Method

If you DO want a deep copy of heap data, use _BT_.clone()_BT_:

_BT__BT__BT_rust
let s1 = String::from("hello");
let s2 = s1.clone();  // Deep copy — both are valid
println!("{s1} {s2}"); // ✅
_BT__BT__BT_

_BT_.clone()_BT_ is explicit because deep copies can be expensive. Rust makes you opt in.

## Ownership and Functions

Passing a value to a function **transfers ownership**, just like assigning to a variable:

_BT__BT__BT_rust
fn takes_ownership(s: String) {
    println!("{}", s);
} // s is dropped here

fn main() {
    let s = String::from("hello");
    takes_ownership(s);
    // println!("{}", s); ❌ s was moved!
}
_BT__BT__BT_

## ⚠️ Common Mistakes

1. **Using a value after it's been moved** — The compiler will tell you "value used here after move."
2. **Unnecessary cloning** — Beginners often sprinkle _BT_.clone()_BT_ everywhere. Usually, borrowing (Chapter 4.2) is better.
3. **Expecting assignment to copy Strings** — _BT_let s2 = s1_BT_ moves the String, not copies. Only primitive types copy.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "How many owners can a value have at a time?",
                options: ["As many as needed", "Two", "Exactly one", "Zero or one"],
                correctIndex: 2,
            },
            {
                question: "What happens when a variable goes out of scope?",
                options: [
                    "Nothing — memory stays allocated",
                    "The garbage collector cleans it up",
                    "The value is dropped (memory is freed)",
                    "The value becomes null",
                ],
                correctIndex: 2,
            },
            {
                question: "What happens with _BT_let s2 = s1;_BT_ when _BT_s1_BT_ is a _BT_String_BT_?".replace(/_BT_/g, '`'),
                options: [
                    "s1 is copied to s2 (both valid)",
                    "s1 is moved to s2 (s1 is no longer valid)",
                    "s1 and s2 share the same data",
                    "It causes a runtime error",
                ],
                correctIndex: 1,
            },
            {
                question: "Which types implement the _BT_Copy_BT_ trait (are copied instead of moved)?".replace(/_BT_/g, '`'),
                options: [
                    "String and Vec",
                    "All types by default",
                    "Simple stack types like i32, bool, f64",
                    "Only references",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1. _BT_take_and_return(s: String) -> String_BT_ — Takes ownership of a String, prints it, then returns it back to the caller
2. _BT_make_greeting(name: &str) -> String_BT_ — Creates and returns a new _BT_String_BT_ with the greeting _BT_"Hello, {name}!"_BT_
3. _BT_clone_and_modify(s: &str) -> String_BT_ — Creates a _BT_String_BT_ from the given _BT_&str_BT_, appends _BT_" (modified)"_BT_, and returns it

### Key insight: Notice how returning a _BT_String_BT_ transfers ownership back to the caller!`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_take_and_return() {
        let s = String::from("hello");
        let s2 = take_and_return(s);
        assert_eq!(s2, "hello");
    }

    #[test]
    fn test_take_and_return_empty() {
        let s = String::from("");
        let s2 = take_and_return(s);
        assert_eq!(s2, "");
    }

    #[test]
    fn test_make_greeting() {
        assert_eq!(make_greeting("World"), "Hello, World!");
    }

    #[test]
    fn test_make_greeting_name() {
        assert_eq!(make_greeting("Rustacean"), "Hello, Rustacean!");
    }

    #[test]
    fn test_clone_and_modify() {
        assert_eq!(clone_and_modify("original"), "original (modified)");
    }

    #[test]
    fn test_clone_and_modify_empty() {
        assert_eq!(clone_and_modify(""), " (modified)");
    }
}`,
        starter_code: `// Write: take_and_return(s: String) -> String
// Write: make_greeting(name: &str) -> String
// Write: clone_and_modify(s: &str) -> String

fn main() {
    let s = String::from("hello");
    let s = take_and_return(s); // s is still valid because we got it back!
    println!("{}", s);

    let greeting = make_greeting("World");
    println!("{}", greeting);

    println!("{}", clone_and_modify("original"));
}
`,
    },
    {
        id: "ch04-02",
        chapter: "4.2",
        title: "References and Borrowing",
        sort_order: 41,
        environment: "browser",
        content: `# References and Borrowing

Always transferring ownership is tedious. What if you want to let a function *look at* data without taking it away? That's what **borrowing** is for.

## The Analogy

Back to our library book analogy:
- **Moving** = giving someone your book permanently
- **Borrowing (_BT_&_BT_)** = letting someone read your book, but they have to give it back
- **Mutable borrowing (_BT_&mut_BT_)** = letting someone read AND write notes in your book

## Immutable References (_BT_&_BT_)

A reference lets you refer to a value **without taking ownership**:

_BT__BT__BT_rust
fn calculate_length(s: &String) -> usize {
    s.len()
} // s goes out of scope, but it doesn't own the String, so nothing is dropped

fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);  // Pass a reference
    println!("{s1} has length {len}"); // ✅ s1 is still valid!
}
_BT__BT__BT_

The _BT_&_BT_ creates a reference. The function **borrows** the value — it can read it but not modify it.

## Mutable References (_BT_&mut_BT_)

To modify borrowed data, use a mutable reference:

_BT__BT__BT_rust
fn add_world(s: &mut String) {
    s.push_str(", world!");
}

fn main() {
    let mut s = String::from("hello");
    add_world(&mut s);
    println!("{s}"); // "hello, world!"
}
_BT__BT__BT_

## The Rules of References

These rules are enforced at **compile time**:

1. **You can have EITHER:**
   - Any number of immutable references (_BT_&T_BT_), OR
   - Exactly one mutable reference (_BT_&mut T_BT_)
   — but **not both** at the same time.

2. **References must always be valid** (no dangling references).

### Why these rules?

They prevent **data races** at compile time! A data race occurs when:
- Two pointers access the same data simultaneously
- At least one is writing
- There's no synchronization

Rust's reference rules make data races **impossible**. This is a big deal — data races are among the hardest bugs to debug in other languages.

## ⚠️ Common Mistakes

1. **Trying to modify through an immutable reference** — You need _BT_&mut_BT_, not just _BT_&_BT_.
2. **Having a mutable and immutable reference at the same time** — The compiler won't allow it.
3. **Returning a reference to local data** — A function can't return a reference to a value created inside it (it would be a dangling reference).`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What does the _BT_&_BT_ symbol create?".replace(/_BT_/g, '`'),
                options: [
                    "A copy of the value",
                    "A reference (borrow) to the value",
                    "A pointer that owns the value",
                    "A new variable",
                ],
                correctIndex: 1,
            },
            {
                question: "Can you have a mutable and immutable reference to the same data at the same time?",
                options: [
                    "Yes, always",
                    "Yes, but only in unsafe code",
                    "No — the compiler prevents this",
                    "Yes, but only in single-threaded code",
                ],
                correctIndex: 2,
            },
            {
                question: "What problem do Rust's borrowing rules prevent?",
                options: [
                    "Memory leaks",
                    "Data races",
                    "Stack overflows",
                    "Type mismatches",
                ],
                correctIndex: 1,
            },
            {
                question: "What happens when a reference goes out of scope?",
                options: [
                    "The referenced data is freed",
                    "Nothing — the reference doesn't own the data",
                    "The program panics",
                    "The data becomes null",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. _BT_string_length(s: &String) -> usize_BT_ — Returns the length of a borrowed String
2. _BT_append_exclamation(s: &mut String)_BT_ — Appends _BT_"!"_BT_ to the end of a mutably borrowed String (returns nothing)
3. _BT_first_word_length(s: &str) -> usize_BT_ — Returns the length of the first word (characters before the first space, or the whole string if no spaces)

### Key insight: Functions 1 and 3 borrow immutably. Function 2 borrows mutably.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_string_length() {
        let s = String::from("hello");
        assert_eq!(string_length(&s), 5);
    }

    #[test]
    fn test_string_length_empty() {
        let s = String::from("");
        assert_eq!(string_length(&s), 0);
    }

    #[test]
    fn test_append_exclamation() {
        let mut s = String::from("hello");
        append_exclamation(&mut s);
        assert_eq!(s, "hello!");
    }

    #[test]
    fn test_append_exclamation_multiple() {
        let mut s = String::from("wow");
        append_exclamation(&mut s);
        append_exclamation(&mut s);
        assert_eq!(s, "wow!!");
    }

    #[test]
    fn test_first_word_length() {
        assert_eq!(first_word_length("hello world"), 5);
    }

    #[test]
    fn test_first_word_length_single() {
        assert_eq!(first_word_length("hello"), 5);
    }

    #[test]
    fn test_first_word_length_empty() {
        assert_eq!(first_word_length(""), 0);
    }
}`,
        starter_code: `// Write: string_length(s: &String) -> usize
// Write: append_exclamation(s: &mut String)
// Write: first_word_length(s: &str) -> usize

fn main() {
    let mut s = String::from("hello world");
    println!("Length: {}", string_length(&s));

    append_exclamation(&mut s);
    println!("After append: {}", s);

    println!("First word length: {}", first_word_length("hello world"));
}
`,
    },
    {
        id: "ch04-03",
        chapter: "4.3",
        title: "The Slice Type",
        sort_order: 42,
        environment: "browser",
        content: `# The Slice Type

Slices let you reference a **contiguous section** of a collection rather than the whole thing. They're one of Rust's most useful features.

## Why Slices?

Imagine you want to get the first word of a string. Without slices, you'd need to track the start and end indices manually — error-prone and fragile. Slices give you a **safe window** into data.

## String Slices (_BT_&str_BT_)

A string slice is a reference to a portion of a _BT_String_BT_:

_BT__BT__BT_rust
let s = String::from("hello world");

let hello = &s[0..5];   // "hello"
let world = &s[6..11];  // "world"

// Shorthand:
let hello = &s[..5];    // From the start
let world = &s[6..];    // To the end
let whole = &s[..];     // The entire string
_BT__BT__BT_

The type _BT_&str_BT_ (pronounced "string slice") is a reference to a sequence of UTF-8 bytes in memory.

## _BT_&str_BT_ vs _BT_&String_BT_

This is a critical distinction:
- _BT_&String_BT_ — a reference to a _BT_String_BT_ object (which owns heap data)
- _BT_&str_BT_ — a reference to a sequence of characters (more flexible)

**Best practice**: Write functions that accept _BT_&str_BT_ instead of _BT_&String_BT_. A _BT_&str_BT_ can accept both:

_BT__BT__BT_rust
fn first_word(s: &str) -> &str { // Accepts &String AND &str!
    let bytes = s.as_bytes();
    for (i, &byte) in bytes.iter().enumerate() {
        if byte == b' ' {
            return &s[..i];
        }
    }
    s
}
_BT__BT__BT_

## Array Slices

Slices work on any contiguous collection:

_BT__BT__BT_rust
let a = [1, 2, 3, 4, 5];
let slice = &a[1..3]; // [2, 3], type: &[i32]
_BT__BT__BT_

## 🌍 Real-World Usage

Slices are everywhere in Rust:
- Parsing text (get a substring without allocating)
- Working with byte buffers (network packets, file I/O)
- Passing parts of arrays to functions efficiently

## ⚠️ Common Mistakes

1. **Slicing at non-UTF-8 boundaries** — Rust panics if you slice in the middle of a multi-byte character. Use _BT_.char_indices()_BT_ for safety.
2. **Confusing _BT_&str_BT_ with _BT_String_BT_** — _BT_&str_BT_ is a borrowed view; _BT_String_BT_ is an owned heap allocation.
3. **Thinking slices copy data** — They don't! A slice is just a pointer + length. No data is copied.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What type is a string slice?",
                options: ["String", "&String", "&str", "str"],
                correctIndex: 2,
            },
            {
                question: "Does a slice copy the underlying data?",
                options: [
                    "Yes, it creates a new copy",
                    "No, it's just a reference with a length",
                    "Only for small data",
                    "It depends on the type",
                ],
                correctIndex: 1,
            },
            {
                question: "Why is _BT_&str_BT_ preferred over _BT_&String_BT_ in function parameters?".replace(/_BT_/g, '`'),
                options: [
                    "&str is faster",
                    "&str can accept both &String and &str, making the function more flexible",
                    "&String is deprecated",
                    "There is no difference",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. _BT_first_word(s: &str) -> &str_BT_ — Returns the first word (up to the first space, or the entire string if no spaces)
2. _BT_count_words(s: &str) -> usize_BT_ — Counts the number of words (space-separated) in a string. An empty string has 0 words.
3. _BT_slice_sum(arr: &[i32]) -> i32_BT_ — Returns the sum of all elements in a slice`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_first_word_basic() {
        assert_eq!(first_word("hello world"), "hello");
    }

    #[test]
    fn test_first_word_single() {
        assert_eq!(first_word("hello"), "hello");
    }

    #[test]
    fn test_first_word_empty() {
        assert_eq!(first_word(""), "");
    }

    #[test]
    fn test_first_word_leading_space() {
        assert_eq!(first_word(" hello"), "");
    }

    #[test]
    fn test_count_words() {
        assert_eq!(count_words("hello world foo"), 3);
    }

    #[test]
    fn test_count_words_single() {
        assert_eq!(count_words("hello"), 1);
    }

    #[test]
    fn test_count_words_empty() {
        assert_eq!(count_words(""), 0);
    }

    #[test]
    fn test_slice_sum() {
        assert_eq!(slice_sum(&[1, 2, 3, 4, 5]), 15);
    }

    #[test]
    fn test_slice_sum_empty() {
        assert_eq!(slice_sum(&[]), 0);
    }

    #[test]
    fn test_slice_sum_negative() {
        assert_eq!(slice_sum(&[-1, -2, 3]), 0);
    }
}`,
        starter_code: `// Write: first_word(s: &str) -> &str
//   Hint: use s.find(' ') which returns Option<usize>
// Write: count_words(s: &str) -> usize
// Write: slice_sum(arr: &[i32]) -> i32

fn main() {
    let s = "hello world foo";
    println!("First word: '{}'", first_word(s));
    println!("Word count: {}", count_words(s));
    println!("Sum: {}", slice_sum(&[1, 2, 3, 4, 5]));
}
`,
    },
];
