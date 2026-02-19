import { Lesson } from "../../types";

export const ch10Lessons: Lesson[] = [
    {
        id: "ch10-01",
        chapter: "10.1",
        title: "Generic Data Types",
        sort_order: 100,
        environment: "browser",
        content: `# Generic Data Types

Imagine you have a screwdriver with interchangeable bits. You have one handle, but you can swap out the head to fit a Phillips screw, a flathead, or a hex bolt. The handle doesn't care what bit is attached; it just knows how to turn.

**Generics** are the "interchangeable bits" of programming. They allow you to write code that works with *any* data type, rather than being stuck with just integers or just strings.

Without generics, if you wanted a list of integers and a list of strings, you might have to write two separate structs. With generics, you write one struct that works for both.

## The Syntax of Generics

You've actually seen generics before! Remember \`Vec<T>\`? That \`<T>\` meant "This vector can hold any type T."

Here is how we define a **generic function** that finds the largest item in a list:

\`\`\`rust
fn largest<T>(list: &[T]) -> T { ... }
\`\`\`

### Anatomy of Generic Syntax

| Code Fragment | Meaning |
|---|---|
| \`<T>\` | "I am declaring a generic type parameter named T." (You can name it anything, but T is convention). |
| \`list: &[T]\` | "This function takes a slice of items of type T." |
| \`-> T\` | "This function returns one value of type T." |

## Generics in Structs

We can also use generics in structs. Here is a \`Point\` struct that can hold coordinates of any type:

\`\`\`rust
struct Point<T> {
    x: T,
    y: T,
}

let integer_point = Point { x: 5, y: 10 };
let float_point = Point { x: 1.0, y: 4.0 };
\`\`\`

However, notice that we used \`T\` for **both** \`x\` and \`y\`. This means they MUST be the same type.

\`\`\`rust
let wont_work = Point { x: 5, y: 4.0 }; // Error! Expected integer, found float.
\`\`\`

If we want them to be different, we need *two* generic parameters:

\`\`\`rust
struct Point<T, U> {
    x: T,
    y: U,
}
let mixed = Point { x: 5, y: 4.0 }; // Now this works!
\`\`\`

## ⚠️ Common Mistakes

1.  **Mismatched Types**: If a struct uses one parameter \`<T>\` for multiple fields, those fields *must* be the same type. If you need them to vary, use multiple parameters like \`<T, U>\`.
2.  **Assuming Operations**: If you write \`fn add<T>(a: T, b: T)\`, Rust won't let you do \`a + b\` initially. Why? because \`T\` could be a String, or a File, or a Banana! Rust doesn't know if "Bananas" can be added. We fix this with **Traits** (next lesson).
3.  **Syntax Confusion**: It's easy to forget to declare the type inside the angle brackets \`<T>\` after the function or struct name. \`fn function(x: T)\` is an error; \`fn function<T>(x: T)\` is correct.`,
        quiz: [
            {
                question: "What does `<T>` signify in a function definition?",
                options: [
                    "It's a specific type called 'T'",
                    "It declares a generic type parameter placeholder",
                    "It stands for 'Type' and is a keyword",
                    "It means the function takes no arguments",
                ],
                correctIndex: 1,
            },
            {
                question: "If I define `struct Point<T> { x: T, y: T }`, can I do `Point { x: 5, y: 'a' }`?",
                options: [
                    "Yes, because T is generic",
                    "No, because 'x' and 'y' must be the EXACT same type",
                    "Yes, but only if I import std::types",
                    "No, structs cannot be generic",
                ],
                correctIndex: 1,
            },
            {
                question: "How do I define a struct with two fields that might be DIFFERENT types?",
                options: [
                    "struct Point<T> { x: T, y: T }",
                    "struct Point<T, T> { x: T, y: T }",
                    "struct Point<T, U> { x: T, y: U }",
                    "struct Point { x: Generic, y: Generic }",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

We need a flexible coordinate system.

1.  Define a struct named \`Pair<T>\` that has two fields: \`x\` and \`y\`, both of type \`T\`.
2.  Implement a specific method for \`Pair<T>\`:
    *   **Note**: We will assume \`T\` works for now.
    *   Write an implementation block \`impl<T> Pair<T>\`.
    *   Inside, write a function \`new(x: T, y: T) -> Self\`.

(The tests will check if your Pair works with both Integers and Floats!)`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_pair_int() {
        let p = Pair::new(1, 2);
        assert_eq!(p.x, 1);
        assert_eq!(p.y, 2);
    }

    #[test]
    fn test_pair_float() {
        let p = Pair::new(1.0, 2.0);
        assert_eq!(p.x, 1.0);
        assert_eq!(p.y, 2.0);
    }
}`,
        starter_code: `// 1. Define struct Pair<T> with fields x and y

// 2. Implement the 'new' function
// Hint: Start with 'impl<T> Pair<T> {'

fn main() {
    let int_pair = Pair::new(5, 10);
    let float_pair = Pair::new(1.5, 2.5);
    
    println!("Ints: {}, {}", int_pair.x, int_pair.y);
    println!("Floats: {}, {}", float_pair.x, float_pair.y);
}
`,
    },
    {
        id: "ch10-02",
        chapter: "10.2",
        title: "Traits: Defining Shared Behavior",
        sort_order: 101,
        environment: "browser",
        content: `# Traits

In the real world, a "Driver's License" is a trait. It doesn't matter if you are 18 or 80, if you are a student or a CEO. If you have the "Driver" trait, you can drive a car.

In Rust, a **Trait** tells the compiler about functionality a particular type has and can share with other types. It's similar to **interfaces** in languages like Java or TypeScript.

## Defining a Trait

We define a trait by declaring *function signatures* (the name, parameters, and return type) without the body.

\`\`\`rust
pub trait Summary {
    // Anyone who wants to be "Summary" must implement this function!
    fn summarize(&self) -> String;
}
\`\`\`

## Implementing a Trait

Now, let's say we have a \`Tweet\` struct. We can make sure it implements \`Summary\`.

\`\`\`rust
pub struct Tweet {
    pub username: String,
    pub content: String,
}

// "Implement Summary FOR Tweet"
impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}
\`\`\`

Now we can call \`.summarize()\` on any Tweet!

## Default Implementations

Sometimes, you want to provide a default behavior so users don't *have* to write the code unless they want to override it.

\`\`\`rust
pub trait Summary {
    // This has a body, so it's a default!
    fn summarize(&self) -> String {
        String::from("(Read more...)")
    }
}
\`\`\`

## ⚠️ Common Mistakes

1.  **The Orphan Rule**: You can only implement a trait if either the **Trait** or the **Type** belongs to your crate (your project). You cannot implement an external trait (like \`Display\`) on an external type (like \`Vec\`). At least one must be yours.
2.  **Forgetting \`pub\`**: If you want other modules or files to use your trait, both the trait itself AND its methods must be public.
3.  **Signature Mismatch**: When implementing a trait, your function signature must match the trait definition *exactly*. If the trait takes \`&self\`, you cannot take \`self\` (value) or \`&mut self\`.`,
        quiz: [
            {
                question: "What keyword is used to define a shared behavior interface?",
                options: ["interface", "class", "trait", "struct"],
                correctIndex: 2,
            },
            {
                question: "If a trait method has a default implementation body, do I HAVE to implement it for my struct?",
                options: [
                    "Yes, always",
                    "No, I can use the default behavior",
                    "Yes, but only if the struct is public",
                    "No, traits cannot have bodies",
                ],
                correctIndex: 1,
            },
            {
                question: "What is the 'Orphan Rule'?",
                options: [
                    "Traits cannot have parents",
                    "You cannot implement external traits on external types",
                    "Structs without methods are orphans",
                    "Functions cannot return traits",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

We want to format different types of people for a directory.

1.  Define a trait named \`Printable\`.
    *   It should have one method: \`format(&self) -> String\`.
2.  Define a struct named \`Person\` with fields \`name\` (String) and \`age\` (u8).
3.  Implement \`Printable\` for \`Person\`.
    *   The format should return: \`"Name: [name], Age: [age]"\`.`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_printable() {
        let p = Person { name: String::from("Alice"), age: 30 };
        assert_eq!(p.format(), "Name: Alice, Age: 30");
    }
    
    #[test]
    fn test_printable_bob() {
         let p = Person { name: String::from("Bob"), age: 50 };
        assert_eq!(p.format(), "Name: Bob, Age: 50");
    }
}`,
        starter_code: `// 1. Define trait Printable
// 2. Define struct Person
// 3. Implement Printable for Person

fn main() {
    let p = Person {
        name: String::from("Alice"),
        age: 30,
    };
    // If implemented correctly, this will work:
    println!("{}", p.format());
}
`,
    },
    {
        id: "ch10-03",
        chapter: "10.3",
        title: "Validating References with Lifetimes",
        sort_order: 102,
        environment: "browser",
        content: `# Lifetimes

**Warning:** This is widely considered the hardest concept for new Rustaceans. Don't panic if it feels weird at first!

In most languages, you don't think about how long variables live. Keeping track of that is the Garbage Collector's job. In C++, it's your job, and if you mess up, your program crashes.

In Rust, the **Borrow Checker** ensures memory safety. A **Lifetime** is simply a name Rust gives to "the scope for which this reference is valid."

## The Problem: Dangling References

Imagine I give you a post-it note saying "The book is in Locker 5." (This is a reference). Then, the janitor empties Locker 5 and burns the contents. Now my post-it note is a **Dangling Reference**—it points to garbage. Rust prevents this.

## Lifetime Annotations

Sometimes, the compiler gets confused. Look at this function:

\`\`\`rust
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() { x } else { y }
}
\`\`\`

Rust complains: *"I don't know if the returned reference comes from \`x\` or \`y\`. What if \`x\` is destroyed but I'm still using the result?"*

We need to tell Rust: "The result will live at least as long as both inputs."

\`\`\`rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    // ... same body
}
\`\`\`

### Anatomy of \`'a\`

*   **\`'\` (Tick)**: Starts a lifetime name.
*   **\`a\`**: The name. Usually \`'a\`, \`'b\`, \`'c\`. (Like generic \`T\`).
*   **Meaning**: We are NOT changing how long \`x\` or \`y\` lives. We are just telling the compiler: "Assume the return value lives as long as the *shortest* lived input."

## ⚠️ Common Mistakes

1.  **Thinking Lifetimes Change Runtime Behavior**: Annotating \`'a\` does NOT make a variable live longer. It just proves to the compiler that your code is safe. If the code is actually unsafe, adding \`'a\` won't fix it; the compiler will still reject it.
2.  **Dangling Returns**: You cannot return a reference to a value created *inside* the function.
    \`\`\`rust
    fn bad() -> &'static str {
        let s = String::from("hello");
        &s // Error! 's' is dropped when function ends. Reference would be invalid.
    }
    \`\`\`
    Solution: Return the \`String\` (ownership), not the reference \`&String\`.

## The \`'static\` Lifetime

There is one special lifetime: \`'static\`. It means "This reference can live for the entire duration of the program." String literals (like \`"hello"\`) are always \`'static\`.`,
        quiz: [
            {
                question: "What symbol indicates a lifetime parameter?",
                options: ["*", "&", "' (single quote/tick)", "#"],
                correctIndex: 2,
            },
            {
                question: "Do lifetime annotations make a value live longer?",
                options: [
                    "Yes, they prevent the garbage collector from running",
                    "No, they only verify relationships for the compiler",
                    "Yes, but only on the heap",
                    "It depends on the operating system",
                ],
                correctIndex: 1,
            },
            {
                question: "What does the 'static lifetime mean?",
                options: [
                    "The data is immutable (static)",
                    "The reference is valid for the entire program duration",
                    "The data is static electricity",
                    "The reference is invalid",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

We need to extract the first part of a string before a delimiter (like getting "hello" from "hello_world").

1.  Write a function named \`first_part\`.
2.  It needs lifetime annotations because it takes a string slice and returns a sub-slice of it.
3.  Signature: \`fn first_part<'a>(s: &'a str, delimiter: &str) -> &'a str\`
    *   Note: \`delimiter\` doesn't need \`'a\` because we don't return it.
4.  Logic:
    *   Use \`s.split(delimiter).next().unwrap()\` to get the first part easily.
    *   (In a real app we'd handle errors better, but \`unwrap\` is fine for learning here).`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_first_part_found() {
        assert_eq!(first_part("hello_world", "_"), "hello");
    }

    #[test]
    fn test_first_part_not_found() {
        assert_eq!(first_part("hello", "_"), "hello");
    }
    
    #[test]
    fn test_lifetimes_explicit() {
        let s = String::from("test-case");
        let result: &str;
        {
            let delim = String::from("-");
            result = first_part(&s, &delim);
        }
        assert_eq!(result, "test");
    }
}`,
        starter_code: `// Write: fn first_part<'a>(...) -> &'a str { ... }
// Hint: s.split(...) returns an iterator. .next() gets the first item.

fn main() {
    let s = String::from("hello_world");
    let part = first_part(&s, "_");
    println!("Part: {}", part);
}
`,
    },
];

