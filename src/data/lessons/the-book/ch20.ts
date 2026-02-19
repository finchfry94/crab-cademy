import { Lesson } from "../../types";

export const ch20Lessons: Lesson[] = [
    {
        id: "ch20-01",
        chapter: "20.1",
        title: "Unsafe Rust",
        sort_order: 200,
        environment: "browser",
        content: `# Unsafe Rust

Use the Force, Luke... but be careful.

Rust normally enforces memory safety at compile time. **Unsafe Rust** is a dialect of Rust that gives you extra superpowers, but removes the safety net. You use it by wrapping code in an \`unsafe { ... }\` block.

## The 5 Superpowers
Inside \`unsafe\`, you can:
1.  Dereference a raw pointer.
2.  Call an unsafe function or method.
3.  Access or modify a mutable static variable.
4.  Implement an unsafe trait.
5.  Access fields of unions.

It does **NOT** disable the borrow checker! You still can't have two mutable references to the same safe variable.

## Raw Pointers
Raw pointers (\`*const T\` and \`*mut T\`) are like C pointers. They can be null, dangling, or unaligned. Dereferencing them is unsafe because Rust can't guarantee they point to valid memory.

\`\`\`rust
let mut num = 5;

// Creating pointers is SAFE
let r1 = &num as *const i32;
let r2 = &mut num as *mut i32;

unsafe {
    // Dereferencing them is UNSAFE
    println!("r1 is: {}", *r1);
    println!("r2 is: {}", *r2);
}
\`\`\`

## ⚠️ Common Mistakes

1.  **"Unsafe turns off checks"**: No, it just allows *more* things. The standard rules still apply to normal references.
2.  **Undefined Behavior (UB)**: If you violate the rules (e.g., writing to read-only memory), your program might crash, or worse, execute code you didn't write. UB is the dragon we are trying to slay.`,
        quiz: [
            {
                question: "Does 'unsafe' disable the borrow checker?",
                options: ["Yes", "No", "Only for pointers", "Only in release mode"],
                correctIndex: 1,
            },
            {
                question: "Is creating a raw pointer unsafe?",
                options: ["Yes", "No", "Only if it's null", "Only if it's mutable"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Create a raw pointer to an integer.
2. Use an _BT_unsafe_BT_ block to dereference it and print the value.`.replace(/_BT_/g, '`'),
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
    
    // 1. Create raw pointer
    // let p = ...
    
    // 2. Unsafe block to read it
    // unsafe { ... }
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

Macros are code that writes code. This is called **Metaprogramming**.

## Declarative Macros (\`macro_rules!\`)
These are the most common. They look like \`match\` expressions. You match against a pattern of Rust syntax code, and replace it with other code.

Example: \`vec!\`
\`\`\`rust
#[macro_export]
macro_rules! vec {
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
\`\`\`

*   \`$x:expr\`: Match any Rust expression and call it \`$x\`.
*   \`$(...),*\`: Match zero or more times, separated by commas.

## Procedural Macros
These are more like functions. They take a stream of tokens (code) as input and return a stream of tokens as output. They are used for \`#[derive(Custom)]\` and attribute macros like \`#[tokio::main]\`.

## ⚠️ Common Mistakes

1.  **Overusing Macros**: Macros are harder to read, debug, and maintain than functions. Only use them when you need to abstract over *syntax* (like variable argument lists) that functions can't handle.
2.  **Hygiene**: Rust macros are "hygienic", meaning variables defined inside the macro don't accidentally clash with variables outside. But be careful when assuming what names differ!`,
        quiz: [
            {
                question: "What is the main difference between functions and macros?",
                options: [
                    "Macros expand into code at compile time",
                    "Functions are faster",
                    "Macros are only for math",
                    "Functions are defined at compile time"
                ],
                correctIndex: 0,
            },
        ],
        objectives: `## Your Mission

1. Define a macro _BT_say_hello!_BT_.
2. Call it in main.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    #[test]
    fn test_macro_expansion() {
        macro_rules! add_one {
            ($x:expr) => { $x + 1 };
        }
        assert_eq!(add_one!(5), 6);
    }
}`,
        starter_code: `macro_rules! say_hello {
    // Fill in the pattern and expansion
    // () => { ... };
}

fn main() {
    // say_hello!();
}
`,
    },
];
