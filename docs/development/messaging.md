# Messaging (Pub/Sub)

<!-- Source: docs-old/01-dev-getting-started/07-create-and-use-messaging.md -->

Taubyte provides a built-in publish-subscribe messaging system for real-time communication between functions, WebSocket connections, and external clients. This enables building real-time applications like chat systems, notifications, live updates, and event-driven architectures.

## Messaging Characteristics

### Publish-Subscribe Model

- **Decoupled Communication**: Publishers and subscribers don't need to know about each other
- **Many-to-Many**: Multiple publishers can send to multiple subscribers
- **Event-Driven**: Perfect for reactive architectures
- **Real-Time**: Low-latency message delivery

### WebSocket Integration

- **Automatic WebSocket URLs**: Get WebSocket endpoints for channels
- **Bidirectional Communication**: Send and receive messages in real-time
- **Connection Management**: Automatic handling of connections and subscriptions
- **Cross-Platform**: Works with any WebSocket client

### Distributed Architecture

- **Global Distribution**: Messages delivered worldwide
- **High Availability**: Continues operating despite node failures
- **Scalable**: Handles thousands of concurrent connections
- **Reliable Delivery**: Messages delivered to all active subscribers

## Creating Messaging Channels

### Using the Web Console

1. Navigate to `Messaging` in the side menu and click the `+` button

![](../images/webconsole-dreamland-create-new-messaging.png)

2. Configure your messaging channel:
   - **Name**: `ws_chan` (descriptive name)
   - **Topic Matcher**: `/ws/chan` (pattern for channel access)
   - **WebSocket**: Toggle enabled for WebSocket support

![](../images/webconsole-dreamland-create-new-messaging-modal.png)

3. Push the configuration changes

![](../images/webconsole-dreamland-create-new-messaging-push-done.png)

### Messaging Configuration

Messaging channels are configured through YAML:

```yaml
id: ""
description: Real-time messaging channel
tags: []
matcher: /ws/chan
websocket: true
```

#### Configuration Options

**Matcher Patterns:**

- **Simple Path**: `/ws/chan` - Single channel
- **Regex Pattern**: `/chat/[^/]+` - Channel per room/topic
- **Wildcard**: `/notifications/*` - Multiple isolated channels

**WebSocket Support:**

- Enable for browser-based real-time applications
- Provides automatic WebSocket URL generation
- Handles connection lifecycle management

## Using Messaging

### Basic Operations

#### Creating/Opening a Channel

```go
import pubsub "github.com/taubyte/go-sdk/pubsub/node"

// Open or create a channel
channel, err := pubsub.Channel("chat-room-1")
if err != nil {
    return handleError(err)
}
```

#### Publishing Messages

```go
// Publish a message to the channel
message := []byte("Hello, World!")
err = channel.Publish(message)
if err != nil {
    return handleError(err)
}
```

#### Subscribing to Messages

```go
// Subscribe to channel (usually done automatically)
err = channel.Subscribe()
if err != nil {
    return handleError(err)
}
```

#### Getting WebSocket URLs

```go
// Get WebSocket URL for real-time connections
url, err := channel.WebSocket().Url()
if err != nil {
    return handleError(err)
}
websocketPath := url.Path
```

## Complete Examples

### WebSocket URL Generator

```go
package lib

import (
    "crypto/md5"
    "encoding/hex"
    "encoding/json"
    "fmt"
    "github.com/taubyte/go-sdk/event"
    http "github.com/taubyte/go-sdk/http/event"
    pubsub "github.com/taubyte/go-sdk/pubsub/node"
)

func handleError(h http.Event, err error, code int) uint32 {
    h.Write([]byte(err.Error()))
    h.Return(code)
    return 1
}

//export getWebSocketURL
func getWebSocketURL(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }

    // Get room from query parameter
    room, err := h.Query().Get("room")
    if err != nil {
        return handleError(h, err, 400)
    }

    // Hash the room name to create a unique channel
    hash := md5.New()
    hash.Write([]byte(room))
    roomHash := hex.EncodeToString(hash.Sum(nil))

    // Create or open channel with hashed name
    channelName := fmt.Sprintf("chat-%s", roomHash)
    channel, err := pubsub.Channel(channelName)
    if err != nil {
        return handleError(h, err, 500)
    }

    // Subscribe to the channel
    err = channel.Subscribe()
    if err != nil {
        return handleError(h, err, 500)
    }

    // Get WebSocket URL
    url, err := channel.WebSocket().Url()
    if err != nil {
        return handleError(h, err, 500)
    }

    // Return WebSocket URL as JSON
    response := map[string]string{
        "websocket_url": url.Path,
        "channel": channelName,
        "room": room,
    }

    responseData, _ := json.Marshal(response)
    h.Headers().Set("Content-Type", "application/json")
    h.Write(responseData)
    h.Return(200)
    return 0
}
```

