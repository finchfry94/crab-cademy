import { Lesson } from "../../types";

export const ch19Lessons: Lesson[] = [
    {
        id: "ch19-01",
        chapter: "19.1",
        title: "All the Places Patterns Can Be Used",
        sort_order: 191,
        environment: "browser",
        content: `# Patterns are Everywhere

You might think patterns are just for \`match\` statements. But they are actually baked into the core of Rust!

## 1. \`if let\`
Mixes \`if\` and \`match\`. It runs code only if the pattern matches.

\`\`\`rust
let favorite_color: Option<&str> = None;
if let Some(color) = favorite_color {
    println!("Using your favorite color, {}, as the background", color);
}
\`\`\`

## 2. \`while let\`
Runs a loop *as long as* the pattern continues to match. Great for iterating over iterators or channels.

\`\`\`rust
let mut stack = Vec::new();
stack.push(1);
stack.push(2);

while let Some(top) = stack.pop() {
    println!("{}", top);
}
\`\`\`

## 3. \`for\` loops
The \`for x in y\` syntax is actually a pattern!
\`\`\`rust
let v = vec!['a', 'b', 'c'];
for (index, value) in v.iter().enumerate() {
    println!("{} is at index {}", value, index);
}
\`\`\`

## 4. \`let\` statements
Surprise! \`let x = 5;\` is a pattern match. \`x\` is a pattern that means "bind everything to x".
Request: \`let (x, y) = (1, 2);\`

## ⚠️ Common Mistakes
1.  **Refutable Patterns in \`let\`**: You can't say \`let Some(x) = ...\` because what if it's None? \`let\` requires an **Irrefutable Pattern** (one that always matches). \`if let\` allows **Refutable Patterns**.`,
        quiz: [
            {
                question: "Which of these allows Refutable patterns (patterns that might fail)?",
                options: ["let", "if let", "function parameters", "struct fields"],
                correctIndex: 1,
            },
            {
                question: "What happens if a 'while let' pattern stops matching?",
                options: ["The program panics", "The loop ends", "It tries again", "Compiler error"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Create a Vector with values 1, 2, 3.
2. Use a _BT_while let_BT_ loop to pop values off the vector and sum them up.`.replace(/_BT_/g, '`'),
        test_code: `// We need a way to check if they actually used a while let loop or just calculated the sum.
// For now we check if sum equals 6 given the starting vector.
#[cfg(test)]
mod tests {
    #[test]
    fn test_while_let() {
        let mut stack = vec![1, 2, 3];
        let mut sum = 0;
        while let Some(top) = stack.pop() {
            sum += top;
        }
        assert_eq!(sum, 6);
    }
}`,
        starter_code: `fn main() {
    let mut stack = vec![1, 2, 3];
    let mut sum = 0;

    // Write a while let loop here to pop and add to sum
    
    println!("Sum: {}", sum);
}
`,
    },
    {
        id: "ch19-03",
        chapter: "19.3",
        title: "Pattern Syntax",
        sort_order: 190,
        environment: "browser",
        content: `# Pattern Syntax

Patterns are not just for \`match\` expressions. You use them every time you write \`let x = ...\` (where \`x\` is a simple pattern).

Rust patterns are incredibly powerful. You can match against literals, variables, structures, and even ranges.

## Multiple Patterns
You can use \`|\` (Pipe) to match multiple patterns (Logical OR):
\`\`\`rust
match x {
    1 | 2 => println!("one or two"),
    _ => println!("anything"),
}
\`\`\`

## Ranges
Use \`..=\` for inclusive ranges:
\`\`\`rust
match x {
    1..=5 => println!("one through five"),
    _ => println!("something else"),
}
\`\`\`

## Destructuring Structs
Matches can break objects apart!

\`\`\`rust
struct Point { x: i32, y: i32 }

fn main() {
    let p = Point { x: 0, y: 7 };

    match p {
        // Match only if y is 0
        Point { x, y: 0 } => println!("On the x axis at {}", x),
        // Match only if x is 0
        Point { x: 0, y } => println!("On the y axis at {}", y),
        // Match anything else
        Point { x, y } => println!("On neither axis: ({}, {})", x, y),
    }
}
\`\`\`

## ⚠️ Common Mistakes

1.  **Ranges are Inclusive**: Rust ranges in patterns MUST be inclusive (\`..=\`). You cannot use exclusive ranges (\`..\`) in patterns because they are ambiguous for some types.
2.  **Shadowing**: If you introduce a variable name in a match arm, it **shadows** any outer variable.
    \`\`\`rust
    let x = Some(5);
    let y = 10;
    match x {
        Some(50) => println!("Got 50"),
        Some(y) => println!("Matched, y = {}", y), // This 'y' is a NEW variable containing 5!
        _ => println!("Default case, x = {:?}", x),
    }
    \`\`\`
    In the second arm, \`y\` matches *anything* inside the \`Some\`. It does **NOT** check if it equals the outer \`y\` (10). To match against an outer variable, use a **Match Guard** (\`Some(n) if n == y\`).`,
        quiz: [
            {
                question: "Which operator is used to match a range of values?",
                options: ["...", "..", "..=", "|"],
                correctIndex: 2,
            },
            {
                question: "What does the | operator do in a pattern?",
                options: ["Logical OR (matches either pattern)", "Bitwise OR", "Pipe output"],
                correctIndex: 0,
            },
        ],
        objectives: `## Your Mission

1. Define a struct _BT_Point_BT_ with x and y fields.
2. Write a function _BT_check_point(p: Point) -> &'static str_BT_.
3. Use a _BT_match_BT_ expression to return _BT_"On Y Axis"_BT_ when x is 0, and _BT_"Elsewhere"_BT_ otherwise.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_pattern_match() {
        let p1 = Point { x: 0, y: 7 };
        let p2 = Point { x: 5, y: 5 };
        assert_eq!(check_point(p1), "On Y Axis");
        assert_eq!(check_point(p2), "Elsewhere");
    }
}`,
        starter_code: `struct Point { x: i32, y: i32 }

// 1. Define: fn check_point(p: Point) -> &'static str

fn main() {
    let p = Point { x: 0, y: 7 };
    println!("Point status: {}", check_point(p));
}
`,
    },
];
