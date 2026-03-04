import { Lesson } from "../../types";

export const ch08Lessons: Lesson[] = [
    {
        id: "webdev-08",
        chapter: "3.2",
        title: "Relationships & JOINs",
        sort_order: 8,
        environment: "desktop",
        content: "# Relationships & JOINs\n\nIn the real world, data is connected. A \"User\" might have many \"Posts\". An \"Order\" belongs to a \"Customer\". \n\nInstead of putting everything in one giant table (which would get messy and repetitive), we split data into separate tables and \"relate\" them using **Foreign Keys**.\n\n## One-to-Many Relationships\n\nThis is the most common relationship. \n\n1. **Users Table**: Contains user info (`id`, `username`).\n2. **Posts Table**: Contains post info (`id`, `title`, `user_id`).\n\nThe `user_id` in the `posts` table is a **Foreign Key**. It \"points\" back to the `id` in the `users` table. Both tables can live inside the same SQLite database.\n\n## Combining Tables with JOIN\n\nWhat if we want to see the post title *and* the username together? We use a `JOIN`.\n\n```sql\nSELECT posts.title, users.username\nFROM posts\nJOIN users ON posts.user_id = users.id;\n```\n\nThink of `JOIN` as a way to \"stitch\" two spreadsheets together temporarily based on a matching column (id and user_id).\n\n## Writing JOIN strings in Rust\n\nWhen writing complex queries like JOINs in raw SQL strings, you have to be very careful. \n\n```rust\nlet mut stmt = conn.prepare(\n    \"SELECT posts.title, users.username \n     FROM posts \n     JOIN users ON posts.user_id = users.id\"\n)?;\n```\n\nIf you mistype `users.username` or `posts.user_id`, Rust won't know! It will compile perfectly fine, but crash instantly the moment it runs.",
        quiz: [
    {
        "question": "What is a Foreign Key?",
        "options": [
            "A key used to encrypt the database",
            "A column that points to the ID of a row in another table",
            "The primary password for the database",
            "A column that is only used by foreign users"
        ],
        "correctIndex": 1
    },
    {
        "question": "Which SQL command is used to stitch data from related tables together?",
        "options": [
            "COMBINE",
            "STITCH",
            "JOIN",
            "MERGE"
        ],
        "correctIndex": 2
    },
    {
        "question": "What happens if you have a typo in your raw JOIN string using rusqlite?",
        "options": [
            "The Rust compiler will throw an error immediately",
            "The database fixes the typo automatically",
            "The code compiles, but crashes at runtime when the query is executed",
            "It will return random data"
        ],
        "correctIndex": 2
    }
],
        objectives: "## Your Mission\n\nWe've provided a pre-seeded database containing a `users` table and a `posts` table. We want to find out who authored the post with ID 101.\n\n1. Write a raw SQL `SELECT` string that joins `users` and `posts`.\n2. Select the `username` from the `users` table where the `posts.id` is 101.\n3. Manually map the result to a String.\n\n### Requirements:\n- Use the JOIN syntax you learned!",
        test_code: "#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn test_join_query() {\n        let conn = Connection::open_in_memory().unwrap();\n        setup_db(&conn).unwrap();\n        \n        let author = find_post_author(&conn, 101).unwrap();\n        assert_eq!(author, \"ferris\");\n    }\n}",
        starter_code: "use rusqlite::{Connection, Result, params};\n\nfn setup_db(conn: &Connection) -> Result<()> {\n    // We create the tables and seed them with a user and a post\n    conn.execute(\"CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT)\", [])?;\n    conn.execute(\"CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT, user_id INTEGER)\", [])?;\n    \n    conn.execute(\"INSERT INTO users (id, username) VALUES (1, 'ferris')\", [])?;\n    conn.execute(\"INSERT INTO posts (id, title, user_id) VALUES (101, 'Hello Rust', 1)\", [])?;\n    Ok(())\n}\n\nfn find_post_author(conn: &Connection, post_id: i32) -> Result<String> {\n    // TODO: Write a JOIN query to find the username of the author of a specific post.\n    // We've provided the 'params![post_id]' to safely inject the ID into the '?' placeholder.\n    let username: String = conn.query_row(\n        \"\n        SELECT ____\n        FROM posts\n        JOIN ____ ON posts.____ = users.____\n        WHERE posts.id = ?\n        \",\n        params![post_id],\n        |row| row.get(0) // Manually grab the first column (username)\n    )?;\n    \n    Ok(username)\n}\n\nfn main() {\n    let conn = Connection::open_in_memory().unwrap();\n    setup_db(&conn).unwrap();\n    \n    match find_post_author(&conn, 101) {\n        Ok(name) => println!(\"Post 101 author: {}\", name),\n        Err(e) => println!(\"Error: {}\", e),\n    }\n}\n",
    },
];
