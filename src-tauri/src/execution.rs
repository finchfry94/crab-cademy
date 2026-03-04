use std::collections::HashMap;
use std::fs;
use std::process::Command;
use syn::visit::Visit;
use tauri::Manager;
use tempfile::Builder;

/// Forbidden module paths that indicate dangerous operations
const FORBIDDEN_PATHS: &[&str] = &["std::fs", "std::net", "std::process", "std::env", "std::os"];

/// Visitor that checks for forbidden patterns in the AST
struct SecurityVisitor {
    errors: Vec<String>,
}

impl SecurityVisitor {
    fn new() -> Self {
        Self { errors: Vec::new() }
    }

    fn check_path(&mut self, path: &syn::Path) {
        let path_str = path
            .segments
            .iter()
            .map(|s| s.ident.to_string())
            .collect::<Vec<_>>()
            .join("::");

        for forbidden in FORBIDDEN_PATHS {
            if path_str.starts_with(forbidden) || path_str == *forbidden {
                self.errors.push(format!(
                    "Security: `{}` is not allowed in the sandbox",
                    forbidden
                ));
            }
        }
    }

    fn check_use_tree(&mut self, tree: &syn::UseTree, prefix: &str) {
        match tree {
            syn::UseTree::Path(path) => {
                let new_prefix = if prefix.is_empty() {
                    path.ident.to_string()
                } else {
                    format!("{}::{}", prefix, path.ident)
                };
                for forbidden in FORBIDDEN_PATHS {
                    if new_prefix == *forbidden {
                        self.errors
                            .push(format!("Security: `use {}` is not allowed", new_prefix));
                        return;
                    }
                }
                self.check_use_tree(&path.tree, &new_prefix);
            }
            syn::UseTree::Name(name) => {
                let full_path = if prefix.is_empty() {
                    name.ident.to_string()
                } else {
                    format!("{}::{}", prefix, name.ident)
                };
                for forbidden in FORBIDDEN_PATHS {
                    if full_path == *forbidden {
                        self.errors
                            .push(format!("Security: `use {}` is not allowed", full_path));
                    }
                }
            }
            syn::UseTree::Group(group) => {
                for item in &group.items {
                    self.check_use_tree(item, prefix);
                }
            }
            syn::UseTree::Glob(_) | syn::UseTree::Rename(_) => {}
        }
    }
}

impl<'ast> Visit<'ast> for SecurityVisitor {
    fn visit_expr_unsafe(&mut self, _node: &'ast syn::ExprUnsafe) {
        self.errors
            .push("Security: `unsafe` blocks are not allowed".to_string());
    }

    fn visit_item_extern_crate(&mut self, node: &'ast syn::ItemExternCrate) {
        self.errors.push(format!(
            "Security: `extern crate {}` is not allowed",
            node.ident
        ));
    }

    fn visit_item_use(&mut self, node: &'ast syn::ItemUse) {
        // Recursively check the use tree for forbidden paths
        self.check_use_tree(&node.tree, "");
        syn::visit::visit_item_use(self, node);
    }

    fn visit_path(&mut self, node: &'ast syn::Path) {
        self.check_path(node);
        syn::visit::visit_path(self, node);
    }
}

/// Validate code for security violations
fn validate_code(code: &str) -> Result<(), String> {
    let syntax = syn::parse_file(code).map_err(|e| format!("Parse error: {}", e))?;

    let mut visitor = SecurityVisitor::new();
    visitor.visit_file(&syntax);

    if visitor.errors.is_empty() {
        Ok(())
    } else {
        Err(visitor.errors.join("\n"))
    }
}

