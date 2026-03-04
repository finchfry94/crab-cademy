const fs = require('fs');

const createLesson = (num, id, chapter, title, content, quiz, objectives, test, starter) => `import { Lesson } from "../../types";

export const ch${num}Lessons: Lesson[] = [
    {
        id: "webdev-${id}",
        chapter: "${chapter}",
        title: "${title}",
        sort_order: ${parseInt(id, 10)},
        environment: "desktop",
        content: ${JSON.stringify(content)},
        quiz: ${JSON.stringify(quiz, null, 4)},
        objectives: ${JSON.stringify(objectives)},
        test_code: ${JSON.stringify(test)},
        starter_code: ${JSON.stringify(starter)},
    },
];
`;

fs.writeFileSync("src/data/lessons/web-dev/ch05.ts", createLesson("05", "05", "2.1", "In-Memory Data Stores", 
`# Intro to Databases: The Simulation

If you've ever used a spreadsheet like Google Sheets or Excel, you already understand the basics of a database. 

A **Relational Database** is essentially a collection of spreadsheets (called **Tables**) that are organized and "related" to each other. **SQL** (Structured Query Language) is the language we use to ask the database questions.

## Tables, Rows, and Columns

Imagine a spreadsheet named \`users\`:

| id | username | email |
|----|----------|-------|
| 1  | ferris   | ferris@rust.org |
| 2  | crabby   | crabby@sea.com |

- The **Table** is the whole spreadsheet (\`users\`).
- A **Column** is a vertical category (\`username\`, \`email\`).
- A **Row** is a single entry (record) in the table.

## Asking Questions with SELECT

The most common SQL command is \`SELECT\`. It's how we "read" data.

\`\`\`sql
-- Get everything from the users table
SELECT * FROM users;

-- Get just the usernames
SELECT username FROM users;
\`\`\`

## Adding Data with INSERT

To add a new row, we use \`INSERT INTO\`:

\`\`\`sql
INSERT INTO users (username, email) 
VALUES ('rustacean', 'rusty@crates.io');
\`\`\`

## The Rust Equivalent

Before we connect to a real database, let's simulate one in Rust using a \`Vec\`. 
A \`Vec<User>\` directly mimics a Table holding Rows!`,
[
    { question: "In database terms, what is a 'Table'?", options: ["A single piece of data", "A collection of organized data, like a spreadsheet", "A command used to delete data", "A type of computer hardware"], correctIndex: 1 },
    { question: "What SQL keyword is used to retrieve data from a table?", options: ["GET", "FIND", "SELECT", "OPEN"], correctIndex: 2 },
    { question: "Which command is used to add a new record to a table?", options: ["ADD", "CREATE", "INSERT INTO", "PUSH"], correctIndex: 2 }
],
`## Your Mission

Let's practice the concept of "Inserting" and "Selecting" by building an in-memory database simulation using a Rust \`Vec\`.

1. Implement the \`add_user\` function to push a new name into the \`users\` vector.
2. Implement the \`find_user\` function to return the name at a specific index.

### Requirements:
- Use the provided \`UserStore\` struct.`,
`#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add_and_find() {
        let mut store = UserStore::new();
        store.add_user("ferris".to_string());
        store.add_user("crabby".to_string());

        assert_eq!(store.find_user(0), Some(&"ferris".to_string()));
        assert_eq!(store.find_user(1), Some(&"crabby".to_string()));
        assert_eq!(store.find_user(2), None);
    }
}`,
`struct UserStore {
    users: Vec<String>,
}

impl UserStore {
    fn new() -> Self {
        Self { users: Vec::new() }
    }

    fn add_user(&mut self, name: String) {
        // TODO: Push the name into the users vector
    }

    fn find_user(&self, index: usize) -> Option<&String> {
        // TODO: Return the name at the given index using .get()
        None
    }
}

fn main() {
    let mut store = UserStore::new();
    store.add_user("ferris".into());
    println!("User at 0: {:?}", store.find_user(0));
}
`));

