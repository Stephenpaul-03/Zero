# Concept Checks

Add a concept check with a `:::quiz` block. A lesson can include more than one block; Lattice presents them as a guided sequence.

## Example

```text
:::quiz
question: What kind of file does a lesson use?
options:
  - Markdown (correct)
  - A database migration
  - A compiled binary
explanation: Lessons are authored as markdown files.
:::
```

Each question has selectable options, feedback, and an optional explanation.