### Message Publisher

```go
//export publishMessage
func publishMessage(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }

    // Get channel name from query
    channelName, err := h.Query().Get("channel")
    if err != nil {
        return handleError(h, err, 400)
    }

    // Read message from request body
    messageData, err := io.ReadAll(h.Body())
    if err != nil {
        return handleError(h, err, 400)
    }

    // Open channel
    channel, err := pubsub.Channel(channelName)
    if err != nil {
        return handleError(h, err, 500)
    }

    // Publish message
    err = channel.Publish(messageData)
    if err != nil {
        return handleError(h, err, 500)
    }

    // Return success response
    response := map[string]string{
        "status": "published",
        "channel": channelName,
    }

    responseData, _ := json.Marshal(response)
    h.Headers().Set("Content-Type", "application/json")
    h.Write(responseData)
    h.Return(200)
    return 0
}
```

### Pub/Sub Event Handler

```go
//export handlePubSubEvent
func handlePubSubEvent(e event.Event) uint32 {
    // Get pub/sub channel from event
    channel, err := e.PubSub()
    if err != nil {
        return 1
    }

    // Get message data
    data, err := channel.Data()
    if err != nil {
        return 1
    }

    // Process the message
    var message map[string]interface{}
    err = json.Unmarshal(data, &message)
    if err != nil {
        fmt.Printf("Received raw message: %s\n", string(data))
        return 0
    }

    // Handle different message types
    messageType, exists := message["type"]
    if !exists {
        fmt.Printf("Received message without type: %v\n", message)
        return 0
    }

    switch messageType {
    case "chat":
        handleChatMessage(message)
    case "notification":
        handleNotification(message)
    case "system":
        handleSystemMessage(message)
    default:
        fmt.Printf("Unknown message type: %s\n", messageType)
    }

    return 0
}

func handleChatMessage(message map[string]interface{}) {
    user := message["user"].(string)
    text := message["text"].(string)
    fmt.Printf("Chat from %s: %s\n", user, text)

    // Could forward to other channels, store in database, etc.
}
```

## Real-Time Application Patterns

### Chat System

#### Backend Functions

```go
// Room management
//export createChatRoom
func createChatRoom(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }

    room, err := h.Query().Get("room")
    if err != nil {
        return handleError(h, err, 400)
    }

    // Create room channel
    channelName := fmt.Sprintf("chat-room-%s", room)
    channel, err := pubsub.Channel(channelName)
    if err != nil {
        return handleError(h, err, 500)
    }

    // Subscribe to room
    err = channel.Subscribe()
    if err != nil {
        return handleError(h, err, 500)
    }

    // Get WebSocket URL for the room
    url, err := channel.WebSocket().Url()
    if err != nil {
        return handleError(h, err, 500)
    }

    response := map[string]string{
        "room": room,
        "channel": channelName,
        "websocket_url": url.Path,
    }

    responseData, _ := json.Marshal(response)
    h.Write(responseData)
    return 0
}

// Send message to room
//export sendChatMessage
func sendChatMessage(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }

    room, err := h.Query().Get("room")
    if err != nil {
        return handleError(h, err, 400)
    }

    var messageData struct {
        User string `json:"user"`
        Text string `json:"text"`
        Time int64  `json:"timestamp"`
    }

    decoder := json.NewDecoder(h.Body())
    err = decoder.Decode(&messageData)
    if err != nil {
        return handleError(h, err, 400)
    }

    // Add timestamp
    messageData.Time = time.Now().Unix()

    // Publish to room channel
    channelName := fmt.Sprintf("chat-room-%s", room)
    channel, err := pubsub.Channel(channelName)
    if err != nil {
        return handleError(h, err, 500)
    }

    messageJSON, _ := json.Marshal(messageData)
    err = channel.Publish(messageJSON)
    if err != nil {
        return handleError(h, err, 500)
    }

    h.Write([]byte("Message sent"))
    return 0
}
```

#### Frontend Integration

```javascript
// Get WebSocket URL for room
async function joinRoom(roomName) {
  const response = await fetch(`/api/chat/join?room=${roomName}`);
  const data = await response.json();

  // Connect to WebSocket
  const ws = new WebSocket(`ws://localhost:PORT${data.websocket_url}`);

  ws.onmessage = function (event) {
    const message = JSON.parse(event.data);
    displayMessage(message);
  };

  ws.onopen = function () {
    console.log("Connected to chat room:", roomName);
  };

  return ws;
}

