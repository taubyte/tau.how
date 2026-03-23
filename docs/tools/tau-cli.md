# Tau CLI

This is a practical playbook for a real project: a SaaS notes app with:
- API function: `GET /notes`
- website: `app.notesforge.dev`
- database + storage + messaging
- shared library for common code

## Before you start

```bash
npm i -g @taubyte/cli
tau version
tau --help
```

### Global flags (used everywhere)

- `--yes`: skip confirmation prompts.
- `--defaults`: auto-fill defaults when possible, fail if required values are missing.
- `--json`: JSON output (great for scripts).
- `--toon`: TOON output.

---

## Journey 1: Ship `notesforge` to a remote cloud

### Step 1 - Login

```bash
tau login notesforge_profile \
  --new \
  --provider github \
  --token "$GITHUB_TOKEN" \
  --set-default
```

Flags used:
- `--new`: create profile.
- `--token`: avoid browser/login prompts.
- `--set-default`: use this profile by default.

### Step 2 - Select cloud and project context

```bash
tau select cloud --fqdn cloud.notesforge.dev
tau select project notesforge
tau current
```

Flags used:
- `tau select cloud --fqdn`: target remote cloud.
- `tau select project`: set active project.

### Step 3 - Create project non-interactively

```bash
tau --yes --defaults new project notesforge \
  --description "NotesForge production project" \
  --private \
  --no-embed-token
```

Flags used:
- `--private` or `--public`: repo visibility.
- `--no-embed-token`: avoid embedding token in remotes.

### Step 4 - Clone project repos with explicit branch

```bash
tau clone project notesforge --branch main --no-embed-token
```

Flags used:
- `--branch main`: pin branch.
- `--no-embed-token`: safer remotes.

### Step 5 - Create app resources

Application:

```bash
tau --yes new application notes_app --description "Core app resources"
```

HTTP function (`GET /notes`):

```bash
tau --yes new function get_notes \
  --description "Return paginated notes for current user" \
  --type http \
  --method GET \
  --paths /notes \
  --source notes_app/functions/get_notes \
  --template empty \
  --language Go \
  --timeout 30s
```

Website (`app.notesforge.dev`):

```bash
tau --yes new website notes_web \
  --description "NotesForge frontend" \
  --template empty \
  --domains app.notesforge.dev \
  --paths / \
  --provider github \
  --generate-repository \
  --private \
  --branch main \
  --no-embed-token
```

Database (matcher `notes`):

```bash
tau --yes new database notes_db \
  --description "Primary notes KV store" \
  --match notes \
  --min 1 \
  --max 1 \
  --size 5GB
```

Storage (matcher `attachments`):

```bash
tau --yes new storage notes_attachments \
  --description "Attachment object storage" \
  --match attachments \
  --bucket Object \
  --size 50GB \
  --versioning
```

Messaging (channel matcher `notes.events`):

```bash
tau --yes new messaging notes_events \
  --description "Events for note created/updated/deleted" \
  --match notes.events \
  --mqtt \
  --web-socket
```

Domain:

```bash
tau --yes new domain notes_domain \
  --description "Primary app domain" \
  --fqdn app.notesforge.dev \
  --cert-type auto
```

Library:

```bash
tau --yes new library notes_shared \
  --description "Shared models and validation helpers" \
  --template empty \
  --provider github \
  --generate-repository \
  --private \
  --branch main \
  --no-embed-token
```

### Step 6 - Push safely (config first, code second)

```bash
tau push project notesforge --config-only --message "notesforge resources and routes"
tau push project notesforge --code-only --message "notes API + web app changes"
```

### Step 7 - Check builds and logs

```bash
tau query builds --since 24h
tau query logs --jid "<JOB_ID>"
```

---

## Journey 2: Fast local loop for `get_notes`

This is your fast inner loop while developing a function/site/library.

### Build artifacts with `tau build`

Function:

