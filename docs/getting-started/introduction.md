# Introduction to Taubyte

<!-- Sources: Based on official Taubyte documentation and platform architecture -->

> **Note**: Taubyte is built from the ground up and does not depend on Kubernetes. We wanted something that doesn't carry the baggage of traditional cloud platforms.

Taubyte's goal is `Local Development = Global Production`. This means:

- **Great Developer Experience**: Developers should be self-serving with tools to build locally, plus abstractions for code to scale globally
- **Scalability**: Should scale both horizontally and vertically without complex code and configuration
- **Security**: Encryption and restricted/contained execution are core principles. All communication is encrypted, node identity and content is verified, and secure execution runtimes are preferred

## What is Taubyte?

Taubyte is an open-source, Git-native cloud computing platform that enables developers to build and maintain highly scalable cloud infrastructure with minimal configuration. It serves as an alternative to traditional cloud platforms like Vercel, Netlify, Cloudflare, and AWS services.

## Core Capabilities

<!-- Source: https://tau.how/02-platform-getting-started/00-what-is-taubyte/ -->

As of now, these cloud computing capabilities are available:

- **Serverless Functions** - WebAssembly functions with automatic scaling
- **Website Hosting** - Static site hosting with global distribution
- **Key/Value Databases** - Distributed storage with automatic replication
- **Object Storage** - File storage with content addressing
- **Messaging (Pub/Sub)** - Real-time messaging with WebSocket support
- **CI/CD** - Git-native deployment pipelines

> **Note**: We are working on adding more capabilities like unikernels, containers, and more to the platform.

## Key Features

### For Developers

- **Git-Native**: Infrastructure changes through Git, with branch-based environments
- **Local Development**: Test locally with the same environment as production
- **P2P Architecture**: Secure peer-to-peer communication with automatic discovery
- **Advanced Storage**: Content-addressed system with automatic deduplication
- **Computing**: WebAssembly execution with edge capabilities
- **Security**: Zero-configuration HTTPS/TLS with automatic certificate management

### For Platform Engineers

- **Simple Deployment**: Single binary deployment with minimal configuration
- **Ready to Use**: Immediate developer access via Web Console, CLI, or manual configuration
- **Flexible Environments**: Create new environments by pointing nodes to different branches

## Benefits

- **Minimal Configuration**: Auto-discovery eliminates complex setup
- **Development Parity**: Local development matches production exactly
- **Highly Scalable**: Distributed architecture scales automatically
- **No Vendor Lock-in**: Open source with standard technologies
- **Easy Maintenance**: Simple operations with powerful capabilities

## Next Steps

Ready to get started? Continue to [Installation](installation.md) to set up your development environment.