// Send message to room
async function sendMessage(room, user, text) {
  await fetch(`/api/chat/send?room=${room}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: user,
      text: text,
    }),
  });
}
```

### Notification System

```go
//export sendNotification
func sendNotification(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }

    // Get user ID from query
    userID, err := h.Query().Get("user")
    if err != nil {
        return handleError(h, err, 400)
    }

    // Parse notification data
    var notification struct {
        Title   string `json:"title"`
        Message string `json:"message"`
        Type    string `json:"type"`
        Time    int64  `json:"timestamp"`
    }

    decoder := json.NewDecoder(h.Body())
    err = decoder.Decode(&notification)
    if err != nil {
        return handleError(h, err, 400)
    }

    // Add timestamp
    notification.Time = time.Now().Unix()

    // Send to user-specific notification channel
    channelName := fmt.Sprintf("notifications-%s", userID)
    channel, err := pubsub.Channel(channelName)
    if err != nil {
        return handleError(h, err, 500)
    }

    notificationJSON, _ := json.Marshal(notification)
    err = channel.Publish(notificationJSON)
    if err != nil {
        return handleError(h, err, 500)
    }

    h.Write([]byte("Notification sent"))
    return 0
}
```

### Live Data Updates

```go
//export broadcastUpdate
func broadcastUpdate(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }

    // Get update data
    updateData, err := io.ReadAll(h.Body())
    if err != nil {
        return handleError(h, err, 400)
    }

    // Broadcast to all subscribers of live updates
    channel, err := pubsub.Channel("live-updates")
    if err != nil {
        return handleError(h, err, 500)
    }

    err = channel.Publish(updateData)
    if err != nil {
        return handleError(h, err, 500)
    }

    h.Write([]byte("Update broadcasted"))
    return 0
}
```

## Testing Messaging

### Using wscat

Install wscat for WebSocket testing:

```bash
npm install -g wscat
```

Test WebSocket connection:

```bash
# Get WebSocket URL
curl "http://localhost:PORT/api/websocket?room=test"

# Connect to WebSocket (replace with actual URL)
wscat -c "ws://localhost:PORT/ws-<ID>/chat-<HASH>"
```

### Testing Publishers

```bash
# Publish a message
curl -X POST "http://localhost:PORT/api/publish?channel=test-channel" \
  -H "Content-Type: application/json" \
  -d '{"type": "test", "message": "Hello, World!"}'
```

### Integration Testing

```go
func testMessaging() {
    // Test channel creation
    channel, err := pubsub.Channel("test-channel")
    assert.NoError(err)

    // Test subscription
    err = channel.Subscribe()
    assert.NoError(err)

    // Test publishing
    testMessage := []byte("test message")
    err = channel.Publish(testMessage)
    assert.NoError(err)

    // Test WebSocket URL generation
    url, err := channel.WebSocket().Url()
    assert.NoError(err)
    assert.NotEmpty(url.Path)
}
```

## Best Practices

### Channel Design

- **Use meaningful names**: `chat-room-general` vs `channel1`
- **Implement namespacing**: `app:chat:room:123` for organization
- **Plan for scaling**: Consider channel per tenant/user patterns
- **Use hashing for dynamic channels**: Avoid conflicts with deterministic naming

### Message Format

- **Use JSON**: For structured, parseable messages
- **Include metadata**: Timestamp, sender, message type
- **Version your messages**: Plan for schema evolution
- **Keep messages small**: For better performance

### Error Handling

- **Handle connection failures**: Implement reconnection logic
- **Validate message format**: Parse and validate incoming messages
- **Implement timeouts**: Don't wait indefinitely for responses
- **Log messaging activity**: For debugging and monitoring

### Security

- **Validate subscribers**: Ensure only authorized users can subscribe
- **Sanitize messages**: Prevent XSS and injection attacks
- **Implement rate limiting**: Prevent message spam
- **Use secure connections**: WSS for production WebSocket connections

## Troubleshooting

### Common Issues

**WebSocket connection failures:**

- Verify WebSocket URL is correctly generated
- Check network connectivity and firewall rules
- Ensure proper CORS headers for browser connections

**Messages not delivered:**

- Verify channel names match between publisher and subscriber
- Check subscription status
- Monitor for network partitions

**Performance issues:**

- Limit message size for better throughput
- Implement message batching for high-frequency updates
- Monitor connection counts and resource usage

Messaging in Taubyte provides a powerful foundation for building real-time, event-driven applications with automatic scaling and global distribution.
