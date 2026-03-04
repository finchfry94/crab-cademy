import { Lesson } from "../../types";

export const ch11Lessons: Lesson[] = [
    {
        id: "webdev-11",
        chapter: "4.2",
        title: "ORM Patterns & Migrations",
        sort_order: 11,
        environment: "desktop",
        content: "# ORM Patterns & Migrations\n\n`sqlx` is incredible, but as your app grows, even writing safe, checked SQL strings for every single insert, update, and delete gets tedious. \n\nThat's why we use an **ORM** (Object-Relational Mapper). An ORM writes the SQL for you!\n\n## From SQL to Rust\n\n| Raw SQL / SQLx | ORM (SeaORM) |\n|----------------|-------------|\n| `\"SELECT * FROM users\"` | `User::find().all(&db)` |\n| `\"INSERT INTO users...\"` | `user.insert(&db)` |\n\nThe ORM is our ultimate abstraction layer. We construct Rust objects and call methods, and the ORM translates that into the highly optimized SQL strings under the hood.\n\n## What are Migrations?\n\nIn earlier modules, we hardcoded `CREATE TABLE` strings right into our Rust code to set up the database. In a real app, you'll constantly add features over time:\n- *\"We need to add a 'profile_picture_url' column to the users table.\"*\n- *\"We need a new table for 'Comments'.\"*\n\nHow do we change the database structure without deleting the file and starting over? We use **Migrations**.\n\n### Version Control for Data\n\nMigrations are like **Git commits** for your database schema.\n- **Migration #1**: Create `users` table.\n- **Migration #2**: Add `age` column to `users`.\n- **Migration #3**: Create `posts` table.\n\nEach migration has an `up` part (to apply the change) and a `down` part (to undo it).\n\n## The Loco Framework\n\nThe **Loco** framework (which we'll explore in the next module) uses an ORM called **SeaORM**. It handles migrations automatically, so you can focus entirely on building features while Loco keeps your database schema in perfect sync.\n\n## Summary of the Data Ladder\n\nYou've made it! Look at how far we've graduated:\n1. **Simulation**: Rust `Vec`s (fast, but no persistence).\n2. **SQLite + `rusqlite`**: Persistence, but painful raw SQL strings and runtime typos.\n3. **SQLite + `sqlx`**: Compile-time safety, but still writing manual SQL strings.\n4. **SeaORM (Loco)**: Total abstraction. Write pure Rust, let the library generate the SQL.\n\nYou now understand **HOW** databases work, **WHY** we need them, and **WHY** frameworks like Loco use ORMs. You are ready to build a real web app!",
        quiz: [
    {
        "question": "What does an ORM do?",
        "options": [
            "Translates between database rows and Rust objects automatically",
            "Makes the internet faster",
            "Automatically backups your computer",
            "Encrypts the database"
        ],
        "correctIndex": 0
    },
    {
        "question": "What are 'Migrations'?",
        "options": [
            "Moving your database from one city to another",
            "Version control for your database structure (schema) over time",
            "A way to delete all data and start over",
            "A type of bird that likes SQL"
        ],
        "correctIndex": 1
    },
    {
        "question": "In a migration, what does the 'up' function do?",
        "options": [
            "Uploads the data to the cloud",
            "Applies a new structural change to the database",
            "Reverts a change",
            "Calculates the number of rows"
        ],
        "correctIndex": 1
    },
    {
        "question": "Why use an ORM instead of sqlx for everything?",
        "options": [
            "It's required by the law",
            "It eliminates the need to write repetitive CRUD queries manually, keeping code clean",
            "It's always 10x faster than sqlx",
            "sqlx doesn't work with SQLite"
        ],
        "correctIndex": 1
    }
],
        objectives: "## Your Mission\n\nLet's simulate a basic \"Migration\" system in Rust. \n\nImplement the `apply_migration` function to handle two types of \"commands\" (represented by strings):\n1. `\"CREATE_USERS\"`: Add \"id\" and \"name\" to the `columns` vector.\n2. `\"ADD_AGE\"`: Add \"age\" to the `columns` vector.\n\n### Requirements:\n- Use the provided `Schema` struct to reflect the migrations.",
        test_code: "#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn test_migrations() {\n        let mut schema = Schema::new();\n        \n        schema.apply_migration(\"CREATE_USERS\");\n        assert!(schema.columns.contains(&\"id\".to_string()));\n        assert!(schema.columns.contains(&\"name\".to_string()));\n        assert!(!schema.columns.contains(&\"age\".to_string()));\n\n        schema.apply_migration(\"ADD_AGE\");\n        assert!(schema.columns.contains(&\"age\".to_string()));\n    }\n}",
        starter_code: "struct Schema {\n    columns: Vec<String>,\n}\n\nimpl Schema {\n    fn new() -> Self {\n        Self { columns: Vec::new() }\n    }\n\n    fn apply_migration(&mut self, command: &str) {\n        match command {\n            \"CREATE_USERS\" => {\n                // TODO: Push \"id\" and \"name\" to columns\n                self.columns.push(\"id\".into());\n            }\n            \"ADD_AGE\" => {\n                // TODO: Push \"age\" to columns\n            }\n            _ => {}\n        }\n    }\n}\n\nfn main() {\n    let mut s = Schema::new();\n    s.apply_migration(\"CREATE_USERS\");\n    println!(\"Migration 1 Columns: {:?}\", s.columns);\n    s.apply_migration(\"ADD_AGE\");\n    println!(\"Migration 2 Columns: {:?}\", s.columns);\n}\n",
    },
];
