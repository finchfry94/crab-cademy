import { Lesson } from "../../types";

export const ch14Lessons: Lesson[] = [
    {
        id: "ch14-01",
        chapter: "14.1",
        title: "Customizing Builds with Release Profiles",
        sort_order: 140,
        environment: "desktop",
        content: `# Customizing Builds with Release Profiles

Cargo has two main profiles: the _BT_dev_BT_ profile it uses when you run _BT_cargo build_BT_ and the _BT_release_BT_ profile it uses when you run _BT_cargo build --release_BT_. 

## Optimization Levels
You can customize these in your _BT_Cargo.toml_BT_:

_BT__BT__BT_toml
[profile.dev]
opt-level = 0

[profile.release]
opt-level = 3
_BT__BT__BT_

The _BT_opt-level_BT_ setting controls the number of optimizations Rust will apply to your code, ranging from 0 to 3.

> [!NOTE]
> **A Note on Testing**: Because this lesson involves modifying your _BT_Cargo.toml_BT_, we can't run a standard Rust unit test (which only tests _.rs_ files) to verify these changes. In a real project, you would verify this by checking the performance or size of your compiled binary.`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "Which file is used to customize release profiles?",
                options: ["main.rs", "lib.rs", "Cargo.toml", "Cargo.lock"],
                correctIndex: 2,
            },
            {
                question: "What is the maximum value for opt-level?",
                options: ["1", "3", "5", "10"],
                correctIndex: 1,
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

As your project grows, you might develop a library crate that continues to get bigger. Cargo has a feature called **workspaces** that can help you manage multiple related packages that are developed in tandem.

## Creating a Workspace
A workspace is a set of packages that share the same _BT_Cargo.lock_BT_ and output directory.

_BT__BT__BT_toml
[workspace]
members = [
    "adder",
    "add_one",
]
_BT__BT__BT_`.replace(/_BT_/g, '`'),
        quiz: [
            {
                question: "What is shared across all packages in a workspace?",
                options: ["The src folder", "The Cargo.lock file", "All dependencies", "The main.rs file"],
                correctIndex: 1,
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
