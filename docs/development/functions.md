# Functions

<!-- Source: Based on WebAssembly functions and official Taubyte function templates -->

Serverless functions in Taubyte are WebAssembly-based, event-driven compute units that automatically scale and execute in response to various triggers like HTTP requests, WebSocket connections, or Pub/Sub messages.

## Function Characteristics

### WebAssembly Runtime

- **Security**: Sandboxed execution environment
- **Performance**: Near-native execution speed
- **Portability**: Runs identically across different architectures
- **Efficiency**: Compact binaries for fast distribution

### Event Architecture

- **Event-driven**: Functions respond to specific events
- **Stateless**: No state maintained between invocations
- **Auto-scaling**: Automatic scaling based on demand
- **Fast startup**: Optimized for minimal cold start times

### Supported Languages

- **Go**: Primary language with full SDK support
- **Other languages**: Any language that compiles to WebAssembly

## Creating Functions

### Using Templates

The Web Console provides templates for quick function creation:

1. Navigate to `Functions` and click the `+` button
2. Click `Template Select` to choose from available templates
3. Select language (e.g., Go) and template (e.g., `ping_pong`)
4. Configure domains, paths, and execution parameters

### Function Configuration

Functions are configured via YAML with the following key sections:

```yaml
id: ""
description: Returns pong to a ping over HTTP
tags: []
source: .
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

#### Configuration Options

**Source:**

- `source: .` - Inline code in the Web Console
- `source: github.com/username/repo` - External Git repository

**Trigger Types:**

- `https` - HTTP/HTTPS requests
- `websocket` - WebSocket connections
- `pubsub` - Pub/Sub messages
- `timer` - Scheduled execution

**HTTP Configuration:**

- `method` - HTTP methods (GET, POST, PUT, DELETE, etc.)
- `paths` - URL paths that trigger the function
- `domains` - Domains where the function is available

**Execution Settings:**

- `timeout` - Maximum execution time (e.g., 10s, 1m)
- `memory` - Memory allocation (e.g., 10MB, 100MB, 1GB)
- `call` - Entry point function name (must match exported function)

## Writing Function Code

### Basic Structure

All Taubyte functions must follow this pattern:

```go
package lib

import (
    "github.com/taubyte/go-sdk/event"
    http "github.com/taubyte/go-sdk/http/event"
)

//export functionName
func functionName(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1  // Error
    }

    // Your logic here
    h.Write([]byte("Hello, World!"))
    h.Return(200)

    return 0  // Success
}
```

#### Critical Requirements

1. **Export Comment**: `//export functionName` is mandatory
2. **Function Signature**: `func functionName(e event.Event) uint32`
3. **Return Values**: `0` for success, `1` for error
4. **Package Name**: Use `lib` (not `main`)

### HTTP Request Handling

#### Getting Request Data

```go
// Get HTTP method
method, err := h.Method()
if err != nil {
    return 1
}

// Get query parameters
param, err := h.Query().Get("paramName")
if err != nil {
    // Handle missing parameter
}

// Get path parameters
id, err := h.Path().Get("id")
if err != nil {
    return 1
}

// Get headers
contentType := h.Headers().Get("Content-Type")

// Read request body
body, err := io.ReadAll(h.Body())
if err != nil {
    return 1
}
```

#### Sending Responses

```go
// Set response headers
h.Headers().Set("Content-Type", "application/json")

// Write response body
response := map[string]string{"message": "success"}
jsonResponse, _ := json.Marshal(response)
h.Write(jsonResponse)

// Set status code
h.Return(200)
```

### Error Handling

Always handle errors gracefully:

```go
func handleError(h http.Event, err error, code int) uint32 {
    h.Write([]byte(err.Error()))
    h.Return(code)
    return 1
}

//export myFunction
func myFunction(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }

    // Use error handler
    data, err := someOperation()
    if err != nil {
        return handleError(h, err, 500)
    }

    // Continue with success path
    return 0
}
```

## Function Types and Examples

### HTTP API Function

```go
//export apiHandler
func apiHandler(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }

    method, _ := h.Method()

    switch method {
    case "GET":
        return handleGet(h)
    case "POST":
        return handlePost(h)
    case "PUT":
        return handlePut(h)
    case "DELETE":
        return handleDelete(h)
    default:
        h.Write([]byte("Method not allowed"))
        h.Return(405)
        return 1
    }
}
```

### WebSocket Function

```go
//export websocketHandler
func websocketHandler(e event.Event) uint32 {
    ws, err := e.WebSocket()
    if err != nil {
        return 1
    }

    // Handle WebSocket messages
    data, err := ws.Read()
    if err != nil {
        return 1
    }

    // Echo back the message
    err = ws.Write(data)
    if err != nil {
        return 1
    }

    return 0
}
```

### Pub/Sub Function

```go
//export pubsubHandler
func pubsubHandler(e event.Event) uint32 {
    channel, err := e.PubSub()
    if err != nil {
        return 1
    }

    data, err := channel.Data()
    if err != nil {
        return 1
    }

    // Process the received message
    processMessage(data)

    return 0
}
```

## Library Integration

Functions can use external libraries in two ways:

### 1. Library as Source

Set the function source to a library repository:

```yaml
source: github.com/username/library-repo
```

### 2. Library as Dependency

Import library functions using WebAssembly imports:

```go
//go:wasmimport libraries/my_library add
func add(a, b uint32) uint64

//export calculateSum
func calculateSum(e event.Event) uint32 {
    // Use the imported library function
    result := add(5, 3)
    // Handle result...
    return 0
}
```

## Deployment and Testing

### Local Testing

1. Create or modify function in Web Console
2. Push changes to Git repository
3. Run `dream inject push-all` to trigger local build
4. Test function endpoints locally

### Production Deployment

Functions automatically deploy when:

1. Code is pushed to monitored Git branch
2. CI/CD pipeline builds and deploys function
3. Function becomes available on configured domains

### Testing HTTP Functions

```bash
# Test with curl
curl -X GET "https://your-domain.com/api/endpoint?param=value"

# Test with specific headers
curl -H "Content-Type: application/json" \
     -X POST "https://your-domain.com/api/endpoint" \
     -d '{"key": "value"}'
```

## Best Practices

### Performance

- Keep functions **stateless** and lightweight
- Use **appropriate memory allocation** for your workload
- **Cache frequently used data** in global variables (within memory limits)
- **Minimize cold starts** by keeping functions warm

### Security

- **Validate all inputs** from HTTP requests
- **Sanitize data** before processing
- **Use HTTPS** for all production functions
- **Implement proper error handling** without exposing sensitive data

### Code Organization

- **Use libraries** for shared functionality
- **Keep functions focused** on single responsibilities
- **Use descriptive names** for functions and parameters
- **Document function purposes** and parameters

### Error Handling

- **Always check errors** from SDK operations
- **Return meaningful error messages** to clients
- **Log errors** for debugging (use fmt.Printf for local development)
- **Use appropriate HTTP status codes**

## Troubleshooting

### Common Issues

**Function not responding:**

- Check build logs in Web Console
- Verify function is exported with `//export`
- Ensure correct entry point in configuration

**Import errors:**

- Verify SDK version in go.mod matches supported version
- Check import paths are correct
- Ensure all required packages are imported

**Performance issues:**

- Check memory allocation is sufficient
- Verify timeout settings are appropriate
- Monitor function execution logs

Functions are the core building blocks of Taubyte applications, providing scalable, secure, and efficient compute capabilities for your cloud applications.
