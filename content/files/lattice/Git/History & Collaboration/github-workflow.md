# GitHub Workflow

Git provides version control locally; GitHub provides a place to share repositories, review changes, and collaborate through pull requests.

## Typical Feature Workflow

```shell
git clone <repository-url>
cd <repository>
git switch -c feature/short-description
# edit and test the project
git add <files>
git commit -m "add the feature"
git push -u origin feature/short-description
```

Open a pull request from the feature branch into the project’s default branch. Explain what changed, why it changed, and how it was tested. Keep the pull request focused and easy to review.

## Keeping a Branch Current

```shell
git fetch origin
git rebase origin/main
```

Resolve conflicts carefully, run the tests again, and then push. A rebased branch may need:

```shell
git push --force-with-lease
```

Use this only on your own feature branch. Never force-push a shared branch without team agreement.

## Review Checklist

- The branch has a focused purpose.
- Commits have clear messages.
- Tests and relevant checks pass.
- Secrets and generated files are not included.
- The pull request explains the behavior change and any trade-offs.
