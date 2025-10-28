# AI Development Guide

This is a comprehensive reference guide for AI assistants working with Taubyte. It contains critical patterns, common mistakes, and best practices specifically tailored for AI-assisted development.

## 🚨 CRITICAL RULES - READ FIRST

### ⚠️ MANDATORY READING FOR AI ASSISTANTS

**WHY THIS MATTERS:** AIs often default to familiar patterns (Express.js, Socket.io, etc.) but Taubyte has its own ecosystem.

### 🚫 FORBIDDEN PATTERNS

**NEVER use these libraries or frameworks:**

- ❌ **socket.io** - Use Taubyte's built-in WebSocket handling
- ❌ **express.js** - Use Taubyte's HTTP event handling
- ❌ **gin, echo, fiber** - Use Taubyte's HTTP event handling
- ❌ **gorilla/websocket** - Use Taubyte's WebSocket handling
- ❌ **external database drivers** (MySQL, PostgreSQL, MongoDB, gorm, etc.)
- ❌ **external pub/sub systems** (Redis, RabbitMQ, Apache Kafka, etc.)
- ❌ **external storage systems** (AWS S3, Google Cloud Storage, etc.)
- ❌ **Any non-Taubyte SDK packages**

### ✅ CORRECT PATTERNS

**ALWAYS use these:**

- ✅ **Taubyte SDK packages only** - `github.com/taubyte/go-sdk/*`
- ✅ **Export functions with `//export`** - Mandatory for all public functions
- ✅ **Taubyte's built-in database** - Distributed key-value storage
- ✅ **Taubyte's pub/sub system** - Real-time messaging
- ✅ **Taubyte's WebSocket handling** - Built-in WebSocket support
- ✅ **Taubyte's storage system** - File storage capabilities
- ✅ **CORS headers** - For all HTTP endpoints
- ✅ **Proper error handling** - Use provided utility functions

## 📦 CORRECT IMPORTS

### Core Taubyte SDK Packages

```go
import (
    "encoding/json"
    "fmt"
    "time"
    "io"

    // Core SDK
    "github.com/taubyte/go-sdk/event"

    // Database operations
    "github.com/taubyte/go-sdk/database"

    // Pub/Sub messaging
    pubsub "github.com/taubyte/go-sdk/pubsub/node"

    // HTTP operations
    "github.com/taubyte/go-sdk/http/event"

    // Storage operations
    "github.com/taubyte/go-sdk/storage"
)
```

### 🚫 WRONG IMPORTS (Never Use)

```go
// WRONG - External frameworks
import "github.com/gin-gonic/gin"           // DON'T USE
import "github.com/gorilla/websocket"       // DON'T USE
import "github.com/go-redis/redis"          // DON'T USE
import "gorm.io/gorm"                       // DON'T USE
```

## 📝 FUNCTION EXPORT PATTERN (MANDATORY)

### 🚨 CRITICAL: Every Taubyte function MUST be exported

```go
package lib

import "github.com/taubyte/go-sdk/event"

//export functionName
func functionName(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1  // Error
    }

    // Your logic here

    return 0  // Success
}
```

### Export Rules

1. **MANDATORY**: Use `//export functionName` comment
2. **Function signature**: `func functionName(e event.Event) uint32`
3. **Return values**: `0` = Success, `1` = Error
4. **Package name**: Use `lib` (not `main`)

## 🌐 HTTP HANDLING

### Basic HTTP Handler Pattern

```go
//export httpHandler
func httpHandler(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }

    // ALWAYS set CORS headers
    h.Headers().Set("Access-Control-Allow-Origin", "*")
    h.Headers().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    h.Headers().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    // Your logic here

    return 0
}
```

### HTTP Operations

```go
// Get request method
method, err := h.Method()

// Get query parameters
param, err := h.Query().Get("paramName")

// Get path parameters
id, err := h.Path().Get("id")

// Get headers
contentType := h.Headers().Get("Content-Type")

// Read request body
body, err := io.ReadAll(h.Body())

// Set response headers
h.Headers().Set("Content-Type", "application/json")

// Write response
h.Write([]byte("Hello World!"))

// Return status code
h.Return(200)
```

