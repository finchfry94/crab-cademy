import { Lesson } from "../../types";

export const ch12Lessons: Lesson[] = [
    {
        id: "ch12-01",
        chapter: "12.1",
        title: "Accepting Command Line Arguments",
        sort_order: 120,
        environment: "desktop",
        content: `# Accepting Command Line Arguments

Let's start building _BT_minigrep_BT_! The first step is to accept the two command line arguments: the file path and the string to search for.

## Reading the Argument Values
To read the arguments, we use _BT_std::env::args_BT_. It returns an iterator of the arguments passed to the program.

_BT__BT__BT_rust
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    println!("{:?}", args);
}
_BT__BT__BT_

Note: _BT_args[0]_BT_ is the name of the program binary itself.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Which function is used to get command line arguments?",
                options: ["std::io::args()", "std::env::args()", "args()", "std::cli::args()"],
                correctIndex: 1,
            },
            {
                question: "What is stored at index 0 of the arguments vector?",
                options: ["The first parameter", "The program name", "The number of arguments", "Empty string"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Use _BT_std::env::args().collect()_BT_ to get arguments.
2. Extract the second and third arguments into variables _BT_query_BT_ and _BT_file_path_BT_.`.replace(/_BT_/g, '`'),
        test_code: `// Conceptual test - verifies collect logic
#[cfg(test)]
mod tests {
    #[test]
    fn test_args_collection() {
        let args = vec!["prog".to_string(), "query".to_string(), "path".to_string()];
        let query = &args[1];
        let path = &args[2];
        assert_eq!(query, "query");
        assert_eq!(path, "path");
    }
}`,
        starter_code: `use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();

    // Extract query and file_path
    // let query = ...
    // let file_path = ...

    println!("Searching for {}", query);
    println!("In file {}", file_path);
}
`,
    },
    {
        id: "ch12-02",
        chapter: "12.2",
        title: "Reading a File",
        sort_order: 121,
        environment: "desktop",
        content: `# Reading a File

Now we’ll add the functionality to read the file specified in the _BT_file_path_BT_ argument.

## Reading with fs::read_to_string
Now that we know *what* the user wants to find (the query) and *where* they want to find it (the filename), we need to actually open and read that file.

## The _BT_std::fs_BT_ Module

Rust's standard library provides the _BT_fs_BT_ (filesystem) module for this.

_BT__BT__BT_rust
use std::fs;

// read_to_string takes a path and returns a Result<String, Error>
let contents = fs::read_to_string(file_path)
    .expect("Something went wrong reading the file");
_BT__BT__BT_

This function:
1.  Opens the file.
2.  Allocates a new String.
3.  Reads all bytes from the file into that String.
4.  Closes the file.

It handles all the messy system calls for you!`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Which module contains file system functions?",
                options: ["std::env", "std::io", "std::fs", "std::file"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

1. Use _BT_fs::read_to_string_BT_ to read a file.
2. Print the contents to the console.`.replace(/_BT_/g, '`'),
        test_code: `// No automated test for file I/O in this environment
#[cfg(test)]
mod tests {
    #[test]
    fn test_conceptual() {
        assert!(true);
    }
}`,
        starter_code: `use std::fs;

fn main() {
    let file_path = "test.txt";
    // Read the file and print contents
}
`,
    },
    {
        id: "ch12-04",
        chapter: "12.4",
        title: "Developing with TDD",
        sort_order: 122,
        environment: "browser",
        content: `# Test-Driven Development (TDD)

"Red, Green, Refactor." This is the mantra of TDD.

Instead of writing code and then checking if it works, passing TDD means we:
1.  **Write a test that fails** (Red).
2.  **Write just enough code to make it pass** (Green).
3.  **Clean up the code** (Refactor).

## Writing the Search Logic

We want a function _BT_search_BT_ that takes a query and text, and returns only the matching lines.

_BT__BT__BT_rust
// note the explicit lifetimes 'a!
pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let mut results = Vec::new();

    for line in contents.lines() {
        if line.contains(query) {
            results.push(line);
        }
    }

    results
}
_BT__BT__BT_

## Why Lifetimes here?
Returns a _BT_Vec<&'a str>_BT_. We are returning *references* to slices of the original _BT_contents_BT_. Use lifetimes to tell the compiler: "The returned lines are just pointers into the original _BT_contents_BT_ string. Don't drop _BT_contents_BT_ while we are still looking at these lines!"`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Why do we need lifetime annotations in the search function?",
                options: [
                    "To make it run faster",
                    "To tell the compiler the returned slices live as long as 'contents'",
                    "To allow the function to mutate contents",
                    "It's required for all public functions"
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Implement the _BT_search_BT_ function.
2. It should return all lines from _BT_contents_BT_ that contain the _BT_query_BT_ string.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn one_result() {
        let query = "duct";
        let contents = "\\
Rust:
safe, fast, productive.
Pick three.";

        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }

    #[test]
    fn multiple_results() {
        let query = "the";
        let contents = "\\
The quick brown fox
jumps over the lazy dog.
The end.";

        // Should find "jumps over the lazy dog." (case sensitive)
        assert_eq!(vec!["jumps over the lazy dog."], search(query, contents));
    }
}`,
        starter_code: `pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    // Implement search logic here
    vec![]
}

fn main() {
    let query = "fast";
    let contents = "Rust is fast\\nPython is slow";
    println!("{:?}", search(query, contents));
}
`,
    },
];
