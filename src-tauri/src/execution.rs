use std::fs;
use std::process::Command;
use syn::visit::Visit;
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
pub fn execute_rust_code(code: &str, use_sandbox: bool) -> String {
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
    let compile = Command::new("rustc")
        .arg(&main_rs)
        .arg("-o")
        .arg(&binary)
        .output();

    let compile = match compile {
        Ok(out) => out,
        Err(e) => return format!("Error running rustc: {}", e),
    };

    if !compile.status.success() {
        let stderr = String::from_utf8_lossy(&compile.stderr);
        return format!("Compilation Error:\n{}", stderr);
    }

    // Step 5: Run the binary
    let run = Command::new(&binary).output();

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
