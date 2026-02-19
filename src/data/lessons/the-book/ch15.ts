import { Lesson } from "../../types";

export const ch15Lessons: Lesson[] = [
    {
        id: "ch15-01",
        chapter: "15.1",
        title: "Using Box<T> to Point to Data on the Heap",
        sort_order: 150,
        environment: "browser",
        content: `# Box<T>

\u0060Box<T>\u0060 is the most straightforward smart pointer. It allows you to store data on the **Heap** rather than the **Stack**.

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

1. Create a _BT_Box_BT_ containing the number 1000.
2. Dereference the box to multiply the inner value by 2.
3. Print the result.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    #[test]
    fn test_box() {
        let b = Box::new(1000);
        let val = *b * 2;
        assert_eq!(val, 2000);
    }
}`,
        starter_code: `fn main() {
    // 1. Create a Box with 1000
    // let b = ...
    
    // 2. Dereference and multiply
    // let result = ...
    
    // println!("{}", result);
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

1. Create an _BT_Rc_BT_ wrapping a String "Rust".
2. Create two clones of it.
3. Assert that the strong count is 3.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use std::rc::Rc;

    #[test]
    fn test_rc_count() {
        let a = Rc::new(String::from("Rust"));
        let b = Rc::clone(&a);
        let c = Rc::clone(&a);
        assert_eq!(Rc::strong_count(&a), 3);
    }
}`,
        starter_code: `use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("Rust"));
    // Clone 'a' into 'b' and 'c'
    
    // println!("Count: {}", Rc::strong_count(&a));
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

We have an immutable variable \`data\`. Use \`RefCell\` to mutate it anyway.

1.  Wrap the integer 10 in a \`RefCell\`.
2.  Use \`borrow_mut()\` to change the value to 20.
3.  Print the new value using \`borrow()\`.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use std::cell::RefCell;

    #[test]
    fn test_refcell() {
        let data = RefCell::new(10);
        *data.borrow_mut() = 20;
        assert_eq!(*data.borrow(), 20);
    }
}`,
        starter_code: `use std::cell::RefCell;

fn main() {
    let data = RefCell::new(10);
    
    // Mutate it to 20!
    
    println!("Value: {}", data.borrow());
}
`,
    },
];
