
import { Lesson } from "../../types";

export const ch07Lessons: Lesson[] = [
    {
        id: "polars-07",
        chapter: "1.7",
        title: "Window Functions",
        sort_order: 7,
        environment: "desktop",
        content: `# Window Functions (\`over\`)

Sometimes you want to calculate an aggregation (like a sum or average) but you don't want to collapse your DataFrame into a few rows. You want to keep every original row and just add a new column with the grouped value.

In Polars, we do this with the \`over()\` expression.

## The Problem
Imagine you have sales data for multiple cities. You want to know what percentage of a city's total sales each transaction represents.

## The Solution
\`\`\`rust
let out = df.lazy().select([
    col("city"),
    col("sales"),
    // Calculate sum of sales per city, but keep original rows!
    (col("sales") / col("sales").sum().over(["city"])).alias("pct_of_city")
]).collect()?;
\`\`\`

## How it works
1.  **Expression**: \`col("sales").sum()\`
2.  **Window**: \`.over(["city"])\` tells Polars: "Calculate this sum separately for each city."
3.  **Result**: The resulting column has the same length as the original DataFrame.

## Other Window Types
You can also sort within a window! This is great for calculating "rank" or "cumulative sum".

\`\`\`rust
// Rank players by score within their team
col("score").rank(Default::default(), None).over(["team"])
\`\`\`

## 🧠 Why is it called a "Window"?
Think of it like looking through a small window at a subset of your data (the group) to calculate something, then moving that window to the next group, while the main table remains unchanged.
`,
        quiz: [
            {
                question: "What is the main difference between `group_by` and `over`?",
                options: [
                    "group_by collapses the frame; over keeps all rows",
                    "over is only for numbers; group_by is for text",
                    "There is no difference",
                    "group_by is faster than over",
                ],
                correctIndex: 0,
            },
            {
                question: "How do you define the 'groups' in a window function?",
                options: [".groups()", ".by()", ".over()", ".within()"],
                correctIndex: 2,
            },
            {
                question: "Can you calculate a rank within a window?",
                options: ["No", "Yes, using .rank() and .over()", "Only if you sort the whole frame first", "Only in eager mode"],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

You have school data: "student", "class", "grade".

Write a function \`add_class_average\` that:
1.  Calculates the average "grade" per "class" using \`.over()\`.
2.  Adds this as a new column named \`"class_avg"\`.
3.  Returns the resulting DataFrame.
`,
        starter_code: `use polars::prelude::*;

pub fn add_class_average(df: DataFrame) -> PolarsResult<DataFrame> {
    // df.lazy().with_column(
    //    col("grade").mean().over(["class"]).alias("class_avg")
    // ).collect()
    todo!()
}

fn main() -> PolarsResult<()> {
    let df = df![
        "student" => ["Alice", "Bob", "Charlie", "David"],
        "class" => ["Math", "Math", "Science", "Science"],
        "grade" => [90.0, 80.0, 70.0, 100.0]
    ]?;

    let result = add_class_average(df)?;
    println!("{}", result);
    Ok(())
}
`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use polars::prelude::*;

    #[test]
    fn test_window() {
        let df = df![
            "student" => ["A", "B"],
            "class" => ["M", "M"],
            "grade" => [10.0, 20.0]
        ].unwrap();

        let res = add_class_average(df).unwrap();
        
        let avg_col = res.column("class_avg").unwrap().f64().unwrap();
        assert_eq!(avg_col.get(0), Some(15.0));
        assert_eq!(avg_col.get(1), Some(15.0));
    }
}
`,
    },
];
