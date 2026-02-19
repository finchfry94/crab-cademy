import { Lesson } from "../../types";

export const ch15Lessons: Lesson[] = [
    {
        id: "ch15-01",
        chapter: "15.1",
        title: "Using Box<T> to Point to Data on the Heap",
        sort_order: 150,
        environment: "browser",
        content: `# Box<T>

\`Box<T>\` is the most straightforward smart pointer. It allows you to store data on the **Heap** rather than the **Stack**.

## Stack vs Heap Refresher

*   **Stack**: Fast, organized, but limited size. Data *must* have a known, fixed size at compile time (like \`i32\`).
*   **Heap**: Slower, disorganized, huge. Can store data of dynamic size (like \`String\` or \`Vec\`).

What if you have a struct that is huge, or recursive? You can't put it on the stack. You put it in a \`Box\` (on the heap) and keep the simple pointer on the stack.

\`\`\`rust
let b = Box::new(5);
println!("b = {}", b);
\`\`\`

Here, \`b\` is a pointer stored on the stack. It points to the value \`5\`, which lives on the heap.

## When to use Box
1.  **Recursive Types**: A type that contains itself (like a Linked List node). Without indirection (a pointer), the size would be infinite!
2.  **Huge Data**: Transferring ownership of large data is cheap with Box (just copying the pointer) vs expensive on stack (copying all the bits).
3.  **Trait Objects**: When you care about a specific Trait, not the concrete type.

## ⚠️ Common Mistakes

1.  **Unnecessary Boxing**: Beginners sometimes Box everything coming from Java/Python. Don't! Stack allocation is free and fast. Only Box when you *have* to.
2.  **Dereferencing**: To get the value *out* of the box, you often need to dereference it with \`*\`.
    \`\`\`rust
    let x = 5;
    let y = Box::new(x);
    assert_eq!(5, *y); // Verify the value pointed to is 5
    \`\`\`
`,
        quiz: [
            {
                question: "Where does Box<T> store its data?",
                options: ["Stack", "Heap", "Static memory", "Registers"],
                correctIndex: 1,
            },
            {
                question: "Why do recursive types need a Box?",
                options: [
                    "To make them faster",
                    "To give them a known, fixed size (the size of a pointer)",
                    "Because recursion is dangerous",
                    "They don't need a Box"
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write a function _BT_double_box(b: Box<i32>) -> i32_BT_ that:

1. Takes a boxed integer.
2. Dereferences it using the _BT_*_BT_ operator.
3. Multiplies the inner value by 2 and returns it.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_double_box() {
        let b = Box::new(10);
        assert_eq!(double_box(b), 20);
    }

    #[test]
    fn test_double_box_large() {
        let b = Box::new(1000);
        assert_eq!(double_box(b), 2000);
    }
}`,
        starter_code: `// Write: double_box(b: Box<i32>) -> i32

fn main() {
    let my_box = Box::new(500);
    let result = double_box(my_box);
    println!("Result: {}", result);
}
`,
    },
    {
        id: "ch15-04",
        chapter: "15.4",
        title: "Rc<T>, the Reference Counted Smart Pointer",
        sort_order: 151,
        environment: "browser",
        content: `# Rc<T>: Reference Counting

In Rust, ownership is usually clear: one variable owns the data. But some scenarios (like Graph data structures) require **Multiple Ownership**.

Imagine a TV in a family room.
*   When Mom enters, she turns it on (Count = 1).
*   When Dad enters, the TV stays on (Count = 2).
*   Mom leaves (Count = 1).
*   Dad leaves (Count = 0). **The TV turns off.**

This is exactly how \`Rc<T>\` (Reference Counted) works. It keeps track of the number of references to a value. When the count hits zero, the value is cleaned up.

## Usage

\`\`\`rust
use std::rc::Rc;

let a = Rc::new(String::from("Shared Data"));
let b = Rc::clone(&a); // Count is now 2
let c = Rc::clone(&a); // Count is now 3
\`\`\`

Note: \`Rc::clone\` doesn't copy the data (deep copy). It just increments the counter (fast!).

## ⚠️ Common Mistakes

1.  **Using \`Rc\` multiple threads**: \`Rc\` is NOT thread-safe. If you need shared ownership across threads, you must use **\`Arc\`** (Atomic Reference Counted).
2.  **Reference Cycles**: If Item A holds an \`Rc\` to Item B, and Item B holds an \`Rc\` to Item A, the count will never reach zero. This is a memory leak! Rust guarantees memory safety, but not absence of leaks (though they are rare).`,
        quiz: [
            {
                question: "What happens when Rc count reaches zero?",
                options: ["nothing", "the data is cleaned up (dropped)", "the program panics", "it resets to 1"],
                correctIndex: 1,
            },
            {
                question: "Can Rc<T> be used to share data between threads safe?",
                options: ["Yes", "No, use Arc<T> instead", "Only if T is Sync", "Only if T is Send"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission
        
Write a function _BT_count_references(s: &str) -> usize_BT_ that:

1. Creates an _BT_Rc<String>_BT_ from the input string.
2. Creates **two** clones of that _BT_Rc_BT_.
3. Returns the **strong count** of the original _BT_Rc_BT_.
   *(Hint: It should be 3 if you did it right!)*`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use std::rc::Rc; // Verify they can use it or import it

    #[test]
    fn test_count_is_three() {
        assert_eq!(count_references("hello"), 3);
    }
}`,
        starter_code: `use std::rc::Rc;

// Write: count_references(s: &str) -> usize

fn main() {
    let count = count_references("Rust");
    println!("Reference count: {}", count);
}
`,
    },
    {
        id: "ch15-05",
        chapter: "15.5",
        title: "RefCell<T> and Interior Mutability",
        sort_order: 152,
        environment: "browser",
        content: `# RefCell<T>

**Interior mutability** is a design pattern in Rust that arguably "cheats" the borrow checker. It allows you to mutate data even when there are immutable references to that data.

## Runtime Borrow Checking

*   **Box<T>**: Checks borrowing rules at **Compile Time**. If you mess up, code doesn't compile.
*   **RefCell<T>**: Checks borrowing rules at **Run Time**. If you mess up, the program **panics** (crashes).

Why use it? sometimes the compiler is too strict. You know your code is safe, but the compiler can't prove it. \`RefCell\` lets you say "Trust me, I'll handle it at runtime."

## Syntax

*   Use \`borrow()\` to get an immutable reference.
*   Use \`borrow_mut()\` to get a mutable reference.

## ⚠️ Common Mistakes

1.  **Panicking**: Just because it compiles doesn't mean it's right! If you call \`borrow_mut()\` twice in the same scope, your program *will* crash.
    \`\`\`rust
    let x = RefCell::new(5);
    let mut one = x.borrow_mut();
    let mut two = x.borrow_mut(); // PANIC! Already borrowed mutably.
    \`\`\`
2.  **Overusing**: \`RefCell\` has a small runtime performance cost. Prefer standard borrowing if possible.`,
        quiz: [
            {
                question: "When does RefCell<T> check borrowing rules?",
                options: ["Compile time", "Runtime", "Initialization time", "It doesn't check them"],
                correctIndex: 1,
            },
            {
                question: "What happens if you violate borrowing rules with RefCell?",
                options: ["Compiler error", "Undefined behavior", "Runtime Panic", "Silent failure"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Write a function _BT_add_ten(r: &RefCell<i32>)_BT_ that:

1. Borrows the contents of the RefCell mutably.
2. Adds **10** to the inner value.
3. Prints the new value.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use std::cell::RefCell;

    #[test]
    fn test_modification() {
        let r = RefCell::new(5);
        add_ten(&r);
        assert_eq!(*r.borrow(), 15);
    }

    #[test]
    fn test_modification_again() {
        let r = RefCell::new(100);
        add_ten(&r);
        assert_eq!(*r.borrow(), 110);
    }
}`,
        starter_code: `use std::cell::RefCell;

// Write: add_ten(r: &RefCell<i32>)

fn main() {
    let data = RefCell::new(10);
    add_ten(&data);
    println!("Main sees: {:?}", data);
}
`,
    },
];
