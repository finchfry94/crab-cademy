import { Lesson } from "../../types";

export const ch15Lessons: Lesson[] = [
    {
        id: "ch15-01",
        chapter: "15.1",
        title: "Using Box<T> to Point to Data on the Heap",
        sort_order: 150,
        environment: "browser",
        content: `# Box<T>

_BT_Box<T>_BT_ is the most straightforward smart pointer. It allows you to store data on the heap rather than the stack. 

## When to use Box
- When you have a type whose size can’t be known at compile time (recursive types).
- When you have a large amount of data and you want to transfer ownership but ensure the data won’t be copied.
- When you want to own a value and you care only that it’s a type that implements a particular trait rather than being of a specific type.

_BT__BT__BT_rust
let b = Box::new(5);
println!("b = {}", b);
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Where does Box<T> store its data?",
                options: ["Stack", "Heap", "Static memory", "Registers"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Create a _BT_Box_BT_ containing an array of 1000 integers.
2. Demonstrate that you can still access the data normally.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    #[test]
    fn test_box() {
        let b = Box::new([0; 1000]);
        assert_eq!(b.len(), 1000);
    }
}`,
        starter_code: `fn main() {
    // Create a Boxed array
    let b = Box::new([0; 1000]);
    println!("Length: {}", b.len());
}
`,
    },
    {
        id: "ch15-04",
        chapter: "15.4",
        title: "Rc<T>, the Reference Counted Smart Pointer",
        sort_order: 151,
        environment: "browser",
        content: `# Rc<T>

_BT_Rc<T>_BT_ stands for **reference counting**. It keeps track of the number of references to a value to determine whether or not the value is still in use. If there are zero references to a value, the value can be cleaned up.

## Single Ownership vs Multiple Ownership
- _BT_Box<T>_BT_ has a single owner.
- _BT_Rc<T>_BT_ allows multiple owners for a single value.

Note: _BT_Rc<T>_BT_ is only for use in single-threaded scenarios!`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What does Rc stand for?",
                options: ["Runtime Container", "Reference Counting", "Recursive Call", "Read-only Collection"],
                correctIndex: 1,
            },
            {
                question: "Can Rc<T> be used to share data between threads safely?",
                options: ["Yes", "No, only in single-threaded scenarios", "Only if T is Sync", "Only if T is Send"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Create an _BT_Rc_BT_ wrapping a String.
2. Use _BT_Rc::clone(&a)_BT_ to create multiple references.
3. Print the reference count using _BT_Rc::strong_count(&a)_BT_.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use std::rc::Rc;

    #[test]
    fn test_rc_count() {
        let a = Rc::new(String::from("test"));
        let b = Rc::clone(&a);
        assert_eq!(Rc::strong_count(&a), 2);
    }
}`,
        starter_code: `use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("hello"));
    let b = Rc::clone(&a);
    
    println!("Count: {}", Rc::strong_count(&a));
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

**Interior mutability** is a design pattern in Rust that allows you to mutate data even when there are immutable references to that data.

## Borrowing Rules at Runtime
Unlike _BT_Box<T>_BT_, _BT_RefCell<T>_BT_ enforces the borrowing rules **at runtime** instead of compile time. 

- Use _BT_borrow()_BT_ for an immutable borrow.
- Use _BT_borrow_mut()_BT_ for a mutable borrow.

If you violate the rules (e.g., two mutable borrows), the program will panic at runtime.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "When does RefCell<T> check borrowing rules?",
                options: ["Compile time", "Runtime", "Initialization time", "It doesn't check them"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Create a _BT_RefCell_BT_ containing a value.
2. Mutate the value inside an immutable reference using _BT_borrow_mut()_BT_.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use std::cell::RefCell;

    #[test]
    fn test_refcell() {
        let x = RefCell::new(5);
        {
            let mut y = x.borrow_mut();
            *y += 1;
        }
        assert_eq!(*x.borrow(), 6);
    }
}`,
        starter_code: `use std::cell::RefCell;

fn main() {
    let x = RefCell::new(10);
    
    // Mutate x using a borrow_mut()
    
    println!("Value: {}", x.borrow());
}
`,
    },
];
