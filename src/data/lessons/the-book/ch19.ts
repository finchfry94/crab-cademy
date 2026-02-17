import { Lesson } from "../../types";

export const ch19Lessons: Lesson[] = [
    {
        id: "ch19-03",
        chapter: "19.3",
        title: "Pattern Syntax",
        sort_order: 172,
        environment: "browser",
        content: `# Pattern Syntax

Rust patterns are incredibly powerful. You can match against literals, variables, structures, and even ranges.

## Multiple Patterns
You can use _BT_|_BT_ to match multiple patterns:
_BT__BT__BT_rust
match x {
    1 | 2 => println!("one or two"),
    _ => println!("anything"),
}
_BT__BT__BT_

## Ranges
Use _BT_..=_BT_ for inclusive ranges:
_BT__BT__BT_rust
match x {
    1..=5 => println!("one through five"),
    _ => println!("something else"),
}
_BT__BT__BT_

## Destructing
You can break apart structs and enums:
_BT__BT__BT_rust
let p = Point { x: 0, y: 7 };
let Point { x: a, y: b } = p;
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Which operator is used to match a range of values?",
                options: ["...", "..", "..=", "|"],
                correctIndex: 2,
            },
            {
                question: "What does the | operator do in a pattern?",
                options: ["Logical AND", "Logical OR (matches either pattern)", "Bitwise OR", "Pipe output"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Define a struct _BT_Color_BT_ with _BT_r_BT_, _BT_g_BT_, _BT_b_BT_ fields.
2. Use pattern matching in a _BT_match_BT_ or _BT_if let_BT_ to check if a color is "Pure Red" (r=255, others=0).`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_pattern_match() {
        let red = Color { r: 255, g: 0, b: 0 };
        let green = Color { r: 0, g: 255, b: 0 };
        
        assert!(is_pure_red(red));
        assert!(!is_pure_red(green));
    }
}`,
        starter_code: `struct Color { r: u8, g: u8, b: u8 }

fn is_pure_red(c: Color) -> bool {
    // Match against Color { r: 255, g: 0, b: 0 }
    false
}

fn main() {
    let c = Color { r: 255, g: 0, b: 0 };
    println!("Is red? {}", is_pure_red(c));
}
`,
    },
];