fs.writeFileSync("src/data/lessons/web-dev/ch06.ts", createLesson("06", "06", "2.2", "The Persistence Problem",
`# The Persistence Problem

In the last lesson, we built a simple database simulation using a Rust \`Vec\`. This works perfectly fine for storing data... right up until your program stops.

When your Rust program finishes running, or if the server reboots, everything in RAM (Memory) vanishes. 

## Hard Drives to the Rescue

If we want data to survive a restart, we have to save it to a physical file on the hard drive. 

You could write a system that saves your \`Vec\` of users into a \`.txt\` or \`.json\` file. But imagine a file with millions of users. If you wanted to find one specific email address, you would have to load the *entire* file into memory and search through it. That is incredibly slow!

## The Database Engine

This is why we use **Database Engines**. They are specialized software designed to read and write from files on the hard drive incredibly fast.

Instead of writing our own file-saving logic, we just ask the Database Engine to do it using **SQL**.

### The Flow:
1. You write an SQL query: \`"INSERT INTO users VALUES ('ferris')"\`.
2. The Database Engine reads the query.
3. The Database Engine safely and efficiently writes 'ferris' to a hidden file on the hard drive.

## In the next module...

We'll graduate from our simulation and use a real database engine called **SQLite**. SQLite stores your entire database inside a single file (like \`my_data.sqlite\`), making it perfect for learning and small production apps!`,
[
    { question: "What happens to data stored in a Rust Vec when the program closes?", options: ["It is automatically saved to the cloud", "It is wiped from memory and lost forever", "It turns into SQL", "It prints to the terminal"], correctIndex: 1 },
    { question: "Why don't we just save our data to a giant .txt file?", options: ["Because .txt files cost money", "Because text files don't support SQL", "Because searching through a giant file is incredibly slow and inefficient compared to a true database engine", "You can't save Rust strings to a file"], correctIndex: 2 },
    { question: "What is SQLite?", options: ["A lightweight web framework", "A database engine that stores data in a single file", "A tool for formatting code", "A new version of Rust"], correctIndex: 1 }
],
`## Your Mission

Let's simulate the frustration of "lost data". 

1. Create a simulated server handler that receives a name, pushes it to a local \`Vec\`, and returns the length.
2. The catch: the \`Vec\` is created fresh every time the function runs, simulating a stateless request! You'll see that the length is always 1, no matter how many times you call it.

### Requirements:
- Fix the \`handle_request\` function to simply return the length of its internal \`Vec\` after adding the name.`,
`#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_stateless() {
        assert_eq!(handle_request("ferris".into()), 1);
        assert_eq!(handle_request("crabby".into()), 1); // Continually 1 because it's stateless!
    }
}`,
`fn handle_request(name: String) -> usize {
    // Imagine this function runs every time a user visits your website.
    // We create a fresh, empty Vec.
    let mut users = Vec::new();
    
    users.push(name);
    
    // TODO: Return the length of the users Vec.
    // Notice how it will ALWAYS be 1. The data is lost between requests!
    0
}

fn main() {
    println!("Request 1 (ferris): Users saved: {}", handle_request("ferris".into()));
    println!("Request 2 (crabby): Users saved: {}", handle_request("crabby".into()));
    println!("Where did ferris go? We need a real database!");
}
`));

