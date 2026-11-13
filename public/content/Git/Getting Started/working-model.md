# Working Model

Git is easiest to understand as a flow between four places:

```text
working directory → staging area → local repository → remote repository
        edit              add              commit              push
```

## Working Directory

The working directory is the project on your disk. Editing a file changes the working directory, but it does not create a Git checkpoint.

## Staging Area

The staging area is the proposed next commit. Use it to select and review changes:

```shell
git add <file>
git diff --staged
git restore --staged <file>
```

## Local Repository

`git commit` saves the staged snapshot in the local repository. Commits are local until you push them, so you can inspect and improve your work before sharing it.

## Remote Repository

A remote such as GitHub is a shared copy of the repository. `git push` sends local commits to it, while `git fetch` downloads information without changing your working files.

## A Safe Daily Loop

```shell
git pull --rebase
git status
git add <files>
git diff --staged
git commit -m "describe the change"
git push
```

Use `git status` often. It tells you which files are modified, staged, untracked, or ahead of the remote.
