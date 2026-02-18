
import { Lesson } from "../../types";

export const ch05Lessons: Lesson[] = [
    {
        id: "polars-05",
        chapter: "1.5",
        title: "Joins & Concatenation",
        sort_order: 5,
        environment: "desktop",
        content: `# Joins & Concatenation

Data rarely lives in a single table. To get the full picture, you often need to combine multiple DataFrames. In Polars, we do this with **Joins** and **Concatenation**.

## Joins

Joins combine DataFrames based on a shared "key" column. If you know SQL or Pandas, this will feel very familiar.

### Inner Join
Only keeps rows where the key exists in **both** frames.

\`\`\`rust
let joined = df_employees.lazy()
    .join(
        df_departments.lazy(),
        [col("dept_id")], // Left keys
        [col("id")],      // Right keys
        JoinArgs::new(JoinType::Inner)
    )
    .collect()?;
\`\`\`

### Left Join
Keeps **all** rows from the left frame. If no match is found on the right, the right columns will be \`null\`.

### Join Types in Polars
*   \`JoinType::Inner\`
*   \`JoinType::Left\`
*   \`JoinType::Outer\` (or \`Full\`)
*   \`JoinType::Cross\` (everything with everything)

## Concatenation (Stacking)

Sometimes you don't want to join side-by-side, but instead stack data vertically (more rows) or horizontally (more columns).

### Vertical Concatenation
Useful for merging data from multiple time periods or sources with the same schema.

\`\`\`rust
let stacked = concat(
    [df_jan.lazy(), df_feb.lazy(), df_mar.lazy()],
    UnionArgs::default()
)?.collect()?;
\`\`\`

## ⚠️ Key Conflict?
If both DataFrames have a column with the same name (that isn't the join key), Polars will often append a suffix (like \`_right\`) or throw an error depending on your arguments.
`,
        quiz: [
            {
                question: "Which join type only keeps rows present in both DataFrames?",
                options: ["Left Join", "Inner Join", "Outer Join", "Cross Join"],
                correctIndex: 1,
            },
            {
                question: "What happens in a Left Join if a key is missing in the right DataFrame?",
                options: [
                    "The row is deleted",
                    "The program crashes",
                    "The right columns are filled with nulls",
                    "The right columns are filled with zeros",
                ],
                correctIndex: 2,
            },
            {
                question: "Which function is used to stack DataFrames vertically?",
                options: ["merge()", "join()", "concat()", "attach()"],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

You have two DataFrames:
1.  \`df_players\`: "name", "team_id"
2.  \`df_teams\`: "id", "team_name"

Write a function \`get_player_teams\` that:
1.  Performs a **Left Join** (players on the left).
2.  Joins on \`team_id\` (left) and \`id\` (right).
3.  Returns the resulting DataFrame.
`,
        starter_code: `use polars::prelude::*;

pub fn get_player_teams(players: DataFrame, teams: DataFrame) -> PolarsResult<DataFrame> {
    // Join players and teams
    todo!()
}

fn main() -> PolarsResult<()> {
    let players = df![
        "name" => ["Alice", "Bob", "Charlie"],
        "team_id" => [1, 2, 1]
    ]?;
    
    let teams = df![
        "id" => [1, 2],
        "team_name" => ["Crustaceans", "Cephalopods"]
    ]?;

    let result = get_player_teams(players, teams)?;
    println!("{}", result);
    Ok(())
}
`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use polars::prelude::*;

    #[test]
    fn test_join() {
        let players = df!["name" => ["A"], "team_id" => [1]].unwrap();
        let teams = df!["id" => [1], "team_name" => ["T"]].unwrap();
        
        let res = get_player_teams(players, teams).unwrap();
        
        assert_eq!(res.column("team_name").unwrap().get(0).unwrap(), AnyValue::String("T"));
    }
}
`,
    },
];