fs.writeFileSync("src/data/lessons/web-dev/ch07.ts", createLesson("07", "07", "3.1", "Intro to SQLite",
`# Intro to Raw SQLite

It's time for the real deal. We're going to connect to an **SQLite** database using a popular Rust crate called \`rusqlite\`.

## The Connection

To talk to the database, we first open a connection. Usually, you provide a file path like \`data.sqlite\`. For our interactive exercises, we'll use a special "in-memory" connection:

\`\`\`rust
use rusqlite::Connection;
let conn = Connection::open_in_memory().unwrap();
\`\`\`

## Executing Raw SQL

To create tables or insert data, we pass raw SQL strings into the \`.execute()\` method.

\`\`\`rust
// We are manually writing SQL strings here!
conn.execute(
    "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)",
    [], // Parameters go here (we'll learn this later)
).unwrap();

conn.execute(
    "INSERT INTO users (name) VALUES ('ferris')",
    [],
).unwrap();
\`\`\`

## Selecting Data (The Painful Way)

When you ask the database for data, it returns raw "Rows" consisting of columns. You have to manually tell Rust exactly which column contains what type of data using \`.get()\`.

\`\`\`rust
let mut stmt = conn.prepare("SELECT name FROM users")?;
let mut rows = stmt.query([])?;

while let Some(row) = rows.next()? {
    // We manually extract column 0 as a String.
    // If we typo the column index or type, the program panics at runtime!
    let name: String = row.get(0)?;
    println!("Found: {}", name);
}
\`\`\`

We call this **Manual Mapping**, and as you'll soon experience, it can be frustrating if you make a typo!`,
[
    { question: "What does rusqlite's execute() method do?", options: ["Deletes the database", "Executes a raw SQL command string", "Encrypts the database", "Turns Rust into SQL"], correctIndex: 1 },
    { question: "Why can manual mapping (like row.get(0)) be dangerous?", options: ["It causes the database to lock up", "It uses too much memory", "If you provide the wrong index or wrong type, the program crashes at runtime", "It deletes random rows"], correctIndex: 2 }
],
`## Your Mission

Let's use \`rusqlite\` to insert and read from a real database. We've provided a \`setup_db()\` function that creates a table with an \`id\` and \`name\`.

1. Use \`conn.execute()\` to insert a user with the name \`"ferris"\`.
2. The provided selection query finds all users. Notice the manual \`row.get::<usize, String>(1)?\` mapping used to extract the 'name' column. Just return that \`Vec<String>\`!

### Requirements:
- Insert into the \`users\` table.`,
`#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sqlite_insert() {
        let mut conn = Connection::open_in_memory().unwrap();
        setup_db(&conn).unwrap();
        
        insert_and_read(&conn).unwrap();
        
        let count: i32 = conn.query_row("SELECT count(*) FROM users", [], |row| row.get(0)).unwrap();
        assert_eq!(count, 1);
        
        let name: String = conn.query_row("SELECT name FROM users", [], |row| row.get(0)).unwrap();
        assert_eq!(name, "ferris");
    }
}`,
`use rusqlite::{Connection, Result};

fn setup_db(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )",
        [],
    )?;
    Ok(())
}

fn insert_and_read(conn: &Connection) -> Result<Vec<String>> {
    // 1. TODO: Execute an INSERT statement.
    // The table is "users" and the column is "name".
    conn.execute(
        "____", 
        [],
    )?;

    // 2. We prepare a SELECT query
    let mut stmt = conn.prepare("SELECT id, name FROM users")?;
    
    // 3. We manually map the raw rows into a Vec<String>
    let rows = stmt.query_map([], |row| {
        // Notice the danger here! We have to know 'name' is at index 1 and is a String
        let name: String = row.get(1)?;
        Ok(name)
    })?;

    let mut names = Vec::new();
    for name_result in rows {
        names.push(name_result?);
    }
    
    Ok(names)
}

fn main() {
    let conn = Connection::open_in_memory().unwrap();
    setup_db(&conn).unwrap();
    
    match insert_and_read(&conn) {
        Ok(names) => println!("Inserted users: {:?}", names),
        Err(e) => println!("Database error: {}", e),
    }
}
`));

