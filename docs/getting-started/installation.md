# Installation

<!-- Source: docs-old/02-platform-getting-started/04-dream.md -->

To get started with Taubyte development, you'll need to install the Dream CLI tool. Dream allows you to spin up your own Taubyte cloud right on your local machine - think of it as your personal playground for building and testing cloud apps.

## Prerequisites

All you need is `npm` installed on your machine. We use `npm` since it works great across all platforms - Windows, Mac, or Linux.

## Install Dream CLI

Install the Taubyte Dream CLI globally:

```sh
npm i -g @taubyte/dream
```

The `-g` flag installs it globally so you can use the `dream` command from anywhere on your system.

## Verify Installation

You can verify the installation by checking the version:

```sh
dream --version
```

## What is Dream?

Dream ([github.com/taubyte/dream](https://github.com/taubyte/dream)) is a tool that lets you:

- Spin up a complete Taubyte cloud locally
- Test functions, websites, and databases
- Experiment with the platform before production deployment
- Debug and develop in an isolated environment

## Next Steps

Now that Dream is installed, continue to [Local Cloud](local-cloud.md) to start your development environment.
