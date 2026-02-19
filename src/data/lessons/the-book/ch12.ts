import { Lesson } from "../../types";

export const ch12Lessons: Lesson[] = [
    {
        id: "ch12-01",
        chapter: "12.1",
        title: "Accepting Command Line Arguments",
        sort_order: 120,
        environment: "desktop",
        default_args: ["searchstring", "poem.txt"],
        content: `# Building a Real Tool: Minigrep

Welcome to your first real-world project! We are going to build **minigrep**, a simplified version of the classic command-line tool \`grep\` (Global Regular Expression Print).

It will take two arguments:
1.  A string to search for.
2.  A file to search inside.

Example usage: \`cargo run -- searchstring poem.txt\`

## Reading the Argument Values

To read the arguments, we use \`std::env::args\`. It returns an iterator of the arguments passed to the program.

\`\`\`rust
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    println!("{:?}", args);
}
\`\`\`

## The \`args\` Vector Anatomy

If you run \`cargo run -- foo bar\`, the vector will look like this:

| Index | Value | Description |
|---|---|---|
| \`args[0]\` | \`"target/debug/minigrep"\` | The name of the binary itself. |
| \`args[1]\` | \`"foo"\` | The first argument you passed. |
| \`args[2]\` | \`"bar"\` | The second argument you passed. |

## ⚠️ Common Mistakes

1.  **The "Off-By-One" Error**: Beginners often assume \`args[0]\` is the first user argument. It's not! \`args[0]\` is the *program name*. Your data starts at \`args[1]\`.
2.  **Panicking on missing args**: If the user runs the program without arguments, accessing \`args[1]\` will cause a panic (crash). Robust code checks \`args.len()\` first, but for this lesson, we'll keep it simple.
3.  **Forgetting \`collect()\`**: \`env::args()\` is an *iterator*. To treat it like a list (vector) that you can index into, you must call \`.collect()\`.`,
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
            {
                question: "What does .collect() do?",
                options: [
                    "Garbage collects memory",
                    "Turns an iterator into a collection (like a Vec)",
                    "Collects user input from stdin",
                    "Compiles the code",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Use _BT_std::env::args().collect()_BT_ to get arguments.
2. Store _BT_args[1]_BT_ in a variable named _BT_query_BT_.
3. Store _BT_args[2]_BT_ in a variable named _BT_file_path_BT_.
4. Print them out to prove you got them!`.replace(/_BT_/g, '`'),
        test_code: `// Note: Since main() is hard to unit test directly, this test
// verifies that you understand how to access vector elements by index.
// Run your code to see the actual argument parsing in action!
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

    // The playground passes "searchstring" and "poem.txt" automatically!
    
    // Extract query and file_path
    // let query = ...
    // let file_path = ...

    // println!("Searching for {}", query);
    // println!("In file {}", file_path);
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

Now that we know *what* the user wants to find (the query) and *where* they want to find it (the filename), we need to actually open and read that file.

## The \`std::fs\` Module

Rust's standard library provides the \`fs\` (filesystem) module for this.

\`\`\`rust
use std::fs;

// read_to_string takes a path and returns a Result<String, Error>
let contents = fs::read_to_string(file_path)
    .expect("Something went wrong reading the file");
\`\`\`

This one function does a lot of heavy lifting:
1.  **Opens** the file (handling permissions).
2.  **Allocates** memory for the content.
3.  **Reads** the entire file into that memory.
4.  **Closes** the file safely (even if the program crashes later).

## ⚠️ Common Mistakes

1.  **Relative vs Absolute Paths**: If you run \`cargo run poem.txt\`, Rust looks for \`poem.txt\` in the *current working directory* (where you ran the command). If the file is in a subfolder, you need \`cargo run subfolder/poem.txt\`.
2.  **Missing File Permissions**: In desktop environments, your program might not have permission to read the file. This returns an \`Err\`, which is why we handle it (or use \`expect\` to crash with a message).
3.  **Assuming UTF-8**: \`read_to_string\` *only* works for text files (UTF-8). If you try to open an image or binary file, it will return an error. For those, you'd use \`read\` (bytes).`,
        quiz: [
            {
                question: "Which module contains file system functions?",
                options: ["std::env", "std::io", "std::fs", "std::file"],
                correctIndex: 2,
            },
            {
                question: "What happens if read_to_string finds non-text (binary) data?",
                options: [
                    "It converts it to text automatically",
                    "It returns an Error",
                    "It crashes (panics) immediately",
                    "It skips the bad characters",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1. Use _BT_fs::read_to_string_BT_ to read a file.
2. Print the contents to the console.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    use std::fs;

    #[test]
    fn test_file_reading() {
        let file_path = "poem.txt";
        let contents = fs::read_to_string(file_path).expect("Should read the file");
        // Verify the content matches what we wrote in the starter code
        assert!(contents.contains("Rust:"));
        assert!(contents.contains("safe, fast, productive."));
    }
}`,
        starter_code: `use std::fs;

fn main() {
    let file_path = "poem.txt";
    
    // DO NOT MODIFY THIS LINE: It creates the file needed for this lesson in the temporary playground environment
    std::fs::write(file_path, "Rust:\\nsafe, fast, productive.").unwrap();

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
1.  **Red**: Write a test that fails (because the feature doesn't exist yet).
2.  **Green**: Write *just enough* code to make the test pass.
3.  **Refactor**: Clean up the code without changing behavior (making sure tests still pass).

## The Algorithm

We want a function \`search\` that looks through lines of text.

1.  Iterate through each line of the contents.
2.  Check if the line contains our query string.
3.  If it does, add it to the list of results.
4.  Return the list.

## Lifetimes Revisited

\`\`\`rust
pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> { ... }
\`\`\`

Why \`'a\` on \`contents\` and the return value?
Because the **results** (the vector of strings) are just *references* pointing back to the original **contents**. If \`contents\` ceases to exist, the results are invalid. The lifetime annotation tells Rust: "The returned strings live as long as the input contents."

## ⚠️ Common Mistakes

1.  **Testing Implementation**: A bad test would check *how* we search (e.g., "did we use a for loop?"). A good TDD test checks *what* happens (Input: "duct", Output: ["safe, fast, productive."]).
2.  **Case Sensitivity**: By default, \`contains()\` is case-sensitive. "Rust" != "rust". (We'll fix this later!)`,
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
            {
                question: "What is the 'Green' step in TDD?",
                options: [
                    "Write comments",
                    "Refactor the code",
                    "Write just enough code to pass the test",
                    "Deploy to production",
                ],
                correctIndex: 2,
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
