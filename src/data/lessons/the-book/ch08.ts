import { Lesson } from "../../types";

export const ch08Lessons: Lesson[] = [
    {
        id: "ch08-01",
        chapter: "8.1",
        title: "Vectors",
        sort_order: 60,
        environment: "browser",
        content: `# Vectors

A **Vector** (_BT_Vec<T>_BT_) is a growable array. Unlike arrays (_BT_[T; N]_BT_), vectors store their data on the **heap**, meaning they can grow and shrink at runtime.

## Creating a Vector

_BT__BT__BT_rust
let v: Vec<i32> = Vec::new(); // Explicit type
let v = vec![1, 2, 3];        // Macro (inferred type)
_BT__BT__BT_

## Updating

_BT__BT__BT_rust
let mut v = Vec::new();
v.push(5);
v.push(6);
v.pop(); // Returns Option<T>
_BT__BT__BT_

## Reading Elements

You have two ways to access elements:

1. **Indexing (_BT_&v[i]_BT_)**: Panics if out of bounds. Use when you are certain the index exists.
2. **_BT_.get(i)_BT_**: Returns _BT_Option<&T>_BT_. Returns _BT_None_BT_ if out of bounds. Safest choice.

_BT__BT__BT_rust
let v = vec![1, 2, 3];
// let does_not_exist = &v[100]; // ❌ Panics!
let does_not_exist = v.get(100); // ✅ Returns None
_BT__BT__BT_

## Iterating

_BT__BT__BT_rust
let mut v = vec![100, 32, 57];
for i in &mut v {
    *i += 50; // Dereference to modify
}
_BT__BT__BT_

## ⚠️ Common Mistakes

1. **Modifying while iterating** — You can't start iterating (borrowing) and then push/pop (modify) the vector inside the loop. Rust prevents this to avoid iterator invalidation.
2. **Indexing blindly** — Always prefer _BT_.get()_BT_ if the index comes from user input.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Where do Vectors store their data?",
                options: ["Stack", "Heap", "Global memory", "Disk"],
                correctIndex: 1,
            },
            {
                question: "Which method is safer for accessing elements: `[]` or `.get()`?",
                options: ["[] is safer", ".get() is safer", "They are creating equally safe", "Neither is safe"],
                correctIndex: 1,
            },
            {
                question: "Can different elements of a Vector have different types?",
                options: ["Yes, always", "No, vectors are homogeneous", "Yes, if you use `Any`", "Only in unsafe blocks"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write a function _BT_sum_vectors(v1: &Vec<i32>, v2: &Vec<i32>) -> Vec<i32>_BT_.

1. It should return a NEW vector.
2. The i-th element of the result should be _BT_v1[i] + v2[i]_BT_.
3. If one vector is longer, ignore the extra elements (stop at the length of the shorter one).

Example:
_BT_v1 = [1, 2, 3]_BT_
_BT_v2 = [4, 5]_BT_
Result: _BT_[5, 7]_BT_`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sum_vectors_equal() {
        let v1 = vec![1, 2, 3];
        let v2 = vec![10, 20, 30];
        assert_eq!(sum_vectors(&v1, &v2), vec![11, 22, 33]);
    }

    #[test]
    fn test_sum_vectors_diff() {
        let v1 = vec![1, 2];
        let v2 = vec![10, 20, 30];
        assert_eq!(sum_vectors(&v1, &v2), vec![11, 22]);
    }
}`,
        starter_code: `// Write: sum_vectors(v1: &Vec<i32>, v2: &Vec<i32>) -> Vec<i32>
// Use Iterator::zip inside a loop or collect? Or just a simple index loop.

fn main() {
    let v1 = vec![1, 2, 3];
    let v2 = vec![4, 5, 6];
    let sum = sum_vectors(&v1, &v2);
    println!("Sum: {:?}", sum);
}
`,
    },
    {
        id: "ch08-02",
        chapter: "8.2",
        title: "Strings",
        sort_order: 61,
        environment: "browser",
        content: `# Strings

Strings found in other languages are often simple, but in Rust, they are complex because **UTF-8 is complex**.

## String vs &str

- **_BT_String_BT_**: A growable, mutable, owned, UTF-8 encoded string buffer. (Like _BT_Vec<u8>_BT_).
- **_BT_&str_BT_**: A "String Slice". A view into string data (often string literals). Immutable.

## Creating Strings

_BT__BT__BT_rust
let s1 = String::new();
let s2 = "initial content".to_string();
let s3 = String::from("initial content");
_BT__BT__BT_

## Updating Strings

_BT__BT__BT_rust
let mut s = String::from("foo");
s.push_str("bar"); // "foobar"
s.push('!');       // "foobar!"
_BT__BT__BT_

## Concatenation

_BT__BT__BT_rust
let s1 = String::from("Hello, ");
let s2 = String::from("world!");
let s3 = s1 + &s2; // s1 is MOVED and cannot be used
_BT__BT__BT_

Why pass _BT_&s2_BT_? Because the _BT_+_BT_ operator calls method _BT_add(self, other: &str)_BT_. It takes ownership of the first string and appends a copy of the second.

## Indexing

**You cannot access characters by index in Rust.**
_BT_s[0]_BT_ is a compile error. Why? Because some characters take 1 byte, some take 4 bytes. _BT_[0]_BT_ implies O(1) access and returning a "character", but byte 0 might not be a valid char on its own.

## ⚠️ Common Mistakes

1. **Trying to index a String** — Use _BT_.chars()_BT_ iterator instead.
2. **Confusing String and &str** — Use _BT_&str_BT_ for function arguments usually.
3. **Forgetting that _BT_+_BT_ consumes the left operand**.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Can you index a string like `s[0]`?",
                options: ["Yes, always", "No, never", "Only if it's ASCII", "Yes, but it returns a byte"],
                correctIndex: 1,
            },
            {
                question: "What is `String` essentially a wrapper around?",
                options: ["Vec<char>", "Vec<u8>", "LinkedList<char>", "Box<str>"],
                correctIndex: 1,
            },
            {
                question: "Which type is growable?",
                options: ["&str", "str", "String", "char"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Write a function _BT_make_excited(s: &str) -> String_BT_.

1. Convert the input slice to an owned _BT_String_BT_.
2. Append the string _BT_"!!"_BT_ to it.
3. Return the result.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_make_excited() {
        assert_eq!(make_excited("hello"), "hello!!");
    }

    #[test]
    fn test_make_excited_empty() {
        assert_eq!(make_excited(""), "!!");
    }
}`,
        starter_code: `// Write: make_excited(s: &str) -> String

fn main() {
    let s = "hello";
    let excited = make_excited(s);
    println!("{}", excited);
}
`,
    },
    {
        id: "ch08-03",
        chapter: "8.3",
        title: "Hash Maps",
        sort_order: 62,
        environment: "browser",
        content: `# Hash Maps

_BT_HashMap<K, V>_BT_ stores a mapping of keys to values. It uses a **hashing function** to store keys, meaning access is very fast (O(1) on average).

## Creating and Updating

_BT__BT__BT_rust
use std::collections::HashMap;

let mut scores = HashMap::new();
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);
_BT__BT__BT_

