---
description: Safely sync your git repository (add, commit, pull --rebase, push), including automatic commit message generation and smart sync detection.
---

# Git Safe Sync Skill

This skill handles the safe synchronization of the local repository with the remote. It features:

1.  **Automatic Commit Message Generation**: intelligently writes commit messages based on changes if none is provided.
2.  **Smart Sync**: Checks if a pull is actually needed before attempting it, avoiding unnecessary operations and potential errors.

## Workflow

1.  **Check Status**:
    - Run `git status` to see if there are any changes.
    - If the working tree is clean and `git status` says "nothing to commit", proceed to Step 4 (Sync Check) to ensure we are up to date with remote, or exit if the goal was only to commit.

2.  **Stage Changes**:
    - Run `git add .` to stage all modified and untracked files.

3.  **Generate Commit Message & Commit**:
    - **Context Check**: Did the user explicitly provide a commit message in their request?
    - **IF YES**:
      - Use that message. Run `git commit -m "USER_MESSAGE"`.
    - **IF NO**:
      - Analyze the staged changes. Run `git diff --cached --stat` or `git diff --cached` if needed.
      - **GENERATE** a concise, conventional commit message based on the changes.
        - **Format**: `type(scope): description`
        - **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.
        - **Example**: `fix(cart): resolve issue with sticky cart cutoff`
        - Keep the subject line under 50 characters.
      - Run `git commit -m "GENERATED_MESSAGE"`.

4.  **Smart Sync Check**:
    - Run `git fetch` to get the latest remote status.
    - Run `git status -uno` to check the relationship with the remote branch.
    - **Analyze Output**:
      - **"Your branch is behind..."**: A pull is needed. Run `git pull --rebase`.
      - **"Your branch and 'origin/main' have diverged..."**: A pull is needed. Run `git pull --rebase`.
        - _Note_: If conflicts occur during rebase, **STOP** and inform the user.
      - **"Your branch is ahead..."**: No pull needed. Proceed to Push.
      - **"Your branch is up to date..."**: No pull needed.
        - If you just made a commit, you are now "ahead", so Proceed to Push.
        - If you didn't make a commit and are "up to date", the sync is complete. Exit.

5.  **Push**:
    - Run `git push` to upload changes.

6.  **Completion**:
    - Report the successful sync, the commit message used (if auto-generated), and whether a pull was performed.
