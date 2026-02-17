import { Lesson } from "../../types";

export const ch05Lessons: Lesson[] = [
    {
        id: "ch05-01",
        chapter: "5.1",
        title: "Defining and Instantiating Structs",
        sort_order: 50,
        environment: "browser",
        content: `# Defining and Instantiating Structs

Structs (short for **structures**) let you name and package related data values into a meaningful group. If you're coming from object-oriented languages, a *struct* is like an object's data attributes without the methods (we'll add methods in the next lesson!).

## Defining a Struct

You define a struct with the _BT_struct_BT_ keyword and a list of typed fields:

_BT__BT__BT_rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
_BT__BT__BT_

## Creating an Instance

To use a struct, we create an **instance** of it by specifying values for each field. Order doesn't matter!

_BT__BT__BT_rust
let user1 = User {
    email: String::from("someone@example.com"),
    username: String::from("someusername123"),
    active: true,
    sign_in_count: 1,
};
_BT__BT__BT_

## Field Init Shorthand

If your variables have the same names as the fields, you can avoid repetition:

_BT__BT__BT_rust
fn build_user(email: String, username: String) -> User {
    User {
        email,      // Same as email: email,
        username,   // Same as username: username,
        active: true,
        sign_in_count: 1,
    }
}
_BT__BT__BT_

## Tuple Structs

Sometimes you don't need named fields, just a type name. **Tuple structs** are great for this:

_BT__BT__BT_rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);
_BT__BT__BT_

Even though _BT_black_BT_ and _BT_origin_BT_ have the same inner types, they are **different types** because they are instances of different structs. You can't pass a _BT_Color_BT_ to a function expecting a _BT_Point_BT_.

## ⚠️ Common Mistakes

1. **Missing fields** — When creating an instance, you *must* provide a value for every field.
2. **Mutability** — The *entire* instance must be mutable to change any field. Rust doesn't allow field-level mutability.
   _BT__BT__BT_rust
   let mut user1 = User { ... };
   user1.email = String::from("new@example.com"); // ✅ Allowed
   _BT__BT__BT_
`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Can you mark only one field of a struct as mutable?",
                options: [
                    "Yes, using the mut keyword on the field",
                    "No, mutability is a property of the entire instance",
                    "Yes, but only for public fields",
                    "Only if the struct is a tuple struct",
                ],
                correctIndex: 1,
            },
            {
                question: "What is the Field Init Shorthand?",
                options: [
                    "Omitting fields that have default values",
                    "Creating a struct without curly braces",
                    "Writing `field` instead of `field: field` when the variable name matches",
                    "Using a tuple instead of a struct",
                ],
                correctIndex: 2,
            },
            {
                question: "Are `struct A(i32)` and `struct B(i32)` the same type?",
                options: [
                    "Yes, because they both wrap an i32",
                    "No, they are distinct types",
                    "Only if they are in the same module",
                    "Yes, Rust uses duck typing",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Define a struct _BT_Point_BT_ with fields _BT_x: i32_BT_ and _BT_y: i32_BT_.
2. Write a function _BT_new_point(x: i32, y: i32) -> Point_BT_ that uses field init shorthand.
3. Write a function _BT_inspect_point(p: &Point)_BT_ that prints the point (e.g., "x: 10, y: 20") and returns the sum of x and y.

*(Note: We aren't using methods yet, just regular functions!)*`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new_point() {
        let p = new_point(10, 20);
        assert_eq!(p.x, 10);
        assert_eq!(p.y, 20);
    }

    #[test]
    fn test_inspect_point() {
        let p = Point { x: 5, y: -2 };
        assert_eq!(inspect_point(&p), 3);
    }

    #[test]
    fn test_inspect_point_zero() {
        let p = Point { x: 0, y: 0 };
        assert_eq!(inspect_point(&p), 0);
    }
}`,
        starter_code: `// Define struct Point { x: i32, y: i32 }

// Write: new_point(x: i32, y: i32) -> Point

// Write: inspect_point(p: &Point) -> i32

fn main() {
    let p = new_point(10, 20);
    let sum = inspect_point(&p);
    println!("Sum of coordinates: {}", sum);
}
`,
    },
    {
        id: "ch05-03",
        chapter: "5.3",
        title: "Method Syntax",
        sort_order: 52,
        environment: "browser",
        content: `# Method Syntax

Functions are great, but sometimes you want functions that belong to a specific type. **Methods** are just like functions, but they are defined within an _BT_impl_BT_ (implementation) block and their first parameter is always _BT_self_BT_.

## Defining Methods

_BT__BT__BT_rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // &self is short for self: &Self
    fn area(&self) -> u32 {
        self.width * self.height
    }
}
_BT__BT__BT_

## The _BT_self_BT_ Parameters

| Parameter | Meaning | Use Case |
|-----------|---------|----------|
| _BT_&self_BT_ | Borrows the instance immutably | **Most common**. You just want to read data. |
| _BT_&mut self_BT_ | Borrows the instance mutably | You want to change fields (e.g., _BT_counter.increment()_BT_). |
| _BT_self_BT_ | Takes ownership | Consumes the instance. Rare. Used for transforming into something else. |

## Associated Functions (Constructors)

Functions inside an _BT_impl_BT_ block that **don't** take _BT_self_BT_ are called associated functions. They act like namespaces.

_BT__BT__BT_rust
impl Rectangle {
    // No &self! This is a constructor.
    fn square(size: u32) -> Self {
        Self { width: size, height: size }
    }
}

// Usage:
let sq = Rectangle::square(10);
_BT__BT__BT_

## Multiple _BT_impl_BT_ Blocks

You can have multiple _BT_impl_BT_ blocks for the same struct. This is useful for organization or when using Traits (Chapter 10).

## ⚠️ Common Mistakes

1. **Forgetting _BT_&_BT_ on _BT_self_BT_** — Using _BT_self_BT_ instead of _BT_&self_BT_ means the method **takes ownership**. Calling it will consume the instance, meaning you can't use it afterwards!
2. **Accessing private fields** — Methods inside the _BT_impl_BT_ block can access private fields, but external code usually cannot (unless _BT_pub_BT_).`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What is the first parameter of every method?",
                options: ["this", "self (or variant)", "me", "instance"],
                correctIndex: 1,
            },
            {
                question: "What is the difference between `fn area(&self)` and `fn square(size: u32)`?",
                options: [
                    "`area` is a private function",
                    "`area` is a method (takes self), `square` is an associated function",
                    "`square` returns a String",
                    "There is no difference",
                ],
                correctIndex: 1,
            },
            {
                question: "If a method takes `self` (no `&`), what happens when you call it?",
                options: [
                    "It borrows the instance",
                    "It copies the instance",
                    "It takes ownership (consumes) the instance",
                    "It modifies the instance in place",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Implement a _BT_BankAccount_BT_ struct with methods:

1. **Constructor:** _BT_new(balance: i32) -> BankAccount_BT_
2. **Getter:** _BT_get_balance(&self) -> i32_BT_ — Returns current balance.
3. **Mutator:** _BT_deposit(&mut self, amount: i32)_BT_ — Adds amount to balance.
4. **Mutator:** _BT_withdraw(&mut self, amount: i32) -> bool_BT_
   - If balance >= amount, subtract amount and return _BT_true_BT_
   - If insufficient funds, do nothing and return _BT_false_BT_`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new_and_get() {
        let acc = BankAccount::new(100);
        assert_eq!(acc.get_balance(), 100);
    }

    #[test]
    fn test_deposit() {
        let mut acc = BankAccount::new(50);
        acc.deposit(50);
        assert_eq!(acc.get_balance(), 100);
    }

    #[test]
    fn test_withdraw_success() {
        let mut acc = BankAccount::new(100);
        let success = acc.withdraw(60);
        assert!(success);
        assert_eq!(acc.get_balance(), 40);
    }

    #[test]
    fn test_withdraw_fail() {
        let mut acc = BankAccount::new(50);
        let success = acc.withdraw(100);
        assert!(!success);
        assert_eq!(acc.get_balance(), 50); // Balance unchanged
    }

    #[test]
    fn test_withdraw_lazy_exact() {
        let mut acc = BankAccount::new(50);
        let success = acc.withdraw(50);
        assert!(success);
        assert_eq!(acc.get_balance(), 0);
    }
}`,
        starter_code: `struct BankAccount {
    balance: i32,
}

impl BankAccount {
    // Write: new(balance: i32) -> BankAccount
    // Write: get_balance(&self) -> i32
    // Write: deposit(&mut self, amount: i32)
    // Write: withdraw(&mut self, amount: i32) -> bool
}

fn main() {
    let mut acc = BankAccount::new(100);
    acc.deposit(50);
    println!("Balance: {}", acc.get_balance());
    
    if acc.withdraw(200) {
        println!("Withdrew 200");
    } else {
        println!("Insufficient funds");
    }
}
`,
    },
];
