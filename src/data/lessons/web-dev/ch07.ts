import { Lesson } from "../../types";

export const ch07Lessons: Lesson[] = [
    {
        id: "webdev-07",
        chapter: "3.1",
        title: "Intro to SQLite",
        sort_order: 7,
        environment: "desktop",
        content: "# Intro to Raw SQLite\n\nIt's time for the real deal. We're going to connect to an **SQLite** database using a popular Rust crate called `rusqlite`.\n\n## The Connection\n\nTo talk to the database, we first open a connection. Usually, you provide a file path like `data.sqlite`. For our interactive exercises, we'll use a special \"in-memory\" connection:\n\n```rust\nuse rusqlite::Connection;\nlet conn = Connection::open_in_memory().unwrap();\n```\n\n## Executing Raw SQL\n\nTo create tables or insert data, we pass raw SQL strings into the `.execute()` method.\n\n```rust\n// We are manually writing SQL strings here!\nconn.execute(\n    \"CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)\",\n    [], // Parameters go here (we'll learn this later)\n).unwrap();\n\nconn.execute(\n    \"INSERT INTO users (name) VALUES ('ferris')\",\n    [],\n).unwrap();\n```\n\n## Selecting Data (The Painful Way)\n\nWhen you ask the database for data, it returns raw \"Rows\" consisting of columns. You have to manually tell Rust exactly which column contains what type of data using `.get()`.\n\n```rust\nlet mut stmt = conn.prepare(\"SELECT name FROM users\")?;\nlet mut rows = stmt.query([])?;\n\nwhile let Some(row) = rows.next()? {\n    // We manually extract column 0 as a String.\n    // If we typo the column index or type, the program panics at runtime!\n    let name: String = row.get(0)?;\n    println!(\"Found: {}\", name);\n}\n```\n\nWe call this **Manual Mapping**, and as you'll soon experience, it can be frustrating if you make a typo!",
        quiz: [
    {
        "question": "What does rusqlite's execute() method do?",
        "options": [
            "Deletes the database",
            "Executes a raw SQL command string",
            "Encrypts the database",
            "Turns Rust into SQL"
        ],
        "correctIndex": 1
    },
    {
        "question": "Why can manual mapping (like row.get(0)) be dangerous?",
        "options": [
            "It causes the database to lock up",
            "It uses too much memory",
            "If you provide the wrong index or wrong type, the program crashes at runtime",
            "It deletes random rows"
        ],
        "correctIndex": 2
    }
],
        objectives: "## Your Mission\n\nLet's use `rusqlite` to insert and read from a real database. We've provided a `setup_db()` function that creates a table with an `id` and `name`.\n\n1. Use `conn.execute()` to insert a user with the name `\"ferris\"`.\n2. The provided selection query finds all users. Notice the manual `row.get::<usize, String>(1)?` mapping used to extract the 'name' column. Just return that `Vec<String>`!\n\n### Requirements:\n- Insert into the `users` table.",
        test_code: "#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn test_sqlite_insert() {\n        let mut conn = Connection::open_in_memory().unwrap();\n        setup_db(&conn).unwrap();\n        \n        insert_and_read(&conn).unwrap();\n        \n        let count: i32 = conn.query_row(\"SELECT count(*) FROM users\", [], |row| row.get(0)).unwrap();\n        assert_eq!(count, 1);\n        \n        let name: String = conn.query_row(\"SELECT name FROM users\", [], |row| row.get(0)).unwrap();\n        assert_eq!(name, \"ferris\");\n    }\n}",
        starter_code: "use rusqlite::{Connection, Result};\n\nfn setup_db(conn: &Connection) -> Result<()> {\n    conn.execute(\n        \"CREATE TABLE users (\n            id INTEGER PRIMARY KEY,\n            name TEXT NOT NULL\n        )\",\n        [],\n    )?;\n    Ok(())\n}\n\nfn insert_and_read(conn: &Connection) -> Result<Vec<String>> {\n    // 1. TODO: Execute an INSERT statement.\n    // The table is \"users\" and the column is \"name\".\n    conn.execute(\n        \"____\", \n        [],\n    )?;\n\n    // 2. We prepare a SELECT query\n    let mut stmt = conn.prepare(\"SELECT id, name FROM users\")?;\n    \n    // 3. We manually map the raw rows into a Vec<String>\n    let rows = stmt.query_map([], |row| {\n        // Notice the danger here! We have to know 'name' is at index 1 and is a String\n        let name: String = row.get(1)?;\n        Ok(name)\n    })?;\n\n    let mut names = Vec::new();\n    for name_result in rows {\n        names.push(name_result?);\n    }\n    \n    Ok(names)\n}\n\nfn main() {\n    let conn = Connection::open_in_memory().unwrap();\n    setup_db(&conn).unwrap();\n    \n    match insert_and_read(&conn) {\n        Ok(names) => println!(\"Inserted users: {:?}\", names),\n        Err(e) => println!(\"Database error: {}\", e),\n    }\n}\n",
    },
];
