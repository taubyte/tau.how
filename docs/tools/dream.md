# Dream CLI

<!-- Source: docs-old/02-platform-getting-started/04-dream.md and 01-dev-getting-started/01-local-cloud.md -->

Dream is a package that was originally created to test tau itself. It got refactored so it can be used for writing E2E tests for projects running on tau. We also, built a CLI tool that allows local development.

Dream can be installed on Linux, Mac or Windows.

## Installation

=== "Using NPM"

    ```bash
    npm i -g @taubyte/dream
    ```

=== "Using Install Script"

    ```bash
    curl https://get.tau.link/dream | sh
    ```

## Starting a Local Cloud

Starting a local cloud environment is as easy as running:

```bash
dream new multiverse
```

## Check Status

You can verify everything is running with:

```bash
dream status universe
```

If you'd like to play around with dream, [Start a local Cloud](../getting-started/local-cloud.md) is a good place to start.

For more information about using dream as a library for E2E testing, see the [dream repository](https://github.com/taubyte/tau/tree/main/dream).
