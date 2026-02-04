//! Integration tests for the execution module (soft sandbox + native compilation)

use crab_cademy_lib::execution::execute_rust_code;

#[test]
fn test_hello_world() {
    let code = r#"fn main() { println!("Hello!"); }"#;
    let output = execute_rust_code(code);
    assert!(output.contains("Hello!"), "Output: {}", output);
}

#[test]
fn test_fs_blocked() {
    let code = r#"
        use std::fs;
        fn main() { fs::write("/tmp/test.txt", "evil"); }
    "#;
    let output = execute_rust_code(code);
    assert!(output.contains("Sandbox Violation"), "Output: {}", output);
}

#[test]
fn test_unsafe_blocked() {
    let code = r#"fn main() { unsafe { } }"#;
    let output = execute_rust_code(code);
    assert!(output.contains("Sandbox Violation"), "Output: {}", output);
}

#[test]
fn test_net_blocked() {
    let code = r#"
        use std::net::TcpStream;
        fn main() { TcpStream::connect("127.0.0.1:80"); }
    "#;
    let output = execute_rust_code(code);
    assert!(output.contains("Sandbox Violation"), "Output: {}", output);
}

#[test]
fn test_process_blocked() {
    let code = r#"
        use std::process::Command;
        fn main() { Command::new("ls").status(); }
    "#;
    let output = execute_rust_code(code);
    assert!(output.contains("Sandbox Violation"), "Output: {}", output);
}
