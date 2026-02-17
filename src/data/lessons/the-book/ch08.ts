import { Lesson } from "../../types";

export const ch08Lessons: Lesson[] = [
    {
        id: "ch08-01",
        chapter: "8.1",
        title: "Vectors",
        sort_order: 60,
        content: `# Vectors

Vectors (_BT_Vec<T>_BT_) allow you to store more than one value in a single data structure that puts all the values next to each other in memory.

## Creating a Vector

_BT__BT__BT_rust
let v: Vec<i32> = Vec::new();
let v = vec![1, 2, 3]; // Macro shortcut
_BT__BT__BT_

## Updating a Vector

_BT__BT__BT_rust
let mut v = Vec::new();
v.push(5);
v.push(6);
v.push(7);
_BT__BT__BT_

## Reading Elements

You can use indexing syntax or the _BT_get_BT_ method:

_BT__BT__BT_rust
let v = vec![1, 2, 3, 4, 5];

let third: &i32 = &v[2]; // Panics if out of bounds
println!("The third element is {}", third);

match v.get(2) {
    Some(third) => println!("The third element is {}", third),
    None => println!("There is no third element."),
}
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What macro is used to create a vector with initial values?",
                options: ["Vec!", "array!", "vec!", "list!"],
                correctIndex: 2,
            },
            {
                question: "What happens if you access a vector index that is out of bounds using _BT_[]_BT_ syntax?".replace(/_BT_/g, '`'),
                options: [
                    "It returns None",
                    "It returns 0",
                    "The program panics (crashes)",
                    "It compiles but warns",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1. Create a function _BT_sum_vectors(v1: &Vec<i32>, v2: &Vec<i32>) -> Vec<i32>_BT_.
2. It should return a new vector where each element is the sum of elements at the same position.
3. If vectors have different lengths, stop at the shorter length.

Example: _BT_sum_vectors(&vec![1, 2], &vec![3, 4, 5])_BT_ -> _BT_vec![4, 6]_BT_`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sum_vectors_equal_length() {
        let v1 = vec![1, 2, 3];
        let v2 = vec![4, 5, 6];
        assert_eq!(sum_vectors(&v1, &v2), vec![5, 7, 9]);
    }

    #[test]
    fn test_sum_vectors_diff_length() {
        let v1 = vec![1, 2];
        let v2 = vec![3, 4, 5];
        assert_eq!(sum_vectors(&v1, &v2), vec![4, 6]);
    }
    
    #[test]
    fn test_sum_vectors_one_empty() {
        let v1 = vec![];
        let v2 = vec![1, 2, 3];
        assert_eq!(sum_vectors(&v1, &v2), vec![]);
    }
}`,
        starter_code: `// Write: sum_vectors(v1: &Vec<i32>, v2: &Vec<i32>) -> Vec<i32>

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
        content: `# Strings

Rust has only one string type in the core language: the string slice _BT_str_BT_ (usually seen as borrowed _BT_&str_BT_).

The _BT_String_BT_ type, provided by Rust’s standard library, is a growable, mutable, owned, UTF-8 encoded string type.

## Creating a String

_BT__BT__BT_rust
let s = String::new();
let s = "initial contents".to_string();
let s = String::from("initial contents");
_BT__BT__BT_

## Appending

_BT__BT__BT_rust
let mut s = String::from("foo");
s.push_str("bar");
s.push('!'); // append a single char
_BT__BT__BT_

## Concatenation

_BT__BT__BT_rust
let s1 = String::from("Hello, ");
let s2 = String::from("world!");
let s3 = s1 + &s2; // Note: s1 has been moved here and can no longer be used
_BT__BT__BT_

The _BT_+_BT_ operator uses the _BT_add_BT_ method, which takes ownership of _BT_self_BT_ (s1) and borrows the second argument.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Which type is growable and mutable?",
                options: ["&str", "String", "char", "u8"],
                correctIndex: 1,
            },
            {
                question: "What happens to _BT_s1_BT_ in _BT_let s3 = s1 + &s2;_BT_?".replace(/_BT_/g, '`'),
                options: [
                    "It is copied",
                    "It is borrowed",
                    "It is moved (ownership transferred)",
                    "It remains valid",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Write a function _BT_add_suffix(s: String, suffix: &str) -> String_BT_.
It should take ownership of the string and append the suffix to it.

Note: You can use _BT_push_str_BT_ since the string is mutable (you'll need to declare the argument mutably! e.g. _BT_mut s: String_BT_).`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add_suffix() {
        let s = String::from("hello");
        let result = add_suffix(s, " world");
        assert_eq!(result, "hello world");
    }

    #[test]
    fn test_add_suffix_empty() {
        let s = String::from("");
        let result = add_suffix(s, "test");
        assert_eq!(result, "test");
    }
}`,
        starter_code: `// Write: add_suffix(mut s: String, suffix: &str) -> String

fn main() {
    let s = String::from("hello");
    let result = add_suffix(s, " world");
    println!("{}", result);
}
`,
    },
    {
        id: "ch08-03",
        chapter: "8.3",
        title: "Hash Maps",
        sort_order: 62,
        content: `# Hash Maps

The type _BT_HashMap<K, V>_BT_ stores a mapping of keys of type _BT_K_BT_ to values of type _BT_V_BT_.

## Creating a Hash Map

_BT__BT__BT_rust
use std::collections::HashMap;

let mut scores = HashMap::new();
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);
_BT__BT__BT_

## Accessing Values

_BT__BT__BT_rust
let team_name = String::from("Blue");
let score = scores.get(&team_name); // Returns Option<&i32>
_BT__BT__BT_

## Updating

_BT__BT__BT_rust
// Overwriting
scores.insert(String::from("Blue"), 25);

// Inserting only if key has no value
scores.entry(String::from("Yellow")).or_insert(50);
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What module must be imported to use HashMap?",
                options: ["std::io", "std::map", "std::collections::HashMap", "std::prelude"],
                correctIndex: 2,
            },
            {
                question: "What does _BT_scores.get(&key)_BT_ return?".replace(/_BT_/g, '`'),
                options: ["The value directly", "Option<&V>", "Result<V, E>", "bool"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write a function _BT_count_words(text: &str) -> HashMap<String, u32>_BT_.
It should return a map where keys are words and values are the count of occurrences.

Hint:
1. Use _BT_text.split_whitespace()_BT_ to iterate over words.
2. Use _BT_.entry(word.to_string()).or_insert(0)_BT_ to update counts.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    #[test]
    fn test_count_words() {
        let text = "hello world hello";
        let map = count_words(text);
        assert_eq!(map.get("hello"), Some(&2));
        assert_eq!(map.get("world"), Some(&1));
    }
    
    #[test]
    fn test_count_words_empty() {
        let map = count_words("");
        assert!(map.is_empty());
    }
}`,
        starter_code: `use std::collections::HashMap;

// Write: count_words(text: &str) -> HashMap<String, u32>

fn main() {
    let text = "hello world hello";
    let counts = count_words(text);
    println!("{:?}", counts);
}
`,
    },
];