Note: Like vectors, hash maps store their data on the heap.

## Entry API

A common pattern is "insert if not present". Rust has a beautiful API for this:

_BT__BT__BT_rust
scores.entry(String::from("Blue")).or_insert(50);
_BT__BT__BT_

This line says: "Get the entry for 'Blue'. If it exists, return a reference to it. If not, insert 50 and return a reference to that."

## Iterating

_BT__BT__BT_rust
for (key, value) in &scores {
    println!("{key}: {value}");
}
_BT__BT__BT_

Iteration order is **arbitrary**! Don't rely on it.

## ⚠️ Common Mistakes

1. **Forgetting to import** — _BT_HashMap_BT_ is not in the prelude. You must _BT_use std::collections::HashMap_BT_.
2. **Ownership** — For types like String, keys and values are MOVED into the hash map. You can't use them afterwards unless you cloned them.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Is HashMap included in the standard prelude?",
                options: ["Yes", "No, you must import it", "Only in Rust 2021", "Yes, but under a different name"],
                correctIndex: 1,
            },
            {
                question: "What happens if you insert a key that already exists?",
                options: [
                    "It panics",
                    "It keeps the old value",
                    "It overwrites the old value",
                    "It adds a second entry",
                ],
                correctIndex: 2,
            },
            {
                question: "What does `or_insert(v)` do?",
                options: [
                    "Inserts v even if key exists",
                    "Inserts v only if key is MISSING",
                    "Returns v always",
                    "Deletes the key",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write a function _BT_word_frequencies(text: &str) -> HashMap<String, u32>_BT_.

1. Convert the text to lowercase.
2. Split it into words (whitespace).
3. Count the frequency of each word.

Example: "Hello hello world" -> {"hello": 2, "world": 1}

Hint: Use _BT_.entry(word).or_insert(0)_BT_ and dereference the result to increment it!`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    #[test]
    fn test_word_frequencies() {
        let text = "Hello hello world";
        let map = word_frequencies(text);
        assert_eq!(map.get("hello"), Some(&2));
        assert_eq!(map.get("world"), Some(&1));
    }
}`,
        starter_code: `use std::collections::HashMap;

// Write: word_frequencies(text: &str) -> HashMap<String, u32>

fn main() {
    let text = "Hello world hello";
    let map = word_frequencies(text);
    println!("{:?}", map);
}
`,
    },
];
