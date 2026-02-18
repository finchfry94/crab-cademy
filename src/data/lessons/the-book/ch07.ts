import { Lesson } from "../../types";

export const ch07Lessons: Lesson[] = [
    {
        id: "ch07-01",
        chapter: "7.1",
        title: "Packages and Crates",
        sort_order: 70,
        environment: "browser",
        content: `# Packages and Crates

As your code grows, managing it all in one file becomes impossible. Rust uses **Packages**, **Crates**, and **Modules** to organize code.

## The Hierarchy

1. **Package**: A bundle of one or more crates. Contains a _BT_Cargo.toml_BT_ file.
2. **Crate**: A compilation unit.
   - **Binary Crate**: Has a _BT_main_BT_ function. Compiles to an executable.
   - **Library Crate**: No _BT_main_BT_. Defines functionality to be shared.
3. **Module**: Organizes code within a crate.

## Binary vs Library

Most packages contain:
- One library crate (logic, data structures)
- One or more binary crates (executables that use the library)

## ⚠️ Common Mistakes

1. **Confusing Package and Crate** — A package *contains* crates.
2. **Trying to run a library** — Libraries don't run on their own; they are imported by binaries.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What file defines a Package?",
                options: ["main.rs", "lib.rs", "Cargo.toml", "package.json"],
                correctIndex: 2,
            },
            {
                question: "Which type of crate has a _BT_main_BT_ function?".replace(/_BT_/g, '`'),
                options: ["Library crate", "Binary crate", "Module crate", "Both"],
                correctIndex: 1,
            },
            {
                question: "How many library crates can a package have?",
                options: ["Zero or one", "Unlimited", "Exactly one", "At least one"],
                correctIndex: 0,
            },
        ],
        objectives: `## Your Mission

Simple check: Write a function _BT_is_binary(has_main: bool) -> bool_BT_.
It should return true if the input _BT_has_main_BT_ is true, representing that binary crates have a main function.

(This is a conceptual lesson, so the code is trivial!)`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_is_binary() {
        assert_eq!(is_binary(true), true);
        assert_eq!(is_binary(false), false);
    }
}`,
        starter_code: `// Write: is_binary(has_main: bool) -> bool
// Return the input value basically...

fn main() {
    println!("Is binary? {}", is_binary(true));
}
`,
    },
    {
        id: "ch07-02",
        chapter: "7.2",
        title: "Defining Modules and Control Visibility",
        sort_order: 71,
        environment: "browser",
        content: `# Modules and Visibility

If crates are boxes, **modules** are the dividers inside those boxes. They let you organize code into groups (like _BT_front_of_house_BT_, _BT_back_of_house_BT_) and control **privacy** (what is visible to the outside world).

## The _BT_mod_BT_ Keyword

You define a module with the _BT_mod_BT_ keyword. This nests code inside a namespace:

_BT__BT__BT_rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}
_BT__BT__BT_

## Privacy Rules (The "Private by Default" Rule)

In Rust, everything is **private by default**. This is the opposite of languages like Java or Python where things are often public unless you hide them.

1.  **Child modules can access everything in their parent modules.** (Children can see what their parents have).
2.  **Parent modules CANNOT access private items in child modules.** (Parents can't see inside their children's private diaries).

To make an item (function, struct, enum, module) accessible to its parent or the outside world, you must explicitly mark it with **_BT_pub_BT_**.

## Struct Privacy Logic

This often trips up students coming from other languages:

*   If you make a **struct** public (_BT_pub struct_BT_), its fields are **still private** by default! You must mark each field as _BT_pub_BT_ if you want it to be accessible directly.
*   Why? This allows you to hide implementation details. You typically provide a public constructor (like _BT_new()_BT_) to create the struct, ensuring it's always created in a valid state.

Valid State Example: Imagine a _BT_BankAccount_BT_ struct. If the _BT_balance_BT_ field were public, anyone could set it to negative one billion. By keeping it private and only exposing a _BT_withdraw()_BT_ method, you enforce the rule "balance cannot be negative".

## ⚠️ Common Mistakes

