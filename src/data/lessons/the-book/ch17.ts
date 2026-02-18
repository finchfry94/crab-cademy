import { Lesson } from "../../types";

export const ch17Lessons: Lesson[] = [
    {
        id: "ch17-01",
        chapter: "17.1",
        title: "Futures and the Async Syntax",
        sort_order: 170,
        environment: "desktop",
        content: `# Async / Await

Asynchronous programming allows you to handle many tasks concurrently without using many OS threads.

## The Future Trait
A _BT_Future_BT_ represents a value that might not be available yet. 

## async and await
- _BT_async fn_BT_ creates a function that returns a future.
- _BT_await_BT_ pauses execution until the future is ready.

_BT__BT__BT_rust
async fn hello_world() {
    println!("hello, world!");
}

#[tokio::main]
async fn main() {
    hello_world().await;
}
_BT__BT__BT_

Note: To run async code, you need an **async runtime** like _BT_tokio_BT_ or _BT_async-std_BT_.

> [!IMPORTANT]
> **A Note on Testing**: The playground sandbox currently has a limited set of packages available. Since \`tokio\` is an external crate, we cannot compile and run full async tests here. For now, focus on the async/await syntax itself!`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Does calling an async function execute its code immediately?",
                options: [
                    "Yes",
                    "No, it returns a Future",
                    "Only if it's marked with #[tokio::main]",
                    "Yes, but in the background"
                ],
                correctIndex: 1,
            },
            {
                question: "What is required to execute a Future?",
                options: ["A thread", "An async runtime", "A compiler flag", "The wait keyword"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Define an _BT_async fn say_hi()_BT_.
2. Call and _BT_.await_BT_ it inside an async block or main.`.replace(/_BT_/g, '`'),
        test_code: `// Conceptual test - async requires runtime
#[cfg(test)]
mod tests {
    #[test]
    fn test_conceptual() {
        assert!(true);
    }
}`,
        starter_code: `async fn say_hi() {
    println!("Hi from async!");
}

#[tokio::main]
async fn main() {
    // call say_hi and await it
}
`,
    },
];
