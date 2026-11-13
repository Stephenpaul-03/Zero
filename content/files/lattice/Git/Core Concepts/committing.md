# Committing

A commit is a named checkpoint containing the changes you deliberately saved to the repository. Good commits make the project history easier to understand, review, and recover.

## Basic Workflow

```shell
git status
git add <file>
git diff --staged
git commit -m "add login form validation"
```

Git commits only what is in the staging area. This lets you review and select the exact changes that belong together instead of committing every modified file automatically.

## Writing a Good Commit

- Describe what the commit changes, not what you happened to do.
- Use the imperative mood: `add`, `fix`, `remove`, or `update`.
- Keep one logical change per commit where practical.
- Avoid committing secrets, generated files, or unrelated formatting changes.

```shell
git commit -m "fix empty password validation"
```

## Inspecting a Commit

```shell
git show <commit>
git log --oneline --decorate --graph
git diff HEAD~1 HEAD
```

## Amend the Latest Commit

Use amend only when the commit has not been shared with others:

```shell
git add <forgotten-file>
git commit --amend --no-edit
```

To change the message, omit `--no-edit`. Once a commit has been pushed, prefer a new corrective commit instead of rewriting shared history.