/// Execute Rust code with optional sandbox validation
pub fn execute_rust_code(
    app: Option<&tauri::AppHandle>,
    code: &str,
    use_sandbox: bool,
    is_test: bool,
    args: Vec<String>,
) -> String {
    // Check if code requires heavy dependencies — route to appropriate runner
    if code.contains("polars") {
        return execute_with_runner(app, code, is_test, "tauri_runner");
    }
    if code.contains("axum") || code.contains("sqlx") || code.contains("sea_orm") {
        return execute_with_runner(app, code, is_test, "web_dev_runner");
    }

    // Step 1: Validate code for security violations if requested
    if use_sandbox {
        if let Err(e) = validate_code(code) {
            return format!("🛡️ Sandbox Violation:\n{}", e);
        }
    }

    // Step 2: Create temp directory
    let temp_dir = match Builder::new().prefix("crab_cademy_").tempdir() {
        Ok(dir) => dir,
        Err(e) => return format!("Error creating temp dir: {}", e),
    };

    let main_rs = temp_dir.path().join("main.rs");
    let binary = temp_dir.path().join("main");

    // Step 3: Write code to file
    if let Err(e) = fs::write(&main_rs, code) {
        return format!("Error writing code: {}", e);
    }

    // Step 4: Compile with rustc
    let mut rustc_path = "rustc".to_string();

    // Check if rustc works
    if Command::new(&rustc_path).arg("--version").output().is_err() {
        #[cfg(not(windows))]
        let home = std::env::var("HOME").unwrap_or_default();

        #[cfg(windows)]
        let home = std::env::var("USERPROFILE").unwrap_or_default();

        if !home.is_empty() {
            let cargo_rustc = std::path::PathBuf::from(home)
                .join(".cargo")
                .join("bin")
                .join(if cfg!(windows) { "rustc.exe" } else { "rustc" });

            if cargo_rustc.exists() {
                rustc_path = cargo_rustc.to_string_lossy().into_owned();
            }
        }
    }

    let mut compile_cmd = Command::new(&rustc_path);
    compile_cmd.arg(&main_rs).arg("-o").arg(&binary);

    if is_test {
        compile_cmd.arg("--test");
    }

    let compile = compile_cmd.output();

    let compile = match compile {
        Ok(out) => out,
        Err(e) => return format!("Error running rustc: {} (tried {})", e, rustc_path),
    };

    if !compile.status.success() {
        let stderr = String::from_utf8_lossy(&compile.stderr);
        return format!("Compilation Error:\n{}", stderr);
    }

    // Step 5: Run the binary
    let run = Command::new(&binary).args(&args).output();

    match run {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            let stderr = String::from_utf8_lossy(&output.stderr);

            if output.status.success() {
                format!("{}{}", stdout, stderr)
            } else {
                format!("Runtime Error:\n{}{}", stdout, stderr)
            }
        }
        Err(e) => format!("Error running binary: {}", e),
    }
}

/// Locate a runner directory by name, checking relative paths, resources, and exe-relative paths
fn find_runner_path(
    app: Option<&tauri::AppHandle>,
    runner_name: &str,
) -> Result<std::path::PathBuf, String> {
    let possible_paths = [
        runner_name.to_string(),
        format!("../{}", runner_name),
        format!("../../{}", runner_name),
    ];

    let mut attempted_paths = Vec::new();

    for path in &possible_paths {
        let p = std::path::Path::new(path);
        attempted_paths.push(format!("(Relative) {}", path));
        if p.exists() {
            return Ok(std::path::PathBuf::from(path));
        }
    }

    // Fallback: Try to find it in Tauri resources (for bundled apps)
    if let Some(app) = app {
        if let Ok(res_path) = app.path().resource_dir() {
            let bundled_path = res_path.join(runner_name);
            attempted_paths.push(format!("(Resource) {}", bundled_path.display()));
            if bundled_path.exists() {
                return Ok(bundled_path);
            }
        }
    }

    // Fallback: Try to find it relative to the current executable
    if let Ok(mut exe_path) = std::env::current_exe() {
        exe_path.pop(); // binary dir
        exe_path.pop(); // debug/release
        exe_path.pop(); // target
        exe_path.push(runner_name);
        attempted_paths.push(format!("(Exe Relative) {}", exe_path.display()));
        if exe_path.exists() {
            return Ok(exe_path);
        }
    }

    let mut msg = format!(
        "Error: Could not locate '{}' directory.\nChecked paths:",
        runner_name
    );
    for path in attempted_paths {
        msg.push_str(&format!("\n - {}", path));
    }
    if let Ok(cwd) = std::env::current_dir() {
        msg.push_str(&format!("\nCurrent working directory: {}", cwd.display()));
    }
    Err(msg)
}