## 🗄️ DATABASE OPERATIONS

### Key-Value Store (NOT SQL)

```go
// Get database connection
db, err := database.New("/data")
if err != nil {
    return 1
}
defer db.Close()

// Store data
err = db.Put("/key/path", []byte("value"))
if err != nil {
    return 1
}

// Get data
data, err := db.Get("/key/path")
if err != nil {
    return 1
}

// Delete data
err = db.Delete("/key/path")

// List keys with prefix
keys, err := db.List("/prefix/")
```

## 📡 PUB/SUB MESSAGING

### Create Channel and Publish

```go
// Create/open channel
channel, err := pubsub.Channel("channel-name")
if err != nil {
    return 1
}

// Subscribe to channel
err = channel.Subscribe()
if err != nil {
    return 1
}

// Publish message
err = channel.Publish([]byte("message"))
if err != nil {
    return 1
}

// Get WebSocket URL for real-time connections
url, err := channel.WebSocket().Url()
if err != nil {
    return 1
}
```

## 📁 STORAGE OPERATIONS

### File Storage

```go
// Open storage bucket
bucket, err := storage.New("/bucket/path")
if err != nil {
    return 1
}

// Select file
file := bucket.File("filename.txt")

// Write data to file
_, err = file.Add([]byte("file content"), true) // true = overwrite
if err != nil {
    return 1
}

// Read file
reader, err := file.GetFile()
if err != nil {
    return 1
}
defer reader.Close()

content, err := io.ReadAll(reader)
```

## 🛠️ ESSENTIAL UTILITY FUNCTIONS

### CORS Headers (CRITICAL)

```go
func setCORSHeaders(h http.Event) {
    h.Headers().Set("Access-Control-Allow-Origin", "*")
    h.Headers().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    h.Headers().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}
```

### Error Handling

```go
func handleHTTPError(h http.Event, err error, code int) uint32 {
    h.Write([]byte(err.Error()))
    h.Return(code)
    return 1
}
```

### JSON Response

```go
func sendJSONResponse(h http.Event, data interface{}) uint32 {
    jsonData, err := json.Marshal(data)
    if err != nil {
        return handleHTTPError(h, err, 500)
    }
    h.Headers().Set("Content-Type", "application/json")
    h.Write(jsonData)
    h.Return(200)
    return 0
}
```

### Query Parameters

```go
// Get query parameter with default
func getQueryParam(h http.Event, key, defaultValue string) string {
    value, err := h.Query().Get(key)
    if err != nil {
        return defaultValue
    }
    return value
}
```

## 🔧 CONFIGURATION

### go.mod Requirements

```go
// go.mod - Use EXACT versions
module function

go 1.19

require github.com/taubyte/go-sdk v0.3.9
```

**❌ WRONG VERSIONS:**

