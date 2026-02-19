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

## The Coffee Shop Analogy
*   **Synchronous**: You order coffee. The cashier stands there, watches the machine brew, pours it, and hands it to you. *Then* they take the next customer's order. (Slow!)
*   **Asynchronous**: You order coffee. The cashier gives you a ticket (a **Future**) and takes the next order immediately. When your coffee is ready, you pick it up.

## The Future Trait
A \`Future\` is a value that might not be available yet. It's a promise that "eventually, I will resolve to a value (or an error)."

## Syntax

1.  **\`async fn\`**: Returns a Future instead of the value directly.
2.  **\`.await\`**: Pauses the current function until the Future is ready.

\`\`\`rust
async fn brew_coffee() -> Coffee { ... }

async fn main() {
    let coffee = brew_coffee().await;
}
\`\`\`

## Async Runtimes
Rust itself doesn't know how to run Futures. You need an **Executor** or **Runtime**. The most popular one is **Tokio**.

## ⚠️ Common Mistakes

1.  **Forgetting \`.await\`**: If you call \`brew_coffee();\` without \`.await\`, **nothing happens**. The code inside the function doesn't run! You just get a Future object that you ignored.
2.  **Blocking the Thread**: Never use \`std::thread::sleep\` or heavy computation inside an async function. It stops the *entire* runtime (the cashier stops taking orders). Use \`tokio::time::sleep\` instead.`,
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
                question: "What happens if you use std::thread::sleep in an async function?",
                options: [
                    "It works normally",
                    "It blocks the entire async runtime (bad!)",
                    "It compiles into tokio::time::sleep",
                    "The compiler throws an error"
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Define an _BT_async fn say_hi()_BT_.
2. Call and _BT_.await_BT_ it inside the main function.
3. Observe that it runs.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_say_hi() {
        // We can't easily check what they print, 
        // but we can check if it compiles and runs.
        say_hi().await;
        assert!(true);
    }
}`,
        starter_code: `// We need a runtime to run async code
#[tokio::main]
async fn main() {
    // 1. Define async fn say_hi()
    
    // 2. Call say_hi().await
    
    // println!("Done!");
}
`,
    },
    {
        id: "ch17-02",
        chapter: "17.2",
        title: "Spawning Tasks and Channels",
        sort_order: 171,
        environment: "desktop",
        content: `# Async Tasks

One of the biggest benefits of async is running thousands of tasks at once. 

## Spawning
In standard threads, \`thread::spawn\` creates an OS thread (heavy).
In async, \`tokio::spawn\` creates a **Task** (extremely light). It's just a small struct allocated on the heap.

\`\`\`rust
#[tokio::main]
async fn main() {
    let handle = tokio::spawn(async {
        println!("Task is running!");
    });

    handle.await.unwrap();
}
\`\`\`

## Channels
Just like threads, async tasks can communicate via channels.
**Crucial Difference**: You must use \`tokio::sync::mpsc\`, NOT \`std::sync::mpsc\`. The standard library channel will block the thread, killing performance.

\`\`\`rust
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
    let (tx, mut rx) = mpsc::channel(32);

    tokio::spawn(async move {
        tx.send("sending from task").await.unwrap();
    });

    while let Some(msg) = rx.recv().await {
        println!("Got: {}", msg);
    }
}
\`\`\`

## ⚠️ Common Mistakes
1.  **Using blocking I/O**: Never call \`std::fs::read\` or \`std::thread::sleep\` inside a \`tokio::spawn\`. It blocks the thread that *other* tasks are trying to run on.
2.  **Detached Tasks**: If you spawn a task and don't await the handle, it runs in the background. If \`main\` finishes, the task is killed instantly.`,
        quiz: [
            {
                question: "Which function should you use to sleep in an async task?",
                options: ["std::thread::sleep", "tokio::time::sleep", "sleep()", "thread::yield_now"],
                correctIndex: 1,
            },
            {
                question: "What happens if you use std::sync::mpsc in async code?",
                options: ["It works fine", "It panics", "It blocks the runtime thread (bad performance)", "It fails to compile"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1. Write an _BT_async fn perform_task() -> i32_BT_.
2. Inside, create a channel using _BT_tokio::sync::mpsc::channel(32)_BT_.
3. Use _BT_tokio::spawn_BT_ to send 100 into the channel.
4. Receive it and return it.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_perform_task() {
        let result = perform_task().await;
        assert_eq!(result, 100);
    }
}`,
        starter_code: `use tokio::sync::mpsc;

// 1. Define: async fn perform_task() -> i32

#[tokio::main]
async fn main() {
    let val = perform_task().await;
    println!("Value from task: {}", val);
}
`,
    },
];
