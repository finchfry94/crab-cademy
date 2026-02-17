import { Lesson } from "../../types";

export const ch04Lessons: Lesson[] = [
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

_BT__BT__BT_rust
let s1 = String::from("hello");
let s2 = s1;  // s1 is MOVED to s2
// println!("{s1}");  // ❌ Error! s1 is no longer valid
println!("{s2}");    // ✅ This works
_BT__BT__BT_

## Clone (Deep Copy)

_BT__BT__BT_rust
let s1 = String::from("hello");
let s2 = s1.clone();  // deep copy
println!("{s1} and {s2}");  // ✅ Both valid!
_BT__BT__BT_

## Ownership and Functions

Passing a value to a function **moves** it:

_BT__BT__BT_rust
fn takes_ownership(s: String) {
    println!("{s}");
} // s is dropped here
_BT__BT__BT_`.replace(/_BT_/g, '`'),
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

1. _BT_make_greeting(name: String) -> String_BT_ — Takes ownership of a name, returns a greeting like _BT_"Welcome, Alice!"_BT_
2. _BT_first_word(s: &str) -> String_BT_ — Borrows a string, returns the first word (everything before the first space, or the whole string if no space)`.replace(/_BT_/g, '`'),
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

_BT__BT__BT_rust
fn calculate_length(s: &String) -> usize {
    s.len()
}

fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s);
    println!("Length of '{s}' is {len}");  // ✅ s is still valid!
}
_BT__BT__BT_

## Mutable References

_BT__BT__BT_rust
fn change(s: &mut String) {
    s.push_str(", world!");
}
_BT__BT__BT_

### The Rule
You can have **either**:
- Any number of **immutable** references, OR
- Exactly **one mutable** reference

But **not both** at the same time!`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "How many mutable references to a value can exist at the same time?",
                options: ["Unlimited", "Two", "Exactly one", "Zero"],
                correctIndex: 2,
            },
            {
                question: "What does _BT_&_BT_ mean in a function parameter?".replace(/_BT_/g, '`'),
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

1. _BT_count_chars(s: &str) -> usize_BT_ — Borrows a string, returns its character count
2. _BT_append_exclaim(s: &mut String)_BT_ — Takes a mutable reference, appends "!" to the string
3. _BT_longest<'a>(a: &'a str, b: &'a str) -> &'a str_BT_ — Returns a reference to the longer string`.replace(/_BT_/g, '`'),
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

A reference to part of a _BT_String_BT_:

_BT__BT__BT_rust
let s = String::from("hello world");
let hello = &s[0..5];
let world = &s[6..11];
_BT__BT__BT_

- _BT_.._BT_ is the range syntax
- _BT_0..5_BT_ includes 0, excludes 5
- _BT_&str_BT_ is the type for string slices

### Range Shortcuts

_BT__BT__BT_rust
let len = s.len();
let slice = &s[0..2];
let slice = &s[..2];   // starts at 0

let slice = &s[3..len];
let slice = &s[3..];   // ends at len

let slice = &s[..];    // whole string
_BT__BT__BT_

## String Literals are Slices

_BT__BT__BT_rust
let s = "Hello, world!";
_BT__BT__BT_

The type of _BT_s_BT_ is _BT_&str_BT_ — it's a slice pointing to that specific point of the binary.

## Other Slices

You can slice arrays too:

_BT__BT__BT_rust
let a = [1, 2, 3, 4, 5];
let slice = &a[1..3];  // &[2, 3]
assert_eq!(slice, &[2, 3]);
_BT__BT__BT_`.replace(/_BT_/g, '`'),
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

1. _BT_first_word(s: &str) -> &str_BT_ — Returns the first word. If no space is found, return the whole string.
2. _BT_trim_ends(arr: &[i32]) -> &[i32]_BT_ — Returns a slice of the array excluding the first and last elements. If length < 2, return an empty slice.`.replace(/_BT_/g, '`'),
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
];
