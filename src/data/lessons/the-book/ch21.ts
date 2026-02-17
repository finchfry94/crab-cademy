import { Lesson } from "../../types";

export const ch21Lessons: Lesson[] = [
    {
        id: "ch21-01",
        chapter: "21.1",
        title: "Building a Single-Threaded Web Server",
        sort_order: 210,
        environment: "desktop",
        content: `# Building a Web Server

We'll use _BT_std::net::TcpListener_BT_ to listen for incoming connections.

_BT__BT__BT_rust
use std::net::TcpListener;
use std::io::prelude::*;
use std::net::TcpStream;

fn main() {
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();

    for stream in listener.incoming() {
        let stream = stream.unwrap();
        handle_connection(stream);
    }
}

fn handle_connection(mut stream: TcpStream) {
    let mut buffer = [0; 1024];
    stream.read(&mut buffer).unwrap();
    
    let response = "HTTP/1.1 200 OK\r\n\r\nHello!";
    stream.write(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Which port did we use in the example?",
                options: ["80", "443", "7878", "8080"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1. Understand the TCP handshake and HTTP request/response cycle.
2. Run the provided server code locally and visit _BT_http://127.0.0.1:7878_BT_ in your browser.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    #[test]
    fn test_conceptual() {
        assert!(true);
    }
}`,
        starter_code: `use std::net::TcpListener;

fn main() {
    // let listener = TcpListener::bind("127.0.0.1:7878").unwrap();
    println!("Web server tutorial");
}
`,
    },
];
