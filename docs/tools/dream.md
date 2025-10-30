# Dream CLI

<!-- Source: docs-old/02-platform-getting-started/04-dream.md -->

Dream is a development tool that allows you to spin up a complete Taubyte cloud locally on your machine. It provides a perfect development environment that mirrors production behavior while keeping everything isolated and easy to manage.

## What is Dream?

Dream ([github.com/taubyte/dream](https://github.com/taubyte/dream)) creates a local Taubyte cloud instance that includes all the services and capabilities you'd find in production:

- **Complete Cloud Environment**: All Taubyte services running locally
- **Development Isolation**: Safe testing without affecting production
- **Production Parity**: Same runtime environment as production
- **Easy Management**: Simple commands to start, stop, and manage your local cloud

## Installation

Install Dream globally using npm:

```bash
npm i -g @taubyte/dream
```

Verify installation:

```bash
dream --version
```

## Basic Commands

### Start a Local Cloud

```bash
# Start default cloud (main branch)
dream new multiverse

# Start cloud on specific branch
dream new multiverse -b develop

# Start with custom name
dream new multiverse --name my-cloud
```

Expected output:

```
[INFO] Dreamland ready
[SUCCESS] Universe blackhole started!
```

### Check Cloud Status

```bash
# Check overall status
dream status universe

# Check specific service
dream status substrate
dream status auth
dream status tns
```

Example output:

```
┌───────┬─────────────────────┬────────┬───────┐
│ Nodes │ elder@blackhole     │ p2p    │ 14051 │
│       ├─────────────────────┼────────┼───────┤
│       │ tns@blackhole       │ http   │ 14466 │
│       │ substrate@blackhole │ http   │ 14529 │
└───────┴─────────────────────┴────────┴───────┘
```

### Stop the Cloud

```bash
# Stop current cloud
dream stop

# Stop specific cloud by name
dream stop my-cloud
```

## Development Workflow Commands

### Trigger Builds

```bash
# Build all repositories
dream inject push-all

# Build specific repository
dream inject push-specific --rid <repo-id> --fn <github-fullname>
```

### Branch Management

```bash
# List available universes
dream list

# Switch to different branch (requires restart)
dream stop
dream new multiverse -b feature/new-api

# Check current branch
dream status universe
```

### Debug and Monitoring

```bash
# View logs
dream logs

# View logs for specific service
dream logs substrate
dream logs patrick

# Monitor build progress
dream build status
```

## Advanced Usage

### Multi-Universe Management

Run multiple cloud instances simultaneously:

```bash
# Start multiple environments
dream new multiverse -b main --name production-test
dream new multiverse -b develop --name dev-env
dream new multiverse -b feature/api --name feature-test

# List all running universes
dream list

# Switch between universes
dream use production-test
dream use dev-env
```

### Custom Configuration

```bash
# Start with custom configuration
dream new multiverse --config custom-config.yaml

# Use specific ports
dream new multiverse --ports 8080:80,8443:443
```

### Environment Variables

```bash
# Set environment variables for dream
DREAM_LOG_LEVEL=debug dream new multiverse
DREAM_DATA_PATH=/custom/path dream new multiverse
```

## Integration with Web Console

### Console Connection

1. Navigate to [console.taubyte.com](https://console.taubyte.com)
2. Select "Dreamland/blackhole" as your network
3. Login with GitHub to access your local cloud

### Visual Monitoring

The Web Console provides:

- **Network Visualization**: Interactive graph of running services
- **Build Monitoring**: Real-time build logs and status
- **Resource Management**: Create and manage functions, websites, databases
- **Performance Metrics**: Monitor function execution and performance

### Development Workflow

1. **Code in Console**: Use the built-in code editor for quick changes
2. **Local Testing**: Test changes immediately in your local environment
3. **Build Monitoring**: Watch builds complete in real-time
4. **Debugging**: Access detailed logs and error messages

## Common Workflows

### Feature Development

```bash
# 1. Create feature branch environment
dream new multiverse -b feature/user-profiles

# 2. Develop using Web Console
# - Create functions, websites, databases
# - Test functionality locally

# 3. Trigger builds
dream inject push-all

# 4. Test and iterate
curl http://localhost:PORT/api/endpoint

# 5. Clean up when done
dream stop
```

### Bug Investigation

```bash
# 1. Reproduce issue locally
dream new multiverse -b main

# 2. Check logs for errors
dream logs substrate
dream logs patrick

# 3. Test fixes
dream inject push-all

# 4. Verify resolution
dream status universe
```

### Multi-Environment Testing

```bash
# Test across different environments
dream new multiverse -b main --name stable
dream new multiverse -b develop --name latest

# Compare behavior
dream use stable
curl http://localhost:PORT1/api/test

dream use latest
curl http://localhost:PORT2/api/test
```

## Configuration Options

### Default Configuration

Dream uses sensible defaults but can be customized:

```yaml
# .dream/config.yaml
network:
  name: blackhole
  ports:
    substrate: auto
    gateway: auto

logging:
  level: info
  output: console

storage:
  path: .dream/data
```

### Custom Networks

```bash
# Create custom network configuration
dream new multiverse --network custom-net --config custom.yaml
```

### Resource Limits

```bash
# Limit resource usage
dream new multiverse --memory 2GB --cpu 2
```

## Troubleshooting

### Common Issues

**Port conflicts:**

```bash
# Check port usage
dream status universe

# Use different ports
dream new multiverse --ports 9080:80,9443:443
```

**Build failures:**

```bash
# Check build logs
dream logs patrick
dream logs monkey

# Retry builds
dream inject push-all
```

**Service startup issues:**

```bash
# Check service status
dream status universe

# Restart services
dream restart
```

### Debug Mode

```bash
# Start with debug logging
DREAM_LOG_LEVEL=debug dream new multiverse

# Enable verbose output
dream new multiverse --verbose
```

### Log Analysis

```bash
# View all logs
dream logs

# Filter by service
dream logs substrate | grep ERROR

# Follow logs in real-time
dream logs --follow
```

## Performance Optimization

### Resource Management

```bash
# Monitor resource usage
dream stats

# Limit memory usage
dream new multiverse --memory-limit 1GB
```

### Storage Management

```bash
# Clean up old data
dream cleanup

# Check storage usage
du -sh ~/.dream/
```

### Build Optimization

```bash
# Parallel builds
dream inject push-all --parallel

# Skip cache for clean builds
dream inject push-all --no-cache
```

## Integration with Development Tools

### IDE Integration

```bash
# Export environment variables for IDE
dream env > .env

# Generate development configuration
dream config export > dev-config.json
```

### CI/CD Integration

```bash
# Use in CI/CD pipelines
dream new multiverse --headless
dream inject push-all
dream test run
dream stop
```

### Docker Integration

```bash
# Run dream in Docker
docker run -it taubyte/dream new multiverse

# Mount local code
docker run -v $(pwd):/workspace taubyte/dream
```

## Best Practices

### Development Workflow

- **Use branches**: Create branch-specific environments for features
- **Clean up**: Stop dream instances when not needed
- **Monitor resources**: Keep an eye on memory and CPU usage
- **Version control**: Keep dream configurations in version control

### Testing

- **Isolated testing**: Use separate dream instances for different features
- **Production parity**: Test with same configuration as production
- **Automated testing**: Integrate dream into automated test suites
- **Performance testing**: Use dream for load testing before production

### Security

- **Local only**: Dream is for development, never use in production
- **Network isolation**: Dream runs locally and isolated from external networks
- **Clean credentials**: Don't commit any production credentials to dream configs

Dream provides a powerful, production-like development environment that makes building and testing Taubyte applications fast, reliable, and enjoyable.