```bash
tau build function --name get_notes --output ./dist/get_notes.wasm
```

Website:

```bash
tau build website --name notes_web --output ./dist/notes_web.zip
```

Library:

```bash
tau build library --name notes_shared --output ./dist/notes_shared.wasm
```

Flags that matter:
- `--name` (`-n`): resource name to build.
- `--output` (`-o`): exact output path, so scripts can pick artifacts reliably.

### Run functions with `tau run`

Basic run:

```bash
tau run function --name get_notes
```

Run with realistic request overrides:

```bash
tau run function --name get_notes \
  --force-build \
  --method GET \
  --path "/notes?limit=25&cursor=abc123" \
  --domain api.notesforge.dev \
  --header "Authorization: Bearer $ACCESS_TOKEN" \
  --header "X-Workspace-Id: ws_demo_001" \
  --header "X-Trace-Id: local-debug-2026-03-23" \
  --body "" \
  --timeout 30s
```

Run a pinned wasm artifact:

```bash
tau run function --name get_notes --wasm ./dist/get_notes.wasm
```

Flags that matter:
- `--force-build`: rebuild before run.
- `--method`, `--path`, `--domain`: override endpoint details.
- `--header`: repeatable request headers.
- `--body`: request payload (literal string or `@file`).
- `--wasm`: run a specific compiled binary.

---

## Journey 3: Switch the same project to local Dream

```bash
npm i -g @taubyte/dream
dream status
dream start
dream status universe default
dream new universe default
tau select cloud --universe default
tau select project notesforge
tau current
```

From this point, you use the same `tau new`, `tau build`, `tau run`, `tau push`, `tau query` flow.

For Dream details, see [Dream CLI](dream.md).

---

## Flag cheat sheets by command family

### `tau new`

Main resources:
- `project`, `application`, `function`, `website`, `database`, `storage`, `messaging`, `library`, `domain`.

Patterns:
- Always start scripts with `tau --yes --defaults new ...`.
- Use explicit booleans (`--private` / `--no-private`, `--embed-token` / `--no-embed-token`).
- For HTTP functions, create one function per `(method + path)` pair.

Practical split for the same route family:

```bash
tau --yes new function get_notes    --type http --method GET    --paths /notes --source notes_app/functions/get_notes    --template empty --language Go
tau --yes new function create_note  --type http --method POST   --paths /notes --source notes_app/functions/create_note  --template empty --language Go
tau --yes new function delete_note  --type http --method DELETE --paths /notes --source notes_app/functions/delete_note  --template empty --language Go
```

### `tau clone`

Main resources:
- `project`, `website`, `library`.

High-value flags:
- `--branch main`
- `--no-embed-token`

### `tau push` / `tau pull`

For project:
- `--config-only`
- `--code-only`
- `--message` (push)

Recommended order:
1. `pull` if needed.
2. `push --config-only`
3. `push --code-only`

### `tau query`

High-value commands:
- `tau query builds --since 24h`
- `tau query logs --jid "<JOB_ID>"`

Machine-friendly output for CI checks:

```bash
tau --json query builds --since 2h
tau --json query logs --jid "$FAILED_JOB_ID" --output ./logs
```

### `tau validate`

```bash
tau validate config
```

Use before push when you changed project config.

---

## Non-interactive rules that save you pain

- Start automated commands with `tau --yes --defaults`.
- Pass all required flags directly; do not rely on interactive prompts.
- Use one HTTP function per `(method + path)` pair.
- Use `--branch main` when cloning.
- Push config before code after infra/resource edits.
- Keep matchers stable (`notes`, `attachments`, `notes.events`) so code and config stay aligned.

---

## Command discovery

```bash
tau --help
tau new --help
tau edit --help
tau delete --help
tau list --help
tau select --help
tau clone --help
tau pull --help
tau push --help
tau query --help
tau build --help
tau run --help
tau validate --help
```