fs.writeFileSync("src/data/lessons/web-dev/ch08.ts", createLesson("08", "08", "3.2", "Relationships & JOINs",
`# Relationships & JOINs

In the real world, data is connected. A "User" might have many "Posts". An "Order" belongs to a "Customer". 

Instead of putting everything in one giant table (which would get messy and repetitive), we split data into separate tables and "relate" them using **Foreign Keys**.

## One-to-Many Relationships

This is the most common relationship. 

1. **Users Table**: Contains user info (\`id\`, \`username\`).
2. **Posts Table**: Contains post info (\`id\`, \`title\`, \`user_id\`).

The \`user_id\` in the \`posts\` table is a **Foreign Key**. It "points" back to the \`id\` in the \`users\` table. Both tables can live inside the same SQLite database.

## Combining Tables with JOIN

What if we want to see the post title *and* the username together? We use a \`JOIN\`.

\`\`\`sql
SELECT posts.title, users.username
FROM posts
JOIN users ON posts.user_id = users.id;
\`\`\`

Think of \`JOIN\` as a way to "stitch" two spreadsheets together temporarily based on a matching column (id and user_id).

## Writing JOIN strings in Rust

When writing complex queries like JOINs in raw SQL strings, you have to be very careful. 

\`\`\`rust
let mut stmt = conn.prepare(
    "SELECT posts.title, users.username 
     FROM posts 
     JOIN users ON posts.user_id = users.id"
)?;
\`\`\`

If you mistype \`users.username\` or \`posts.user_id\`, Rust won't know! It will compile perfectly fine, but crash instantly the moment it runs.`,
[
    { question: "What is a Foreign Key?", options: ["A key used to encrypt the database", "A column that points to the ID of a row in another table", "The primary password for the database", "A column that is only used by foreign users"], correctIndex: 1 },
    { question: "Which SQL command is used to stitch data from related tables together?", options: ["COMBINE", "STITCH", "JOIN", "MERGE"], correctIndex: 2 },
    { question: "What happens if you have a typo in your raw JOIN string using rusqlite?", options: ["The Rust compiler will throw an error immediately", "The database fixes the typo automatically", "The code compiles, but crashes at runtime when the query is executed", "It will return random data"], correctIndex: 2 }
],
`## Your Mission

We've provided a pre-seeded database containing a \`users\` table and a \`posts\` table. We want to find out who authored the post with ID 101.

1. Write a raw SQL \`SELECT\` string that joins \`users\` and \`posts\`.
2. Select the \`username\` from the \`users\` table where the \`posts.id\` is 101.
3. Manually map the result to a String.

### Requirements:
- Use the JOIN syntax you learned!`,
`#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_join_query() {
        let conn = Connection::open_in_memory().unwrap();
        setup_db(&conn).unwrap();
        
        let author = find_post_author(&conn, 101).unwrap();
        assert_eq!(author, "ferris");
    }
}`,
`use rusqlite::{Connection, Result, params};

fn setup_db(conn: &Connection) -> Result<()> {
    // We create the tables and seed them with a user and a post
    conn.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT)", [])?;
    conn.execute("CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT, user_id INTEGER)", [])?;
    
    conn.execute("INSERT INTO users (id, username) VALUES (1, 'ferris')", [])?;
    conn.execute("INSERT INTO posts (id, title, user_id) VALUES (101, 'Hello Rust', 1)", [])?;
    Ok(())
}

fn find_post_author(conn: &Connection, post_id: i32) -> Result<String> {
    // TODO: Write a JOIN query to find the username of the author of a specific post.
    // We've provided the 'params![post_id]' to safely inject the ID into the '?' placeholder.
    let username: String = conn.query_row(
        "
        SELECT ____
        FROM posts
        JOIN ____ ON posts.____ = users.____
        WHERE posts.id = ?
        ",
        params![post_id],
        |row| row.get(0) // Manually grab the first column (username)
    )?;
    
    Ok(username)
}

fn main() {
    let conn = Connection::open_in_memory().unwrap();
    setup_db(&conn).unwrap();
    
    match find_post_author(&conn, 101) {
        Ok(name) => println!("Post 101 author: {}", name),
        Err(e) => println!("Error: {}", e),
    }
}
`));

