
import { Lesson } from "../../types";

export const ch03Lessons: Lesson[] = [
    {
        id: "polars-03",
        chapter: "1.3",
        title: "Filtering & Sorting",
        sort_order: 3,
        environment: "desktop",
        content: `# Filtering & Sorting

Data analysis is 90% finding the stuff you care about and ignoring the rest. In Polars, we use \`filter\` to narrow down rows and \`sort\` to order them.

## Filtering

The \`filter\` function takes a **boolean expression**. If the expression evaluates to \`true\` for a row, that row is kept.

\`\`\`rust
// Keep only rows where age > 18 AND role is "Engineer"
df.lazy()
  .filter(
      col("age").gt(18).and(col("role").eq(lit("Engineer")))
  )
  .collect()?;
\`\`\`

Note the syntax: \`.gt()\` (greater than), \`.eq()\` (equal), \`.and()\` (logical AND). You can't use standard Rust operators like \`>\` or \`==\` directly on expressions in the same way you do on values (though recent versions of Polars support operator overloading in some contexts, explicit methods are safer/clearer).

## Sorting

Sorting is straightforward. You provide the column(s) to sort by.

\`\`\`rust
// Sort by age (descending), then by name (ascending)
df.lazy()
  .sort(
      ["age", "name"], 
      SortOptions::default()
        .with_descending(true) // sort age desc
        // complex sorting might require multiple sort calls or specific options
        // For simple cases:
  )
  .collect()?;
\`\`\`

*Actually, let's keep it simple for now*:
\`\`\`rust
df.lazy().sort(["age"], Default::default()).collect()?;
\`\`\`

## Method Chaining

The beauty of the Lazy API is chaining. You can build a complex query pipeline:

\`\`\`rust
df.lazy()
  .filter(col("active").eq(lit(true)))
  .select([col("name"), col("score")])
  .sort(["score"], Default::default())
  .collect()
\`\`\`

Polars optimizes this whole chain together!
`,
        quiz: [
            {
                question: "What does the `filter` function require?",
                options: [
                    "A list of column names",
                    "A boolean expression",
                    "A sorting order",
                    "A file path",
                ],
                correctIndex: 1,
            },
            {
                question: "Which method is used for 'greater than' in an expression?",
                options: [">", ".gt()", ".greater()", ".big()"],
                correctIndex: 1,
            },
            {
                question: "Can you chain multiple operations in Polars?",
                options: [
                    "No, you must save intermediate results",
                    "Yes, and it is encouraged for optimization",
                    "Only in Python, not Rust",
                    "Yes, but it is slower",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

You have a dataset of orbital launches. Columns: "spacecraft", "success" (bool), "altitude" (u32).

Write a function \`find_successful_high_launches\` that:
1.  Filters for launches where "success" is \`true\`.
2.  Filters for "altitude" greater than \`100\`.
3.  Sorts the result by "altitude" (ascending, default).
4.  Returns the resulting DataFrame.
`,
        starter_code: `use polars::prelude::*;

pub fn find_successful_high_launches(df: DataFrame) -> PolarsResult<DataFrame> {
    // Chain your .lazy(), .filter(), .sort(), and .collect()
    todo!()
}

fn main() -> PolarsResult<()> {
    let df = df! [
        "spacecraft" => ["Vostok", "Apollo", "N1", "Falcon"],
        "success" => [true, true, false, true],
        "altitude" => [200, 380000, 30, 500]
    ]?;

    let result = find_successful_high_launches(df)?;
    println!("{}", result);
    Ok(())
}
`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use polars::prelude::*;

    #[test]
    fn test_launches() {
        let df = df! [
            "spacecraft" => ["A", "B", "C"],
            "success" => [true, false, true],
            "altitude" => [150, 200, 50]
        ].unwrap();

        let res = find_successful_high_launches(df).unwrap();
        
        // Should only keep "A" (success=true, alt=150 > 100)
        // "B" failed. "C" alt is 50 (< 100).
        
        let expected = df![
            "spacecraft" => ["A"],
            "success" => [true],
            "altitude" => [150]
        ].unwrap();

        assert!(res.equals(&expected));
    }
}
`,
    },
];
