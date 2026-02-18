
import { Lesson } from "../../types";

export const ch02Lessons: Lesson[] = [
    {
        id: "polars-02",
        chapter: "1.2",
        title: "Contexts & Expressions",
        sort_order: 2,
        environment: "desktop",
        content: `# Contexts & Expressions

Welcome back! In the last lesson, we created a DataFrame. Now, let's actually *do* something with it.

## The Expression API

Polars is special because it uses an **Expression API**. In Pandas, you might do \`df['a'] * 2\`. In Polars, you write an expression that *describes* that operation: \`col("a") * lit(2)\`.

These expressions are lazy. They don't run until you execute them within a **Context**.

## The \`select\` Context

The most basic context is \`select\`. It determines which columns you want to return.

\`\`\`rust
// Select the "name" column and a new column "double_age"
let out = df.clone().lazy().select([
    col("name"),
    (col("age") * lit(2)).alias("double_age")
]).collect()?;
\`\`\`

### Key Functions

*   \`col("name")\`: Refers to a column.
*   \`lit(value)\`: Wraps a literal value (like a number or string) into an expression.
*   \`alias("new_name")\`: Renames the result of an expression.

## Why \`lazy()\`?

You'll notice \`.lazy()\` and \`.collect()\` in the example. 
*   **Lazy**: Converts the eager DataFrame into a LazyFrame. This is where the magic optimization happens.
*   **Collect**: Triggers the execution and returns a Result<DataFrame>.

For simple operations, you *can* use eager methods, but learning the lazy API is the superpower of Polars.
`,
        quiz: [
            {
                question: "What function do you use to refer to a column in an expression?",
                options: ["column()", "c()", "col()", "get()"],
                correctIndex: 2,
            },
            {
                question: "What does `alias()` do?",
                options: [
                    "Hides the column",
                    "Renames the output of an expression",
                    "Creates a copy of the dataframe",
                    "Deletes the column",
                ],
                correctIndex: 1,
            },
            {
                question: "Why do we use `lazy()`?",
                options: [
                    "Because we are tired",
                    "To enable query implementation optimizations",
                    "It is required for all operations",
                    "To slow down the execution",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

You are given a DataFrame with columns: "item", "price", "tax_rate".

Write a function \`calculate_total\` that returns a DataFrame with:
1.  The "item" column.
2.  A new column "total_price" calculated as \`price * (1 + tax_rate)\`.

**Requirements:**
*   Use \`lazy()\` and \`select\`.
*   Use \`col()\` and \`lit()\`.
*   Don't forget to \`collect()\`!
`,
        starter_code: `use polars::prelude::*;

pub fn calculate_total(df: DataFrame) -> PolarsResult<DataFrame> {
    // df.lazy().select([ ... ]).collect()
    todo!("Implement the selection logic")
}

fn main() -> PolarsResult<()> {
    let df = df! [
        "item" => ["Sword", "Shield", "Potion"],
        "price" => [100.0, 50.0, 10.0],
        "tax_rate" => [0.1, 0.1, 0.0]
    ]?;

    let result = calculate_total(df)?;
    println!("{}", result);
    Ok(())
}
`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use polars::prelude::*;

    #[test]
    fn test_calculate_total() {
        let df = df! [
            "item" => ["A"],
            "price" => [10.0],
            "tax_rate" => [0.5]
        ].unwrap();

        let res = calculate_total(df).unwrap();
        
        let expected = df![
            "item" => ["A"],
            "total_price" => [15.0]
        ].unwrap();

        assert!(res.equals(&expected));
    }
}
`,
    },
];
