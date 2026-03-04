mod controllers;

use axum::Router;

#[tokio::main]
async fn main() {
    // In a real Loco app, this is handled by the framework.
    // Here we wire it up manually to show what Loco does under the hood.
    let app = Router::new()
        .merge(controllers::greet::routes());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("🚂 Loco-style server on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
