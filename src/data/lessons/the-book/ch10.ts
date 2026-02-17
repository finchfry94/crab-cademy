import { Lesson } from "../../types";

export const ch10Lessons: Lesson[] = [
    {
        id: "ch10-01",
        chapter: "10.1",
        title: "Generic Data Types",
        sort_order: 80,
        content: `# Generic Data Types

Generics allow us to create flexible definitions for functions and structs that can work with any data type.

## In Functions

_BT__BT__BT_rust
fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut largest = list[0];
    for &item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}
_BT__BT__BT_

## In Structs

_BT__BT__BT_rust
struct Point<T> {
    x: T,
    y: T,
}

let integer = Point { x: 5, y: 10 };
let float = Point { x: 1.0, y: 4.0 };
_BT__BT__BT_

If you want different types for x and y, use multiple parameters:

_BT__BT__BT_rust
struct Point<T, U> {
    x: T,
    y: U,
}
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What does _BT_<T>_BT_ signify in a function definition?".replace(/_BT_/g, '`'),
                options: [
                    "It's a specific type called T",
                    "It's a generic type parameter",
                    "It's a lifetime annotation",
                    "It's a macro",
                ],
                correctIndex: 1,
            },
            {
                question: "Can verify structs have fields of different generic types?",
                options: ["No, only one generic type allowed", "Yes, by using multiple type parameters like <T, U>", "No, struct fields must be concrete types", "Yes, but they must be numeric"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write a struct _BT_Pair<T>_BT_ that holds two items of the same type _BT_T_BT_.
Implement a method _BT_new(x: T, y: T) -> Self_BT_.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_pair_int() {
        let p = Pair::new(1, 2);
        assert_eq!(p.x, 1);
        assert_eq!(p.y, 2);
    }

    #[test]
    fn test_pair_float() {
        let p = Pair::new(1.0, 2.0);
        assert_eq!(p.x, 1.0);
        assert_eq!(p.y, 2.0);
    }
}`,
        starter_code: `// Write: struct Pair<T> { x: T, y: T }
// Write: impl<T> Pair<T> { fn new(...) }

fn main() {
    let int_pair = Pair::new(5, 10);
    let float_pair = Pair::new(1.5, 2.5);
    
    println!("Ints: {}, {}", int_pair.x, int_pair.y);
    println!("Floats: {}, {}", float_pair.x, float_pair.y);
}
`,
    },
    {
        id: "ch10-02",
        chapter: "10.2",
        title: "Traits: Defining Shared Behavior",
        sort_order: 81,
        content: `# Traits

Traits are similar to **interfaces** in other languages. They define behavior that types can share.

## Defining a Trait

_BT__BT__BT_rust
pub trait Summary {
    fn summarize(&self) -> String;
}
_BT__BT__BT_

## Implementing a Trait

_BT__BT__BT_rust
pub struct Tweet {
    pub username: String,
    pub content: String,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}
_BT__BT__BT_

## Default Implementations

You can provide a default behavior for methods in the trait definition.

_BT__BT__BT_rust
pub trait Summary {
    fn summarize(&self) -> String {
        String::from("(Read more...)")
    }
}
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What keyword is used to define a trait?",
                options: ["interface", "class", "trait", "struct"],
                correctIndex: 2,
            },
            {
                question: "Can traits provide default implementations for methods?",
                options: ["Yes", "No", "Only for public methods", "Only for private methods"],
                correctIndex: 0,
            },
        ],
        objectives: `## Your Mission

1. Define a trait _BT_Printable_BT_ with a method _BT_format(&self) -> String_BT_.
2. Implement it for a struct _BT_Person_BT_ with fields _BT_name_BT_ and _BT_age_BT_.
3. The format should be _BT_"Name: {name}, Age: {age}"_BT_.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_printable() {
        let p = Person { name: String::from("Alice"), age: 30 };
        assert_eq!(p.format(), "Name: Alice, Age: 30");
    }
}`,
        starter_code: `// Write: trait Printable
// Write: struct Person
// Write: impl Printable for Person

fn main() {
    let p = Person {
        name: String::from("Alice"),
        age: 30,
    };
    println!("{}", p.format());
}
`,
    },
    {
        id: "ch10-03",
        chapter: "10.3",
        title: "Validating References with Lifetimes",
        sort_order: 82,
        content: `# Lifetimes

Lifetimes ensure that references are valid as long as we need them to be.

## The Problem

_BT__BT__BT_rust
let r;
{
    let x = 5;
    r = &x;
} // x is dropped here
println!("r: {}", r); // Error! r refers to dropped value
_BT__BT__BT_

## Lifetime Annotations

When a function returns a reference, Rust needs to know how the lifetime of the return value relates to the lifetimes of arguments.

_BT__BT__BT_rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
_BT__BT__BT_

The _BT_'a_BT_ reads as "the returned reference will live as long as the shorter of the lifetimes of x and y".`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What syntax denotes a lifetime?",
                options: ["<T>", "*ptr", "&ref", "'a"],
                correctIndex: 3,
            },
            {
                question: "Do lifetime annotations change how long a value lives?",
                options: [
                    "Yes, they extend the lifetime",
                    "No, they only describe relationships for the compiler",
                    "Yes, they force heap allocation",
                    "No, they are ignored at runtime",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write a function _BT_first_part<'a>(s: &'a str, delimiter: &str) -> &'a str_BT_.
It should return the part of the string before the delimiter. If delimiter not found, return the whole string.

Usage of _BT_.split(delimiter).next().unwrap()_BT_ is a handy way to get the first part.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_first_part_found() {
        assert_eq!(first_part("hello_world", "_"), "hello");
    }

    #[test]
    fn test_first_part_not_found() {
        assert_eq!(first_part("hello", "_"), "hello");
    }
}`,
        starter_code: `// Write: first_part<'a>(s: &'a str, delimiter: &str) -> &'a str

fn main() {
    let s = String::from("hello_world");
    let part = first_part(&s, "_");
    println!("Part: {}", part);
}
`,
    },
];
