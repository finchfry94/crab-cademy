
import { Lesson } from "../../types";

export const ch04Lessons: Lesson[] = [
    {
        id: "polars-04",
        chapter: "1.4",
        title: "Aggregation (GroupBy)",
        sort_order: 4,
        environment: "desktop",
        content: `# Aggregation (GroupBy)

The "Split-Apply-Combine" strategy is the heart of data summarizing. You **split** data into groups, **apply** a function to each group (like create a sum or mean), and **combine** the results.

In Polars, we do this with \`group_by\` followed by \`agg\`.

## The Syntax

\`\`\`rust
df.lazy()
  .group_by(["department"])
  .agg([
      col("salary").mean().alias("avg_salary"),
      col("salary").max().alias("max_salary"),
      len().alias("count") // Count rows in group
  ])
  .collect()?;
\`\`\`

**Note**: In recent Polars versions, \`groupby\` was renamed to \`group_by\`. And \`count()\` is often replaced by \`len()\` in expressions to avoid confusion with method calls, though \`col("x").count()\` works too.

## Aggregation Functions

Common aggregations include:
*   \`.mean()\`: Average
*   \`.max()\`, \`.min()\`: Extremes
*   \`.sum()\`: Total
*   \`.first()\`, \`.last()\`: Sample values
*   \`.n_unique()\`: Count unique values

## Using \`agg\` without GroupBy

You can also use \`.select\` to compute these statistics for the *entire* DataFrame globally!

\`\`\`rust
// Global average salary
df.lazy().select([col("salary").mean()]).collect()?;
\`\`\`

But \`group_by\` is where the power lies for categorized data.
`,
        quiz: [
            {
                question: "What method initiates the split-apply-combine process?",
                options: ["split()", "group_by()", "cluster()", "categorize()"],
                correctIndex: 1,
            },
            {
                question: "What passes the aggregation expressions to the groups?",
                options: [".agg()", ".apply()", ".map()", ".run()"],
                correctIndex: 0,
            },
            {
                question: " How would you rename an aggregation result?",
                options: [
                    "You cannot rename it",
                    "Using .rename()",
                    "Using .alias() on the expression",
                    "Using .name()",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

You have sales data: "region" (string), "sales" (f64).

Write \`summarize_sales\` that returns a DataFrame with:
1.  Grouped by "region".
2.  Aggregations:
    *   "total_sales": sum of sales
    *   "avg_sales": mean of sales
3.  Sort by "total_sales" (descending).

**Hint**: Remember \`sort\` comes *after* \`agg\`!
`,
        starter_code: `use polars::prelude::*;

pub fn summarize_sales(df: DataFrame) -> PolarsResult<DataFrame> {
    // group_by -> agg -> sort
    todo!()
}

fn main() -> PolarsResult<()> {
    let df = df! [
        "region" => ["North", "South", "North", "East", "South"],
        "sales" => [100.0, 200.0, 150.0, 50.0, 100.0]
    ]?;

    let result = summarize_sales(df)?;
    println!("{}", result);
    Ok(())
}
`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use polars::prelude::*;

    #[test]
    fn test_summarize_sales() {
        let df = df! [
            "region" => ["A", "A", "B"],
            "sales" => [10.0, 20.0, 5.0]
        ].unwrap();

        let res = summarize_sales(df).unwrap();
        
        // Expected: 
        // A: sum=30, mean=15
        // B: sum=5, mean=5
        // Sorted by sum desc -> A first
        
        let expected_cols = vec![
            "region", "total_sales", "avg_sales"
        ];
        
        // Basic check for column existence and first row value
        let binding = res.column("region").unwrap().cast(&DataType::String).unwrap();
        let region_ca = binding.str().unwrap();
        assert_eq!(region_ca.get(0), Some("A"));
        
        let binding = res.column("total_sales").unwrap();
        let sales_ca = binding.f64().unwrap();
        assert_eq!(sales_ca.get(0), Some(30.0));
    }
}
`,
    },
];
