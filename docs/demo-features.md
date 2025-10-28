# ✨ Features Demo

This page demonstrates various MkDocs Material features and extensions used in the Taubyte documentation.

## Code Blocks

### Go Function Example

```go
package lib

import (
    "github.com/taubyte/go-sdk/event"
    http "github.com/taubyte/go-sdk/http/event"
)

//export ping
func ping(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }

    h.Write([]byte("PONG"))
    h.Return(200)
    return 0
}
```

### YAML Configuration

```yaml
id: ""
description: Returns pong to a ping over HTTP
trigger:
  type: https
  method: GET
  paths:
    - /ping
domains:
  - GeneratedDomain
execution:
  timeout: 10s
  memory: 10MB
  call: ping
```

## Admonitions

!!! note
This is a note admonition. Use it for general information.

!!! tip
This is a tip admonition. Use it for helpful suggestions.

!!! warning
This is a warning admonition. Use it for important warnings.

!!! danger
This is a danger admonition. Use it for critical information.

## Tabs

=== "Development"

````bash # Start local cloud
dream new multiverse

    # Trigger builds
    dream inject push-all
    ```

=== "Production"
```bash # Deploy to production
tau deploy --project myapp

    # Monitor deployment
    tau logs --follow
    ```

## Tables

| Feature   | Description                      | Status       |
| --------- | -------------------------------- | ------------ |
| Functions | Serverless WebAssembly functions | ✅ Available |
| Websites  | Static site hosting              | ✅ Available |
| Databases | Key-value storage                | ✅ Available |
| Storage   | Object storage                   | ✅ Available |
| Messaging | Pub/Sub messaging                | ✅ Available |

## Task Lists

- [x] Create project structure
- [x] Set up local development
- [x] Deploy first function
- [ ] Add database integration
- [ ] Implement messaging
- [ ] Go to production

## Keyboard Keys

Press ++ctrl+s++ to save your work.

Use ++cmd+shift+p++ to open the command palette.

## Annotations

```go
package lib // (1)!

import (
    "github.com/taubyte/go-sdk/event" // (2)!
)

//export ping // (3)!
func ping(e event.Event) uint32 {
    return 0
}
````

1.  Package name must be `lib` for Taubyte functions
2.  Import the Taubyte Go SDK event package
3.  Export directive is required for all Taubyte functions

## Emojis

:material-check: Complete
:material-clock: In Progress  
:material-close: Not Started

## Links

- [Getting Started](getting-started/index.md)
- [GitHub Repository](https://github.com/taubyte/tau)
- [Discord Community](https://discord.gg/KbN3KN7kpQ)

This page showcases the rich formatting capabilities available in the Taubyte documentation system.
