# Developer guide

This document is intended to provide information about the project structure, best practices and other useful information for contributors.

## Prerequisites

- Node v22.7
- NPM v10.8

# Getting started

Clone the repository to your local machine by running the following command in your terminal:

```
git clone https://github.com/RandomNoobster/IT2810-Book-Vault.git
```

Navigate to the project directory:

```
cd T05-Project-2
```

Be sure to be in the root repository when opening in VSCode, in order to get format on save with Prettier.

# Monorepo

Since our repo is a monorepo, we have multiple packages. We have a `frontend` and `backend` package. The `frontend` package contains the React application, while the `backend` package contains the Express server.

## Frontend

To start the frontend, navigate to the `frontend` directory and run `npm install`:

```
cd frontend
npm install
```

Run the application locally by using:

```
npm run dev
```

Run tests with

```
npm run test
```

## Backend

See [the README in the backend](./backend/README.md) for more information on how to run the backend.

## Workflow

Our development process follows the trunk-based development workflow to maintain a structured and stable codebase. We utilize two main types of branches:

- `main`-branch: This is a protected branch (you cannot commit directly to it), which should always be in working condition. You can consider this to be the "production"-branch.
- Feature branches: This is the name of the branches that you are actively working on. When you are branching out of `main`, you are creating a feature branch.
  The name of a feature branch should follow this format `issue-number-short-description-of-task`. Example: `43-implement-searching-functionality`.

## Issues

You will find all issues on the issue board on GitHub (under Projects). We use issues to monitor our progress and we have split the issue board into five parts: `Product Backlog`, `Current Sprint` (Sprint backlog), `In Progress`, `Under review` and `Closed`.

When you are creating a new issue remember to do the following:

- Create a title which briefly explains the issue (example: `Implement filter functionality`)
- [Optional] Provide more information on the issue in the description
- Assign labels
- Assign correct project
- Assign milestone

When moving an issue from the `Product Backlog` to `In Progress` remember to:

- Assign it to someone (like yourself)
- [Optional] Update the description with how you plan to solve the issue

## Commit messages

We are following the Conventional Commits guidelines. Here is a link to a cheatsheet: [Conventional Commits](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13).

Shortly summarized, we are using these commit types:

- API relevant changes
  - `feat` Commits, that adds or remove a new feature
  - `fix` Commits, that fixes a bug
- `refactor` Commits, that rewrite/restructure your code, however does not change any API behaviour
  - `perf` Commits are special `refactor` commits, that improve performance
- `style` Commits, that do not affect the meaning (white-space, formatting, missing semi-colons, etc)
- `test` Commits, that add missing tests or correcting existing tests
- `docs` Commits, that affect documentation only
- `build` Commits, that affect build components like build tool, ci pipeline, dependencies, project version, ...
- `ops` Commits, that affect operational components like infrastructure, deployment, backup, recovery, ...
- `chore` Miscellaneous commits e.g. modifying `.gitignore`

## How to use Git

This developer guide will show how to use git with the terminal. You can do all these commands directly in VSCode by entering `Ctrl+Shift+P` or `Cmd+Shift+P` and typing what you want to do, like `Create branch`.

Git is a version control system that enables collaborative development and effective code managment.
In Git there are three main areas or directories that represent different stages of your project.

- Working directory: The working directory is where you actively make changes to your files.
- Staging Area: In this area you have marked a modified file to be included in the next commit.
- Local Repository: This area is the copy of the repository that is on your own computer.
- Remote Repository: This area is hosted on platforms like GitLab. It serves as the central location where all commited changes are stored and where team members can collaborate.

Here is a brief list of essential Git commands (Remember all these commands are integrated in VSCode and you can use that instead of the terminal):

- `git add <file-name>`. Stages a file for commit. This means a file goes from the working directory to the staging area.
- `git add -all`: Same as above, just adds all the modified files to the staging area (useful when you want to commit all modified files)
- `git commit -m "Your commit message"`: This commits all staged files into the local repository. On the next line of the commit message, type `Co-authored-by: name <name@example.com>` with specific information for each co-author. After the co-author information, add a closing quotation mark.
- `git push`: Pushes your local repository to the remote repository so everyone can see it. \
  When you push from a new branch, you may need to set a upstream branch, just follow what the terminal says.

## Branching

When you plan to start on a new issue, you need to create a new branch (never make changes directly to `main`). The branch name should be the issue number followed by a short description of the issue. For example, if you are working on issue #1, you should create a branch named `1-implementing-new-feature`. This will ensure that the branch is automatically linked to that issue, and add some QOL improvements when creating merge requests.

### Creating a new branch

