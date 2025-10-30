# Tau CLI

<!-- Source: docs-old/02-platform-getting-started/03-tau.md -->

The Tau CLI is a command-line tool for managing production Taubyte clouds. It provides direct access to cloud operations, monitoring, and configuration management for production environments.

## Installation

### Download Binary

Get the latest release from GitHub:

```bash
# Linux (x86_64)
curl -L https://github.com/taubyte/tau/releases/latest/download/tau-linux-amd64.tar.gz | tar -xz

# macOS (x86_64)
curl -L https://github.com/taubyte/tau/releases/latest/download/tau-darwin-amd64.tar.gz | tar -xz

# macOS (ARM64)
curl -L https://github.com/taubyte/tau/releases/latest/download/tau-darwin-arm64.tar.gz | tar -xz
```

Make executable and install:

```bash
chmod +x tau
sudo mv tau /usr/local/bin/
```

### Verify Installation

```bash
tau --version
```

## Basic Configuration

### Cloud Connection

Configure tau to connect to your cloud:

```bash
# Set cloud endpoint
tau config set endpoint https://your-cloud.com

# Set authentication token (if required)
tau auth login

# Verify connection
tau ping
```

### Configuration File

Tau uses configuration files for persistent settings:

```bash
# View current config
tau config show

# Edit configuration
tau config edit

# Reset to defaults
tau config reset
```

Example configuration:

```yaml
# ~/.tau/config.yaml
endpoint: https://enterprise.starships.ws
auth:
  method: token
  token: your-auth-token
project:
  default: my-project
logging:
  level: info
  format: json
```

## Core Commands

### Cloud Management

```bash
# Check cloud status
tau status

# View cloud information
tau info

# Check health of services
tau health

# List all nodes in the cloud
tau nodes list
```

### Project Management

```bash
# List projects
tau project list

# Set default project
tau project use my-project

# Get project info
tau project info my-project

# Import project from Git
tau project import \
  --config-repo github.com/user/config \
  --code-repo github.com/user/code
```

### Resource Management

```bash
# List functions
tau function list

# Get function details
tau function get my-function

# List websites
tau website list

# List databases
tau database list

# List storage buckets
tau storage list
```

## Development Operations

### Build Management

```bash
# List builds
tau build list

# Get build status
tau build status <build-id>

# View build logs
tau build logs <build-id>

# Retry failed build
tau build retry <build-id>

# Trigger new build
tau build trigger --project my-project --repo code
```

### Deployment Operations

```bash
# List deployments
tau deploy list

# Get deployment status
tau deploy status <deploy-id>

# Rollback deployment
tau deploy rollback <deploy-id>

# Deploy specific version
tau deploy version --tag v1.2.3
```

### Branch Operations

```bash
# List tracked branches
tau branch list

# Switch branch tracking
tau branch track develop

# View branch status
tau branch status
```

## Monitoring and Debugging

### Logs

```bash
# View application logs
tau logs --project my-project

# Filter by service
tau logs --service substrate

# Follow logs in real-time
tau logs --follow

# Filter by log level
tau logs --level error

# View logs for specific time range
tau logs --since 1h --until 30m
```

### Metrics

```bash
# View resource usage
tau metrics cpu
tau metrics memory
tau metrics network

# Function-specific metrics
tau metrics function my-function

# Historical metrics
tau metrics --since 24h --resolution 1h
```

### Performance Analysis

```bash
# Function performance
tau perf function my-function

# Request tracing
tau trace request <request-id>

# System performance
tau perf system
```

## Administrative Operations

### Service Management

```bash
# List running services
tau service list

# Get service status
tau service status auth

# Restart service
tau service restart substrate

# Scale service
tau service scale substrate --replicas 3
```

### Node Management

```bash
# List cluster nodes
tau node list

# Get node information
tau node info node-1

# Drain node for maintenance
tau node drain node-1

# Add new node to cluster
tau node add \
  --host 1.2.3.4 \
  --shape compute \
  --location "us-west-1"
```

### Security Operations

