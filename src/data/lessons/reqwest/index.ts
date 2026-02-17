import { LearningPath, Lesson } from "../../types";

export const path: LearningPath = {
    id: "reqwest",
    title: "HTTP with Reqwest",
    description:
        "Learn to make HTTP requests in Rust using the reqwest crate — GET, POST, JSON, error handling, and more.",
    icon: "🌐",
    color: "from-blue-500 to-cyan-600",
};

export const lessons: Lesson[] = [
    {
        id: "reqwest-01",
        chapter: "1",
        title: "Your First GET Request",
        sort_order: 1,
        environment: "browser",
        content: `# Your First GET Request

Reqwest is the most popular HTTP client for Rust. It provides a convenient API for making requests to web servers.

In this lesson, we'll make a simple GET request to fetch the text content of a URL.

## Async Rust
Reqwest is **asynchronous** by default. This means we use _BT_async_BT_ and _BT_await_BT_ to perform network operations without blocking the entire program.

We'll use the _BT_tokio_BT_ runtime (the industry standard) to run our async code.

_BT__BT__BT_rust
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let response = reqwest::get("https://www.rust-lang.org")
        .await?
        .text()
        .await?;

    println!("{response}");
    Ok(())
}
_BT__BT__BT_

### Key concepts:
- _BT_reqwest::get_BT_: Makes a GET request.
- _BT_.await_BT_: Pauses execution until the request (or response body) is ready.
- _BT_.text()_BT_: Extracts the response body as a String.
- _BT_await?_BT_: The _BT_?_BT_ operator handles errors by returning early if something goes wrong.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Which keyword is used to wait for an asynchronous operation to finish?",
                options: ["wait", "yield", "await", "finish"],
                correctIndex: 2,
            },
            {
                question: "What is the return type of reqwest::get() initially?",
                options: ["String", "Result<Response, Error>", "Response", "Future"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Make a GET request to _BT_https://httpbin.org/get_BT_ and print the response body.

### Requirements:
1. Use _BT_reqwest::get_BT_
2. Use _BT_.await?_BT_ to handle the response
3. Use _BT_.text().await?_BT_ to get the content
4. Print the content using _BT_println!_BT_`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_request() {
        // Validation logic
    }
}`,
        starter_code: `#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Make a GET request to "https://httpbin.org/get"
    // 2. Await the response
    // 3. Await the text content
    // 4. Print it
    
    Ok(())
}
`,
    },
    {
        id: "reqwest-02",
        chapter: "2",
        title: "Working with JSON",
        sort_order: 2,
        environment: "browser",
        content: `# Working with JSON

Most modern APIs communicate using JSON. Reqwest integrates seamlessly with _BT_serde_BT_, Rust's powerful serialization framework.

## Sending JSON
To send JSON, you can use a _BT_reqwest::Client_BT_ and the _BT_.json()_BT_ method.

_BT__BT__BT_rust
use serde::Serialize;

#[derive(Serialize)]
struct User {
    username: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let user = User { username: "rustacean".into() };

    let res = client.post("https://httpbin.org/post")
        .json(&user)
        .send()
        .await?;

    println!("Status: {}", res.status());
    Ok(())
}
_BT__BT__BT_

### Why a Client?
While _BT_reqwest::get_BT_ is fine for one-off requests, a **Client** is better for repeated requests as it reuses connection pools internally.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What derive macro is needed on a struct to send it as JSON?",
                options: ["Json", "Serialize", "Deserialize", "Http"],
                correctIndex: 1,
            },
            {
                question: "Why should you prefer using a reqwest::Client over individual calls like reqwest::get?",
                options: ["It's mandatory", "It reuses connection pools", "It's synchronous", "It's easier to type"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Send a POST request to _BT_https://httpbin.org/post_BT_ with a JSON body containing a _BT_message_BT_ field.

### Requirements:
1. Define a struct _BT_Payload_BT_ that implements _BT_Serialize_BT_.
2. Use a _BT_reqwest::Client_BT_.
3. Use _BT_.post()_BT_ and _BT_.json(&payload)_BT_.
4. Print the status code of the response.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_json_post() {
        // Logic check
    }
}`,
        starter_code: `use serde::Serialize;

#[derive(Serialize)]
struct Payload {
    message: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let payload = Payload { message: "Hello from CrabCademy!".into() };

    // Post to https://httpbin.org/post
    
    Ok(())
}
`,
    },
    {
        id: "reqwest-03",
        chapter: "3",
        title: "Handling HTTP Errors",
        sort_order: 3,
        environment: "browser",
        content: `# Handling HTTP Errors

Not every request succeeds. The network might be down, or the server might return an error status code like 404 (Not Found) or 500 (Internal Server Error).

## Checking Status Codes
You can check if a response was successful using _BT_res.status().is_success()_BT_ or use _BT_error_for_status()_BT_ to convert error codes into actual Rust errors.

_BT__BT__BT_rust
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let res = reqwest::get("https://httpbin.org/status/404").await?;

    if res.status().is_client_error() {
        println!("Got a client error: {}", res.status());
    } else {
        println!("Success!");
    }

    Ok(())
}
_BT__BT__BT_

### Common status checks:
- _BT_is_success()_BT_: 200-299
- _BT_is_redirection()_BT_: 300-399
- _BT_is_client_error()_BT_: 400-499
- _BT_is_server_error()_BT_: 500-599`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Which method is the easiest way to turn a non-success status code into a Result::Err?",
                options: ["to_error()", "error_for_status()", "into_err()", "check_status()"],
                correctIndex: 1,
            },
            {
                question: "What status code range represents 'Client Errors'?",
                options: ["200-299", "300-399", "400-499", "500-599"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Make a request to _BT_https://httpbin.org/status/500_BT_ and print "Server Error" if it returns a 5xx status code.

### Requirements:
1. Handle the request to the error endpoint.
2. Check if _BT_res.status().is_server_error()_BT_ is true.
3. Print the appropriate message.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_error_handling() {
        // Logic check
    }
}`,
        starter_code: `#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let res = reqwest::get("https://httpbin.org/status/500").await?;

    // Check if it's a server error and print "Server Error"
    
    Ok(())
}
`,
    },
];
