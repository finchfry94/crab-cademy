import { Lesson } from "../../types";

export const ch16Lessons: Lesson[] = [
    {
        id: "ch16-01",
        chapter: "16.1",
        title: "Using Threads to Run Code Simultaneously",
        sort_order: 160,
        environment: "desktop",
        content: `# Threads

Rust uses 1:1 threading, where one language thread corresponds to one operating system thread.

## Creating a Thread
Use _BT_std::thread::spawn_BT_ and pass it a closure containing the code you want to run.

_BT__BT__BT_rust
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
_BT__BT__BT_

## Waiting for Threads with join
To ensure the main thread waits for spawned threads to finish, use the handle returned by _BT_spawn_BT_ and call _BT_join()_BT_ on it.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What happens if the main thread ends before a spawned thread?",
                options: [
                    "The program waits for all threads",
                    "All spawned threads are shut down",
                    "The program hangs",
                    "It depends on the OS"
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Use _BT_thread::spawn_BT_ to run code in a background thread.
2. Use _BT_handle.join()_BT_ in the main thread to wait for it.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use std::thread;

    #[test]
    fn test_join() {
        let handle = thread::spawn(|| {
            10
        });
        let result = handle.join().unwrap();
        assert_eq!(result, 10);
    }
}`,
        starter_code: `use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        // Run some code here
    });

    // handle.join().unwrap();
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

One increasingly popular approach to ensuring safe concurrency is **message passing**, where threads communicate by sending each other data.

## mpsc (Multiple Producer, Single Consumer)
Rust provides implementations of channels in _BT_std::sync::mpsc_BT_.

_BT__BT__BT_rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });

    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
_BT__BT__BT_`.replace(/_BT_/g, '`'),
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
        ],
        objectives: `## Your Mission

1. Create a channel using _BT_mpsc::channel()_BT_.
2. Spawn a thread and send a string from it.
3. Receive the string in the main thread.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use std::sync::mpsc;
    use std::thread;

    #[test]
    fn test_channel() {
        let (tx, rx) = mpsc::channel();
        thread::spawn(move || {
            tx.send(42).unwrap();
        });
        assert_eq!(rx.recv().unwrap(), 42);
    }
}`,
        starter_code: `use std::sync::mpsc;
use std::thread;

fn main() {
    // Create channel
    // Spawn thread and send
    // Receive and print
}
`,
    },
];
