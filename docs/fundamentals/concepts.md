# Key Concepts

<!-- Source: https://tau.how/fundamentals/concepts/ - Key concepts and principles -->

Understanding Taubyte's core concepts will help you make the most of the platform. These principles guide how Taubyte works and why it's designed the way it is.

## Git-Native Development

Taubyte is fundamentally Git-native, meaning your infrastructure is defined and managed through Git repositories.

### How It Works

- **Infrastructure as Code**: All configuration is stored in YAML files in Git repositories
- **Branch-Based Environments**: Different Git branches can represent different environments (dev, staging, prod)
- **Automatic Deployment**: Push to Git triggers automatic builds and deployments
- **Version Control**: Full history and rollback capabilities through Git

### Benefits

- Familiar workflow for developers
- Complete audit trail of changes
- Easy collaboration through pull requests
- Instant environment creation by branching

## Local Development = Global Production

One of Taubyte's core principles is that your local development environment should be identical to production.

### What This Means

- **Same Runtime**: Local functions run in the same WebAssembly environment as production
- **Same Services**: Database, storage, and messaging work identically locally and in production
- **Same Configuration**: YAML configs work the same everywhere
- **Same Performance**: No surprises when deploying to production

### Implementation

- Use `dream` to run a complete Taubyte cloud locally
- Test all functionality offline
- Deploy with confidence knowing it will work in production

## Peer-to-Peer Architecture

Taubyte uses a distributed peer-to-peer network instead of centralized servers.

### Network Structure

- **No Central Authority**: No single point of failure
- **Self-Organizing**: Nodes discover and connect to each other automatically
- **Resilient**: Network continues operating even if some nodes fail
- **Scalable**: Adding more nodes increases capacity automatically

### Node Communication

- **Encrypted**: All communication is secure by default
- **Authenticated**: Node identities are verified
- **Efficient**: Multiplexed connections reduce overhead

## Content-Addressed Storage

Taubyte uses content-addressed storage where data is identified by its content, not its location.

### How It Works

- **Content Hashing**: Each piece of data gets a unique hash based on its content
- **Automatic Deduplication**: Identical content is stored only once
- **Distributed**: Data is replicated across multiple nodes for availability
- **Integrity**: Content can be verified against its hash

### Benefits

- Efficient storage utilization
- Data integrity guarantees
- Fast content distribution
- Automatic backup and redundancy

## Serverless-First Design

Taubyte is designed around serverless principles from the ground up.

### Function Characteristics

- **WebAssembly**: Functions compile to WASM for security and performance
- **Event-Driven**: Functions respond to HTTP, WebSocket, Pub/Sub, and timer events
- **Stateless**: Functions don't maintain state between invocations
- **Auto-Scaling**: Automatic scaling based on demand
- **Cold Start Optimization**: Fast startup times for better performance

### Resource Management

- **Automatic**: No need to provision or manage servers
- **Efficient**: Resources allocated only when needed
- **Elastic**: Scales from zero to high load automatically

## WebAssembly Runtime

All functions in Taubyte run in WebAssembly (WASM) for security and performance.

### Advantages

- **Security**: Sandboxed execution environment
- **Performance**: Near-native execution speed
- **Portability**: Runs identically across different architectures
- **Language Support**: Multiple programming languages compile to WASM
- **Small Size**: Compact binaries for fast distribution

### Compilation Process

- Functions written in Go (and other languages)
- Compiled to WebAssembly using TinyGo
- Deployed and executed in WASM runtime
- SDK provides optimized interfaces to platform services

## Event-Driven Architecture

Taubyte uses events to trigger function execution and coordinate services.

### Event Types

- **HTTP Events**: Traditional web requests
- **WebSocket Events**: Real-time bidirectional communication
- **Pub/Sub Events**: Asynchronous message processing
- **Timer Events**: Scheduled or recurring execution
- **Storage Events**: File system change notifications

### Event Flow

1. Event occurs (HTTP request, message published, etc.)
2. Taubyte routes event to appropriate function
3. Function processes event and returns response
4. Response delivered back through the same channel

## Zero-Configuration HTTPS

Taubyte provides automatic HTTPS without manual certificate management.

### Automatic Certificates

- **Let's Encrypt Integration**: Automatic certificate provisioning
- **Renewal**: Certificates renewed before expiration
- **Multi-Domain**: Support for multiple domains and subdomains
- **Wildcard Support**: Automatic wildcard certificate generation

### Security by Default

- All traffic encrypted by default
- Modern TLS protocols and cipher suites
- Perfect Forward Secrecy
- HSTS headers automatically included

## Branch-Based Environments

Create isolated environments by pointing nodes to different Git branches.

### Environment Management

- **Development**: Point to `develop` branch
- **Staging**: Point to `staging` branch
- **Production**: Point to `main` branch
- **Feature Testing**: Point to feature branches

### Benefits

- Complete environment isolation
- Safe testing of changes
- Easy rollbacks through Git
- Parallel development workflows

## Distributed Consensus

Taubyte uses CRDTs (Conflict-free Replicated Data Types) for distributed state management.

### CRDT Benefits

- **Eventual Consistency**: All replicas eventually converge to the same state
- **Partition Tolerance**: Works even when network is split
- **High Availability**: No single point of failure
- **Performance**: No need for coordination between replicas

### Use Cases in Taubyte

- Service discovery and registration
- Configuration distribution
- Authentication state
- Resource allocation

These concepts work together to create a platform that is secure, scalable, and developer-friendly while maintaining operational simplicity.