fs.writeFileSync("src/data/lessons/web-dev/ch09.ts", createLesson("09", "09", "3.3", "Schema Design & Constraints",
`# Schema Design & Constraints

Designing a database is like building a house: you need a solid blueprint. In database terms, this blueprint is called a **Schema**.

To keep our data accurate and high-quality, we use **Constraints**—rules that the database enforces for us.

## Primary Keys (The ID)

Every table should have a **Primary Key**. It's a special column that:
1. Is **Unique**: No two rows can have the same ID.
2. Is **Not Null**: Every row *must* have an ID.

In SQLite, a column defined as \`INTEGER PRIMARY KEY\` automatically increments when you insert a new row!

## Common Constraints

| Constraint | What it does | Example |
|------------|--------------|---------|
| \`NOT NULL\` | Prevents the column from being empty | \`username TEXT NOT NULL\` |
| \`UNIQUE\` | Prevents duplicate values | \`email TEXT UNIQUE\` |
| \`DEFAULT\` | Sets a value if none is provided | \`is_active BOOLEAN DEFAULT TRUE\` |
| \`CHECK\` | Ensures data follows a specific rule | \`age INTEGER CHECK (age >= 18)\` |

## Data Types

Databases are strict about **Types**:
- **INTEGER**: Whole numbers (id, age, count).
- **TEXT**: Strings of text (name, bio).
- **REAL**: Floating-point numbers (price).

## The Power of SQLite Constraints

Imagine a "Sign Up" form where someone forgets to enter an email. 
- Without constraints, your Rust \`Vec\` might have just saved an empty record, causing weird bugs later.
- With \`NOT NULL\` and \`UNIQUE\`, SQLite will **refuse** to save bad data and throw an error back to your Rust code! This is called **Data Integrity**.`,
[
    { question: "What is a 'Primary Key'?", options: ["A secret password for the admin", "A column that uniquely identifies each row in a table", "The largest column in the table", "A column that must be the color yellow"], correctIndex: 1 },
    { question: "What does the 'NOT NULL' constraint do?", options: ["Prevents the column from being deleted", "Enforces that the column must have a value", "Makes the value equal to zero", "Automatically fills the column with random text"], correctIndex: 1 },
    { question: "Which constraint ensures that no two people can have the same username?", options: ["NOT NULL", "UNIQUE", "DEFAULT", "CHECK"], correctIndex: 1 },
    { question: "What happens if a Rust program tries to INSERT data that violates a UNIQUE constraint in SQLite?", options: ["SQLite deletes the old row to make room", "SQLite ignores the error and saves it anyway", "SQLite refuses to insert the data and returns an error to Rust", "The Rust compiler won't let you build the project"], correctIndex: 2 }
],
`## Your Mission

Let's see constraints in action using \`rusqlite\`. We're creating a \`users\` table with two constraints on the \`username\`: it must be \`NOT NULL\` and \`UNIQUE\`.

1. Try inserting a second user with the same \`"ferris"\` username.
2. Catch the database error (which occurs because the \`UNIQUE\` constraint was violated) and return it as a string!

### Requirements:
- Attempt to insert duplicate data.
- Return the error using \`.unwrap_err().to_string()\`.`,
`#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_unique_constraint() {
        let conn = Connection::open_in_memory().unwrap();
        setup_db(&conn).unwrap();
        
        let error_msg = insert_duplicate(&conn);
        assert!(error_msg.contains("UNIQUE constraint failed"));
    }
}`,
`use rusqlite::{Connection, Result};

fn setup_db(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL UNIQUE
        )",
        [],
    )?;
    
    // The first insert works perfectly!
    conn.execute("INSERT INTO users (username) VALUES ('ferris')", [])?;
    Ok(())
}

fn insert_duplicate(conn: &Connection) -> String {
    // 1. TODO: Try to insert 'ferris' a SECOND time. 
    // This violates the UNIQUE constraint we defined above!
    let result = conn.execute(
        "________",
        [],
    );
    
    // 2. Return the error message!
    match result {
        Ok(_) => "Wait, this shouldn't have succeeded!".into(),
        Err(e) => e.to_string(), // This is what we expect!
    }
}

fn main() {
    let conn = Connection::open_in_memory().unwrap();
    setup_db(&conn).unwrap();
    
    println!("Constraint Error: {}", insert_duplicate(&conn));
}
`));

