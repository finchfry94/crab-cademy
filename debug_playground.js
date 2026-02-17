// using global fetch in node 18+

const code = `#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let response = reqwest::get("https://httpbin.org/get")
        .await?
        .text()
        .await?;

    println!("{response}");
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_request() {
        // Validation logic
    }
}`;

const request = {
    channel: "stable",
    mode: "debug",
    edition: "2021",
    crateType: "bin",
    tests: true,
    code: code,
    backtrace: false,
};

async function run() {
    const response = await fetch("https://play.rust-lang.org/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });

    const result = await response.json();
    console.log("Success:", result.success);
    console.log("Stdout:", result.stdout);
    console.log("Stderr:", result.stderr);
}

run();
