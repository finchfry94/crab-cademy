import { Lesson } from "../../types";

export const ch05Lessons: Lesson[] = [
    {
        id: "webdev-05",
        chapter: "2.1",
        title: "In-Memory Data Stores",
        sort_order: 5,
        environment: "desktop",
        content: "# Intro to Databases: The Simulation\n\nIf you've ever used a spreadsheet like Google Sheets or Excel, you already understand the basics of a database. \n\nA **Relational Database** is essentially a collection of spreadsheets (called **Tables**) that are organized and \"related\" to each other. **SQL** (Structured Query Language) is the language we use to ask the database questions.\n\n## Tables, Rows, and Columns\n\nImagine a spreadsheet named `users`:\n\n| id | username | email |\n|----|----------|-------|\n| 1  | ferris   | ferris@rust.org |\n| 2  | crabby   | crabby@sea.com |\n\n- The **Table** is the whole spreadsheet (`users`).\n- A **Column** is a vertical category (`username`, `email`).\n- A **Row** is a single entry (record) in the table.\n\n## Asking Questions with SELECT\n\nThe most common SQL command is `SELECT`. It's how we \"read\" data.\n\n```sql\n-- Get everything from the users table\nSELECT * FROM users;\n\n-- Get just the usernames\nSELECT username FROM users;\n```\n\n## Adding Data with INSERT\n\nTo add a new row, we use `INSERT INTO`:\n\n```sql\nINSERT INTO users (username, email) \nVALUES ('rustacean', 'rusty@crates.io');\n```\n\n## The Rust Equivalent\n\nBefore we connect to a real database, let's simulate one in Rust using a `Vec`. \nA `Vec<User>` directly mimics a Table holding Rows!",
        quiz: [
    {
        "question": "In database terms, what is a 'Table'?",
        "options": [
            "A single piece of data",
            "A collection of organized data, like a spreadsheet",
            "A command used to delete data",
            "A type of computer hardware"
        ],
        "correctIndex": 1
    },
    {
        "question": "What SQL keyword is used to retrieve data from a table?",
        "options": [
            "GET",
            "FIND",
            "SELECT",
            "OPEN"
        ],
        "correctIndex": 2
    },
    {
        "question": "Which command is used to add a new record to a table?",
        "options": [
            "ADD",
            "CREATE",
            "INSERT INTO",
            "PUSH"
        ],
        "correctIndex": 2
    }
],
        objectives: "## Your Mission\n\nLet's practice the concept of \"Inserting\" and \"Selecting\" by building an in-memory database simulation using a Rust `Vec`.\n\n1. Implement the `add_user` function to push a new name into the `users` vector.\n2. Implement the `find_user` function to return the name at a specific index.\n\n### Requirements:\n- Use the provided `UserStore` struct.",
        test_code: "#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn test_add_and_find() {\n        let mut store = UserStore::new();\n        store.add_user(\"ferris\".to_string());\n        store.add_user(\"crabby\".to_string());\n\n        assert_eq!(store.find_user(0), Some(&\"ferris\".to_string()));\n        assert_eq!(store.find_user(1), Some(&\"crabby\".to_string()));\n        assert_eq!(store.find_user(2), None);\n    }\n}",
        starter_code: "struct UserStore {\n    users: Vec<String>,\n}\n\nimpl UserStore {\n    fn new() -> Self {\n        Self { users: Vec::new() }\n    }\n\n    fn add_user(&mut self, name: String) {\n        // TODO: Push the name into the users vector\n    }\n\n    fn find_user(&self, index: usize) -> Option<&String> {\n        // TODO: Return the name at the given index using .get()\n        None\n    }\n}\n\nfn main() {\n    let mut store = UserStore::new();\n    store.add_user(\"ferris\".into());\n    println!(\"User at 0: {:?}\", store.find_user(0));\n}\n",
    },
];
