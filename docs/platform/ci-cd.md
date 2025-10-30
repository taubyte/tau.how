# CI/CD

<!-- Source: docs-old/01-dev-getting-started/10-cicd.md -->

Taubyte has a built-in CI/CD system that automatically builds and deploys your applications when you push changes to monitored Git branches. The build process is entirely defined through the `.taubyte` folder in your codebase.

## How It Works

### Automatic Triggers

- Push events to monitored branches trigger builds
- Different branches can target different environments
- Builds execute in isolated containers
- Successful builds automatically deploy to the target environment

### Build Architecture

The CI/CD system consists of two main services:

- **Patrick**: Listens for Git events and orchestrates build jobs
- **Monkey**: Competes for and executes build jobs

## The `.taubyte` Folder

Every deployable component (functions, websites, libraries) contains a `.taubyte` folder that defines its build process.

### Folder Structure

```
.taubyte/
├── config.yaml    # Build workflow definition
└── build.sh       # Build execution script
```

### Examples by Type

#### Go Function

```
function-repo/
├── go.mod
├── lib.go
└── .taubyte/
    ├── config.yaml
    └── build.sh
```

#### Rust Function

```
rust-function/
├── Cargo.toml
├── src/
│   └── lib.rs
└── .taubyte/
    ├── config.yaml
    └── build.sh
```

#### Website

```
website-repo/
├── src/
├── package.json
└── .taubyte/
    ├── config.yaml
    └── build.sh
```

## Configuration File (`config.yaml`)

The `config.yaml` file defines the build workflow with a simple syntax:

### Basic Structure

```yaml
version: 1.0
environment:
  image: <docker-image>
  variables:
    - KEY: value
    - ENV: production
workflow:
  - step1
  - step2
  - step3
```

### Configuration Options

#### Environment Section

- **image**: Docker image to use for the build
- **variables**: Environment variables available during build

#### Workflow Section

- **Array of steps**: Each step corresponds to a shell script or command
- **Sequential execution**: Steps run in order
- **Fail-fast**: Build stops on first failure

### Examples by Language

#### Go Function Configuration

```yaml
version: 1.0
environment:
  image: taubyte/go-wasi:latest
  variables:
    - CGO_ENABLED: "0"
    - GOOS: js
    - GOARCH: wasm
workflow:
  - build
```

#### Go Function with Libraries

```yaml
version: 1.0
environment:
  image: taubyte/go-wasi-lib:latest
  variables:
    - CGO_ENABLED: "0"
    - LIBRARY_PATH: "/libraries"
workflow:
  - fetch-libraries
  - build
```

#### Rust Function Configuration

```yaml
version: 1.0
environment:
  image: taubyte/rust-wasi:latest
  variables:
    - CARGO_TARGET_DIR: "/tmp/target"
workflow:
  - build
```

#### Node.js Website Configuration

```yaml
version: 1.0
environment:
  image: node:18.14.1-bullseye
  variables:
    - NODE_ENV: production
    - BUILD_PATH: "/out"
workflow:
  - install
  - test
  - build
```

#### Complex Workflow Example

```yaml
version: 1.0
environment:
  image: node:16.18.0-alpine
  variables:
    - ENV: production
    - API_ENDPOINT: "https://api.example.com"
    - PUBSUB_TOPIC: "notifications"
workflow:
  - setup
  - lint
  - test
  - build
  - package
```

## Build Scripts

Build steps reference shell scripts that perform the actual work. These can be:

1. **Built-in commands** (for standard containers)
2. **Custom shell scripts** in the `.taubyte` folder
3. **Inline commands** in the workflow

### Go Function Build Script

```bash
#!/bin/bash
# build.sh for Go functions

. /utils/wasm.sh

# Build the WebAssembly module
build "${FILENAME}"
ret=$?

# Write return code for the system
echo -n $ret > /out/ret-code
exit $ret
```

### Website Build Script

```bash
#!/bin/bash
# build.sh for websites

# Install dependencies
npm install

# Run tests (optional)
npm test

# Build the site
npm run build

# Move built files to output directory
mv dist/* /out/

exit 0
```

### Custom Build Script Example

```bash
#!/bin/bash
# Custom multi-step build

set -e  # Exit on any error

echo "Starting build process..."

# Setup phase
echo "Installing dependencies..."
npm ci

# Linting phase
echo "Running linter..."
npm run lint

# Testing phase
echo "Running tests..."
npm run test:ci

# Build phase
echo "Building application..."
npm run build

# Package phase
echo "Packaging artifacts..."
tar -czf app.tar.gz dist/

# Move to output
mv dist/* /out/
mv app.tar.gz /out/

echo "Build completed successfully!"
exit 0
```

## Artifacts and Output

### Output Directory

All build artifacts must be placed in the `/out` directory:

- **Functions**: Must produce `/out/main.wasm`
- **Websites**: All static files in `/out/`
- **Libraries**: WebAssembly modules and metadata

### Function Artifacts

For serverless functions, the build must produce:

```
/out/
├── main.wasm       # Required: WebAssembly module
├── ret-code        # Required: Build return code
└── metadata.json   # Optional: Function metadata
```

### Website Artifacts

For websites, place all static assets in `/out/`:

```
/out/
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
└── static/
```

