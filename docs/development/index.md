# Development

<!-- Source: Development section overview -->

This section covers everything you need to know about building applications on Taubyte. From creating projects to deploying complex distributed systems, you'll learn how to leverage Taubyte's capabilities to build scalable, reliable applications.

## Development Philosophy

Taubyte's development approach is designed around:

- **Simplicity**: Focus on your application logic, not infrastructure
- **Local Development**: Test everything locally before deploying
- **Git-Native Workflows**: Use familiar Git operations for deployment
- **Serverless-First**: Build with automatic scaling in mind

## What You Can Build

With Taubyte, you can create:

- **Serverless Functions**: HTTP APIs, WebSocket handlers, event processors
- **Static Websites**: Single-page applications, documentation sites, blogs
- **Real-time Applications**: Chat systems, live dashboards, collaborative tools
- **Data Applications**: APIs with integrated databases and file storage
- **Microservices**: Distributed systems with messaging and coordination

## Core Resources

### Compute

- **Functions**: WebAssembly-based serverless functions
- **Websites**: Static site hosting with global distribution

### Storage

- **Databases**: Distributed key-value storage
- **Storage**: Object storage for files and media

### Communication

- **Messaging**: Pub/Sub systems for real-time communication

### Organization

- **Projects**: Top-level containers for all resources
- **Libraries**: Shared code and utilities
- **Applications**: Logical grouping of related resources

## Development Workflow

1. **Create Project** - Set up your project structure and repositories
2. **Develop Locally** - Use Dream CLI for local development and testing
3. **Build Resources** - Create functions, websites, databases as needed
4. **Test Integration** - Verify all components work together
5. **Deploy** - Push to Git to trigger automatic deployment

## Sections

1. **[Projects](projects.md)** - Creating and organizing projects
2. **[Functions](functions.md)** - Building serverless functions
3. **[Websites](websites.md)** - Hosting static websites
4. **[Databases](databases.md)** - Using key-value storage
5. **[Storage](storage.md)** - Managing files and objects
6. **[Messaging](messaging.md)** - Real-time communication
7. **[Libraries](libraries.md)** - Code organization and reuse

## Best Practices

- **Start Simple**: Begin with basic functions and expand gradually
- **Test Locally**: Always test in your local Dream environment first
- **Use Libraries**: Share common code across functions
- **Monitor Performance**: Keep functions lightweight and fast
- **Handle Errors**: Implement robust error handling and logging

Ready to start building? Let's create your first project!
