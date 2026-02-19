use polars::prelude::*;

fn main() {
    let df = df! [
        "item" => ["Amphora", "Scroll", "Gladius"],
        "count" => [10, 50, 3],
        "price" => [15.5, 5.0, 75.0]
    ].unwrap();
    
    println!("{}", df);
}