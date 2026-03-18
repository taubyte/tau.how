# Tau CLI

This page is a practical, end-to-end guide to using `tau` without interactive prompts and with production-safe defaults.

If you want deep resource-specific behavior, use the Development pages as the canonical reference. This page focuses on command flow, command families, and high-signal usage patterns.

## Install and verify

```bash
npm i -g @taubyte/cli
tau --version
tau --help
```

## Core mental model

- A **project** has two repositories managed by Tau:
  - config repository (`tb_config_<project>`)
  - code repository (`tb_code_<project>`)
- You usually work in this order:
  1. authenticate
  2. select cloud/universe + project
  3. create or edit resources
  4. push config
  5. push code
  6. check build/logs

## Authentication and profile management

### Create a profile

```bash
tau login --new my_profile --set-default
```

### Login with token non-interactively

```bash
tau login --new my_profile --provider github --token "<TOKEN>" --set-default
```

### Switch profile

```bash
tau login my_profile
tau whoami
```

## Context and selection

### See current context

```bash
tau current
```

### Select cloud (remote)

```bash
tau select cloud --fqdn cloud.taubyte.com
```

### Select project

```bash
tau select project my_project
tau current
```

## Project lifecycle

### Create project (non-interactive)

```bash
tau new project my_project \
  --description "Main product project" \
  --private \
  --no-embed-token \
  --yes
```

### Clone project repositories

```bash
tau clone project my_project --branch main --no-embed-token --yes
```

### Pull and push

```bash
tau pull project
tau push project --config-only --message "update config"
tau push project --code-only --message "update code"
```

## Resource command families

Most resources follow this shape:

```bash
tau new <resource> <name> [flags]
tau edit <resource> <name> [flags]
tau delete <resource> <name>
tau list <resource_plural>
```

Use `tau --help` and `tau <command> --help` to view full flags in your installed version.

## Create resources quickly (high-value templates)

### Application

```bash
tau new application app_main --description "Main app" --yes
```

### HTTP function

Important:
- use one function per method+path
- do not combine methods in one function

```bash
tau new function get_notes \
  --description "List notes" \
  --type http \
  --method GET \
  --paths /notes \
  --source app_main/functions/get_notes \
  --template empty \
  --language Go \
  --timeout 30s \
  --yes
```

### Website

```bash
tau new website docs_site \
  --description "Documentation website" \
  --template empty \
  --domains docs.example.com \
  --paths / \
  --provider github \
  --generate-repository \
  --no-private \
  --branch main \
  --no-embed-token \
  --yes
```

### Database

```bash
tau new database notes_db \
  --description "Notes data" \
  --match notes \
  --min 1 \
  --max 1 \
  --size 1GB \
  --yes
```

### Storage

```bash
tau new storage uploads_store \
  --description "User uploads" \
  --match uploads \
  --bucket Object \
  --size 10GB \
  --versioning \
  --yes
```

### Messaging

```bash
tau new messaging events_channel \
  --description "App event bus" \
  --match events \
  --mqtt \
  --web-socket \
  --yes
```

### Domain

```bash
tau new domain app_domain \
  --description "Public app domain" \
  --fqdn app.example.com \
  --cert-type le \
  --yes
```

### Library

```bash
tau new library shared_sdk \
  --description "Shared app code" \
  --template empty \
  --provider github \
  --generate-repository \
  --private \
  --branch main \
  --no-embed-token \
  --yes
```

## Production-safe workflow

Use this exact sequence after resource changes:

1. Push config first:

```bash
tau push project --config-only --message "resource config updates"
```

2. Then push code:

```bash
tau push project --code-only --message "function and website code updates"
```

3. Verify builds:

```bash
tau query builds --since 24h
tau query logs --jid "<JOB_ID>"
```

## Dream/local workflow

`dream` is the local cloud runtime. Use it with `tau` to test full workflows before remote deployment.

### 1) Install and start

```bash
npm i -g @taubyte/dream
dream status
dream start
```

### 2) Create/select universe

```bash
dream status universe default
dream new universe default
dream select universe default
```

### 3) Point Tau to local context

```bash
tau select cloud --universe default
tau current
```

### 4) Work normally

Use the same `tau new`, `tau edit`, `tau push`, `tau query` flow you use remotely.

## Non-interactive patterns you should always use

- Prefer explicit boolean flags:
  - `--no-embed-token` instead of interactive prompts
  - `--private` or `--no-private` explicitly for repo visibility
- Always pass `--yes` when scripting resource creation.
- Always pass `--branch main` on clone operations.
- Avoid prompt-only flows in CI.

## Windows notes

- For some path-based flags in Git Bash/MSYS, disable path conversion:

```bash
MSYS_NO_PATHCONV=1 tau new function ...
```

- Keep command examples in shell-compatible quoting.

## Troubleshooting

### `project is not selected` or wrong context

```bash
tau current
tau select project my_project
tau current
```

### Build fails after push

```bash
tau query builds --since 24h
tau query logs --jid "<JOB_ID>"
```

Check for:
- invalid function method/path setup
- wrong source path
- missing `.taubyte` metadata in function/website folders
- compile/runtime errors in function code

### Dream/local commands fail

```bash
dream status
dream start
dream status universe default
```

If Docker is not running, start Docker Desktop first, then retry.

## Full potential checklist

- Keep one project per product boundary.
- Group resources by application.
- Keep one HTTP function per method+path.
- Reuse code through libraries.
- Use matcher values consistently for data resources.
- Push config before code when infra changes.
- Use local Dream for integration testing.
- Monitor every deployment with `tau query builds` and `tau query logs`.

## Command discovery map

Use these help pages directly in your terminal:

```bash
tau --help
tau new --help
tau edit --help
tau delete --help
tau list --help
tau clone --help
tau pull --help
tau push --help
tau query --help
tau select --help
tau current --help
```

For complete local cloud operations, see [Dream CLI](dream.md).
