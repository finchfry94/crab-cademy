const fs = require('fs');

const createTest = (ch, modName, pathId, quizAnswers, codeSolution) => `import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter ${ch}: ${modName}', () => {
    test('${modName} Lesson', async ({ page }) => {
        await page.goto('/path/web-dev/lesson/webdev-${pathId}');

        // Quiz
${quizAnswers.map(ans => `        await page.locator('label', { hasText: '${ans.replace(/'/g, "\\'")}' }).click();`).join('\n')}
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = \`${codeSolution.replace(/`/g, '\\`')}\`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
`;

fs.writeFileSync('tests/web-dev/ch05.spec.ts', createTest(
    5, "In-Memory Data Stores", "05",
    ["A collection of organized data, like a spreadsheet", "SELECT", "INSERT INTO"],
    `struct UserStore {
    users: Vec<String>,
}

impl UserStore {
    fn new() -> Self {
        Self { users: Vec::new() }
    }

    fn add_user(&mut self, name: String) {
        self.users.push(name);
    }

    fn find_user(&self, index: usize) -> Option<&String> {
        self.users.get(index)
    }
}

fn main() {
    let mut store = UserStore::new();
    store.add_user("ferris".into());
    println!("User at 0: {:?}", store.find_user(0));
}
`));

fs.writeFileSync('tests/web-dev/ch06.spec.ts', createTest(
    6, "The Persistence Problem", "06",
    ["It is wiped from memory and lost forever", "Because searching through a giant file is incredibly slow and inefficient compared to a true database engine", "A database engine that stores data in a single file"],
    `fn handle_request(name: String) -> usize {
    let mut users = Vec::new();
    users.push(name);
    users.len()
}

fn main() {
    println!("Request 1 (ferris): Users saved: {}", handle_request("ferris".into()));
    println!("Request 2 (crabby): Users saved: {}", handle_request("crabby".into()));
    println!("Where did ferris go? We need a real database!");
}
`));

fs.writeFileSync('tests/web-dev/ch07.spec.ts', createTest(
    7, "Intro to SQLite", "07",
    ["Executes a raw SQL command string", "If you provide the wrong index or wrong type, the program crashes at runtime"],
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
    conn.execute(
        "INSERT INTO users (name) VALUES ('ferris')", 
        [],
    )?;

    let mut stmt = conn.prepare("SELECT id, name FROM users")?;
    
    let rows = stmt.query_map([], |row| {
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

fs.writeFileSync('tests/web-dev/ch08.spec.ts', createTest(
    8, "Relationships & JOINs", "08",
    ["A column that points to the ID of a row in another table", "JOIN", "The code compiles, but crashes at runtime when the query is executed"],
    `use rusqlite::{Connection, Result, params};

fn setup_db(conn: &Connection) -> Result<()> {
    conn.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT)", [])?;
    conn.execute("CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT, user_id INTEGER)", [])?;
    conn.execute("INSERT INTO users (id, username) VALUES (1, 'ferris')", [])?;
    conn.execute("INSERT INTO posts (id, title, user_id) VALUES (101, 'Hello Rust', 1)", [])?;
    Ok(())
}

fn find_post_author(conn: &Connection, post_id: i32) -> Result<String> {
    let username: String = conn.query_row(
        "
        SELECT users.username
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.id = ?
        ",
        params![post_id],
        |row| row.get(0)
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

fs.writeFileSync('tests/web-dev/ch09.spec.ts', createTest(
    9, "Schema Design & Constraints", "09",
    ["A column that uniquely identifies each row in a table", "Enforces that the column must have a value", "UNIQUE", "SQLite refuses to insert the data and returns an error to Rust"],
    `use rusqlite::{Connection, Result};

fn setup_db(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL UNIQUE
        )",
        [],
    )?;
    conn.execute("INSERT INTO users (username) VALUES ('ferris')", [])?;
    Ok(())
}

fn insert_duplicate(conn: &Connection) -> String {
    let result = conn.execute(
        "INSERT INTO users (username) VALUES ('ferris')",
        [],
    );
    match result {
        Ok(_) => "Wait, this shouldn't have succeeded!".into(),
        Err(e) => e.to_string(),
    }
}

fn main() {
    let conn = Connection::open_in_memory().unwrap();
    setup_db(&conn).unwrap();
    println!("Constraint Error: {}", insert_duplicate(&conn));
}
`));

fs.writeFileSync('tests/web-dev/ch10.spec.ts', createTest(
    10, "SQLx — Type-Safe SQL", "10",
    ["It checks your SQL queries for typos at compile-time", "It uses the #[derive(FromRow)] macro or the query_as! macro to do it automatically", "By using bound parameters with the '?' placeholder"],
    `use sqlx::{sqlite::SqlitePoolOptions, SqlitePool, FromRow};

#[derive(Debug, FromRow)]
struct User {
    id: i64, 
    name: String,
}

async fn setup_db() -> Result<SqlitePool, sqlx::Error> {
    let pool = SqlitePoolOptions::new().connect("sqlite::memory:").await?;
    sqlx::query("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)").execute(&pool).await?;
    sqlx::query("INSERT INTO users (id, name) VALUES (1, 'ferris')").execute(&pool).await?;
    Ok(pool)
}

async fn fetch_user(pool: &SqlitePool, user_id: i64) -> Result<User, sqlx::Error> {
    let user = sqlx::query_as::<_, User>(
        "SELECT id, name FROM users WHERE id = ?"
    )
    .bind(user_id)
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

fs.writeFileSync('tests/web-dev/ch11.spec.ts', createTest(
    11, "ORM Patterns & Migrations", "11",
    ["Translates between database rows and Rust objects automatically", "Version control for your database structure (schema) over time", "Applies a new structural change to the database", "It eliminates the need to write repetitive CRUD queries manually, keeping code clean"],
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
                self.columns.push("id".into());
                self.columns.push("name".into());
            }
            "ADD_AGE" => {
                self.columns.push("age".into());
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

// Update old shifted files
for (let oldCh = 10, newCh = 12; oldCh <= 17; oldCh++, newCh++) {
    let formattedOld = oldCh.toString().padStart(2, '0');
    let formattedNew = newCh.toString().padStart(2, '0');
    const filename = "tests/web-dev/ch" + formattedNew + ".spec.ts";
    if (!fs.existsSync(filename)) continue;
    let content = fs.readFileSync(filename, "utf-8");
    // Update "Chapter X" to "Chapter Y"
    content = content.replace(new RegExp("Web Dev Chapter " + oldCh, "g"), "Web Dev Chapter " + newCh);
    // Update the URLs from webdev-X to webdev-Y
    content = content.replace(new RegExp("webdev-" + formattedOld, "g"), "webdev-" + formattedNew);
    fs.writeFileSync(filename, content);
}
console.log("Tests generated and updated.");