/// Execute code using a persistent Cargo runner project
fn execute_with_runner(
    app: Option<&tauri::AppHandle>,
    code: &str,
    is_test: bool,
    runner_name: &str,
) -> String {
    let runner_path = match find_runner_path(app, runner_name) {
        Ok(p) => p,
        Err(msg) => return msg,
    };

    // 1. Write the code to src/main.rs
    let main_rs = runner_path.join("src/main.rs");
    if let Err(e) = fs::write(&main_rs, code) {
        return format!("Error writing code to runner: {}", e);
    }

    // 2. Run 'cargo run --quiet' or 'cargo test --quiet'
    let mut command = Command::new("cargo");

    if is_test {
        command.arg("test");
    } else {
        command.arg("run");
    }

    let output = command
        .arg("--quiet")
        .arg("--manifest-path")
        .arg(runner_path.join("Cargo.toml"))
        .output();

    match output {
        Ok(out) => {
            let stdout = String::from_utf8_lossy(&out.stdout);
            let stderr = String::from_utf8_lossy(&out.stderr);
            if out.status.success() {
                format!("{}{}", stdout, stderr) // stderr might contain warnings
            } else {
                // If it failed, it might be a compilation error which cargo prints to stderr
                format!("Execution Error:\n{}{}", stdout, stderr)
            }
        }
        Err(e) => format!("Error executing cargo: {}", e),
    }
}

/// Execute multiple source files using a Cargo runner project.
/// `files` maps relative paths (e.g. "src/main.rs", "src/handlers.rs") to source code.
pub fn execute_multi_file(
    app: Option<&tauri::AppHandle>,
    files: HashMap<String, String>,
    use_sandbox: bool,
    is_test: bool,
    args: Vec<String>,
) -> String {
    // Determine which runner to use based on file contents
    let all_code: String = files.values().cloned().collect::<Vec<_>>().join("\n");
    let runner_name = if all_code.contains("polars") {
        "tauri_runner"
    } else if all_code.contains("axum") || all_code.contains("sqlx") || all_code.contains("sea_orm")
    {
        "web_dev_runner"
    } else {
        "web_dev_runner" // Default for multi-file lessons
    };

    let runner_path = match find_runner_path(app, runner_name) {
        Ok(p) => p,
        Err(msg) => return msg,
    };

    // Validate all files if sandbox is enabled
    if use_sandbox {
        for (path, code) in &files {
            if let Err(e) = validate_code(code) {
                return format!("🛡️ Sandbox Violation in {}:\n{}", path, e);
            }
        }
    }

    // Track which extra files we write so we can clean them up
    let mut extra_files: Vec<std::path::PathBuf> = Vec::new();

    // Write all source files
    for (rel_path, code) in &files {
        let file_path = runner_path.join(rel_path);

        // Ensure parent directories exist
        if let Some(parent) = file_path.parent() {
            if let Err(e) = fs::create_dir_all(parent) {
                return format!("Error creating directory for {}: {}", rel_path, e);
            }
        }

        if let Err(e) = fs::write(&file_path, code) {
            return format!("Error writing {}: {}", rel_path, e);
        }

        // Track non-main files for cleanup
        if rel_path != "src/main.rs" {
            extra_files.push(file_path);
        }
    }

    // Run cargo
    let mut command = Command::new("cargo");
    if is_test {
        command.arg("test");
    } else {
        command.arg("run");
    }

    let output = command
        .arg("--quiet")
        .arg("--manifest-path")
        .arg(runner_path.join("Cargo.toml"))
        .args(&args)
        .output();

    // Clean up extra source files to avoid stale state
    for file_path in &extra_files {
        let _ = fs::remove_file(file_path);
    }

    match output {
        Ok(out) => {
            let stdout = String::from_utf8_lossy(&out.stdout);
            let stderr = String::from_utf8_lossy(&out.stderr);
            if out.status.success() {
                format!("{}{}", stdout, stderr)
            } else {
                format!("Execution Error:\n{}{}", stdout, stderr)
            }
        }
        Err(e) => format!("Error executing cargo: {}", e),
    }
}
