# Find Occurences

This actions checks your changes for occurences of a specific search term.

This i especially useful in production to check for occurences of console.log, before the code is merged into the prod branch.

## Inputs

## `before`

**Required** (unless **check-all** is `true`) Sha/ref before the change

**Default** `''`

## `after`

**Required** (unless **check-all** is `true`) Sha/ref of the change

**Default** `''`

## `search-term`

What to search for

**Default** `'console.log|console.error'`

## `file-types`

File types to check for the `search-term`

**Default** `'(.ts|.js|.tsx|.jsx)$'`

## `should-fail`

Should the action fail if occurences of the `search-term` is found

**Default** `'true'`

## `check-all`

Should the action check all files in the repo or only the changed ones

**Default** `'false'`

## `check-all-exclude`

Files to exclude from the `check-all` check

**Default** `':!:node_modules/*'`

## Outputs

## `occurences-count`

Number of occurences found

## `occurences`

String of occurences found

## `checked-files`

String of checked files

## Example Usage

It is important to either split the files up between push/pull_request or make som if checks to make sure the required data is in the github context object

### Seperate Pull Request Action

```yml
# Check pull_request for occurences of console.log or console.error in (.ts, .js, .tsx, .jsx) files
name: Check pull_request for occurences of console.log or console.error

on: 
  pull_request:
    branches:
      - '**'

jobs:
  find_occurences:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Find occurences 
        uses: omikkel/find-occurences@v1
        with:
          before: origin/${{ github.base_ref }}
          after: origin/${{ github.head_ref }}
          search-term: console.log|console.error
```

### Seperate Push Action

```yml
# Check push for occurences of console.log or console.error in (.ts, .js, .tsx, .jsx) files
name: Check push for occurences of console.log or console.error

on: 
  push:
    branches:
      - '**'

jobs:
  find_occurences:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Find occurences 
        uses: omikkel/find-occurences@v1
        with:
          before: ${{ github.event.before }}
          after: ${{ github.sha }}
          search-term: console.log|console.error
```

### Mixed action to handle both Push and Pull_requests

```yml
# Check push and pull_request for occurences of console.log or console.error in (.ts, .js, .tsx, .jsx) files
name: Check push and pull_request for occurences of console.log or console.error

on: 
  push:
    branches:
      - '**'
  pull_request:
    branches:
      - '**'

jobs:
  find_occurences_push:
    runs-on: ubuntu-latest

    if: ${{ github.event_name == "push" }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Find occurences 
        uses: omikkel/find-occurences@v1
        with:
          before: ${{ github.event.before }}
          after: ${{ github.sha }}
          search-term: console.log|console.error
  find_occurences:
    runs-on: ubuntu-latest

    if: ${{ github.event_name == "pull_request" }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Find occurences 
        uses: omikkel/find-occurences@v1
        with:
          before: origin/${{ github.base_ref }}
          after: origin/${{ github.head_ref }}
          search-term: console.log|console.error
```
