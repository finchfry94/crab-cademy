use polars::prelude::*;

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


#[cfg(test)]
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
