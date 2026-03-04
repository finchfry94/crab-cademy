use axum::{extract::Path, routing::get, Json, Router};
use serde::Serialize;

#[derive(Serialize)]
struct GreetResponse {
    message: String,
}

async fn greet_default() -> Json<GreetResponse> {
    // Return {"message": "Hello from Loco!"}
    todo!()
}

async fn greet_name(Path(name): Path<String>) -> Json<GreetResponse> {
    // Return {"message": "Hello, {name}!"}
    todo!()
}

pub fn routes() -> Router {
    Router::new()
        .route("/greet", get(greet_default))
        .route("/greet/:name", get(greet_name))
}


#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::Request;
    use tower::ServiceExt;

    #[tokio::test]
    async fn test_greet_default() {
        let app = routes();
        let response = app
            .oneshot(Request::builder().uri("/greet").body(Body::empty()).unwrap())
            .await
            .unwrap();
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let resp: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(resp["message"], "Hello from Loco!");
    }

    #[tokio::test]
    async fn test_greet_name() {
        let app = routes();
        let response = app
            .oneshot(Request::builder().uri("/greet/Rustacean").body(Body::empty()).unwrap())
            .await
            .unwrap();
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let resp: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(resp["message"], "Hello, Rustacean!");
    }
}