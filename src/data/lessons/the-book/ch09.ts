import { Lesson } from "../../types";

export const ch09Lessons: Lesson[] = [
    {
        id: "ch09-01",
        chapter: "9.1",
        title: "Unrecoverable Errors with panic!",
        sort_order: 70,
        content: `# Unrecoverable Errors with panic!

Sometimes bad things happen in your code, and there's nothing you can do about it. In these cases, Rust has the _BT_panic!_BT_ macro.

When the _BT_panic!_BT_ macro executes, your program will print a failure message, unwind and clean up the stack, and then quit.

## Explicit Panic

_BT__BT__BT_rust
fn main() {
    panic!("crash and burn");
}
_BT__BT__BT_

## Implicit Panic

Some operations panic automatically, like accessing an array out of bounds:

_BT__BT__BT_rust
let v = vec![1, 2, 3];
v[99]; // Panics!
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What does the _BT_panic!_BT_ macro do?".replace(/_BT_/g, '`'),
                options: [
                    "It logs an error and continues",
                    "It terminates the program immediately",
                    "It returns a Result::Err",
                    "It pauses execution for debugging",
                ],
                correctIndex: 1,
            },
            {
                question: "Can you recover from a panic in normal Rust code?",
                options: ["Yes, with try-catch", "No, it's unrecoverable", "Yes, with recover()", "Yes, by ignoring it"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write a function _BT_verify_positive(n: i32)_BT_ that panics with the message _BT_"Number must be positive!"_BT_ if the input is negative.

If the number is positive or zero, it should do nothing.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic(expected = "Number must be positive!")]
    fn test_verify_positive_panic() {
        verify_positive(-5);
    }

    #[test]
    fn test_verify_positive_ok() {
        verify_positive(5);
        verify_positive(0);
    }
}`,
        starter_code: `// Write: verify_positive(n: i32)
// Use the panic! macro if n < 0

fn main() {
    verify_positive(10);
    println!("10 is ok");
    
    verify_positive(-1); // Should crash here
    println!("This line won't run");
}
`,
    },
    {
        id: "ch09-02",
        chapter: "9.2",
        title: "Recoverable Errors with Result",
        sort_order: 71,
        content: `# Recoverable Errors with Result

Most errors aren't serious enough to stop the program entirely. Explicit error handling is done with _BT_Result<T, E>_BT_:

_BT__BT__BT_rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
_BT__BT__BT_

## Handling Result

_BT__BT__BT_rust
let result: Result<i32, &str> = Ok(200);

match result {
    Ok(code) => println!("Success: {}", code),
    Err(e) => println!("Error: {}", e),
}
_BT__BT__BT_

## Shortcuts: unwrap and expect

- _BT_unwrap()_BT_: Returns the value inside _BT_Ok_BT_, or **panics** if _BT_Err_BT_.
- _BT_expect(msg)_BT_: Like unwrap, but lets you provide a custom panic message.

## The ? Operator

Propagates errors to the caller function:

_BT__BT__BT_rust
fn read_username_from_file() -> Result<String, io::Error> {
    let mut s = String::new();
    File::open("hello.txt")?.read_to_string(&mut s)?;
    Ok(s)
}
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What does _BT_unwrap()_BT_ do if the Result is _BT_Err_BT_?".replace(/_BT_/g, '`'),
                options: [
                    "Returns the error",
                    "Returns a default value",
                    "Panics",
                    "Does nothing",
                ],
                correctIndex: 2,
            },
            {
                question: "What is the purpose of the _BT_?_BT_ operator?".replace(/_BT_/g, '`'),
                options: [
                    "To ask the user a question",
                    "To assert that a value is true",
                    "To propagate errors (return early on Err)",
                    "To print debug info",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Write a function _BT_divide(a: f64, b: f64) -> Result<f64, String>_BT_.
1. If _BT_b_BT_ is 0.0, return _BT_Err("Cannot divide by zero".to_string())_BT_.
2. Otherwise, return _BT_Ok(a / b)_BT_.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_divide_ok() {
        match divide(10.0, 2.0) {
            Ok(v) => assert_eq!(v, 5.0),
            Err(_) => panic!("Should result in Ok"),
        }
    }

    #[test]
    fn test_divide_zero() {
        match divide(10.0, 0.0) {
            Ok(_) => panic!("Should result in Err"),
            Err(e) => assert_eq!(e, "Cannot divide by zero"),
        }
    }
}`,
        starter_code: `// Write: divide(a: f64, b: f64) -> Result<f64, String>

fn main() {
    let result = divide(10.0, 2.0);
    println!("10 / 2 = {:?}", result); // Ok(5.0)
    
    let error = divide(10.0, 0.0);
    println!("10 / 0 = {:?}", error); // Err(...)
}
`,
    },
];
