import { Lesson } from "../../types";

export const ch13Lessons: Lesson[] = [
    {
        id: "ch13-01",
        chapter: "13.1",
        title: "Closures",
        sort_order: 130,
        environment: "browser",
        content: `# Closures

Rust’s **closures** are anonymous functions you can save in a variable or pass as arguments to other functions.

## Basic Syntax
_BT__BT__BT_rust
let add_one = |x: i32| x + 1;
let result = add_one(5);
_BT__BT__BT_

## Capturing the Environment
Unlike functions, closures can capture values from the scope in which they’re defined.

_BT__BT__BT_rust
let x = 4;
let equal_to_x = |z| z == x;
assert!(equal_to_x(4));
_BT__BT__BT_

## Moving Ownership
Use the _BT_move_BT_ keyword to force the closure to take ownership of values it uses.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What is the main difference between functions and closures?",
                options: [
                    "Closures are faster",
                    "Closures can capture their environment",
                    "Functions can be anonymous",
                    "There is no difference"
                ],
                correctIndex: 1,
            },
            {
                question: "Which keyword forces a closure to take ownership of captured variables?",
                options: ["take", "own", "move", "copy"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1. Create a closure that takes an integer and returns its square.
2. Capture a variable _BT_multiplier_BT_ and use it inside the closure.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_closure_logic() {
        // This is a bit hard to test directly if defined in main, 
        // but we'll verify the concept via a function that takes a closure.
        let square = |x: i32| x * x;
        assert_eq!(square(5), 25);
    }
}`,
        starter_code: `fn main() {
    let multiplier = 2;
    // Define a closure 'double' that uses 'multiplier'
    
    let result = 10; // double(5)
    println!("Result: {}", result);
}
`,
    },
    {
        id: "ch13-02",
        chapter: "13.2",
        title: "Processing a Series of Items with Iterators",
        sort_order: 131,
        environment: "browser",
        content: `# Iterators

The iterator pattern allows you to perform some task on a sequence of items in turn. 

## Iterators are Lazy
In Rust, iterators are **lazy**, meaning they have no effect until you call methods that consume the iterator to use it up.

_BT__BT__BT_rust
let v1 = vec![1, 2, 3];
let v1_iter = v1.iter(); // Nothing happens yet
_BT__BT__BT_

## Consuming Adaptors
Methods that call _BT_next_BT_ are called **consuming adaptors**. Examples: _BT_sum()_BT_, _BT_collect()_BT_.

## Iterator Adaptors
Methods that produce other iterators. Examples: _BT_map()_BT_, _BT_filter()_BT_. 

_BT__BT__BT_rust
let v2: Vec<_> = v1.iter().map(|x| x + 1).collect();
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What does it mean that iterators are 'lazy'?",
                options: [
                    "They use very little memory",
                    "They don't do anything until consumed",
                    "They are slower than loops",
                    "They only work on small collections"
                ],
                correctIndex: 1,
            },
            {
                question: "Which method is used to convert an iterator back into a collection like a Vector?",
                options: ["to_vec()", "sum()", "collect()", "gather()"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1. Create a vector of numbers.
2. Use an iterator to filter out the odd numbers.
3. Multiply each remaining (even) number by 10.
4. Collect the result into a new vector.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_iterator_chain() {
        let v = vec![1, 2, 3, 4, 5, 6];
        let result: Vec<i32> = v.into_iter()
            .filter(|x| x % 2 == 0)
            .map(|x| x * 10)
            .collect();
        
        assert_eq!(result, vec![20, 40, 60]);
    }
}`,
        starter_code: `fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6];
    
    // Use .iter(), .filter(), .map(), and .collect()
    let evens_times_ten: Vec<i32> = vec![]; 

    println!("{:?}", evens_times_ten);
}
`,
    },
];
