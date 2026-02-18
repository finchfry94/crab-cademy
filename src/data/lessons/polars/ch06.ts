
import { Lesson } from "../../types";

export const ch06Lessons: Lesson[] = [
    {
        id: "polars-06",
        chapter: "1.6",
        title: "Reading & Writing Data (I/O)",
        sort_order: 6,
        environment: "desktop",
        content: `# Reading & Writing Data (I/O)

Polars is famous for its blazingly fast I/O operations, especially for CSV and Parquet files. It achieves this by using a multi-threaded reader and, when possible, **Lazy Scanning**.

## Eager Reading (Load everything)

If you have a small file and want it in memory immediately:

\`\`\`rust
let df = CsvReader::from_path("data.csv")?
    .finish()?;
\`\`\`

## Lazy Scanning (The Pro Way)

For large datasets, you should **scan** instead of read. This creates a \`LazyFrame\` without actually reading the data yet. Polars will then only read the columns and rows you actually use!

\`\`\`rust
let lf = LazyCsvReader::new("data.csv")
    .has_header(true)
    .finish()?;
    
// OR for Parquet
let lf = LazyFrame::scan_parquet("data.parquet", Default::default())?;
\`\`\`

## Common Formats
*   **CSV**: Universal but slow and bulky.
*   **Parquet**: Columnar, compressed, and blazingly fast. **Use this for your heavy lifting.**
*   **JSON / NDJSON**: For web data.
*   **Avro / IPC (Feather)**: High-performance binary formats.

## Writing Data

Writing is just as easy:

\`\`\`rust
let mut file = std::fs::File::create("output.parquet")?;
ParquetWriter::new(&mut file).finish(&mut df)?;
\`\`\`

## 💡 The "Predicate Pushdown"
When you scan a Parquet file and then \`.filter()\`, Polars actually "pushes" that filter down into the file reader. It won't even load the rows that don't match your filter. This is why it can process terabytes of data in seconds.
`,
        quiz: [
            {
                question: "What is the benefit of 'Scanning' a file instead of 'Reading' it?",
                options: [
                    "It's just a different name for the same thing",
                    "It delays loading to allow for optimization like predicate pushdown",
                    "It makes the file smaller",
                    "It converts the file to a different format",
                ],
                correctIndex: 1,
            },
            {
                question: "Which file format is recommended for high-performance data processing in Polars?",
                options: ["CSV", "Excel", "Parquet", "TXT"],
                correctIndex: 2,
            },
            {
                question: "What is 'Predicate Pushdown'?",
                options: [
                    "Falling while running code",
                    "Moving filters directly into the file reading process",
                    "Deleting columns you don't need",
                    "Compressing the data after it's loaded",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Assume you have a large Parquet file named \`"sensor_data.parquet"\`.

Write a function \`process_sensor_data\` that:
1.  **Scans** the Parquet file lazily.
2.  **Filters** for rows where \`"value"\` is greater than \`100.0\`.
3.  **Selects** only the \`"timestamp"\` and \`"value"\` columns.
4.  **Collects** the result.

*Note: Since we are in a sandbox, you won't actually have the file. Use a dummy path string.*
`,
        starter_code: `use polars::prelude::*;

pub fn process_sensor_data(path: &str) -> PolarsResult<DataFrame> {
    // LazyFrame::scan_parquet(path, Default::default())?
    // .filter(...)
    // .select(...)
    // .collect()
    todo!()
}

fn main() {
   // This would fail in a real environment without the file
   // let _ = process_sensor_data("sensor_data.parquet");
}
`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_logic() {
        // We can't easily test this without a file, 
        // but we can check if it compiles!
        assert!(true);
    }
}
`,
    },
];
