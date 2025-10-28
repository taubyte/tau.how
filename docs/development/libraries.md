# Libraries

Libraries in Taubyte allow you to move serverless function code outside of the main code repository, enabling code sharing, better organization, and granular access control. Each library has its own repository and can be used either as a source for functions or as a dependency.

## Library Benefits

### Code Organization

- **Modular Architecture**: Separate concerns into focused libraries
- **Reusability**: Share code across multiple functions and projects
- **Maintainability**: Update library code independently
- **Version Control**: Independent versioning for different components

### Access Control

- **Granular Permissions**: Libraries have their own repositories with separate access control
- **Team Collaboration**: Different teams can maintain different libraries
- **Security**: Isolate sensitive code in separate repositories
- **Audit Trail**: Track changes to shared code independently

### Development Workflow

- **IDE Support**: Edit library code in VSCode or other editors
- **Local Testing**: Test libraries independently
- **CI/CD Integration**: Separate build and deployment pipelines
- **Dependency Management**: Clear dependency relationships

## Creating Libraries

### Using the Web Console

1. Navigate to the `Libraries` tab in the left sidebar and click `+`

![](/images/webconsole-new-library.png)

2. Configure your library:
   - **Name**: Choose a descriptive name for your library
   - **Repository**: Select `Generate` to create a new repository
   - **Template**: Choose from available templates (currently one template available)

![](/images/webconsole-new-library-modal.png)

> 💡 **Note**: If you want to import an existing library, click on `--Generate--` and select the library you want to import.

3. Click `Generate` to create the repository and populate it with template code

![](/images/webconsole-new-library-modal-template-select.png)

4. Push the configuration changes and note the repository details

![](/images/webconsole-new-library-listed-push-1.png)

**Important**: Save the GitHub repository ID and fullname for later use:

- Repository ID: e.g., `905452907`
- Fullname: e.g., `taubyte0/tb_library_tauhow_example_library`

### Library Structure

A typical library repository contains:

```
library-repo/
├── go.mod          # Go module definition
├── go.sum          # Dependency checksums
├── lib.go          # Main library code
└── .taubyte/       # Build configuration
    ├── config.yaml
    └── build.sh
```

## Using Libraries

Libraries can be used in two different ways:

### 1. Library as Function Source

Use the entire library as the source for a function.

#### Configure Function to Use Library

1. Create a new function
2. Click `Select a source` and choose your library
3. Set the entry point to match your library's exported function

![](/images/webconsole-new-library-new-func-modal-sel-lib.png)

#### Example Library Code

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

#### Deploy and Test

```bash
# Build the library
dream inject push-specific -u blackhole \
-rid 905452907 \
-fn taubyte0/tb_library_tauhow_example_library

# Build the configuration
dream inject push-all
```

### 2. Library as Dependency

Import specific functions from a library into your function code.

#### Library Code for Dependencies

Add exportable functions to your library:

```go
package lib

// Mathematical operations library
//export add
func add(a, b uint32) uint64 {
    return uint64(a) + uint64(b)
}

//export multiply
func multiply(a, b uint32) uint64 {
    return uint64(a) * uint64(b)
}

//export divide
func divide(a, b uint32) uint64 {
    if b == 0 {
        return 0
    }
    return uint64(a) / uint64(b)
}
```

#### Function Using Library Dependency

```go
package lib

import (
    "fmt"
    "strconv"
    "github.com/taubyte/go-sdk/event"
    http "github.com/taubyte/go-sdk/http/event"
)

// Import functions from the library
//go:wasmimport libraries/tauhow_example_library add
func add(a, b uint32) uint64

//go:wasmimport libraries/tauhow_example_library multiply
func multiply(a, b uint32) uint64

func getQueryVarAsUint32(h http.Event, varName string) uint32 {
    varStr, err := h.Query().Get(varName)
    if err != nil {
        panic(err)
    }

    varUint, err := strconv.ParseUint(varStr, 10, 32)
    if err != nil {
        panic(err)
    }

    return uint32(varUint)
}

//export calculate
func calculate(e event.Event) uint32 {
    h, err := e.HTTP()
    if err != nil {
        return 1
    }

    // Get operation type from query
    operation, err := h.Query().Get("op")
    if err != nil {
        h.Write([]byte("Missing operation parameter"))
        h.Return(400)
        return 1
    }

    // Get operands from query
    a := getQueryVarAsUint32(h, "a")
    b := getQueryVarAsUint32(h, "b")

    var result uint64
    switch operation {
    case "add":
        result = add(a, b)
    case "multiply":
        result = multiply(a, b)
    default:
        h.Write([]byte("Unsupported operation"))
        h.Return(400)
        return 1
    }

    // Return the result
    h.Write([]byte(fmt.Sprintf("%d", result)))
    h.Return(200)
    return 0
}
```

#### Library Resolution

The import path `libraries/<library_name>` is resolved:

1. Within the context of the application (if function is in an application)
2. Globally within the project

> 💡 **Note**: In the example, the function is global, so the library is resolved globally.

## Advanced Library Patterns

### Utility Libraries

Create libraries for common operations:

