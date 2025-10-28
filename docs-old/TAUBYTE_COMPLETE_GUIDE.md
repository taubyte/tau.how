# TAUBYTE COMPLETE AI GUIDE

> **Quick Reference**: This is a consolidated documentation for Taubyte development, optimized for AI assistants.

---

## TABLE OF CONTENTS

1. [CRITICAL RULES - READ FIRST](#critical-rules)
2. [QUICK START](#quick-start)
3. [ARCHITECTURE OVERVIEW](#architecture)
4. [IMPORTS & SETUP](#imports-setup)
5. [FUNCTION EXPORT PATTERNS](#function-export)
6. [HTTP HANDLING](#http-handling)
7. [REST API TEMPLATES](#rest-api)
8. [DATABASE OPERATIONS](#database)
9. [PUB/SUB MESSAGING](#pubsub)
10. [ERROR HANDLING](#error-handling)
11. [UTILITY FUNCTIONS](#utilities)
12. [CONFIGURATION](#configuration)
13. [COMMON AI MISTAKES](#ai-mistakes)
14. [GETTING STARTED GUIDE](#getting-started)
15. [OFFICIAL RESOURCES](#resources)

---

<a name="critical-rules"></a>

## 🚨 CRITICAL RULES - READ THIS FIRST

### ⚠️ MANDATORY READING FOR AI ASSISTANTS

**WHY THIS MATTERS:** AIs often default to familiar patterns (Express.js, Socket.io, etc.) but Taubyte has its own ecosystem.

### 🤖 AI-SPECIFIC WARNINGS

**As an AI, you might be tempted to:**

- Use familiar web frameworks (Express, Gin, Echo)
- Implement WebSocket connections manually
- Use external databases (MySQL, PostgreSQL)
- Create custom pub/sub systems

**DON'T DO THIS!** Taubyte provides everything built-in.

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

### 🎯 Key Principles

1. **Use Taubyte's capabilities** - Don't reinvent the wheel
2. **Follow Taubyte patterns** - Use the established patterns
3. **Export all functions** - Use `//export functionName`
4. **Handle errors properly** - Use utility functions
5. **Set CORS headers** - For HTTP endpoints
6. **Use context for data** - Request-scoped data

### 🚀 Quick Checklist

Before writing any Taubyte function, verify:

- [ ] Using only `github.com/taubyte/go-sdk/*` packages
- [ ] Function is exported with `//export functionName`
- [ ] Using Taubyte's built-in services (database, pub/sub, storage)
- [ ] Setting CORS headers for HTTP endpoints
- [ ] Proper error handling with utility functions
- [ ] Following Taubyte patterns from the guide

---

<a name="quick-start"></a>

## 🚀 QUICK START

### What is Taubyte?

Taubyte is a decentralized cloud platform that provides serverless functions and distributed infrastructure.

### Start Local Cloud

```sh
npm i -g @taubyte/dream  # Install globally
dream new multiverse     # Start local cloud
```

You should see:

```
[INFO] Dreamland ready
[SUCCESS] Universe blackhole started!
```

### Verify Cloud Status

```sh
dream status universe
```

### Core Development Flow

```
Write Code → Deploy → Global Access
    ↓           ↓         ↓
Go Functions → Taubyte → Worldwide
```

---

<a name="architecture"></a>

## 🏗️ ARCHITECTURE OVERVIEW

### Core Capabilities

#### **Functions**

- Serverless functions with Go SDK
- Automatic scaling
- Global deployment
- No server management

#### **Databases**

- Distributed key-value storage
- Global replication
- Automatic backup
- No configuration needed

#### **Pub/Sub**

- Real-time messaging system
- WebSocket support
- Global message distribution
- Built-in reliability

#### **HTTP**

- Built-in HTTP handling
- REST API support
- Automatic routing
- CORS support

#### **WebSockets**

- Real-time bidirectional communication
- Automatic connection management
- Global scaling
- Built-in reliability

#### **Storage**

- File storage capabilities
- Global distribution
- Automatic replication
- No configuration needed

#### **Additional Services**

- **DNS**: DNS management and configuration
- **P2P**: Peer-to-peer networking
- **IPFS**: InterPlanetary File System integration
- **Ethereum**: Blockchain integration

### Core Services Architecture

**Request Handling:**

- `gateway`: L7 load balancer and entry point
- `substrate`: Processes and serves requests
- `seer`: DNS resolution and load balancing

**CI/CD:**

- `patrick`: Git event handler → CI/CD pipeline
- `monkey`: CI/CD job executor

**Infrastructure:**

- `auth`: Authentication and secrets management
- `tns`: Project registry and configuration store
- `hoarder`: Data replication manager

---

<a name="imports-setup"></a>

## 📦 IMPORTS & SETUP

### Core Taubyte SDK Packages

```go
import (
    "encoding/json"
    "fmt"
    "time"
    "io"

    // Core SDK
    sdk "github.com/taubyte/go-sdk"

    // Database operations
    "github.com/taubyte/go-sdk/database"

    // Event handling
    "github.com/taubyte/go-sdk/event"

    // Pub/Sub messaging
    pubsub "github.com/taubyte/go-sdk/pubsub/node"

    // HTTP operations
    "github.com/taubyte/go-sdk/http/client"
    "github.com/taubyte/go-sdk/http/event"

    // Storage operations
    "github.com/taubyte/go-sdk/storage"

    // P2P networking
    "github.com/taubyte/go-sdk/p2p/event"
    "github.com/taubyte/go-sdk/p2p/node"

    // IPFS integration
    "github.com/taubyte/go-sdk/ipfs/client"

    // DNS management
    "github.com/taubyte/go-sdk/dns"

    // Ethereum integration
    "github.com/taubyte/go-sdk/ethereum/client"

    // Utilities
    "github.com/taubyte/go-sdk/utils/convert"
    "github.com/taubyte/go-sdk/utils/codec"
)
```

### 🚫 Common Import Mistakes

**❌ DON'T use these:**

```go
// WRONG - External frameworks
import "github.com/gin-gonic/gin"
import "github.com/gorilla/websocket"
import "github.com/go-redis/redis"
import "github.com/aws/aws-sdk-go"
import "gorm.io/gorm"
```

**✅ DO use these:**

```go
// CORRECT - Taubyte SDK only
import "github.com/taubyte/go-sdk/database"
import pubsub "github.com/taubyte/go-sdk/pubsub/node"
import "github.com/taubyte/go-sdk/storage"
```

### go.mod Configuration

**CRITICAL: Correct Go and SDK Versions**

```go
// go.mod - Use correct versions
module function

go 1.19

require github.com/taubyte/go-sdk v0.3.9
```

**❌ WRONG VERSIONS:**

- `go 1.21` (too new)
- `github.com/taubyte/go-sdk v0.4.0` (doesn't exist)
- `module your_project` (should be `module function`)

**✅ CORRECT VERSIONS:**

- `go 1.19`
- `github.com/taubyte/go-sdk v0.3.9`
- `module function`

After creating go.mod, run:

```bash
go mod tidy
go build .
```

---

<a name="function-export"></a>

## 📝 FUNCTION EXPORT PATTERN (MANDATORY)

### 🚨 CRITICAL: Every Taubyte function MUST be exported

**AI WARNING:** This is the #1 mistake AIs make! Without `//export`, your function won't be callable by Taubyte.

### Basic Export Pattern

```go
package lib

import "github.com/taubyte/go-sdk/event"

//export functionName
func functionName(e event.Event) uint32 {
    fmt.Println("Event Type:", e.Type())
    h, err := e.HTTP()
    if err != nil {
        return 1
    }

    // Your logic here

    return 0
}
```

### 📋 Export Rules

1. **MANDATORY**: Use `//export functionName` comment
2. **Function signature**: `func functionName(e event.Event) uint32`
3. **Return values**:
   - `0` = Success
   - `1` = Error
4. **Event parameter**: Always `e event.Event`

### Common Patterns

#### HTTP Handler

```go
package lib

import "github.com/taubyte/go-sdk/event"

//export httpHandler
func httpHandler(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }
    setCORSHeaders(h)

    // Your HTTP logic here

    return 0
}
```

#### Pub/Sub Handler

```go
package lib

import "github.com/taubyte/go-sdk/event"

//export pubsubHandler
func pubsubHandler(e event.Event) uint32 {
    channel, err := e.PubSub()
    if err != nil {
        return 1
    }

    // Your pub/sub logic here

    return 0
}
```

#### WebSocket Handler

```go
package lib

import "github.com/taubyte/go-sdk/event"

//export websocketHandler
func websocketHandler(e event.Event) uint32 {
    ws, err := e.WebSocket()
    if err != nil {
        return 1
    }

    // Your WebSocket logic here

    return 0
}
```

### 🚫 Common Mistakes

**❌ WRONG - Missing export comment:**

```go
package lib

func myFunction(e event.Event) uint32 {
    // This won't work!
}
```

**❌ WRONG - Wrong return type:**

```go
package lib

//export myFunction
func myFunction(e event.Event) error {
    // Wrong return type!
}
```

**✅ CORRECT:**

```go
package lib

//export myFunction
func myFunction(e event.Event) uint32 {
    // This will work!
    return 0
}
```

---

<a name="http-handling"></a>

## 🌐 HTTP EVENT HANDLING

### 🤖 AI WARNING: This is NOT Express.js or Gin!

**Common AI mistakes:**

- Trying to use `gin.Context` or `http.Request`
- Creating routers or middleware
- Using standard Go HTTP handlers

**Taubyte uses event-based HTTP handling, not traditional web frameworks!**

### Basic HTTP Handler Pattern

```go
//export httpHandler
func httpHandler(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }
    setCORSHeaders(h) // See utilities section

    // Your logic here

    return 0
}
```

### HTTP Operations

#### Get Request Method

```go
method, err := h.Method()
if err != nil {
    return handleHTTPError(h, err, 400)
}
```

#### Get Query Parameters

```go
// Single parameter
param, err := h.Query().Get("paramName")
if err != nil {
    // Handle missing parameter
}

// With default value
param := getQueryParam(h, "paramName", "defaultValue")
```

#### Get Path Parameters

```go
id, err := h.Path().Get("id")
if err != nil {
    h.Write([]byte("Missing ID parameter"))
    h.Return(400)
    return 1
}
```

#### Get Headers

```go
contentType := h.Headers().Get("Content-Type")
authorization := h.Headers().Get("Authorization")
```

#### Read Request Body

```go
body, err := io.ReadAll(h.Body())
if err != nil {
    return handleHTTPError(h, err, 400)
}
```

#### Set Response Headers

```go
h.Headers().Set("Content-Type", "application/json")
h.Headers().Set("Access-Control-Allow-Origin", "*")
```

#### Write Response

```go
// Simple text response
h.Write([]byte("Hello World!"))

// JSON response
response := map[string]string{"message": "success"}
jsonResponse, _ := json.Marshal(response)
h.Write(jsonResponse)
```

#### Return Status Code

```go
h.Return(200) // Success
h.Return(400) // Bad Request
h.Return(404) // Not Found
h.Return(500) // Internal Server Error
```

### Complete Example

```go
//export apiHandler
func apiHandler(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }
    setCORSHeaders(h)

    // Get method
    method, err := h.Method()
    if err != nil {
        return handleHTTPError(h, err, 400)
    }

    // Get query parameters
    id := getQueryParam(h, "id", "")
    if id == "" {
        h.Write([]byte("Missing ID parameter"))
        h.Return(400)
        return 1
    }

    // Get headers
    contentType := h.Headers().Get("Content-Type")

    // Read body for POST/PUT
    var body []byte
    if method == "POST" || method == "PUT" {
        body, err = io.ReadAll(h.Body())
        if err != nil {
            return handleHTTPError(h, err, 400)
        }
    }

    // Process based on method
    switch method {
    case "GET":
        return handleGetRequest(h, id)
    case "POST":
        return handlePostRequest(h, body)
    case "PUT":
        return handlePutRequest(h, id, body)
    case "DELETE":
        return handleDeleteRequest(h, id)
    default:
        h.Write([]byte("Method not allowed"))
        h.Return(405)
        return 1
    }
}
```

---

<a name="rest-api"></a>

## 🔧 REST API TEMPLATES

### Complete CRUD API Examples

#### Create Resource

```go
//export createResource
func createResource(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }
    setCORSHeaders(h)

    // Read request body
    body, err := io.ReadAll(h.Body())
    if err != nil {
        h.Write([]byte("Failed to read request body"))
        h.Return(400)
        return 1
    }

    // Get database connection
    db, err := database.New("/data")
    if err != nil {
        return handleHTTPError(h, err, 500)
    }
    defer db.Close()

    // Generate unique key
    key := fmt.Sprintf("/resource/%d", time.Now().UnixNano())

    // Store data
    err = db.Put(key, body)
    if err != nil {
        h.Write([]byte("Failed to store data"))
        h.Return(500)
        return 1
    }

    response := map[string]string{"id": key, "status": "created"}
    return sendJSONResponse(h, response)
}
```

#### Get Resource

```go
//export getResource
func getResource(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }
    setCORSHeaders(h)

    // Get resource ID from path
    id, err := h.Path().Get("id")
    if err != nil {
        h.Write([]byte("Missing resource ID"))
        h.Return(400)
        return 1
    }

    // Get database connection
    db, err := database.New("/data")
    if err != nil {
        return handleHTTPError(h, err, 500)
    }
    defer db.Close()

    // Get data
    data, err := db.Get(fmt.Sprintf("/resource/%s", id))
    if err != nil {
        h.Write([]byte("Resource not found"))
        h.Return(404)
        return 1
    }

    h.Headers().Set("Content-Type", "application/json")
    h.Write(data)
    h.Return(200)
    return 0
}
```

#### List Resources

```go
//export listResources
func listResources(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }
    setCORSHeaders(h)

    // Get database connection
    db, err := database.New("/data")
    if err != nil {
        return handleHTTPError(h, err, 500)
    }
    defer db.Close()

    // List all resources
    keys, err := db.List("/resource/")
    if err != nil {
        h.Write([]byte("Failed to list resources"))
        h.Return(500)
        return 1
    }

    return sendJSONResponse(h, keys)
}
```

#### Update Resource

```go
//export updateResource
func updateResource(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }
    setCORSHeaders(h)

    // Get resource ID from path
    id, err := h.Path().Get("id")
    if err != nil {
        h.Write([]byte("Missing resource ID"))
        h.Return(400)
        return 1
    }

    // Read request body
    body, err := io.ReadAll(h.Body())
    if err != nil {
        h.Write([]byte("Failed to read request body"))
        h.Return(400)
        return 1
    }

    // Get database connection
    db, err := database.New("/data")
    if err != nil {
        return handleHTTPError(h, err, 500)
    }
    defer db.Close()

    // Check if resource exists
    _, err = db.Get(fmt.Sprintf("/resource/%s", id))
    if err != nil {
        h.Write([]byte("Resource not found"))
        h.Return(404)
        return 1
    }

    // Update data
    err = db.Put(fmt.Sprintf("/resource/%s", id), body)
    if err != nil {
        h.Write([]byte("Failed to update resource"))
        h.Return(500)
        return 1
    }

    response := map[string]string{"id": id, "status": "updated"}
    return sendJSONResponse(h, response)
}
```

#### Delete Resource

```go
//export deleteResource
func deleteResource(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }
    setCORSHeaders(h)

    // Get resource ID from path
    id, err := h.Path().Get("id")
    if err != nil {
        h.Write([]byte("Missing resource ID"))
        h.Return(400)
        return 1
    }

    // Get database connection
    db, err := database.New("/data")
    if err != nil {
        return handleHTTPError(h, err, 500)
    }
    defer db.Close()

    // Check if resource exists
    _, err = db.Get(fmt.Sprintf("/resource/%s", id))
    if err != nil {
        h.Write([]byte("Resource not found"))
        h.Return(404)
        return 1
    }

    // Delete data
    err = db.Delete(fmt.Sprintf("/resource/%s", id))
    if err != nil {
        h.Write([]byte("Failed to delete resource"))
        h.Return(500)
        return 1
    }

    h.Write([]byte("Resource deleted successfully"))
    h.Return(200)
    return 0
}
```

---

<a name="database"></a>

## 🗄️ DATABASE OPERATIONS

### 🤖 AI WARNING: This is NOT MySQL or PostgreSQL!

**Common AI mistakes:**

- Trying to use SQL queries
- Using GORM or other ORMs
- Creating database schemas
- Using connection strings

**Taubyte uses a distributed key-value store, NOT SQL databases!**

### Create/Update Data

```go
// Get database connection
db, err := database.New("/data")
if err != nil {
    return handleHTTPError(h, err, 500)
}
defer db.Close()

// Store data
err = db.Put("/key/path", []byte("value"))
if err != nil {
    h.Write([]byte("Failed to store data"))
    h.Return(500)
    return 1
}
```

### Read Data

```go
// Get data
data, err := db.Get("/key/path")
if err != nil {
    h.Write([]byte("Data not found"))
    h.Return(404)
    return 1
}

// Use the data
h.Write(data)
h.Return(200)
return 0
```

### Delete Data

```go
// Delete data
err = db.Delete("/key/path")
if err != nil {
    h.Write([]byte("Failed to delete data"))
    h.Return(500)
    return 1
}
```

### List Keys

```go
// List all keys with prefix
keys, err := db.List("/prefix/")
if err != nil {
    h.Write([]byte("Failed to list keys"))
    h.Return(500)
    return 1
}

// Return list of keys
return sendJSONResponse(h, keys)
```

### Complete Database Example (from official docs)

```go
package lib

import (
	"encoding/json"

	"github.com/taubyte/go-sdk/database"
	"github.com/taubyte/go-sdk/event"
	http "github.com/taubyte/go-sdk/http/event"
)

func fail(h http.Event, err error, code int) uint32 {
	h.Write([]byte(err.Error()))
	h.Return(code)
	return 1
}

type Req struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

//export set
func set(e event.Event) uint32 {
	h, err := e.HTTP()
	if err != nil {
		return 1
	}

	// (Create) & Open the database
	db, err := database.New("/example/kv")
	if err != nil {
		return fail(h, err, 500)
	}

	// Decode the request body
	reqDec := json.NewDecoder(h.Body())
	defer h.Body().Close()

	// Decode the request body
	var req Req
	err = reqDec.Decode(&req)
	if err != nil {
		return fail(h, err, 500)
	}

	// Put the key/value into the database
	err = db.Put(req.Key, []byte(req.Value))
	if err != nil {
		return fail(h, err, 500)
	}

	return 0
}

//export get
func get(e event.Event) uint32 {
	h, err := e.HTTP()
	if err != nil {
		return 1
	}

	key, err := h.Query().Get("key")
	if err != nil {
		return fail(h, err, 400)
	}

	db, err := database.New("/example/kv")
	if err != nil {
		return fail(h, err, 500)
	}

	value, err := db.Get(key)
	if err != nil {
		return fail(h, err, 500)
	}

	h.Write(value)
	h.Return(200)

	return 0
}
```

### Database Matcher Patterns

Databases in Taubyte are instantiated on-the-fly when you first use them. You can use regular expressions as matchers.

Examples:

- `/example/kv` - Simple path matcher
- `/profile/history/[^/]+` - Regex matcher (creates database per user)
  - Opening `/profile/history/userA` creates a database just for that user

---

<a name="pubsub"></a>

## 📡 PUB/SUB MESSAGING

### 🤖 AI WARNING: This is NOT Socket.io or Redis!

**Common AI mistakes:**

- Trying to use Socket.io for real-time communication
- Using Redis pub/sub
- Creating WebSocket connections manually
- Using external message brokers

**Taubyte has built-in pub/sub that handles everything automatically!**

### Create Channel

```go
//export createChannel
func createChannel(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }
    setCORSHeaders(h)

    // Get channel name from query
    channelName, err := h.Query().Get("channel")
    if err != nil {
        h.Write([]byte("channel parameter required"))
        h.Return(400)
        return 1
    }

    // Create channel
    channel, err := pubsub.Channel(channelName)
    if err != nil {
        h.Write([]byte(err.Error()))
        h.Return(500)
        return 1
    }

    // Subscribe to channel
    err = channel.Subscribe()
    if err != nil {
        h.Write([]byte("Subscription failed"))
        h.Return(500)
        return 1
    }

    // Get WebSocket URL for real-time connection
    url, err := channel.WebSocket().Url()
    if err != nil {
        h.Write([]byte(err.Error()))
        h.Return(500)
        return 1
    }

    h.Headers().Set("Content-Type", "application/json")
    response := map[string]string{"websocketUrl": url.Path}
    jsonResponse, _ := json.Marshal(response)
    h.Write(jsonResponse)
    h.Return(200)
    return 0
}
```

### Publish Message

```go
//export publishMessage
func publishMessage(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }
    setCORSHeaders(h)

    // Get channel and message from request
    channelName, err := h.Query().Get("channel")
    if err != nil {
        h.Write([]byte("channel parameter required"))
        h.Return(400)
        return 1
    }

    // Read message from request body
    body, err := io.ReadAll(h.Body())
    if err != nil {
        h.Write([]byte("Failed to read request body"))
        h.Return(400)
        return 1
    }

    // Create channel and publish
    channel, err := pubsub.Channel(channelName)
    if err != nil {
        h.Write([]byte(err.Error()))
        h.Return(500)
        return 1
    }

    err = channel.Publish(body)
    if err != nil {
        h.Write([]byte("Publish failed"))
        h.Return(500)
        return 1
    }

    h.Write([]byte("Message published successfully"))
    h.Return(200)
    return 0
}
```

### Handle Pub/Sub Events

```go
//export handlePubSubEvent
func handlePubSubEvent(e event.Event) uint32 {
    // Handle incoming pub/sub events
    channel, err := e.PubSub()
    if err != nil {
        return 1
    }

    data, err := channel.Data()
    if err != nil {
        return 1
    }

    // Process the received data based on your application logic
    // This could be notifications, updates, real-time data, etc.

    return 0
}
```

### Real-time Messaging Patterns

#### Chat System

```go
//export sendChatMessage
func sendChatMessage(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }
    setCORSHeaders(h)

    // Get room and message
    room := getQueryParam(h, "room", "default")
    body, err := io.ReadAll(h.Body())
    if err != nil {
        h.Write([]byte("Failed to read message"))
        h.Return(400)
        return 1
    }

    // Create chat channel
    channel, err := pubsub.Channel(fmt.Sprintf("chat-%s", room))
    if err != nil {
        return handleHTTPError(h, err, 500)
    }

    // Publish message
    err = channel.Publish(body)
    if err != nil {
        h.Write([]byte("Failed to send message"))
        h.Return(500)
        return 1
    }

    h.Write([]byte("Message sent"))
    h.Return(200)
    return 0
}
```

#### Notifications

```go
//export sendNotification
func sendNotification(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }
    setCORSHeaders(h)

    // Get user ID and notification
    userID, err := h.Query().Get("user")
    if err != nil {
        h.Write([]byte("user parameter required"))
        h.Return(400)
        return 1
    }

    body, err := io.ReadAll(h.Body())
    if err != nil {
        h.Write([]byte("Failed to read notification"))
        h.Return(400)
        return 1
    }

    // Create user-specific channel
    channel, err := pubsub.Channel(fmt.Sprintf("notifications-%s", userID))
    if err != nil {
        return handleHTTPError(h, err, 500)
    }

    // Send notification
    err = channel.Publish(body)
    if err != nil {
        h.Write([]byte("Failed to send notification"))
        h.Return(500)
        return 1
    }

    h.Write([]byte("Notification sent"))
    h.Return(200)
    return 0
}
```

---

<a name="error-handling"></a>

## 🚨 ERROR HANDLING & CORS

### Common Error Scenarios

#### Missing Parameters

```go
// Get required parameter
id, err := h.Path().Get("id")
if err != nil {
    h.Write([]byte("Missing ID parameter"))
    h.Return(400)
    return 1
}

// Get required query parameter
param, err := h.Query().Get("param")
if err != nil {
    h.Write([]byte("Missing required parameter"))
    h.Return(400)
    return 1
}
```

#### Database Errors

```go
db, err := database.New("/data")
if err != nil {
    return handleHTTPError(h, err, 500)
}

data, err := db.Get(key)
if err != nil {
    h.Write([]byte("Resource not found"))
    h.Return(404)
    return 1
}
```

#### JSON Parsing Errors

```go
body, err := io.ReadAll(h.Body())
if err != nil {
    h.Write([]byte("Failed to read request body"))
    h.Return(400)
    return 1
}

var data map[string]interface{}
err = json.Unmarshal(body, &data)
if err != nil {
    h.Write([]byte("Invalid JSON"))
    h.Return(400)
    return 1
}
```

#### Validation Errors

```go
// Validate required fields
requiredFields := []string{"name", "email", "password"}
for _, field := range requiredFields {
    if _, exists := data[field]; !exists {
        h.Write([]byte(fmt.Sprintf("Missing required field: %s", field)))
        h.Return(400)
        return 1
    }
}
```

### HTTP Status Codes

- **200** - Success
- **400** - Bad Request (missing/invalid parameters)
- **401** - Unauthorized (authentication required)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **405** - Method Not Allowed (wrong HTTP method)
- **500** - Internal Server Error (server/database error)

---

<a name="utilities"></a>

## 🛠️ ESSENTIAL UTILITY FUNCTIONS

### 🤖 AI WARNING: Create these utility functions first!

### CORS Headers

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

// Get required query parameter
func getRequiredQueryParam(h http.Event, key string) (string, uint32) {
    value, err := h.Query().Get(key)
    if err != nil {
        h.Write([]byte(fmt.Sprintf("Missing required parameter: %s", key)))
        h.Return(400)
        return "", 1
    }
    return value, 0
}
```

### Room Parameters (Multi-tenant Apps)

```go
// Room parameter helper (common in multi-tenant apps)
func getRoomParam(h http.Event) string {
    room, err := h.Query().Get("room")
    if err != nil {
        return "default"
    }
    return room
}

func getRoomParamRequired(h http.Event) (string, uint32) {
    room, err := h.Query().Get("room")
    if err != nil {
        h.Write([]byte(err.Error()))
        h.Return(400)
        return "", 1
    }
    return room, 0
}
```

---

<a name="configuration"></a>

## 🔧 TAUBYTE CONFIGURATION

### Package Structure Options

#### 1. Library Package Structure (Recommended)

```
project/
├── go.mod
├── types.go
├── utils.go
├── database.go
├── pubsub.go
└── [endpoint_files].go
```

**Features:**

- Uses `package lib` in all Go files
- No .taubyte configuration files needed
- Clean library structure
- Direct deployment to Taubyte

#### 2. Traditional .taubyte Structure

```
project/
├── .taubyte/
│   ├── config.yaml
│   └── build.sh
└── your-code/
```

### config.yaml Template

#### For Go Backend Projects

```yaml
version: 1.00
environment:
  image: taubyte/go-wasi:latest
  variables:
workflow:
  - build
```

#### For Node.js Frontend Projects

```yaml
version: 1.00
environment:
  image: node:18.14.1-bullseye
  variables:
workflow:
  - build
```

### build.sh Templates

#### For Go Backend

```bash
#!/bin/bash

. /utils/wasm.sh

build "${FILENAME}"
ret=$?
echo -n $ret > /out/ret-code
exit $ret
```

#### For Node.js Frontend

```bash
#!/bin/bash

npm install
npm run build
mv dist/* /out
exit 0
```

### 🚨 CRITICAL: Required Steps After Setup

#### 1. Correct Go Version and SDK Version

```go
// go.mod - Use correct versions
module function

go 1.19

require github.com/taubyte/go-sdk v0.3.9
```

**❌ WRONG VERSIONS:**

- `go 1.21` (too new)
- `github.com/taubyte/go-sdk v0.4.0` (doesn't exist)
- `module your_project` (should be `module function`)

**✅ CORRECT VERSIONS:**

- `go 1.19`
- `github.com/taubyte/go-sdk v0.3.9`
- `module function`

#### 2. Run go mod tidy

```bash
go mod tidy
```

#### 3. Test Build

```bash
go build .
```

#### 4. Debug Logging (CRITICAL for Production)

**✅ DO include comprehensive debug logging:**

```go
func myFunction(e event.Event) uint32 {
    fmt.Printf("[DEBUG] myFunction called\n")
    h, err := e.HTTP()
    if err != nil {
        fmt.Printf("[ERROR] myFunction HTTP error: %v\n", err)
        return 1
    }
    fmt.Printf("[DEBUG] myFunction processing request\n")
    // ... logic ...
    fmt.Printf("[DEBUG] myFunction completed successfully\n")
    return 0
}
```

---

<a name="ai-mistakes"></a>

## 🤖 COMMON AI MISTAKES

### The Top 10 Mistakes AIs Make with Taubyte

#### 1. Import Errors

**❌ WRONG - AIs often try this:**

```go
import (
    "github.com/gin-gonic/gin"           // WRONG!
    "github.com/gorilla/websocket"       // WRONG!
    "github.com/go-redis/redis"          // WRONG!
    "gorm.io/gorm"                       // WRONG!
)
```

**✅ CORRECT - Use only Taubyte SDK:**

```go
import (
    "github.com/taubyte/go-sdk/event"
    "github.com/taubyte/go-sdk/database"
    pubsub "github.com/taubyte/go-sdk/pubsub/node"
)
```

#### 2. Function Export Mistakes

**❌ WRONG - Missing export comment:**

```go
func myHandler(e event.Event) uint32 {
    // This won't work! Missing //export
}
```

**✅ CORRECT:**

```go
//export myHandler
func myHandler(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1  // Error
    }
    // ... logic ...
    return 0  // Success
}
```

#### 3. HTTP Handling Mistakes

**❌ WRONG - Trying to use standard Go HTTP:**

```go
func handler(w http.ResponseWriter, r *http.Request) {
    // This won't work in Taubyte!
}
```

**✅ CORRECT - Use Taubyte event handling:**

```go
//export myHandler
func myHandler(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }
    setCORSHeaders(h)

    // Your logic here

    return 0
}
```

#### 4. Database Mistakes

**❌ WRONG - Trying to use SQL:**

```go
db.Query("SELECT * FROM users")  // Won't work!
```

**✅ CORRECT - Use Taubyte key-value store:**

```go
db, err := database.New("/users")
if err != nil {
    return 1
}
defer db.Close()

// Store data
err = db.Put("/user/123", userData)
if err != nil {
    return 1
}

// Get data
data, err := db.Get("/user/123")
if err != nil {
    return 1
}
```

#### 5. Pub/Sub Mistakes

**❌ WRONG - Trying to use Socket.io:**

```go
socket.emit("message", data)  // Won't work!
```

**✅ CORRECT - Use Taubyte pub/sub:**

```go
//export publishMessage
func publishMessage(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }

    channelName, err := h.Query().Get("channel")
    if err != nil {
        return 1
    }

    channel, err := pubsub.Channel(channelName)
    if err != nil {
        return 1
    }

    body, err := io.ReadAll(h.Body())
    if err != nil {
        return 1
    }

    err = channel.Publish(body)
    if err != nil {
        return 1
    }

    return 0
}
```

---

<a name="getting-started"></a>

## 🚀 GETTING STARTED GUIDE

### Step 1: Install Dream CLI

```sh
npm i -g @taubyte/dream  # -g installs it globally
```

### Step 2: Start Local Cloud

```sh
dream new multiverse    # Creates and starts a new cloud instance
```

You should see:

```sh
[INFO] Dreamland ready
[SUCCESS] Universe blackhole started!
```

### Step 3: Check Cloud Status

```sh
dream status universe
```

### Step 4: Create a Function

Using the Web Console at [console.taubyte.com](https://console.taubyte.com):

1. Navigate to `Functions` in the side menu
2. Click the `+` button
3. Select a template (e.g., `ping_pong` for Go)
4. Configure domains (use `GeneratedDomain`)
5. Review the code and configuration
6. Click `Done`

### Step 5: Deploy Your Function

1. Click the green button at bottom right
2. Review changes
3. Enter commit message
4. Push to GitHub
5. Run in terminal:
   ```sh
   dream inject push-all
   ```

### Step 6: Test Your Function

1. Get substrate port:

   ```sh
   dream status substrate
   ```

2. Test with curl (replace domain and port):

   ```sh
   curl -H "Host: your-domain.blackhole.localtau" http://127.0.0.1:PORT/ping
   ```

3. Add to `/etc/hosts` for easier testing:
   ```
   127.0.0.1 your-domain.blackhole.localtau
   ```

### Creating a Database

1. Navigate to `Database` in Web Console
2. Click `+` button
3. Set:
   - Name: `example_kv_store`
   - Matcher: `/example/kv`
   - Replication: `min=1, max=2`
   - Size: `100MB`
4. Push changes and run `dream inject push-all`

### Example Database Functions

See the [Database Operations](#database) section for complete examples of:

- Setting a key/value pair (POST)
- Getting a value by key (GET)

---

<a name="resources"></a>

## 📚 OFFICIAL RESOURCES

### Core Resources

- **[Taubyte Go SDK Documentation](https://pkg.go.dev/github.com/taubyte/go-sdk)** - Official Go package documentation
- **[Taubyte Official Documentation](https://tau.how)** - Complete platform documentation
- **[Taubyte GitHub Repository](https://github.com/taubyte/go-sdk)** - Source code and examples

### Getting Started

- **[Taubyte Getting Started](https://tau.how/start/01-what-is-taubyte/)** - Introduction to Taubyte
- **[Taubyte Concepts](https://tau.how/docs/welcome/)** - Core concepts and architecture
- **[Taubyte Examples](https://github.com/taubyte/go-sdk/tree/main/examples)** - Code examples

### SDK Packages

- **[Database Package](https://pkg.go.dev/github.com/taubyte/go-sdk/database)** - Database operations
- **[Pub/Sub Package](https://pkg.go.dev/github.com/taubyte/go-sdk/pubsub/node)** - Messaging system
- **[HTTP Package](https://pkg.go.dev/github.com/taubyte/go-sdk/http/event)** - HTTP handling
- **[Storage Package](https://pkg.go.dev/github.com/taubyte/go-sdk/storage)** - File storage
- **[P2P Package](https://pkg.go.dev/github.com/taubyte/go-sdk/p2p/node)** - Peer-to-peer networking
- **[IPFS Package](https://pkg.go.dev/github.com/taubyte/go-sdk/ipfs/client)** - IPFS integration

### Community

- **[Taubyte Discord](https://discord.gg/taubyte)** - Community support
- **[Taubyte GitHub Discussions](https://github.com/taubyte/go-sdk/discussions)** - Q&A and discussions
- **[Taubyte Blog](https://tau.how/blog/)** - Latest news and updates

---

## 🎯 QUICK DECISION TREE

**"I need to create..."**

- **HTTP endpoint** → See [HTTP Handling](#http-handling) + [Utilities](#utilities)
- **REST API** → See [REST API Templates](#rest-api)
- **Database function** → See [Database Operations](#database)
- **Real-time messaging** → See [Pub/Sub Messaging](#pubsub)
- **Project setup** → See [Configuration](#configuration)

**"I'm getting errors..."**

- **Import errors** → See [Imports & Setup](#imports-setup)
- **Export errors** → See [Function Export Patterns](#function-export)
- **HTTP errors** → See [Error Handling](#error-handling)
- **Database errors** → See [Database Operations](#database)
- **AI-specific errors** → See [Common AI Mistakes](#ai-mistakes)

**"I want to understand..."**

- **What Taubyte is** → See [Architecture Overview](#architecture)
- **Best practices** → See [Critical Rules](#critical-rules)

---

## 📞 REMEMBER

- **ALWAYS** use Taubyte SDK packages
- **ALWAYS** export functions with `//export`
- **ALWAYS** use Taubyte's built-in services
- **NEVER** use external frameworks
- **NEVER** reinvent the wheel - use Taubyte's capabilities

---

_This guide consolidates both the agents.doc-main folder (newest, most accurate) and official docs folder for comprehensive Taubyte development reference._
