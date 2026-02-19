import { Lesson } from "../../types";

export const ch21Lessons: Lesson[] = [
    {
        id: "ch21-01",
        chapter: "21.1",
        title: "Building a Single-Threaded Web Server",
        sort_order: 210,
        environment: "desktop",
        content: `# Building a Web Server

Welcome to the final boss. We are going to build a web server from scratch. No \`Actix\`, no \`Rocket\`, just raw TCP.

## The TCP Listener

We use \`std::net::TcpListener\` to listen for incoming connections. This is the "phone" that rings when a browser tries to connect to your server.

\`\`\`rust
use std::net::TcpListener;
use std::io::prelude::*;
use std::net::TcpStream;

fn main() {
    // Bind to localhost port 7878
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();

    // Loop forever, accepting connections
    for stream in listener.incoming() {
        let stream = stream.unwrap();
        handle_connection(stream);
    }
}

// To make this testable, we use a generic 'Stream' that implements Read + Write
fn handle_connection<S: Read + Write>(mut stream: S) {
    let mut buffer = [0; 1024];
    stream.read(&mut buffer).unwrap();
    
    // Simplest valid HTTP response
    let response = "HTTP/1.1 200 OK\\r\\n\\r\\nHello!";
    
    stream.write(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}
\`\`\`

## HTTP 101
HTTP is just text sent over TCP.
*   **Request**: \`GET / HTTP/1.1\\r\\nHost: localhost...\`
*   **Response**: \`HTTP/1.1 200 OK\\r\\nContent-Length: 5\\r\\n\\r\\nHello\`

## ⚠️ Common Mistakes

1.  **Blocking the Main Thread**: In this simple version, if \`handle_connection\` takes 5 seconds, **nobody else can connect**. The server is "blocked". Real servers use Threads (Chapter 16) or Async (Chapter 17) to handle thousands of connections at once.
2.  **Port Conflicts**: If you run this and get "Address already in use", it means another program (maybe a zombie version of your own server) is already using port 7878.

> [!CAUTION]
> **A Note on Testing**: Due to security restrictions in the playground sandbox, binding to arbitrary network ports (like 7878) is often blocked. In this lesson, we focus on the **logic** of the HTTP handling, which we can test without a real network!`,
        quiz: [
            {
                question: "Which port did we use in the example?",
                options: ["80", "443", "7878", "8080"],
                correctIndex: 2,
            },
            {
                question: "Why is the single-threaded server limited?",
                options: [
                    "It can't handle HTTP/2",
                    "It processes requests one at a time (blocking)",
                    "It runs out of memory",
                    "It can't read files"
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Write a function _BT_handle_connection<S: Read + Write>(mut stream: S)_BT_.
2. It should read from the stream into a buffer.
3. It should write _BT_"HTTP/1.1 200 OK\\r\\n\\r\\nHello!"_BT_ back to the stream.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Cursor;

    #[test]
    fn test_handle_connection() {
        let input = b"GET / HTTP/1.1\\r\\nHost: localhost\\r\\n\\r\\n";
        let mut buffer = Vec::new();
        // Use Cursor to simulate a TCP Stream
        let mut stream = Cursor::new(input.to_vec());
        
        // We need a way to capture the output too.
        // Let's use a combined cursor or just test the response.
        // Actually, let's use a simple mock:
        struct MockStream {
            read_data: Cursor<Vec<u8>>,
            write_data: Vec<u8>,
        }
        impl std::io::Read for MockStream {
            fn read(&mut self, buf: &mut [u8]) -> std::io::Result<usize> {
                self.read_data.read(buf)
            }
        }
        impl std::io::Write for MockStream {
            fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
                self.write_data.extend_from_slice(buf);
                Ok(buf.len())
            }
            fn flush(&mut self) -> std::io::Result<()> { Ok(()) }
        }

        let mut mock = MockStream {
            read_data: Cursor::new(input.to_vec()),
            write_data: Vec::new(),
        };

        handle_connection(&mut mock);

        let response = String::from_utf8(mock.write_data).unwrap();
        assert!(response.contains("HTTP/1.1 200 OK"));
        assert!(response.contains("Hello!"));
    }
}`,
        starter_code: `use std::io::prelude::*;

// 1. Define handle_connection<S: Read + Write>(mut stream: S)

fn main() {
    println!("Web server logic tutorial");
}
`,
    },
    {
        id: "ch21-02",
        chapter: "21.2",
        title: "Multithreaded Server with a Thread Pool",
        sort_order: 211,
        environment: "desktop",
        content: `# Turning Single-Threaded into Multithreaded

Currently, if our server receives a request that takes 1 minute to process, all other users are blocked for 1 minute.
We could just \`thread::spawn\` for every request.
*   **Pros**: Simple.
*   **Cons**: If 10,000 users connect, we spawn 10,000 threads. The OS will crash (DDOS).

## The Solution: Thread Pool
A **Thread Pool** is a fixed group of waiting threads (e.g., 4 threads).
1.  Requests come in and go into a queue.
2.  The first available thread picks up the request.
3.  If all 4 threads are busy, new requests wait in the queue.

This limits the load on the server while allowing concurrency.

## The Interface
We want to change our loop to look like this:

\`\`\`rust
let pool = ThreadPool::new(4);

for stream in listener.incoming() {
    let stream = stream.unwrap();

    pool.execute(|| {
        handle_connection(stream);
    });
}
\`\`\`

## ⚠️ Common Mistakes
1.  **Infinite Spawning**: Beginners often just put \`thread::spawn\` in the loop. This works for small apps but is dangerous for public servers.
2.  **Shared State**: If the threads need to access shared data (like a database connection), you'll need \`Arc<Mutex<Data>>\`.

> [!NOTE]
> Implementing a full \`ThreadPool\` from scratch involves Channels, Arc, Mutex, and Lifetimes. It is the ultimate test of your Rust knowledge!`,
        quiz: [
            {
                question: "Why not just spawn a new thread for every request?",
                options: [
                    "It's too slow",
                    "It could exhaust system resources (DoS)",
                    "Rust doesn't allow it",
                    "Threads can't handle HTTP"
                ],
                correctIndex: 1,
            },
            {
                question: "What happens if all threads in the pool are busy?",
                options: ["The server crashes", "The request is dropped", "The request waits in a queue", "A new thread is spawned automatically"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1. Use _BT_thread::spawn_BT_ to handle the connection in a background thread (The naive approach).
2. Bonus: Read the "The Book" Chapter 20 to learn how to build the full ThreadPool!`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    #[test]
    fn test_conceptual_pool() {
        assert!(true);
    }
}`,
        starter_code: `use std::net::TcpListener;
use std::thread;

fn main() {
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();

    for stream in listener.incoming() {
        let stream = stream.unwrap();

        // CHANGE THIS LINE:
        // Instead of calling handle_connection directly, 
        // spawn a thread to do it!
        handle_connection(stream);
    }
}

fn handle_connection(_stream: std::net::TcpStream) {
    // Handling code...
}
`,
    },
];