```go
package lib

import (
    "crypto/sha256"
    "encoding/hex"
    "time"
)

//export hashString
func hashString(input []byte) []byte {
    hash := sha256.Sum256(input)
    return []byte(hex.EncodeToString(hash[:]))
}

//export getCurrentTimestamp
func getCurrentTimestamp() uint64 {
    return uint64(time.Now().Unix())
}

//export validateEmail
func validateEmail(email []byte) uint32 {
    emailStr := string(email)
    // Simple email validation
    if len(emailStr) > 0 && strings.Contains(emailStr, "@") {
        return 1 // valid
    }
    return 0 // invalid
}
```

### Database Helper Libraries

```go
package lib

import (
    "encoding/json"
    "fmt"
    "github.com/taubyte/go-sdk/database"
)

//export saveUser
func saveUser(userID []byte, userData []byte) uint32 {
    db, err := database.New("/users")
    if err != nil {
        return 0 // error
    }
    defer db.Close()

    key := fmt.Sprintf("/profile/%s", string(userID))
    err = db.Put(key, userData)
    if err != nil {
        return 0 // error
    }

    return 1 // success
}

//export getUser
func getUser(userID []byte) []byte {
    db, err := database.New("/users")
    if err != nil {
        return nil
    }
    defer db.Close()

    key := fmt.Sprintf("/profile/%s", string(userID))
    data, err := db.Get(key)
    if err != nil {
        return nil
    }

    return data
}
```

### HTTP Helper Libraries

```go
package lib

import (
    "encoding/json"
    "fmt"
)

//export sendJSONResponse
func sendJSONResponse(data []byte, statusCode uint32) []byte {
    response := map[string]interface{}{
        "data": json.RawMessage(data),
        "status": statusCode,
        "timestamp": time.Now().Unix(),
    }

    jsonData, _ := json.Marshal(response)
    return jsonData
}

//export sendErrorResponse
func sendErrorResponse(errorMessage []byte, statusCode uint32) []byte {
    response := map[string]interface{}{
        "error": string(errorMessage),
        "status": statusCode,
        "timestamp": time.Now().Unix(),
    }

    jsonData, _ := json.Marshal(response)
    return jsonData
}
```

## Library Management

### Version Control

Libraries follow standard Git practices:

```bash
# Tag versions for stable releases
git tag v1.0.0
git push origin v1.0.0

# Use semantic versioning
# v1.0.0 - Initial release
# v1.1.0 - New features (backwards compatible)
# v2.0.0 - Breaking changes
```

### Dependency Updates

When updating libraries:

1. **Test Changes**: Ensure library changes don't break existing functions
2. **Version Appropriately**: Use semantic versioning for compatibility
3. **Document Changes**: Maintain changelog for breaking changes
4. **Gradual Rollout**: Update functions incrementally

### Build Process

```bash
# Build specific library
dream inject push-specific \
--rid <repository-id> \
--fn <github-fullname>

# Build all configurations
dream inject push-all
```

## Testing Libraries

### Unit Testing

```go
// library_test.go
package lib

import (
    "testing"
)

func TestAdd(t *testing.T) {
    result := add(5, 3)
    expected := uint64(8)

    if result != expected {
        t.Errorf("Expected %d, got %d", expected, result)
    }
}

func TestMultiply(t *testing.T) {
    result := multiply(4, 6)
    expected := uint64(24)

    if result != expected {
        t.Errorf("Expected %d, got %d", expected, result)
    }
}
```

### Integration Testing

Test library functions within the Taubyte environment:

```go
func testLibraryIntegration() {
    // Test library function calls
    result := add(10, 20)
    assert.Equal(uint64(30), result)

    // Test with database operations
    userID := []byte("test123")
    userData := []byte(`{"name": "Test User"}`)

    success := saveUser(userID, userData)
    assert.Equal(uint32(1), success)

    retrieved := getUser(userID)
    assert.Equal(userData, retrieved)
}
```

## Best Practices

### Library Design

- **Single Responsibility**: Each library should have a focused purpose
- **Clear Interfaces**: Export functions with clear, predictable signatures
- **Error Handling**: Return meaningful error codes or status values
- **Documentation**: Comment exported functions thoroughly

### Function Signatures

- **Use Simple Types**: Prefer primitive types for WASM compatibility
- **Consistent Patterns**: Use similar patterns across library functions
- **Avoid Complex Types**: Stick to bytes, numbers, and simple structures
- **Return Codes**: Use return codes to indicate success/failure

### Development Workflow

- **Version Control**: Use Git tags for releases
- **Testing**: Write comprehensive tests for library functions
- **Code Review**: Review library changes carefully (they affect multiple functions)
- **Documentation**: Maintain clear usage documentation

### Performance

- **Optimize Hot Paths**: Profile and optimize frequently called functions
- **Memory Efficiency**: Minimize memory allocations in library functions
- **Batch Operations**: Group related operations where possible
- **Cache Results**: Cache expensive computations when appropriate

## Troubleshooting

### Common Issues

**Import errors:**

- Verify library name matches exactly in import path
- Check that library is built and deployed
- Ensure function signatures match import declarations

**Build failures:**

- Check library Go module configuration
- Verify all dependencies are available
- Review build logs for specific errors

**Runtime errors:**

- Validate function signatures match between import and export
- Check for proper error handling in library functions
- Verify library is accessible from function context

Libraries provide a powerful way to organize, share, and maintain code in Taubyte applications, enabling better architecture and team collaboration.