## Provided Build Containers

Taubyte provides optimized containers for common languages:

### Go Containers

#### `taubyte/go-wasi:latest`

- **Purpose**: Standard Go WebAssembly builds
- **Includes**: Go compiler, TinyGo, build utilities
- **Usage**: Most Go functions

#### `taubyte/go-wasi-lib:latest`

- **Purpose**: Go functions using libraries
- **Includes**: Library resolution, dependency management
- **Usage**: Functions that import Taubyte libraries

### Other Language Containers

#### `taubyte/rust-wasi:latest`

- **Purpose**: Rust WebAssembly builds
- **Includes**: Rust toolchain, wasm-pack
- **Usage**: Rust functions

#### `taubyte/assembly-script-wasi:latest`

- **Purpose**: AssemblyScript WebAssembly builds
- **Includes**: AssemblyScript compiler
- **Usage**: AssemblyScript functions

### Standard Containers

You can also use standard Docker Hub containers:

- `node:18.14.1-bullseye` - Node.js applications
- `python:3.9-slim` - Python applications
- `golang:1.19-alpine` - Custom Go builds
- `nginx:alpine` - Static site serving

## Advanced Build Patterns

### Multi-Stage Builds

```yaml
# Complex build with multiple phases
version: 1.0
environment:
  image: node:18-alpine
  variables:
    - NODE_ENV: production
workflow:
  - prepare
  - dependencies
  - lint
  - test
  - build
  - optimize
  - package
```

With corresponding scripts:

```bash
#!/bin/bash
# prepare.sh
apk add --no-cache git curl

#!/bin/bash
# dependencies.sh
npm ci --only=production

#!/bin/bash
# optimize.sh
npm run build:optimize
gzip -9 dist/*.js
```

### Conditional Builds

```bash
#!/bin/bash
# Conditional build based on environment

if [ "$ENV" = "production" ]; then
    echo "Production build"
    npm run build:prod
    npm run optimize
else
    echo "Development build"
    npm run build:dev
fi

mv dist/* /out/
```

### Library Dependencies

For functions using libraries:

```yaml
version: 1.0
environment:
  image: taubyte/go-wasi-lib:latest
  variables:
    - LIBRARY_DEPS: "math-lib,crypto-lib"
workflow:
  - fetch-libs
  - build
```

### Testing Integration

```yaml
version: 1.0
environment:
  image: node:18-alpine
  variables:
    - CI: "true"
workflow:
  - install
  - lint
  - test-unit
  - test-integration
  - build
```

## Environment Variables

### Standard Variables

Available in all builds:

- `FILENAME` - Name of the main source file
- `PROJECT_NAME` - Taubyte project name
- `BRANCH` - Git branch being built
- `COMMIT_SHA` - Git commit hash
- `BUILD_ID` - Unique build identifier

### Custom Variables

Define in `config.yaml`:

```yaml
environment:
  variables:
    - API_URL: "https://api.example.com"
    - BUILD_ENV: "production"
    - FEATURE_FLAGS: "new-ui,analytics"
```

Access in build scripts:

```bash
echo "Building for environment: $BUILD_ENV"
echo "API URL: $API_URL"

if [[ "$FEATURE_FLAGS" == *"new-ui"* ]]; then
    echo "Enabling new UI features"
fi
```

## Monitoring and Debugging

### Build Logs

Monitor build progress through:

1. **Web Console**: Real-time build logs and status
2. **CLI Tools**: Command-line build monitoring
3. **Webhooks**: Programmatic build notifications

### Common Issues

#### Build Failures

```bash
# Check build logs
tau build logs <build-id>

# Retry failed build
tau build retry <build-id>

# Debug build environment
tau build debug <project> --interactive
```

#### Output Issues

```bash
# Verify output directory contents
ls -la /out/

# Check file permissions
chmod +r /out/*

# Validate WebAssembly module
wasm-validate /out/main.wasm
```

### Build Optimization

#### Faster Builds

```yaml
# Use build caching
environment:
  image: node:18-alpine
  variables:
    - NPM_CONFIG_CACHE: "/cache/npm"
    - YARN_CACHE_FOLDER: "/cache/yarn"
```

#### Smaller Artifacts

```bash
#!/bin/bash
# Minimize output size

# Remove development dependencies
npm prune --production

# Compress assets
gzip -9 dist/*.css dist/*.js

# Remove unnecessary files
find /out -name "*.map" -delete
```

## Best Practices

### Configuration Management

- **Version your configs**: Keep `.taubyte` folders in version control
- **Environment-specific configs**: Use variables for environment differences
- **Simple workflows**: Keep build steps focused and simple
- **Fast feedback**: Optimize for quick build times

### Security

- **Minimal containers**: Use smallest possible base images
- **Secret management**: Use environment variables for secrets
- **Dependency scanning**: Regularly update dependencies
- **Build isolation**: Don't persist sensitive data between builds

### Performance

- **Cache dependencies**: Cache package managers when possible
- **Parallel builds**: Design for concurrent execution
- **Incremental builds**: Only build what changed
- **Artifact optimization**: Minimize output size

The built-in CI/CD system makes deploying Taubyte applications simple and reliable, with automatic builds triggered by Git events and standardized build processes across all resource types.
