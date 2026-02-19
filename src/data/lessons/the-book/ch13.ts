import { Lesson } from "../../types";

export const ch13Lessons: Lesson[] = [
    {
        id: "ch13-01",
        chapter: "13.1",
        title: "Closures",
        sort_order: 130,
        environment: "browser",
        content: `# Closures

Rust’s **Closures** are anonymous functions you can save in a variable or pass as arguments to other functions.

Think of them like functions with a "backpack." They can capture variables from the scope where they were defined and carry them around.

## Syntax: The Pipes \`| |\`

Closure syntax looks similar to closure definitions in Ruby or Smalltalk. We use pipes \`| |\` instead of parentheses \`()\` to hold arguments.

\`\`\`rust
let add_one = |x: i32| x + 1;
//            ^ inputs ^ body
\`\`\`

## Capturing the Environment

This is the superpower of closures. Regular functions *cannot* see variables outside their own body. Closures can!

\`\`\`rust
let x = 4;

// This closure "captures" x from the surroundings
let equal_to_x = |z| z == x;

assert!(equal_to_x(4)); // true
\`\`\`

If you tried to do this with \`fn equal_to_x(z: i32) { z == x }\`, the compiler would yell at you because \`x\` is not an argument.

## Moving Ownership

Sometimes you want the closure to take *ownership* of the data it uses (so it can live longer than the current scope, for example). Use the \`move\` keyword:

\`\`\`rust
let x = vec![1, 2, 3];
let equal_to_x = move |z| z == x;
// x is now gone from the outer scope!
\`\`\`

## ⚠️ Common Mistakes

1.  **Type Inference Confusion**: Closures usually infer types. But if you use strict types in one place, you can't change them later.
    \`\`\`rust
    let example = |x| x;
    let s = example(String::from("hello"));
    let n = example(5); // Error! Compiler already decided 'x' is a String.
    \`\`\`
2.  **Borrowing Rules apply**: If a closure borrows \`x\` immutably, you can't mutate \`x\` elsewhere until the closure is destroyed.`,
        quiz: [
            {
                question: "What is the main difference between functions and closures?",
                options: [
                    "Closures are faster",
                    "Closures can capture their environment (variables)",
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

1. Create a closure named _BT_double_BT_.
2. It should take one argument _BT_x_BT_ and return _BT_x * 2_BT_.
3. Create a variable _BT_multiplier_BT_ = 10.
4. Create a closure _BT_times_ten_BT_ that captures _BT_multiplier_BT_ and multiplies its input by it.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_closure_logic() {
        let n = 5;
        let double = |x| x * 2;
        assert_eq!(double(n), 10);
        
        let multiplier = 10;
        let times_ten = |x| x * multiplier;
        assert_eq!(times_ten(n), 50);
    }
}`,
        starter_code: `fn main() {
    // 1. Define 'double' closure
    
    // 2. Define 'multiplier' variable and 'times_ten' closure
    
    let n = 5;
    // println!("Double 5: {}", double(5));
    // println!("5 times 10: {}", times_ten(5));
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

The Iterator pattern allows you to perform some task on a sequence of items in turn. 

## The "Water Pipe" Analogy

In Rust, iterators are **Lazy**. This means creating an iterator doesn't actually *do* anything. It's like building a system of water pipes. The water doesn't flow until you turn the tap on at the very end.

\`\`\`rust
let v1 = vec![1, 2, 3];
let v1_iter = v1.iter(); // No work is done here! Just setup.
\`\`\`

## Consumer vs Adaptor

1.  **Iterator Adaptors**: These attach pipes to other pipes. They transform the data but don't pull it through yet.
    *   \`.map(|x| x + 1)\`: "When data comes through, add 1 to it."
    *   \`.filter(|x| x > 10)\`: "When data comes through, only let big numbers pass."

2.  **Consuming Adaptors**: These are the "tap" at the end. They pull data through the whole pipeline and give you a result.
    *   \`.collect()\`: "Run the pipe and gather results into a collection (like a Vec)."
    *   \`.sum()\`: "Run the pipe and add everything up."

## Example Chain

\`\`\`rust
let v1 = vec![1, 2, 3];
let v2: Vec<_> = v1.iter()
                   .map(|x| x + 1)
                   .collect();
// v2 is [2, 3, 4]
\`\`\`

## ⚠️ Common Mistakes

1.  **Forgetting \`collect()\`**: If you just write \`my_vec.iter().map(|x| x + 1);\`, the compiler will warn you "unused iterator". Why? Because iterators are lazy! Without \`collect\` (or a \`for\` loop), the code *never runs*.
2.  **Type Annotations**: \`collect()\` is magical—it can turn an iterator into a Vec, a HashMap, a Set, etc. Because it's so flexible, Rust often needs a hint: \`let v: Vec<i32> = ...\`.`,
        quiz: [
            {
                question: "What does it mean that iterators are 'lazy'?",
                options: [
                    "They use very little memory",
                    "They don't do anything until consumed (the 'tap' is turned on)",
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

We have a list of numbers: 1 through 6.
1.  Filter to keep only **even** numbers.
2.  Multiply them by **10**.
3.  Collect them into a new Vector.`.replace(/_BT_/g, '`'),
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
    
    // Fill in the blanks!
    // let result: Vec<i32> = numbers.into_iter()
    //     .filter(...)
    //     .map(...)
    //     .collect();

    // println!("{:?}", result);
}
`,
    },
];
