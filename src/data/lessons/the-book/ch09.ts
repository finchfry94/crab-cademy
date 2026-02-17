import { Lesson } from "../../types";

export const ch09Lessons: Lesson[] = [
    {
        id: "ch09-01",
        chapter: "9.1",
        title: "Unrecoverable Errors with panic!",
        sort_order: 70,
        environment: "browser",
        content: `# Unrecoverable Errors

Rust groups errors into two categories: **recoverable** (Result) and **unrecoverable** (panic).

## Panic!

When something goes horribly wrong and the program cannot continue (like accessing invalid memory), Rust **panics**.

- Prints an error message.
- Unwinds the stack (cleans up).
- Extis.

You can trigger this explicitly:

_BT__BT__BT_rust
fn main() {
    panic!("crash and burn");
}
_BT__BT__BT_

## When to Panic?

In production code: **Rarely**. You should almost always return _BT_Result_BT_ to let the caller decide what to do.

Panic is okay for:
- Prototype code.
- Tests (assert! panics on failure).
- Bugs that violate internal invariants (getting into a state that "should be impossible").
- Security issues.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What does `panic!` do?",
                options: [
                    "Logs an error and keeps running",
                    "Terminates the program immediately",
                    "Returns a boolean false",
                    "Restarts the server",
                ],
                correctIndex: 1,
            },
            {
                question: "Should you use `panic!` for checking user input?",
                options: [
                    "Yes, teach them a lesson",
                    "No, use Result to handle it gracefully",
                    "Yes, it's the standard way",
                    "Only if the input is a number",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write a function _BT_validate_age(age: i32)_BT_ that:
1. Panics with message "Too young!" if age < 0.
2. Panics with message "Too old!" if age > 150.
3. Otherwise does nothing.

(This is an example where panic might be used to enforce internal consistency, though Types are usually better!)`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic(expected = "Too young")]
    fn test_young() {
        validate_age(-5);
    }

    #[test]
    #[should_panic(expected = "Too old")]
    fn test_old() {
        validate_age(200);
    }
    
    #[test]
    fn test_valid() {
        validate_age(50);
    }
}`,
        starter_code: `// Write: validate_age(age: i32)
// Panic if < 0 or > 150

fn main() {
    validate_age(30);
    println!("30 is valid");
    validate_age(-1);
}
`,
    },
    {
        id: "ch09-02",
        chapter: "9.2",
        title: "Recoverable Errors with Result",
        sort_order: 71,
        environment: "browser",
        content: `# Recoverable Errors with Result

Most errors are not fatal. File not found? Just ask the user for a different file. Network down? Retry.

Rust uses the _BT_Result_BT_ enum for this:

_BT__BT__BT_rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
_BT__BT__BT_

## Propagating Errors

The **? operator** is a magical shorthand for "If Ok, give me the value. If Err, return the Error from the function immediately."

_BT__BT__BT_rust
fn read_file() -> Result<String, io::Error> {
    let mut s = String::new();
    File::open("hello.txt")?.read_to_string(&mut s)?;
    Ok(s)
}
_BT__BT__BT_

## Helper Methods

- _BT_unwrap()_BT_: "Give me the value or panic". (Risky!)
- _BT_expect("msg")_BT_: "Give me the value or panic with this message". (Better than unwrap).
- _BT_unwrap_or(default)_BT_: "Give me value or use this default". (Safe).

## ⚠️ Common Mistakes

1. **Using unwrap() in production** — If it crashes, your users will be sad. Handle the error!
2. **Ignoring Result** — Rust will warn you if you call a function returning Result and ignore it.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What does the `?` operator do?",
                options: [
                    "Prints the error",
                    "Panics on error",
                    "Propagates the error (returns early) or unwraps the value",
                    "Retries the operation",
                ],
                correctIndex: 2,
            },
            {
                question: "Which method panics if the Result is Err?",
                options: ["is_err()", "unwrap_or()", "unwrap()", "map()"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Write a function _BT_safe_divide(num: f64, den: f64) -> Result<f64, String>_BT_.

1. If _BT_den_BT_ is 0.0, function returns _BT_Err("Division by zero".to_string())_BT_.
2. Otherwise returns _BT_Ok(num / den)_BT_.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ok() {
        assert_eq!(safe_divide(10.0, 2.0), Ok(5.0));
    }

    #[test]
    fn test_err() {
        let res = safe_divide(10.0, 0.0);
        assert!(res.is_err());
        // Simple check
    }
}`,
        starter_code: `// Write: safe_divide(num: f64, den: f64) -> Result<f64, String>

fn main() {
    match safe_divide(10.0, 0.0) {
        Ok(val) => println!("{}", val),
        Err(e) => println!("Error: {}", e),
    }
}
`,
    },
];