fs.writeFileSync("src/data/lessons/web-dev/ch10.ts", createLesson("10", "10", "4.1", "SQLx — Type-Safe SQL",
`# SQLx — Type-Safe SQL

In the previous module, we learned how to write SQL queries using \`rusqlite\`. But you probably noticed a big problem: **Raw SQL strings are dangerous.** 

If you mistyped a column name in \`SELECT useername FROM users\`, your Rust code still compiled perfectly fine. It wasn't until you *ran* the code that it panicked. 

Furthermore, you had to manually map columns like \`let param: String = row.get(0)?\`. One typo there, and crash!

## Enter SQLx

**SQLx** is the modern bridge between Rust and databases. It has two massive superpowers:

1. **Compile-Time Checked SQL**: SQLx can connect to your database *while you are compiling*. It checks every SQL string. If you mistype a column name, your Rust code **will not compile**!
2. **Automatic Mapping**: No more \`row.get(0)\`. SQLx automatically maps database rows into Rust structs using macros.
3. **Async**: SQLx is fully async, making it the perfect partner for our Tokio/Axum web server.

## The Magic Macro: \`query_as!\`

\`\`\`rust
// We derive FromRow so SQLx can map it automatically!
#[derive(sqlx::FromRow)]
struct User {
    id: i64,
    name: String,
}

// The '!' means this is a macro that checks against the database at compile time!
let user = sqlx::query_as!(
    User,
    "SELECT id, name FROM users WHERE id = ?",
    1
).fetch_one(&pool).await?;
\`\`\`

## Safety: Preventing SQL Injection

Notice the \`?\` and the \`1\` at the end? We **never** build SQL strings manually like \`format!("SELECT * WHERE id = {}", user_input)\`. 

Hackers can use that to inject malicious SQL. By using \`?\`, SQLx binds the parameter safely, treating it strictly as data, not executable code.`,
[
    { question: "What is the primary benefit of using SQLx's query macros over raw rusqlite strings?", options: ["It automatically creates your tables", "It checks your SQL queries for typos at compile-time", "It compresses the database file", "It converts SQL into Javascript"], correctIndex: 1 },
    { question: "How does SQLx map database rows to Rust structs?", options: ["You have to manually use row.get() for every field", "It uses the #[derive(FromRow)] macro or the query_as! macro to do it automatically", "It requires you to write a custom JSON parser", "It guesses based on variable names"], correctIndex: 1 },
    { question: "How do you securely pass a user's input into an SQLx query?", options: ["By using the format!() macro", "By appending it to the string", "By using bound parameters with the '?' placeholder", "By encrypting it first"], correctIndex: 2 }
],
`## Your Mission

Let's use \`sqlx\` to fetch data safely. We've set up an in-memory SQLite pool and seeded it. 

1. Complete the \`fetch_user\` function using \`sqlx::query_as\`.
2. Notice how we don't have to manually pull rows with \`row.get()\`—SQLx maps it directly into the \`User\` struct!
3. Bind the \`user_id\` parameter to the \`?\` placeholder.

### Requirements:
- Use the provided \`User\` struct.
- Use \`.bind()\` and \`.fetch_one()\`.`,
`#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_sqlx_fetch() {
        let pool = setup_db().await.unwrap();
        
        let user = fetch_user(&pool, 1).await.unwrap();
        assert_eq!(user.name, "ferris");
    }
}`,
`use sqlx::{sqlite::SqlitePoolOptions, SqlitePool, FromRow};

#[derive(Debug, FromRow)]
struct User {
    id: i64, 
    name: String,
}

// We simulate setting up the DB pool
async fn setup_db() -> Result<SqlitePool, sqlx::Error> {
    let pool = SqlitePoolOptions::new().connect("sqlite::memory:").await?;
    sqlx::query("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)").execute(&pool).await?;
    sqlx::query("INSERT INTO users (id, name) VALUES (1, 'ferris')").execute(&pool).await?;
    Ok(pool)
}

async fn fetch_user(pool: &SqlitePool, user_id: i64) -> Result<User, sqlx::Error> {
    // 1. TODO: Use sqlx::query_as to select the user by ID
    // 2. Bind the user_id parameter safely
    let user = sqlx::query_as::<_, User>(
        "SELECT id, name FROM users WHERE id = ?"
    )
    .bind(________) // Inject the parameter safely!
    .fetch_one(pool) 
    .await?;
    
    Ok(user)
}

#[tokio::main]
async fn main() {
    let pool = setup_db().await.unwrap();
    
    match fetch_user(&pool, 1).await {
        Ok(user) => println!("Mapped User: {:?}", user),
        Err(e) => println!("Error: {}", e),
    }
}
`));

