import { Lesson } from "../../types";

export const ch20Lessons: Lesson[] = [
    {
        id: "ch20-01",
        chapter: "20.1",
        title: "Unsafe Rust",
        sort_order: 200,
        environment: "browser",
        content: `# Unsafe Rust

All the code we’ve discussed so far has had Rust’s memory safety guarantees enforced at compile time. However, Rust has a second language hidden inside it that doesn’t enforce these memory safety guarantees: it’s called **unsafe Rust**.

## Unsafe Superpowers
Inside an _BT_unsafe_BT_ block, you can:
- Dereference a raw pointer
- Call an unsafe function or method
- Access or modify a mutable static variable
- Implement an unsafe trait
- Access fields of unions

_BT__BT__BT_rust
let mut num = 5;
let r1 = &num as *const i32; // static pointer
let r2 = &mut num as *mut i32;

unsafe {
    println!("r1 is: {}", *r1);
    println!("r2 is: {}", *r2);
}
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Does 'unsafe' mean the code is definitely dangerous?",
                options: ["Yes", "No, it just means the compiler can't verify safety", "Yes, it disables all type checking", "No, it just makes the code run faster"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Create a raw pointer to an integer.
2. Use an _BT_unsafe_BT_ block to dereference it.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    #[test]
    fn test_unsafe() {
        let x = 5;
        let p = &x as *const i32;
        unsafe {
            assert_eq!(*p, 5);
        }
    }
}`,
        starter_code: `fn main() {
    let x = 42;
    // Create raw pointer and dereference in unsafe block
}
`,
    },
    {
        id: "ch20-05",
        chapter: "20.5",
        title: "Macros",
        sort_order: 201,
        environment: "desktop",
        content: `# Macros

The term **macro** refers to a family of features in Rust: **declarative** macros with _BT_macro_rules!_BT_ and three kinds of **procedural** macros.

## Declarative Macros
They allow you to write something similar to a C-style _BT_#define_BT_ but more powerful and "hygienic".

_BT__BT__BT_rust
#[macro_export]
macro_rules! vec_custom {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What is the main difference between functions and macros?",
                options: [
                    "Macros can take variable arguments",
                    "Functions are faster",
                    "Macros are only for math",
                    "Functions are defined at compile time"
                ],
                correctIndex: 0,
            },
        ],
        objectives: `## Your Mission

1. Write a simple declarative macro _BT_say_hello!_BT_ that prints "Hello!".`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    #[test]
    fn test_conceptual() {
        assert!(true);
    }
}`,
        starter_code: `macro_rules! say_hello {
    () => {
        println!("Hello!");
    };
}

fn main() {
    say_hello!();
}
`,
    },
];