```bash
# Manage certificates
tau cert list
tau cert renew domain.com
tau cert status domain.com

# Access control
tau auth user list
tau auth user add john@company.com
tau auth role assign admin john@company.com

# Security audit
tau security audit
tau security scan
```

## Advanced Features

### Backup and Recovery

```bash
# Create backup
tau backup create --project my-project

# List backups
tau backup list

# Restore from backup
tau backup restore <backup-id>

# Export project configuration
tau export project my-project --output project-backup.tar.gz
```

### Configuration Management

```bash
# Validate configuration
tau config validate

# Apply configuration changes
tau config apply config.yaml

# Compare configurations
tau config diff local remote

# Generate configuration templates
tau config template function > function-template.yaml
```

### Development Tools

```bash
# Generate project scaffolding
tau generate project my-new-project

# Create function template
tau generate function my-function --language go

# Validate code before deployment
tau validate --project my-project

# Run local tests against cloud
tau test run --suite integration
```

## CI/CD Integration

### Pipeline Commands

```bash
# CI-friendly status check
tau status --format json --quiet

# Deploy and wait for completion
tau deploy --wait --timeout 300s

# Health check for monitoring
tau health --format prometheus

# Export metrics for monitoring systems
tau metrics export --format grafana
```

### Automation Scripts

```bash
#!/bin/bash
# deploy.sh - Production deployment script

set -e

echo "Checking cloud health..."
tau health --quiet || exit 1

echo "Deploying project..."
DEPLOY_ID=$(tau deploy --project production --wait --format json | jq -r '.id')

echo "Verifying deployment..."
tau deploy status $DEPLOY_ID --wait-success

echo "Running post-deployment tests..."
tau test run --suite smoke-tests

echo "Deployment completed successfully!"
```

### Environment Management

```bash
# Switch between environments
tau config use production
tau config use staging
tau config use development

# Environment-specific operations
tau deploy --env production --branch main
tau deploy --env staging --branch develop
```

## Troubleshooting

### Connection Issues

```bash
# Test connectivity
tau ping

# Debug connection
tau debug connection

# Check DNS resolution
tau debug dns your-cloud.com

# Verify certificates
tau debug tls your-cloud.com
```

### Build Problems

```bash
# Debug build failures
tau build debug <build-id>

# Check build environment
tau build env --project my-project

# Validate build configuration
tau build validate
```

### Performance Issues

```bash
# Analyze performance bottlenecks
tau perf analyze

# Check resource constraints
tau limits check

# Monitor real-time performance
tau monitor --live
```

## Configuration Examples

### Multi-Environment Setup

```yaml
# ~/.tau/environments.yaml
environments:
  development:
    endpoint: https://dev.mycloud.com
    project: my-project-dev

  staging:
    endpoint: https://staging.mycloud.com
    project: my-project-staging

  production:
    endpoint: https://mycloud.com
    project: my-project-prod
```

### Authentication Configuration

```yaml
# ~/.tau/auth.yaml
auth:
  method: oauth
  client_id: your-client-id
  scopes: ["read", "write", "deploy"]

# Or for token-based auth
auth:
  method: token
  token: your-api-token
```

### Logging Configuration

```yaml
# ~/.tau/logging.yaml
logging:
  level: debug
  format: json
  output: /var/log/tau.log
  rotation:
    max_size: 100MB
    max_files: 10
```

## Best Practices

### Security

- **Use authentication**: Always authenticate with production clouds
- **Rotate tokens**: Regularly rotate API tokens and certificates
- **Audit access**: Monitor who has access to production systems
- **Secure storage**: Keep credentials secure and never in version control

### Operations

- **Monitoring**: Set up comprehensive monitoring and alerting
- **Automation**: Automate common operations and deployments
- **Documentation**: Document operational procedures and runbooks
- **Testing**: Test operations in staging before production

### Performance

- **Resource monitoring**: Keep track of resource usage and trends
- **Capacity planning**: Plan for growth and scaling needs
- **Optimization**: Regular performance tuning and optimization
- **Backup strategy**: Implement comprehensive backup and recovery procedures

The Tau CLI provides powerful capabilities for managing production Taubyte clouds with comprehensive monitoring, debugging, and operational features.
