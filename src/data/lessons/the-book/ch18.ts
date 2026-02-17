import { Lesson } from "../../types";

export const ch18Lessons: Lesson[] = [
    {
        id: "ch18-02",
        chapter: "18.2",
        title: "Using Trait Objects for Different Types",
        sort_order: 161,
        environment: "browser",
        content: `# Trait Objects

In Rust, we use **trait objects** to allow for values of different types that all implement a specific trait. This is Rust's way of achieving polymorphism.

## Defining a Trait Object
You create a trait object by specifying _BT_&dyn Trait_BT_ or _BT_Box<dyn Trait>_BT_.

_BT__BT__BT_rust
pub trait Draw {
    fn draw(&self);
}

pub struct Screen {
    pub components: Vec<Box<dyn Draw>>,
}

impl Screen {
    pub fn run(&self) {
        for component in self.components.iter() {
            component.draw();
        }
    }
}
_BT__BT__BT_

## Static vs Dynamic Dispatch
- **Generics** use static dispatch (resolved at compile time).
- **Trait objects** use dynamic dispatch (resolved at runtime via a vtable).`.replace(/_BT_/g, '`'),
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
2. Create a struct _BT_Circle_BT_ and _BT_Square_BT_ that implement _BT_Area_BT_.
3. Create a _BT_Vec<Box<dyn Area>>_BT_ and calculate the total area.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_trait_objects() {
        let shapes: Vec<Box<dyn Area>> = vec![
            Box::new(Circle { radius: 1.0 }),
            Box::new(Square { side: 2.0 }),
        ];
        
        let total: f64 = shapes.iter().map(|s| s.calc_area()).sum();
        // Area = PI*1^2 + 2*2 = 3.14159... + 4 = 7.14159...
        assert!(total > 7.14 && total < 7.15);
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
    let shapes: Vec<Box<dyn Area>> = vec![
        Box::new(Circle { radius: 10.0 }),
        Box::new(Square { side: 5.0 }),
    ];

    for shape in shapes {
        println!("Area: {}", shape.calc_area());
    }
}
`,
    },
];
