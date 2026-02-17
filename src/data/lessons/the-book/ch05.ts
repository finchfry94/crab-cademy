import { Lesson } from "../../types";

export const ch05Lessons: Lesson[] = [
    {
        id: "ch05-01",
        chapter: "5.1",
        title: "Defining and Using Structs",
        sort_order: 30,
        environment: "browser",
        content: `# Defining and Using Structs

Structs let you group related data together into a named type.

## Defining a Struct

_BT__BT__BT_rust
struct User {
    username: String,
    email: String,
    active: bool,
}
_BT__BT__BT_

## Creating an Instance

_BT__BT__BT_rust
let user = User {
    email: String::from("someone@example.com"),
    username: String::from("someone"),
    active: true,
    // Note: use field init shorthand if variable name matches field!
};
_BT__BT__BT_

## Methods with impl

_BT__BT__BT_rust
struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }

    fn new(w: f64, h: f64) -> Self {
        Self { width: w, height: h }
    }
}
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What keyword is used to add methods to a struct?",
                options: ["fn", "struct", "impl", "mod"],
                correctIndex: 2,
            },
            {
                question: "What does _BT_&self_BT_ mean in a method?".replace(/_BT_/g, '`'),
                options: [
                    "The method takes ownership of the struct",
                    "The method borrows the struct immutably",
                    "The method creates a copy of the struct",
                    "The method is static",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Create a _BT_Rectangle_BT_ struct with methods:

1. _BT_Rectangle::new(width: f64, height: f64) -> Rectangle_BT_ — Constructor
2. _BT_area(&self) -> f64_BT_ — Returns the area
3. _BT_perimeter(&self) -> f64_BT_ — Returns the perimeter
4. _BT_is_square(&self) -> bool_BT_ — Returns true if width equals height
5. _BT_can_hold(&self, other: &Rectangle) -> bool_BT_ — Returns true if self can contain other`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_area() {
        let r = Rectangle::new(10.0, 5.0);
        assert!((r.area() - 50.0).abs() < 0.01);
    }

    #[test]
    fn test_perimeter() {
        let r = Rectangle::new(10.0, 5.0);
        assert!((r.perimeter() - 30.0).abs() < 0.01);
    }

    #[test]
    fn test_is_square_true() {
        let r = Rectangle::new(5.0, 5.0);
        assert!(r.is_square());
    }

    #[test]
    fn test_is_square_false() {
        let r = Rectangle::new(5.0, 10.0);
        assert!(!r.is_square());
    }

    #[test]
    fn test_can_hold_true() {
        let big = Rectangle::new(10.0, 10.0);
        let small = Rectangle::new(5.0, 5.0);
        assert!(big.can_hold(&small));
    }

    #[test]
    fn test_can_hold_false() {
        let small = Rectangle::new(5.0, 5.0);
        let big = Rectangle::new(10.0, 10.0);
        assert!(!small.can_hold(&big));
    }
}`,
        starter_code: `struct Rectangle {
    width: f64,
    height: f64,
}

// Add an impl block with:
// new, area, perimeter, is_square, can_hold

fn main() {
    let r = Rectangle::new(10.0, 5.0);
    println!("Area: {}", r.area());
    println!("Perimeter: {}", r.perimeter());
    println!("Square? {}", r.is_square());
}
`,
    },
    {
        id: "ch05-03",
        chapter: "5.3",
        title: "Method Syntax",
        sort_order: 32,
        environment: "browser",
        content: `# Method Syntax

## Methods vs Functions

Methods are functions defined within the context of a struct (or enum/trait object). Their first parameter is always _BT_self_BT_.

## The _BT_self_BT_ arguments

| Argument | Syntax | Description |
|----------|--------|-------------|
| _BT_&self_BT_  | _BT_fn area(&self)_BT_ | Borrows the struct immutably (most common) |
| _BT_&mut self_BT_ | _BT_fn tick(&mut self)_BT_ | Borrows the struct mutably (can change data) |
| _BT_self_BT_ | _BT_fn consume(self)_BT_ | Takes ownership (consumes the struct) |

## Associated Functions

Functions without _BT_self_BT_ are called **associated functions**. They are often used as constructors (like _BT_String::from_BT_).

_BT__BT__BT_rust
impl Rectangle {
    // Constructor (associated function)
    fn new(size: f64) -> Self {
        Self { width: size, height: size }
    }
}
// Usage: Rectangle::new(10.0);
_BT__BT__BT_

## Multiple _BT_impl_BT_ Blocks

You can split methods into multiple _BT_impl_BT_ blocks for organization.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Which parameter allows a method to modify the struct instance?",
                options: ["&self", "self", "&mut self", "mut self"],
                correctIndex: 2,
            },
            {
                question: "What happens to the struct when a method takes _BT_self_BT_?".replace(/_BT_/g, '`'),
                options: [
                    "It is borrowed immutably",
                    "It is borrowed mutably",
                    "It is moved (ownership is transferred)",
                    "It is copied",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Implement a _BT_Counter_BT_ struct:

1. _BT_Counter::new(start: u32) -> Counter_BT_ — Constructor
2. _BT_tick(&mut self)_BT_ — Increments the count by 1
3. _BT_combine(self, other: Counter) -> Counter_BT_ — Consumes both counters, returns a new one with the sum of their counts. Note: this method takes _BT_self_BT_ and "other" by value (ownership).`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_tick_value() {
        let mut c = Counter::new(5);
        c.tick();
        // Assume get_count exists or trust manual check?
        // Let's add get_count to requirements to be safe for testing.
        assert_eq!(c.get_count(), 6);
    }

    #[test]
    fn test_combine() {
        let c1 = Counter::new(10);
        let c2 = Counter::new(20);
        let c3 = c1.combine(c2);
        assert_eq!(c3.get_count(), 30);
    }
}`,
        starter_code: `struct Counter {
    count: u32,
}

impl Counter {
    // Write: new(start: u32) -> Counter
    // Write: tick(&mut self)
    // Write: get_count(&self) -> u32
    // Write: combine(self, other: Counter) -> Counter
}

fn main() {
    let mut c = Counter::new(0);
    c.tick();
    println!("Count after tick: {}", c.get_count());

    let c2 = Counter::new(10);
    let c3 = c.combine(c2);
    println!("Combined count: {}", c3.get_count());
}
`,
    },
];