- `go 1.21` (too new)
- `github.com/taubyte/go-sdk v0.4.0` (doesn't exist)

**✅ CORRECT VERSIONS:**

- `go 1.19`
- `github.com/taubyte/go-sdk v0.3.9`

## 🤖 COMMON AI MISTAKES

### 1. Import Errors

**❌ WRONG:**

```go
import "github.com/gin-gonic/gin"  // DON'T USE!
```

**✅ CORRECT:**

```go
import "github.com/taubyte/go-sdk/event"
```

### 2. Missing Export

**❌ WRONG:**

```go
func myHandler(e event.Event) uint32 {
    // Missing //export comment!
}
```

**✅ CORRECT:**

```go
//export myHandler
func myHandler(e event.Event) uint32 {
    return 0
}
```

### 3. Wrong HTTP Handling

**❌ WRONG:**

```go
func handler(w http.ResponseWriter, r *http.Request) {
    // This is standard Go HTTP, won't work in Taubyte!
}
```

**✅ CORRECT:**

```go
//export handler
func handler(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }
    setCORSHeaders(h)
    return 0
}
```

### 4. Database Mistakes

**❌ WRONG:**

```go
db.Query("SELECT * FROM users")  // This is SQL, won't work!
```

**✅ CORRECT:**

```go
db, err := database.New("/users")
data, err := db.Get("/user/123")
```

## 🎯 TEMPLATES AND PATTERNS

### Complete REST API Function

```go
package lib

import (
    "encoding/json"
    "io"
    "github.com/taubyte/go-sdk/event"
    "github.com/taubyte/go-sdk/database"
    http "github.com/taubyte/go-sdk/http/event"
)

func setCORSHeaders(h http.Event) {
    h.Headers().Set("Access-Control-Allow-Origin", "*")
    h.Headers().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    h.Headers().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func handleHTTPError(h http.Event, err error, code int) uint32 {
    h.Write([]byte(err.Error()))
    h.Return(code)
    return 1
}

func sendJSONResponse(h http.Event, data interface{}) uint32 {
    jsonData, err := json.Marshal(data)
    if err != nil {
        return handleHTTPError(h, err, 500)
    }
    h.Headers().Set("Content-Type", "application/json")
    h.Write(jsonData)
    h.Return(200)
    return 0
}

//export apiHandler
func apiHandler(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }
    setCORSHeaders(h)

    method, err := h.Method()
    if err != nil {
        return handleHTTPError(h, err, 400)
    }

    switch method {
    case "GET":
        return handleGet(h)
    case "POST":
        return handlePost(h)
    default:
        h.Write([]byte("Method not allowed"))
        h.Return(405)
        return 1
    }
}

func handleGet(h http.Event) uint32 {
    db, err := database.New("/data")
    if err != nil {
        return handleHTTPError(h, err, 500)
    }
    defer db.Close()

    data, err := db.Get("/example/key")
    if err != nil {
        h.Write([]byte("Not found"))
        h.Return(404)
        return 1
    }

    h.Write(data)
    h.Return(200)
    return 0
}

func handlePost(h http.Event) uint32 {
    body, err := io.ReadAll(h.Body())
    if err != nil {
        return handleHTTPError(h, err, 400)
    }

    db, err := database.New("/data")
    if err != nil {
        return handleHTTPError(h, err, 500)
    }
    defer db.Close()

    err = db.Put("/example/key", body)
    if err != nil {
        return handleHTTPError(h, err, 500)
    }

    response := map[string]string{"status": "created"}
    return sendJSONResponse(h, response)
}
```

### WebSocket Handler Template

```go
//export websocketHandler
func websocketHandler(e event.Event) uint32 {
    ws, err := e.WebSocket()
    if err != nil {
        return 1
    }

    // Handle WebSocket message
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

### Pub/Sub Handler Template

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

    // Process the message
    var message map[string]interface{}
    err = json.Unmarshal(data, &message)
    if err != nil {
        return 1
    }

    // Handle the message based on your logic

    return 0
}
```

## 🚀 QUICK CHECKLIST

Before writing any Taubyte function, verify:

- [ ] Using only `github.com/taubyte/go-sdk/*` packages
- [ ] Function is exported with `//export functionName`
- [ ] Using Taubyte's built-in services (database, pub/sub, storage)
- [ ] Setting CORS headers for HTTP endpoints
- [ ] Proper error handling with utility functions
- [ ] Following Taubyte patterns from this guide
- [ ] Using correct go.mod with `go 1.19` and SDK `v0.3.9`

## 💡 REMEMBER

- **ALWAYS** use Taubyte SDK packages
- **ALWAYS** export functions with `//export`
- **ALWAYS** use Taubyte's built-in services
- **NEVER** use external frameworks
- **NEVER** reinvent the wheel - use Taubyte's capabilities

This guide provides all the essential patterns and practices for successful Taubyte development with AI assistance.
