import { Lesson } from "../../types";

export const ch07Lessons: Lesson[] = [
    {
        id: "ch07-01",
        chapter: "7.1",
        title: "Packages and Crates",
        sort_order: 50,
        content: `# Packages and Crates

As your project grows, you need to organize your code.

## Crates

A **crate** is the smallest amount of code that the Rust compiler considers at a time.
- **Binary crates** are programs you can run. They have a _BT_main_BT_ function.
- **Library crates** don't have a _BT_main_BT_ function and provide functionality to be shared with other projects.

## Packages

A **package** is a bundle of one or more crates that provides a set of functionality. A package contains a _BT_Cargo.toml_BT_ file that describes how to build those crates.

_BT__BT__BT_text
my-project/
├── Cargo.toml
└── src/
    ├── main.rs  (binary crate root)
    └── lib.rs   (library crate root)
_BT__BT__BT_

A package can have multiple binary crates, but only one library crate.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What is the primary difference between a binary crate and a library crate?",
                options: [
                    "Binary crates have a main function, library crates do not",
                    "Library crates are compiled faster",
                    "Binary crates cannot use dependencies",
                    "There is no difference",
                ],
                correctIndex: 0,
            },
            {
                question: "How many library crates can a package contain?",
                options: ["Unlimited", "Zero", "Exactly one at most", "Two"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

This lesson is improved by understanding the file structure. Since we are in a single-file environment here, we will simulate modules in the next lesson!

For now, simply **pass the quiz** to prove you understand the concepts of Crates and Packages.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    #[test]
    fn test_knowledge() {
        // No code to write for this conceptual lesson
        assert!(true);
    }
}`,
        starter_code: `// This lesson is conceptual.
// Click "Run" to proceed!

fn main() {
    println!("I understand packages and crates!");
}
`,
    },
    {
        id: "ch07-02",
        chapter: "7.2",
        title: "Defining Modules",
        sort_order: 51,
        content: `# Defining Modules

**Modules** let you organize code within a crate for readability and easy reuse. They also control the **privacy** of items (public vs private).

## The _BT_mod_BT_ Keyword

_BT__BT__BT_rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
    }
}
_BT__BT__BT_

By default, everything inside a module is **private** from the outside.

## The _BT_pub_BT_ Keyword

To make an item accessible, use _BT_pub_BT_:

_BT__BT__BT_rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // We can access hosting because it's public
    front_of_house::hosting::add_to_waitlist();
}
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What is the default visibility of an item in a module?",
                options: ["Public", "Private", "Protected", "Package-private"],
                correctIndex: 1,
            },
            {
                question: "Which keyword makes an item accessible from outside its module?",
                options: ["global", "export", "pub", "open"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1. Define a module _BT_math_BT_.
2. Inside _BT_math_BT_, define a public function _BT_add(a: i32, b: i32) -> i32_BT_.
3. Define a private function _BT_subtract(a: i32, b: i32) -> i32_BT_.
4. In _BT_main_BT_, try to call _BT_math::add_BT_.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add_is_public() {
        assert_eq!(math::add(2, 2), 4);
    }
    
    // We can't strictly test that 'subtract' is private via compilation failure here,
    // but the presence of 'pub' on 'add' and absence on 'subtract' is the goal.
}`,
        starter_code: `// Define module 'math'
// - pub fn add
// - fn subtract

fn main() {
    let sum = math::add(10, 20);
    println!("Sum: {}", sum);
    
    // Uncommenting this should cause an error:
    // math::subtract(10, 5); 
}
`,
    },
    {
        id: "ch07-03",
        chapter: "7.3",
        title: "Paths for Referring to an Item",
        sort_order: 52,
        content: `# Paths

To show Rust where to find an item in a module tree, we use a **path**.

## Absolute Paths
Start from the crate root using the crate name or _BT_crate_BT_:

_BT__BT__BT_rust
crate::front_of_house::hosting::add_to_waitlist();
_BT__BT__BT_

## Relative Paths
Start from the current module using _BT_self_BT_, _BT_super_BT_, or an identifier:

_BT__BT__BT_rust
front_of_house::hosting::add_to_waitlist();
_BT__BT__BT_

## The _BT_use_BT_ Keyword

We can bring a path into scope with _BT_use_BT_, creating a shortcut:

_BT__BT__BT_rust
use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What keyword starts an absolute path from the current crate root?",
                options: ["root", "top", "crate", "src"],
                correctIndex: 2,
            },
            {
                question: "What keyword refers to the parent module?",
                options: ["parent", "super", "self", "base"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Use the module structure provided.
2. Bring the _BT_add_BT_ function into scope using _BT_use_BT_.
3. Call _BT_add_BT_ directly without the module prefix.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_usage() {
        // This test mostly verifies the code compiles
        assert_eq!(compute(5, 5), 10);
    }
}`,
        starter_code: `mod tools {
    pub fn add(a: i32, b: i32) -> i32 {
        a + b
    }
}

// Write: use tools::add;

fn compute(a: i32, b: i32) -> i32 {
    // Call 'add' directly here!
    add(a, b)
}

fn main() {
    println!("Result: {}", compute(4, 6));
}
`,
    },
];
