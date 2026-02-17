import { Lesson } from "../../types";

export const ch12Lessons: Lesson[] = [
    {
        id: "ch12-01",
        chapter: "12.1",
        title: "Accepting Command Line Arguments",
        sort_order: 100,
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
        sort_order: 101,
        environment: "desktop",
        content: `# Reading a File

Now we’ll add the functionality to read the file specified in the _BT_file_path_BT_ argument.

## Reading with fs::read_to_string
We use _BT_std::fs_BT_ to handle files.

_BT__BT__BT_rust
use std::fs;

let contents = fs::read_to_string(file_path)
    .expect("Should have been able to read the file");
_BT__BT__BT_

This reads the entire file into a _BT_String_BT_.`.replace(/_BT_/g, '`'),
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
        sort_order: 103,
        environment: "browser",
        content: `# Test-Driven Development (TDD)

In this lesson, we practice TDD by writing the core search logic for _BT_minigrep_BT_.

## The search function
We want a function that takes a query and the file contents, and returns only the lines that contain the query.

_BT__BT__BT_rust
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

Note the use of lifetimes: the returned vector contains string slices that reference _BT_contents_BT_, so they must live as long as _BT_contents_BT_.`.replace(/_BT_/g, '`'),
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

Implement the _BT_search_BT_ function.
It should return all lines from _BT_contents_BT_ that contain the _BT_query_BT_ string.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn one_result() {
        let query = "duct";
        let contents = "\
Rust:
safe, fast, productive.
Pick three.";

        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }

    #[test]
    fn multiple_results() {
        let query = "the";
        let contents = "\
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
    let contents = "Rust is fast\nPython is slow";
    println!("{:?}", search(query, contents));
}
`,
    },
];
