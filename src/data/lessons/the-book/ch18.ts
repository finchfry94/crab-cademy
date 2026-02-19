import { Lesson } from "../../types";

export const ch18Lessons: Lesson[] = [
    {
        id: "ch18-02",
        chapter: "18.2",
        title: "Using Trait Objects for Different Types",
        sort_order: 180,
        environment: "browser",
        content: `# Trait Objects: Polymorphism

In languages like Java or C++, you might have a list of \`Shape\` objects, where some are \`Circles\` and some are \`Squares\`.
In Rust, vectors usually must contain elements of the **same type**.

So how do we store a mix of \`Circle\` and \`Square\`?
We use **Trait Objects**.

## The \`dyn\` keyword

Instead of storing the concrete struct, we store a pointer to "something that implements the Trait".

\`\`\`rust
pub trait Draw {
    fn draw(&self);
}

pub struct Screen {
    // A vector of boxes. Each box holds "some type responsible for its own drawing"
    pub components: Vec<Box<dyn Draw>>,
}
\`\`\`

## Static vs Dynamic Dispatch

*   **Generics (\`T: Draw\`)**: Compiler generates code for *each* concrete type (Static Dispatch). Very fast, but you can only have one type in the list.
*   **Trait Objects (\`Box<dyn Draw>\`)**: Compiler generates code that looks up the method at runtime (Dynamic Dispatch via vtable). Slower, but allows mixed types.

## ⚠️ Common Mistakes

1.  **Object Safety**: Not all traits can be made into objects. If a trait method returns \`Self\` or has generic parameters, it is **not object-safe**.
    *   *Why?* Because at runtime, we don't know what \`Self\` is anymore!
2.  **Forgetting \`Box\` (or \`&\`)**: You cannot have a variable of type \`dyn Draw\`. It has no size! You must always put it behind a pointer like \`&dyn Draw\` or \`Box<dyn Draw>\`.`,
        quiz: [
            {
                question: "Which keyword denotes a trait object?",
                options: ["dyn", "impl", "trait", "box"],
                correctIndex: 0,
            },
            {
                question: "Do trait objects use static or dynamic dispatch?",
                options: ["Static", "Dynamic", "Both", "Neither"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Define a trait _BT_Area_BT_ with a method _BT_calc_area(&self) -> f64_BT_.
2. Implement it for struct _BT_Circle_BT_ and _BT_Square_BT_.
3. Create a _BT_Vec<Box<dyn Area>>_BT_ containing one of each.
4. Iterate and print their areas.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use std::f64::consts::PI;

    #[test]
    fn test_trait_objects() {
        let shapes: Vec<Box<dyn Area>> = vec![
            Box::new(Circle { radius: 1.0 }),
            Box::new(Square { side: 2.0 }),
        ];
        
        let areas: Vec<f64> = shapes.iter().map(|s| s.calc_area()).collect();
        assert!((areas[0] - PI).abs() < 1e-5); // Circle area
        assert!((areas[1] - 4.0).abs() < 1e-5); // Square area
    }
}`,
        starter_code: `trait Area {
    fn calc_area(&self) -> f64;
}

struct Circle { radius: f64 }
impl Area for Circle {
    fn calc_area(&self) -> f64 { std::f64::consts::PI * self.radius * self.radius }
}

struct Square { side: f64 }
impl Area for Square {
    fn calc_area(&self) -> f64 { self.side * self.side }
}

fn main() {
    // 1. Create the vector of Box<dyn Area>
    // let shapes: Vec<Box<dyn Area>> = vec![ ... ];

    // 2. Iterate and print
    // for shape in shapes ...
}
`,
    },
    {
        id: "ch18-03",
        chapter: "18.3",
        title: "The State Design Pattern",
        sort_order: 181,
        environment: "browser",
        content: `# The State Pattern

Rust's ownership system allows us to implement the **State Pattern** in a very safe way. We can ensure that invalid states are impossible at compile time.

Imagine a Blog Post.
1.  Starts as **Draft**. (Can add text, can't approve).
2.  Moves to **PendingReview**. (Can't add text, can approve).
3.  Moves to **Published**. (Content is visible).

## Encoding State as Types

Instead of a single \`Post\` struct with a \`status: String\` field, we can have different types for each state.

\`\`\`rust
struct Draft {
    content: String,
}

struct PendingReview {
    content: String,
}

impl Draft {
    fn request_review(self) -> PendingReview {
        PendingReview { content: self.content }
    }
}
\`\`\`

Notice how \`request_review\` takes \`self\` (ownership)? The \`Draft\` is consumed and destroyed. It is replaced by a \`PendingReview\`. You can no longer mistakenly modify the draft, because the variable assumes a new type!

## ⚠️ Common Mistakes

1.  **Partial Moves**: If you have a struct with \`state: Option<Box<dyn State>>\`, you often need to \`.take()\` the value out of the Option to own it.
2.  **Over-Engineering**: This pattern is powerful but verbose. For simple boolean flags (is_active), just use a \`bool\`. Don't create a whole class hierarchy unless the *behavior* changes significantly.`,
        quiz: [
            {
                question: "Why do state transition methods often take 'self' by value?",
                options: [
                    "To save memory",
                    "To consume the old state so it can't be reused",
                    "Because 'self' is faster than '&self'",
                    "It's required by the trait"
                ],
                correctIndex: 1,
            },
            {
                question: "What is the benefit of encoding state in types?",
                options: ["Compile-time verification of valid transitions", "Runtime speed", "Smaller binary size", "Easier to debug"],
                correctIndex: 0,
            },
        ],
        objectives: `## Your Mission

1. Create a _BT_Draft_BT_ struct.
2. Implement a method _BT_request_review_BT_ that consumes the draft and returns a _BT_PendingReview_BT_ struct.
3. In main, convert a Draft to PendingReview.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_state_transition() {
        let d = Draft { content: String::from("Hello World") };
        let p = d.request_review();
        assert_eq!(p.content, "Hello World");
    }
}`,
        starter_code: `struct Draft { content: String }
struct PendingReview { content: String }

impl Draft {
    // Implement request_review(self) -> PendingReview
}

fn main() {
    let d = Draft { content: String::from("Hello") };
    // let p = d.request_review();
}
`,
    },
];
