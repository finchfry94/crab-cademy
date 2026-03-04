import { Lesson } from "../../types";

export const ch09Lessons: Lesson[] = [
    {
        id: "webdev-09",
        chapter: "3.3",
        title: "Schema Design & Constraints",
        sort_order: 9,
        environment: "desktop",
        content: "# Schema Design & Constraints\n\nDesigning a database is like building a house: you need a solid blueprint. In database terms, this blueprint is called a **Schema**.\n\nTo keep our data accurate and high-quality, we use **Constraints**—rules that the database enforces for us.\n\n## Primary Keys (The ID)\n\nEvery table should have a **Primary Key**. It's a special column that:\n1. Is **Unique**: No two rows can have the same ID.\n2. Is **Not Null**: Every row *must* have an ID.\n\nIn SQLite, a column defined as `INTEGER PRIMARY KEY` automatically increments when you insert a new row!\n\n## Common Constraints\n\n| Constraint | What it does | Example |\n|------------|--------------|---------|\n| `NOT NULL` | Prevents the column from being empty | `username TEXT NOT NULL` |\n| `UNIQUE` | Prevents duplicate values | `email TEXT UNIQUE` |\n| `DEFAULT` | Sets a value if none is provided | `is_active BOOLEAN DEFAULT TRUE` |\n| `CHECK` | Ensures data follows a specific rule | `age INTEGER CHECK (age >= 18)` |\n\n## Data Types\n\nDatabases are strict about **Types**:\n- **INTEGER**: Whole numbers (id, age, count).\n- **TEXT**: Strings of text (name, bio).\n- **REAL**: Floating-point numbers (price).\n\n## The Power of SQLite Constraints\n\nImagine a \"Sign Up\" form where someone forgets to enter an email. \n- Without constraints, your Rust `Vec` might have just saved an empty record, causing weird bugs later.\n- With `NOT NULL` and `UNIQUE`, SQLite will **refuse** to save bad data and throw an error back to your Rust code! This is called **Data Integrity**.",
        quiz: [
    {
        "question": "What is a 'Primary Key'?",
        "options": [
            "A secret password for the admin",
            "A column that uniquely identifies each row in a table",
            "The largest column in the table",
            "A column that must be the color yellow"
        ],
        "correctIndex": 1
    },
    {
        "question": "What does the 'NOT NULL' constraint do?",
        "options": [
            "Prevents the column from being deleted",
            "Enforces that the column must have a value",
            "Makes the value equal to zero",
            "Automatically fills the column with random text"
        ],
        "correctIndex": 1
    },
    {
        "question": "Which constraint ensures that no two people can have the same username?",
        "options": [
            "NOT NULL",
            "UNIQUE",
            "DEFAULT",
            "CHECK"
        ],
        "correctIndex": 1
    },
    {
        "question": "What happens if a Rust program tries to INSERT data that violates a UNIQUE constraint in SQLite?",
        "options": [
            "SQLite deletes the old row to make room",
            "SQLite ignores the error and saves it anyway",
            "SQLite refuses to insert the data and returns an error to Rust",
            "The Rust compiler won't let you build the project"
        ],
        "correctIndex": 2
    }
],
        objectives: "## Your Mission\n\nLet's see constraints in action using `rusqlite`. We're creating a `users` table with two constraints on the `username`: it must be `NOT NULL` and `UNIQUE`.\n\n1. Try inserting a second user with the same `\"ferris\"` username.\n2. Catch the database error (which occurs because the `UNIQUE` constraint was violated) and return it as a string!\n\n### Requirements:\n- Attempt to insert duplicate data.\n- Return the error using `.unwrap_err().to_string()`.",
        test_code: "#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn test_unique_constraint() {\n        let conn = Connection::open_in_memory().unwrap();\n        setup_db(&conn).unwrap();\n        \n        let error_msg = insert_duplicate(&conn);\n        assert!(error_msg.contains(\"UNIQUE constraint failed\"));\n    }\n}",
        starter_code: "use rusqlite::{Connection, Result};\n\nfn setup_db(conn: &Connection) -> Result<()> {\n    conn.execute(\n        \"CREATE TABLE users (\n            id INTEGER PRIMARY KEY,\n            username TEXT NOT NULL UNIQUE\n        )\",\n        [],\n    )?;\n    \n    // The first insert works perfectly!\n    conn.execute(\"INSERT INTO users (username) VALUES ('ferris')\", [])?;\n    Ok(())\n}\n\nfn insert_duplicate(conn: &Connection) -> String {\n    // 1. TODO: Try to insert 'ferris' a SECOND time. \n    // This violates the UNIQUE constraint we defined above!\n    let result = conn.execute(\n        \"________\",\n        [],\n    );\n    \n    // 2. Return the error message!\n    match result {\n        Ok(_) => \"Wait, this shouldn't have succeeded!\".into(),\n        Err(e) => e.to_string(), // This is what we expect!\n    }\n}\n\nfn main() {\n    let conn = Connection::open_in_memory().unwrap();\n    setup_db(&conn).unwrap();\n    \n    println!(\"Constraint Error: {}\", insert_duplicate(&conn));\n}\n",
    },
];
