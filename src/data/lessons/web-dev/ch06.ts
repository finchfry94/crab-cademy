import { Lesson } from "../../types";

export const ch06Lessons: Lesson[] = [
    {
        id: "webdev-06",
        chapter: "2.2",
        title: "The Persistence Problem",
        sort_order: 6,
        environment: "desktop",
        content: "# The Persistence Problem\n\nIn the last lesson, we built a simple database simulation using a Rust `Vec`. This works perfectly fine for storing data... right up until your program stops.\n\nWhen your Rust program finishes running, or if the server reboots, everything in RAM (Memory) vanishes. \n\n## Hard Drives to the Rescue\n\nIf we want data to survive a restart, we have to save it to a physical file on the hard drive. \n\nYou could write a system that saves your `Vec` of users into a `.txt` or `.json` file. But imagine a file with millions of users. If you wanted to find one specific email address, you would have to load the *entire* file into memory and search through it. That is incredibly slow!\n\n## The Database Engine\n\nThis is why we use **Database Engines**. They are specialized software designed to read and write from files on the hard drive incredibly fast.\n\nInstead of writing our own file-saving logic, we just ask the Database Engine to do it using **SQL**.\n\n### The Flow:\n1. You write an SQL query: `\"INSERT INTO users VALUES ('ferris')\"`.\n2. The Database Engine reads the query.\n3. The Database Engine safely and efficiently writes 'ferris' to a hidden file on the hard drive.\n\n## In the next module...\n\nWe'll graduate from our simulation and use a real database engine called **SQLite**. SQLite stores your entire database inside a single file (like `my_data.sqlite`), making it perfect for learning and small production apps!",
        quiz: [
    {
        "question": "What happens to data stored in a Rust Vec when the program closes?",
        "options": [
            "It is automatically saved to the cloud",
            "It is wiped from memory and lost forever",
            "It turns into SQL",
            "It prints to the terminal"
        ],
        "correctIndex": 1
    },
    {
        "question": "Why don't we just save our data to a giant .txt file?",
        "options": [
            "Because .txt files cost money",
            "Because text files don't support SQL",
            "Because searching through a giant file is incredibly slow and inefficient compared to a true database engine",
            "You can't save Rust strings to a file"
        ],
        "correctIndex": 2
    },
    {
        "question": "What is SQLite?",
        "options": [
            "A lightweight web framework",
            "A database engine that stores data in a single file",
            "A tool for formatting code",
            "A new version of Rust"
        ],
        "correctIndex": 1
    }
],
        objectives: "## Your Mission\n\nLet's simulate the frustration of \"lost data\". \n\n1. Create a simulated server handler that receives a name, pushes it to a local `Vec`, and returns the length.\n2. The catch: the `Vec` is created fresh every time the function runs, simulating a stateless request! You'll see that the length is always 1, no matter how many times you call it.\n\n### Requirements:\n- Fix the `handle_request` function to simply return the length of its internal `Vec` after adding the name.",
        test_code: "#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn test_stateless() {\n        assert_eq!(handle_request(\"ferris\".into()), 1);\n        assert_eq!(handle_request(\"crabby\".into()), 1); // Continually 1 because it's stateless!\n    }\n}",
        starter_code: "fn handle_request(name: String) -> usize {\n    // Imagine this function runs every time a user visits your website.\n    // We create a fresh, empty Vec.\n    let mut users = Vec::new();\n    \n    users.push(name);\n    \n    // TODO: Return the length of the users Vec.\n    // Notice how it will ALWAYS be 1. The data is lost between requests!\n    0\n}\n\nfn main() {\n    println!(\"Request 1 (ferris): Users saved: {}\", handle_request(\"ferris\".into()));\n    println!(\"Request 2 (crabby): Users saved: {}\", handle_request(\"crabby\".into()));\n    println!(\"Where did ferris go? We need a real database!\");\n}\n",
    },
];