This is a step by step guide on how to create a new branch.

1. First you need to be on the `main`-branch (or the branch you want to branch out from). You can see which branch you are on by running `git branch` and you will be on the branch with the star next to it (or check the bottom left corner in VSCode). If you are on the wrong branch, use `git checkout <name-of-branch>` to change branch.

```
(See which branch you are currently on)
> git branch

(Change branch, fill in <name-of-branch> without the "<>")
> git checkout <name-of-branch>
```

2. Now you can branch out into your own feature branch. Do this by running this command in your terminal. This will create a new branch with the name you specified, and automatically switch to that branch. You can now make changes to the code, and commit them to the branch.

```
git checkout -b "issue-number-new-branch-name"
```

### Updating a branch with content in `main`

Before you create a merge request, you should make sure that your branch is up to date with the `main` branch. This is to ensure that there are no merge conflicts when you create the merge request. \
The code block below assumes you start on your own branch and want to update it with `main`.

```
(Assuming you are on your own branch)
> git checkout main
(Now you are on the main branch)

> git pull
> git checkout <your-branch-name>
(Now you are on your own branch again)

> git merge main

(There may be merge conflicts here, if so, resolve them (resolving them in VSCode is recommended))

(Now you can push your changes to remote without any merge conflicts)
> git push
```

## Pull request

When you are done with your changes, and want to merge your branch into `main`, you will need to create a pull request. If this PR closes an issue add this in the description: `Closes #issue-number`, this will automatically close the issue when the merge request is merged.

Before you are allowed to merge, you will need approval of one other team member. Assign at least one other team member, or notify them in another way that your pull request is ready for review.

When the review is done, you are ready to merge into `main`. Click the "Merge" button, and then the "Confirm merge" button (pick the default option (not squash merge)). Congratulations, you have now merged into `main` and contributed to the project 🚀.

## Milestones

We will use milestones to track our progress. Utilizing milestones allows us to set specific goals, plans and allocate tasks, and monitor the overall advancement of our project.

Active engagement with milestones is encouraged, including regular progress updates, task completion, and addressing any obstacles encountered. By leveraging milestones, we enhance coordination, facilitate communication, and ensure project success.

## How to create new hooks in the frontend

First create your GraphQL query in `frontend/src/graphql/queries`. It is adviced to experiment in Apollo Sandbox to create the correct query. After that gql expression has been created, run `npm run generate`, to update type files. Then create a new hook in `frontend/src/hooks` that uses the query. The hook should return the data, loading and error state. Use the already created hooks as examples.

## Conventions

We will follow [Google's TypeScript styling guide](https://google.github.io/styleguide/tsguide.html#naming).

### Linters

In this project, we utilize ESLint as our linter to ensure code quality and consistency. A linter, like ESLint and Checkstyle, performs static code analysis to find syntax errors, coding style violations and other common mistakes. Linters help developers maintain code quality, enforce consistent coding practices, and catch errors early in the development process.

### Formatters

We are using Prettier. This formatter makes it so all code follows the same styling. An example of formatting is that all code uses 2-spaces indentation and each line is no longer than 150 characters.

### Naming conventions

The naming format should follow the list below:

- `PascalCase`: Components, classes, interfaces, types, enums and components
- `camelCase`: Variables, parameters, functions, methods and properties
- `CONSTANT_CASE`: Global constant values

### Commenting

There are two types of comments, JSDoc (`/** ... */`) and ordinary comments (`// ... ` or `/* ... */`).

- Use `/** JSDoc */` comments for documentation, i.e. comments a user of the code should read.
- Use `// line comments` for implementation comments, i.e. comments that only concern the implementation of the code itself.

In addition, JSDoc comments are understood by tools (such as editors and documentation generators), while ordinary comments are only for other humans.

### React best practices

- **Keep Components Small and Focused**: Aim for single responsibility principle. Each component should ideally do one thing only.
- **Decompose Components**: Break down your UI into smaller, reusable components to improve maintainability and reusability.

### Other best practices

- Do not use `var` declarations
- If you don't have a reason to otherwise, always declare a variable/function as a constant
- Try not to use `div` tags, but instead use more fitting semantics tags
- Use .modules.css instead of .css when styling components. This avoids conflicting stylenames between components.
- You should never use "[magic numbers](https://stackoverflow.com/questions/47882/what-is-a-magic-number-and-why-is-it-bad)", instead create a constant variable and reference it instead, this makes the code clearer and easier to read.
- If you find yourself nesting a lot of if-statements, you should consider using the [guard clause](https://codingbeautydev.com/blog/stop-using-nested-ifs/?expand_article=1) pattern (invert the if-statement and return early).
