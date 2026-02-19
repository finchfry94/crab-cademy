import { Lesson } from "../../types";

export const ch16Lessons: Lesson[] = [
    {
        id: "ch16-01",
        chapter: "16.1",
        title: "Using Threads to Run Code Simultaneously",
        sort_order: 160,
        environment: "desktop",
        content: `# Threads: Fearless Concurrency

In most languages, multithreading is dangerous. You get "Race Conditions" where two threads try to write to the same memory at the same time, causing garbage data or crashes.

Rust is different. **Rust prevents data races at compile time.** If your threaded code compiles, it is (almost certainly) free of data races.

## Creating a Thread

Rust uses **1:1 threading**, meaning one Rust thread maps to one Operating System thread.

\`\`\`rust
use std::thread;
use std::time::Duration;

fn main() {
    thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(Duration::from_millis(1));
    }
}
\`\`\`

## Waiting for Threads with \`join\`

When the \`main\` function ends, the program exits, **even if other threads are still running**. To wait for them, you must use the \`JoinHandle\`.

\`\`\`rust
let handle = thread::spawn(|| { ... });

// Wait for the thread to finish
handle.join().unwrap();
\`\`\`

## ⚠️ Common Mistakes

1.  **Forgetting to Join**: "My thread code never ran!" usually means your main thread finished and killed the process before the spawned thread could start.
2.  **Using References in Threads**: A thread might live forever (detached), but stack variables die when the function ends. You almost ALWAYS need \`move\` closures with threads to transfer ownership.
    \`\`\`rust
    let v = vec![1, 2, 3];
    // ERROR: closure may outlive 'v'
    // thread::spawn(|| println!("{:?}", v)); 
    
    // FIX: move 'v' into the thread
    thread::spawn(move || println!("{:?}", v));
    \`\`\`
`,
        quiz: [
            {
                question: "What happens if the main thread ends before a spawned thread?",
                options: [
                    "The program waits for all threads",
                    "All spawned threads are shut down immediately",
                    "The program hangs",
                    "It depends on the OS"
                ],
                correctIndex: 1,
            },
            {
                question: "How do you fix 'closure may outlive current function' errors in threads?",
                options: ["Use static variables", "Use the 'move' keyword", "Use Arc<T>", "Use a global mutex"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write a function \`spawn_forty_two() -> std::thread::JoinHandle<i32>\` that:

1. Spawns a thread.
2. Inside the thread, returns the number **42**.
3. Returns the \`JoinHandle\` to the caller.`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use std::thread;

    #[test]
    fn test_join() {
        let handle = spawn_forty_two();
        let result = handle.join().unwrap();
        assert_eq!(result, 42);
    }
}`,
        starter_code: `use std::thread;
use std::thread::JoinHandle;

// Write: spawn_forty_two() -> JoinHandle<i32>

fn main() {
    let handle = spawn_forty_two();
    let result = handle.join().unwrap();
    println!("Thread returned: {}", result);
}
`,
    },
    {
        id: "ch16-02",
        chapter: "16.2",
        title: "Message Passing with Channels",
        sort_order: 161,
        environment: "desktop",
        content: `# Channels

"Do not communicate by sharing memory; share memory by communicating."

This philosophy (popularized by Go) helps avoid race conditions. Instead of everyone yelling at the same whiteboard (shared memory), threads pass notes to each other (channels).

## mpsc (Multiple Producer, Single Consumer)

Rust's standard channel is a one-way street. You can have many threads **Sending** to it, but only one thread **Receiving** from it.

\`\`\`rust
use std::sync::mpsc;
use std::thread;

fn main() {
    // tx = transmitter, rx = receiver
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap(); 
        // val is GONE now. Ownership moved to the channel!
    });

    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
\`\`\`

## ⚠️ Common Mistakes

1.  **Deadlocks**: If you try to receive message from a channel, but the sender has crashed or finished without sending, \`recv()\` might block forever (hang). (Actually, if all senders drop, \`recv\` returns an error, which is good!).
2.  **Sending non-Send types**: You cannot send types that aren't thread-safe (like \`Rc\`) through a channel. The compiler will stop you.`,
        quiz: [
            {
                question: "What does mpsc stand for?",
                options: [
                    "Multi-protocol, Static-checking",
                    "Multiple Producer, Single Consumer",
                    "Main Process, Sub-channel",
                    "Many Pipes, Single Core"
                ],
                correctIndex: 1,
            },
            {
                question: "Does tx.send(val) take ownership of val?",
                options: ["No, it borrows it", "Yes, ownership moves to the receiver", "It clones it automatically", "It depends on the type"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write a function \`create_sender() -> std::sync::mpsc::Receiver<i32>\` that:

1. Creates a channel.
2. Spawns a thread that sends the number **100** into the channel.
3. Returns the **Receiver** (\`rx\`) to the caller so we can read it.`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::mpsc;
    use std::thread;

    #[test]
    fn test_channel() {
        let rx = create_sender();
        // We expect to receive 100 within a reasonable time
        assert_eq!(rx.recv().unwrap(), 100);
    }
}`,
        starter_code: `use std::sync::mpsc;
use std::thread;

// Write: create_sender() -> mpsc::Receiver<i32>

fn main() {
    let rx = create_sender();
    println!("Received: {}", rx.recv().unwrap());
}
`,
    },
];
