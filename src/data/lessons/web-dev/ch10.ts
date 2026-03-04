import { Lesson } from "../../types";

export const ch10Lessons: Lesson[] = [
    {
        id: "webdev-10",
        chapter: "4.1",
        title: "SQLx — Type-Safe SQL",
        sort_order: 10,
        environment: "desktop",
        content: "# SQLx — Type-Safe SQL\n\nIn the previous module, we learned how to write SQL queries using `rusqlite`. But you probably noticed a big problem: **Raw SQL strings are dangerous.** \n\nIf you mistyped a column name in `SELECT useername FROM users`, your Rust code still compiled perfectly fine. It wasn't until you *ran* the code that it panicked. \n\nFurthermore, you had to manually map columns like `let param: String = row.get(0)?`. One typo there, and crash!\n\n## Enter SQLx\n\n**SQLx** is the modern bridge between Rust and databases. It has two massive superpowers:\n\n1. **Compile-Time Checked SQL**: SQLx can connect to your database *while you are compiling*. It checks every SQL string. If you mistype a column name, your Rust code **will not compile**!\n2. **Automatic Mapping**: No more `row.get(0)`. SQLx automatically maps database rows into Rust structs using macros.\n3. **Async**: SQLx is fully async, making it the perfect partner for our Tokio/Axum web server.\n\n## The Magic Macro: `query_as!`\n\n```rust\n// We derive FromRow so SQLx can map it automatically!\n#[derive(sqlx::FromRow)]\nstruct User {\n    id: i64,\n    name: String,\n}\n\n// The '!' means this is a macro that checks against the database at compile time!\nlet user = sqlx::query_as!(\n    User,\n    \"SELECT id, name FROM users WHERE id = ?\",\n    1\n).fetch_one(&pool).await?;\n```\n\n## Safety: Preventing SQL Injection\n\nNotice the `?` and the `1` at the end? We **never** build SQL strings manually like `format!(\"SELECT * WHERE id = {}\", user_input)`. \n\nHackers can use that to inject malicious SQL. By using `?`, SQLx binds the parameter safely, treating it strictly as data, not executable code.",
        quiz: [
    {
        "question": "What is the primary benefit of using SQLx's query macros over raw rusqlite strings?",
        "options": [
            "It automatically creates your tables",
            "It checks your SQL queries for typos at compile-time",
            "It compresses the database file",
            "It converts SQL into Javascript"
        ],
        "correctIndex": 1
    },
    {
        "question": "How does SQLx map database rows to Rust structs?",
        "options": [
            "You have to manually use row.get() for every field",
            "It uses the #[derive(FromRow)] macro or the query_as! macro to do it automatically",
            "It requires you to write a custom JSON parser",
            "It guesses based on variable names"
        ],
        "correctIndex": 1
    },
    {
        "question": "How do you securely pass a user's input into an SQLx query?",
        "options": [
            "By using the format!() macro",
            "By appending it to the string",
            "By using bound parameters with the '?' placeholder",
            "By encrypting it first"
        ],
        "correctIndex": 2
    }
],
        objectives: "## Your Mission\n\nLet's use `sqlx` to fetch data safely. We've set up an in-memory SQLite pool and seeded it. \n\n1. Complete the `fetch_user` function using `sqlx::query_as`.\n2. Notice how we don't have to manually pull rows with `row.get()`—SQLx maps it directly into the `User` struct!\n3. Bind the `user_id` parameter to the `?` placeholder.\n\n### Requirements:\n- Use the provided `User` struct.\n- Use `.bind()` and `.fetch_one()`.",
        test_code: "#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[tokio::test]\n    async fn test_sqlx_fetch() {\n        let pool = setup_db().await.unwrap();\n        \n        let user = fetch_user(&pool, 1).await.unwrap();\n        assert_eq!(user.name, \"ferris\");\n    }\n}",
        starter_code: "use sqlx::{sqlite::SqlitePoolOptions, SqlitePool, FromRow};\n\n#[derive(Debug, FromRow)]\nstruct User {\n    id: i64, \n    name: String,\n}\n\n// We simulate setting up the DB pool\nasync fn setup_db() -> Result<SqlitePool, sqlx::Error> {\n    let pool = SqlitePoolOptions::new().connect(\"sqlite::memory:\").await?;\n    sqlx::query(\"CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)\").execute(&pool).await?;\n    sqlx::query(\"INSERT INTO users (id, name) VALUES (1, 'ferris')\").execute(&pool).await?;\n    Ok(pool)\n}\n\nasync fn fetch_user(pool: &SqlitePool, user_id: i64) -> Result<User, sqlx::Error> {\n    // 1. TODO: Use sqlx::query_as to select the user by ID\n    // 2. Bind the user_id parameter safely\n    let user = sqlx::query_as::<_, User>(\n        \"SELECT id, name FROM users WHERE id = ?\"\n    )\n    .bind(________) // Inject the parameter safely!\n    .fetch_one(pool) \n    .await?;\n    \n    Ok(user)\n}\n\n#[tokio::main]\nasync fn main() {\n    let pool = setup_db().await.unwrap();\n    \n    match fetch_user(&pool, 1).await {\n        Ok(user) => println!(\"Mapped User: {:?}\", user),\n        Err(e) => println!(\"Error: {}\", e),\n    }\n}\n",
    },
];