fs.writeFileSync("src/data/lessons/web-dev/ch11.ts", createLesson("11", "11", "4.2", "ORM Patterns & Migrations",
`# ORM Patterns & Migrations

\`sqlx\` is incredible, but as your app grows, even writing safe, checked SQL strings for every single insert, update, and delete gets tedious. 

That's why we use an **ORM** (Object-Relational Mapper). An ORM writes the SQL for you!

## From SQL to Rust

| Raw SQL / SQLx | ORM (SeaORM) |
|----------------|-------------|
| \`"SELECT * FROM users"\` | \`User::find().all(&db)\` |
| \`"INSERT INTO users..."\` | \`user.insert(&db)\` |

The ORM is our ultimate abstraction layer. We construct Rust objects and call methods, and the ORM translates that into the highly optimized SQL strings under the hood.

## What are Migrations?

In earlier modules, we hardcoded \`CREATE TABLE\` strings right into our Rust code to set up the database. In a real app, you'll constantly add features over time:
- *"We need to add a 'profile_picture_url' column to the users table."*
- *"We need a new table for 'Comments'."*

How do we change the database structure without deleting the file and starting over? We use **Migrations**.

### Version Control for Data

Migrations are like **Git commits** for your database schema.
- **Migration #1**: Create \`users\` table.
- **Migration #2**: Add \`age\` column to \`users\`.
- **Migration #3**: Create \`posts\` table.

Each migration has an \`up\` part (to apply the change) and a \`down\` part (to undo it).

## The Loco Framework

The **Loco** framework (which we'll explore in the next module) uses an ORM called **SeaORM**. It handles migrations automatically, so you can focus entirely on building features while Loco keeps your database schema in perfect sync.

## Summary of the Data Ladder

You've made it! Look at how far we've graduated:
1. **Simulation**: Rust \`Vec\`s (fast, but no persistence).
2. **SQLite + \`rusqlite\`**: Persistence, but painful raw SQL strings and runtime typos.
3. **SQLite + \`sqlx\`**: Compile-time safety, but still writing manual SQL strings.
4. **SeaORM (Loco)**: Total abstraction. Write pure Rust, let the library generate the SQL.

You now understand **HOW** databases work, **WHY** we need them, and **WHY** frameworks like Loco use ORMs. You are ready to build a real web app!`,
[
    { question: "What does an ORM do?", options: ["Translates between database rows and Rust objects automatically", "Makes the internet faster", "Automatically backups your computer", "Encrypts the database"], correctIndex: 0 },
    { question: "What are 'Migrations'?", options: ["Moving your database from one city to another", "Version control for your database structure (schema) over time", "A way to delete all data and start over", "A type of bird that likes SQL"], correctIndex: 1 },
    { question: "In a migration, what does the 'up' function do?", options: ["Uploads the data to the cloud", "Applies a new structural change to the database", "Reverts a change", "Calculates the number of rows"], correctIndex: 1 },
    { question: "Why use an ORM instead of sqlx for everything?", options: ["It's required by the law", "It eliminates the need to write repetitive CRUD queries manually, keeping code clean", "It's always 10x faster than sqlx", "sqlx doesn't work with SQLite"], correctIndex: 1 }
],
`## Your Mission

Let's simulate a basic "Migration" system in Rust. 

Implement the \`apply_migration\` function to handle two types of "commands" (represented by strings):
1. \`"CREATE_USERS"\`: Add "id" and "name" to the \`columns\` vector.
2. \`"ADD_AGE"\`: Add "age" to the \`columns\` vector.

### Requirements:
- Use the provided \`Schema\` struct to reflect the migrations.`,
`#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_migrations() {
        let mut schema = Schema::new();
        
        schema.apply_migration("CREATE_USERS");
        assert!(schema.columns.contains(&"id".to_string()));
        assert!(schema.columns.contains(&"name".to_string()));
        assert!(!schema.columns.contains(&"age".to_string()));

        schema.apply_migration("ADD_AGE");
        assert!(schema.columns.contains(&"age".to_string()));
    }
}`,
`struct Schema {
    columns: Vec<String>,
}

impl Schema {
    fn new() -> Self {
        Self { columns: Vec::new() }
    }

    fn apply_migration(&mut self, command: &str) {
        match command {
            "CREATE_USERS" => {
                // TODO: Push "id" and "name" to columns
                self.columns.push("id".into());
            }
            "ADD_AGE" => {
                // TODO: Push "age" to columns
            }
            _ => {}
        }
    }
}

fn main() {
    let mut s = Schema::new();
    s.apply_migration("CREATE_USERS");
    println!("Migration 1 Columns: {:?}", s.columns);
    s.apply_migration("ADD_AGE");
    println!("Migration 2 Columns: {:?}", s.columns);
}
`));

