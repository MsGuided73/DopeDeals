---
description: Safely sync your git repository (add, commit, pull --rebase, push), including automatic commit message generation if needed.
---

# Git Safe Sync Skill

This skill handles the safe synchronization of the local repository with the remote, including handling uncommitted changes and ensuring a clean history via rebase. It is designed to be intelligent: if the user does not provide a commit message, the agent will analyze the changes and generate a suitable conventional commit message automatically.

## Workflow

1.  **Check Status**:
    - Run `git status` to see if there are any changes.
    - If the working tree is clean and `git status` says "nothing to commit", skip to Step 4 (Sync Remote).

2.  **Stage Changes**:
    - Run `git add .` to stage all modified and untracked files.

3.  **Generate Commit Message & Commit**:
    - **Context Check**: Did the user explicitly provide a commit message in their request (e.g., "sync with message 'fix bug'")?
    - **IF YES**:
      - Use that message.
      - Run `git commit -m "USER_MESSAGE"`.
    - **IF NO**:
      - Analyze the staged changes to understand what happened. Run `git diff --cached --stat` or `git diff --cached` if needed.
      - **GENERATE** a concise, conventional commit message based on the changes.
        - **Format**: `type(scope): description`
        - **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.
        - **Example**: `fix(cart): resolve issue with sticky cart cutoff`
        - Keep the subject line under 50 characters if possible.
      - Run `git commit -m "GENERATED_MESSAGE"`.

4.  **Sync Remote (Pull & Push)**:
    - Run `git pull --rebase` to fetch remote changes and reapply local commits on top.
      - **Conflict Handling**: If conflicts occur during rebase, **STOP** and inform the user. Do not attempt to automatically resolve complex merge conflicts without guidance.
    - If rebase is successful, run `git push` to upload changes.

5.  **Completion**:
    - Report the successful sync and the commit message used to the user.