1.  **Forgetting _BT_pub_BT_ on fields** — "Why can't I access _BT_my_struct.name_BT_? The struct is public!" Check the field definition!
2.  **Assuming "same file" means "same visibility"** — Privacy boundaries correspond to *modules*, not just files. If you put code inside a _BT_mod_BT_ block in the same file, it's a separate module with its own privacy wall.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What is the default visibility of an item in a module?",
                options: ["Public", "Private", "Protected", "Package-private"],
                correctIndex: 1,
            },
            {
                question: "If a struct is public, are its fields public by default?",
                options: ["Yes", "No", "Only if strict mode is off", "Yes, if the module is public"],
                correctIndex: 1,
            },
            {
                question: "Can a child module access private items in its parent module?",
                options: ["Yes", "No", "Only if marked pub(super)", "Only data, not functions"],
                correctIndex: 0,
            },
        ],
        objectives: `## Your Mission

The code below has privacy errors. The module _BT_kitchen_BT_ calculates a meal, but the _BT_make_sandwich_BT_ function can't access the private _BT_Sandwich_BT_ struct or its fields strings.

**Fix the code by adding _BT_pub_BT_ where necessary** so that _BT_make_sandwich_BT_ can run and return a _BT_Sandwich_BT_.

1. Make the _BT_Sandwich_BT_ struct public.
2. Make the _BT_name_BT_ field public.
3. Make the _BT_is_tasty_BT_ field public.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_make_sandwich() {
        let s = make_sandwich();
        assert_eq!(s.name, "BLT");
        assert_eq!(s.is_tasty, true);
    }
}`,
        starter_code: `mod kitchen {
    // FIX: Add 'pub' to the struct and fields
    struct Sandwich {
        name: String,
        is_tasty: bool,
    }

    pub fn prepare_order() -> Sandwich {
        Sandwich {
            name: String::from("BLT"),
            is_tasty: true,
        }
    }
}

use kitchen::prepare_order;

// Note: We need access to the Struct type return type too!
// That implies the Struct definition itself must be visible.

fn make_sandwich() -> kitchen::Sandwich { // validation will fail if Sandwich is private
    prepare_order()
}

fn main() {
    let s = make_sandwich();
    println!("Made a {}", s.name); // validation will fail if 'name' is private
}
`,
    },
    {
        id: "ch07-03",
        chapter: "7.3",
        title: "Paths and use",
        sort_order: 72,
        environment: "browser",
        content: `# Paths and use

To access an item in the module tree, we use a **path**.

- **Absolute path**: Starts with _BT_crate_BT_ (root).
- **Relative path**: Starts with _BT_self_BT_, _BT_super_BT_, or an identifier.

## The _BT_use_BT_ Keyword

Typing full paths is annoying. _BT_use_BT_ lets you bring an item into scope so you can call it directly.

_BT__BT__BT_rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

// Bring it into scope
use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist(); // Shorter!
}
_BT__BT__BT_

## Idiomatic use

- For **functions**, it's idiomatic to bring the **parent module** into scope, then call _BT_module::function()_BT_.
- For **structs/enums**, it's idiomatic to bring the **item itself** into scope.

_BT__BT__BT_rust
use std::collections::HashMap; // Struct -> full path
use std::fmt;                  // Module -> parent path
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What keyword brings a path into scope?",
                options: ["import", "include", "use", "require"],
                correctIndex: 2,
            },
            {
                question: "What keyword refers to the parent module?",
                options: ["parent", "super", "self", "root"],
                correctIndex: 1,
            },
            {
                question: "What is the idiomatic way to bring a function into scope?",
                options: [
                    "Bring the function itself",
                    "Bring the parent module",
                    "Bring the crate root",
                    "Don't use use",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Use the provided _BT_calculator_BT_ module.
2. Add a **_BT_use_BT_** statement to bring the _BT_add_BT_ function into scope.
3. Note: In this specific challenge, bring the function itself so you can call _BT_add(1, 2)_BT_ directly, not _BT_calculator::add_BT_.

(This contradicts the idiom lesson slightly, but it's a good test of the _BT_use_BT_ keyword!)`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_compute() {
        assert_eq!(compute(10, 20), 30);
    }
}`,
        starter_code: `mod calculator {
    pub fn add(a: i32, b: i32) -> i32 {
        a + b
    }
}

// Write: use calculator::add;

fn compute(a: i32, b: i32) -> i32 {
    // Call 'add' directly! 
    // If you don't add the 'use' line, this will error.
    add(a, b)
}

fn main() {
    println!("{}", compute(1, 2));
}
`,
    },
];
