
import { Lesson } from "../../types";

export const ch01Lessons: Lesson[] = [
    {
        id: "polars-01",
        chapter: "1.1",
        title: "Introduction to Polars",
        sort_order: 1,
        environment: "desktop",
        content: `# Introduction to Polars

Welcome to the **fastest** dataframe library in the known universe (citation needed, but it's really fast).

## What is Polars?

If you're coming from Python, you probably know **Pandas**. It's the Swiss Army knife of data science. But like a real Swiss Army knife, it can be a bit... clunky when you're trying to cut down a tree (i.e., process massive datasets).

**Polars** is a dataframe library written in **Rust** (heck yeah!) that is designed from the ground up for:

1.  **Speed**: It uses Apache Arrow for memory efficiency and vectorization.
2.  **Parallelism**: It automatically uses all your CPU cores.
3.  **Lazy Evaluation**: It optimizes your queries before running them.

## Why Should You Care?

Imagine defining a complex data transformation pipeline. In Pandas, each step executes immediately, creating intermediate copies of your data.

In **Polars**, you can write a "lazy" query. Polars looks at your entire plan, says "Actually, I can do step 3 before step 1 and skip step 2 entirely," and *then* runs it. It's like having a database query optimizer for your in-memory data.

## Your First Polars DataFrame

Let's create a simple DataFrame. In Rust, we use the \`df!\` macro for quick creation.

\`\`\`rust
use polars::prelude::*;

fn main() -> PolarsResult<()> {
    let df = df! [
        "name" => ["Alice", "Bob", "Charlie"],
        "age" => [25, 30, 35],
        "role" => ["Engineer", "Designer", "Manager"]
    ]?;

    println!("{}", df);
    Ok(())
}
\`\`\`

### Key Concepts

*   **Series**: A single column of data (like a typed array).
*   **DataFrame**: A collection of Series (like a table).
*   **PolarsResult**: Polars operations often return a \`Result\` because things can fail (e.g., mismatched column lengths).
`,
        quiz: [
            {
                question: "What is the primary reason for Polars' speed?",
                options: [
                    "It uses magic spells",
                    "It uses Apache Arrow and parallel execution",
                    "It ignores all errors",
                    "It runs on the GPU only",
                ],
                correctIndex: 1,
            },
            {
                question: "What is 'Lazy Evaluation' in Polars?",
                options: [
                    "The library runs slowly",
                    "It delays execution to optimize the query plan",
                    "It only reads the first 5 rows",
                    "It requires the user to manually allocate memory",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

1.  Implement a function \`create_inventory() -> PolarsResult<DataFrame>\`.
2.  Use the \`df!\` macro inside it.
3.  Create columns:
    *   "item" (Amphora, Scroll, Gladius)
    *   "count" (10, 50, 3)
    *   "price" (15.5, 5.0, 75.0)
4.  The main function will call yours and print the result.

**Note:** The \`df!\` macro returns a \`Result\`, so you'll need to handle it (e.g., with \`?\` or \`unwrap()\`). For this exercise, \`unwrap()\` is fine since we know the data is valid.
`,
        starter_code: `use polars::prelude::*;

pub fn create_inventory() -> PolarsResult<DataFrame> {
    // let df = df! [ ... ]?;
    // Ok(df)
    todo!()
}

fn main() -> PolarsResult<()> {
    let df = create_inventory()?;
    println!("{}", df);
    Ok(())
}
`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use polars::prelude::*;

    #[test]
    fn test_dataframe_dimensions() {
        let df = create_inventory().unwrap();
        // Check that we have 3 rows and 3 columns
        assert_eq!(df.height(), 3);
        assert_eq!(df.width(), 3);
        
        // Verify columns names
        let names = df.get_column_names();
        assert!(names.contains(&"item"));
        assert!(names.contains(&"count"));
        assert!(names.contains(&"price"));
    }
}
`,
    },
];
