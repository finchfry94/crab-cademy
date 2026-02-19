import { Lesson } from "../../types";

export const ch14Lessons: Lesson[] = [
    {
        id: "ch14-01",
        chapter: "14.1",
        title: "Customizing Builds with Release Profiles",
        sort_order: 140,
        environment: "desktop",
        content: `# Customizing Builds with Release Profiles

When you run \`cargo build\`, you might notice it says \`Finished dev [unoptimized + debuginfo]\`.
When you run \`cargo build --release\`, it says \`Finished release [optimized]\`.

What's the difference?

## The Trade-off: Compile Time vs Runtime Speed

*   **Dev Profile (\`cargo build\`)**: 
    *   **Goal**: Compile fast so you can iterate quickly.
    *   **Optimizations**: Turned off (Level 0).
    *   **Debug Info**: Included (so debuggers work).
*   **Release Profile (\`cargo build --release\`)**:
    *   **Goal**: Run fast in production.
    *   **Optimizations**: Maximum (Level 3).
    *   **Compiling**: Much slower (Rust spends time rearranging your code to make it faster).

## Customizing \`Cargo.toml\`

You can tweak these settings. For example, if you want your dev builds to be slightly faster at runtime (at the cost of compile time):

\`\`\`toml
[profile.dev]
opt-level = 1
\`\`\`

## ⚠️ Common Mistakes

1.  **Benchmarking Debug Builds**: "Rust is slow!" says the user who ran \`cargo run\` instead of \`cargo run --release\`. Debug builds can be 10-100x slower. ALWAYS test performance with \`--release\`.
2.  **Deploying Debug Builds**: Debug binaries are huge (because of debug symbols) and slow. Never put a debug binary on a production server.`,
        quiz: [
            {
                question: "Which file is used to customize release profiles?",
                options: ["main.rs", "lib.rs", "Cargo.toml", "Cargo.lock"],
                correctIndex: 2,
            },
            {
                question: "Why is the release build slower to compile?",
                options: [
                    "It constructs more files",
                    "It downloads more dependencies",
                    "It performs advanced optimizations to make the code run faster",
                    "It runs on a single thread"
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission
 
1. Open your _BT_Cargo.toml_BT_.
2. Add a _BT_[profile.dev]_BT_ section and set _BT_opt-level = 1_BT_.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    #[test]
    fn test_knowledge() {
        assert!(true);
    }
}`,
        starter_code: `# Add this to your Cargo.toml
[profile.dev]
opt-level = 1
`,
    },
    {
        id: "ch14-03",
        chapter: "14.3",
        title: "Cargo Workspaces",
        sort_order: 141,
        environment: "desktop",
        content: `# Cargo Workspaces

As your project grows, it becomes a "Monolith"—one giant pile of code. It takes forever to compile, and it's hard to navigate.

**Workspaces** allow you to split one project into multiple **Crates** (packages) that live side-by-side.

## Structure

A workspace is a set of packages that share the same \`Cargo.lock\` and output directory.

\`\`\`text
my-project/
├── Cargo.toml      (The Workspace root)
├── adder/          (A crate)
│   ├── Cargo.toml
│   └── src/main.rs
└── add-one/        (Another crate)
    ├── Cargo.toml
    └── src/lib.rs
\`\`\`

## The Root \`Cargo.toml\`

The top-level file doesn't have \`[package]\`. Instead, it has \`[workspace]\`:

\`\`\`toml
[workspace]
members = [
    "adder",
    "add-one",
]
\`\`\`

## ⚠️ Common Mistakes

1.  **Circular Dependencies**: Crate A depends on Crate B, and Crate B depends on Crate A. Cargo cannot build this. You must extract shared logic into a third Crate C.
2.  **Forgetting to add to \`members\`**: If you create a folder for a new crate but don't list it in the root \`Cargo.toml\`, Cargo won't include it in the workspace.`,
        quiz: [
            {
                question: "What is shared across all packages in a workspace?",
                options: ["The src folder", "The Cargo.lock file", "All dependencies", "The main.rs file"],
                correctIndex: 1,
            },
            {
                question: "What section replaces [package] in the root Cargo.toml?",
                options: ["[workspace]", "[modules]", "[library]", "[crate]"],
                correctIndex: 0,
            },
        ],
        objectives: `## Your Mission

1. Create a workspace with two members: _BT_app_BT_ and _BT_utils_BT_.`.replace(/_BT_/g, '`'),
        test_code: `#[cfg(test)]
mod tests {
    #[test]
    fn test_conceptual() {
        assert!(true);
    }
}`,
        starter_code: `[workspace]
members = [
    "app",
    "utils",
]
`,
    },
];
