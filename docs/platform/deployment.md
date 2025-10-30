# Manual Deployment

<!-- Source: https://tau.how/platform/deployment/ - Manual deployment guide -->

This guide covers manually deploying a Taubyte cloud to production infrastructure. This gives you complete control over the setup process and understanding of how Taubyte works under the hood.

## Overview

Every Taubyte-based cloud is associated with a Fully Qualified Domain Name (FQDN). You can use any domain or sub-domain you control. The manual deployment process involves:

1. Setting up infrastructure (bare metal or VMs)
2. Configuring networking and firewall rules
3. Installing and configuring Tau on each host
4. Setting up domain configuration and certificates

## Domain Planning

Choose your domains carefully as they define your cloud's identity:

### Primary Domain

Your main cloud domain (e.g., `enterprise.starships.ws`)

### Generated Domain

A sub-domain for auto-generated resources (e.g., `g.enterprise.starships.ws` or `e.ftll.ink`)

> **Note**: The domain can be local, but it must resolve on all hosts where `tau` is installed.

## Infrastructure Requirements

### Host Requirements

- **Operating System**: Ubuntu (other Linux distributions may work but Ubuntu is recommended)
- **Architecture**: x86_64 or ARM64
- **Resources**: Minimum 2GB RAM, 20GB storage per node
- **Network**: Public IP addresses or proper NAT configuration

### Example Infrastructure

For demonstration, here's a typical 3-node setup:

| Name                | Location    | IP             | Role                 |
| ------------------- | ----------- | -------------- | -------------------- |
| host-001-enterprise | Iowa        | 34.133.173.124 | Bootstrap + Services |
| host-002-enterprise | Toronto     | 34.130.131.76  | Services             |
| host-003-enterprise | Los Angeles | 35.235.122.141 | Services             |

### Firewall Configuration

Ensure these ports are open on all hosts:

| Ports            | Protocols | Description                                 |
| ---------------- | --------- | ------------------------------------------- |
| 4242, 4247, 4252 | TCP       | Peer-to-peer communication and IPFS         |
| 80, 443          | TCP       | HTTP and HTTPS - serving APIs and resources |
| 53, 953          | TCP, UDP  | DNS resolution                              |

## Host Preparation

### Initial Setup

On each host, install required packages:

```bash
sudo apt update
sudo apt install curl vim
```

### Install Tau

Download and install the latest Tau binary:

```bash
# Download tau
curl -L https://github.com/taubyte/tau/releases/latest/download/tau-linux-amd64.tar.gz | tar -xz

# Make executable and move to PATH
chmod +x tau
sudo mv tau /usr/local/bin/
```

Verify installation:

```bash
tau --version
```

### Create Configuration Directory

```bash
sudo mkdir -p /etc/tau
cd /etc/tau
```

## Domain and Key Generation

### Domain Validation Keys

Generate domain validation keys for Let's Encrypt certificates:

```bash
# Generate domain validation key
tau tools domain key generate \
  --domain enterprise.starships.ws \
  --output /etc/tau/domain_validation.key
```

### P2P Swarm Key

Generate a shared key for P2P communication:

```bash
# Generate swarm key (run once, then distribute to all nodes)
tau tools p2p swarm key generate --output /etc/tau/swarm.key
```

> **Important**: The swarm key must be identical on all nodes in your cloud.

## Node Configuration

### Create Node Configuration

Create `/etc/tau/config.yaml` on each host:

```yaml
# Basic node configuration
p2p:
  listen: ["/ip4/0.0.0.0/tcp/4242", "/ip4/0.0.0.0/tcp/4247"]
  announce: ["/ip4/YOUR_PUBLIC_IP/tcp/4242", "/ip4/YOUR_PUBLIC_IP/tcp/4247"]
  swarm:
    key: /etc/tau/swarm.key

dns:
  domain: enterprise.starships.ws

services:
  - auth
  - tns
  - hoarder
  - seer
  - substrate
  - patrick
  - monkey

location:
  latitude: 40.7128
  longitude: -74.0060
```

Replace `YOUR_PUBLIC_IP` with each node's actual public IP address.

### Bootstrap Node Configuration

On the first (bootstrap) node, add bootstrap configuration:

```yaml
# Additional bootstrap configuration
bootstrap: true
p2p:
  bootstrap:
    - /ip4/34.133.173.124/tcp/4242/p2p/BOOTSTRAP_PEER_ID
```

### Service-Specific Configuration

#### Auth Service Configuration

```yaml
auth:
  domain_validation_key: /etc/tau/domain_validation.key

acme:
  enabled: true
  endpoint: https://acme-v02.api.letsencrypt.org/directory
  email: admin@enterprise.starships.ws
```

#### DNS Configuration

```yaml
dns:
  domain: enterprise.starships.ws
  generated: e.ftll.ink

seer:
  dns_discovery: true
```

### Complete Configuration Example

Here's a complete configuration for a production node:

```yaml
# /etc/tau/config.yaml
version: v0.1

# Network configuration
p2p:
  listen:
    - /ip4/0.0.0.0/tcp/4242
    - /ip4/0.0.0.0/tcp/4247
  announce:
    - /ip4/34.133.173.124/tcp/4242
    - /ip4/34.133.173.124/tcp/4247
  swarm:
    key: /etc/tau/swarm.key
  bootstrap:
    - /ip4/34.133.173.124/tcp/4242

# Domain configuration
dns:
  domain: enterprise.starships.ws
  generated: e.ftll.ink

# Services this node will run
services:
  - auth
  - tns
  - hoarder
  - seer
  - substrate
  - patrick
  - monkey

# Geographic location for routing optimization
location:
  latitude: 41.2524
  longitude: -95.9980

# Auth service configuration
auth:
  domain_validation_key: /etc/tau/domain_validation.key

# ACME configuration for automatic HTTPS
acme:
  enabled: true
  endpoint: https://acme-v02.api.letsencrypt.org/directory
  email: admin@enterprise.starships.ws

# Storage configuration
storage:
  path: /var/lib/tau/storage

# Logging configuration
logging:
  level: info
  output: /var/log/tau/tau.log
```

## Service Management

### Create Systemd Service

Create `/etc/systemd/system/tau.service`:

```ini
[Unit]
Description=Taubyte Cloud Node
After=network.target
Wants=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/tau start --config /etc/tau/config.yaml
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=tau
KillMode=mixed
KillSignal=SIGINT

# Security settings
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/etc/tau /var/lib/tau /var/log/tau

[Install]
WantedBy=multi-user.target
```

### Enable and Start Service

```bash
# Create required directories
sudo mkdir -p /var/lib/tau/storage /var/log/tau

# Reload systemd and enable service
sudo systemctl daemon-reload
sudo systemctl enable tau
sudo systemctl start tau

# Check service status
sudo systemctl status tau

# View logs
sudo journalctl -u tau -f
```

## DNS Configuration

### Domain Setup

Configure your domain's DNS to point to your Tau nodes:

```bash
# A records for your main domain
enterprise.starships.ws.    IN  A   34.133.173.124
enterprise.starships.ws.    IN  A   34.130.131.76
enterprise.starships.ws.    IN  A   35.235.122.141

# Generated domain (can point to same IPs or subset)
e.ftll.ink.                 IN  A   34.133.173.124
e.ftll.ink.                 IN  A   34.130.131.76

# Wildcard for generated subdomains
*.e.ftll.ink.               IN  A   34.133.173.124
*.e.ftll.ink.               IN  A   34.130.131.76
```

### Health Checks

Verify your cloud is running:

```bash
# Check HTTP endpoint
curl -I http://enterprise.starships.ws

# Check DNS resolution
dig enterprise.starships.ws

# Check P2P connectivity
tau tools p2p ping /ip4/34.133.173.124/tcp/4242
```

## Security Considerations

### Firewall Rules

Configure UFW (Ubuntu Firewall):

```bash
# Basic firewall setup
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (adjust port as needed)
sudo ufw allow 22/tcp

# Allow Tau ports
sudo ufw allow 4242/tcp
sudo ufw allow 4247/tcp
sudo ufw allow 4252/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 53
sudo ufw allow 953

# Enable firewall
sudo ufw enable
```

### SSL/TLS Certificates

Taubyte automatically manages Let's Encrypt certificates when properly configured:

```yaml
acme:
  enabled: true
  endpoint: https://acme-v02.api.letsencrypt.org/directory
  email: admin@yourdomain.com

# Certificate storage
auth:
  domain_validation_key: /etc/tau/domain_validation.key
```

### Access Control

- Limit SSH access to specific IP ranges
- Use key-based authentication for SSH
- Regularly update and patch the OS
- Monitor logs for suspicious activity

## Monitoring and Maintenance

### Health Monitoring

```bash
# Check service status
sudo systemctl status tau

# Monitor resource usage
htop
df -h
free -h

# Check network connectivity
netstat -tulpn | grep tau
ss -tulpn | grep 4242
```

### Log Management

```bash
# View live logs
sudo journalctl -u tau -f

# View recent logs
sudo journalctl -u tau --since "1 hour ago"

# Check log disk usage
sudo du -sh /var/log/tau/
```

### Backup Procedures

```bash
# Backup configuration
sudo tar -czf tau-config-backup.tar.gz /etc/tau/

# Backup data (if using local storage)
sudo tar -czf tau-data-backup.tar.gz /var/lib/tau/

# Backup keys (store securely!)
sudo cp /etc/tau/swarm.key swarm.key.backup
sudo cp /etc/tau/domain_validation.key domain_validation.key.backup
```

## Troubleshooting

### Common Issues

**Service won't start:**

- Check configuration file syntax
- Verify file permissions
- Review systemd logs

**Network connectivity issues:**

- Verify firewall rules
- Check DNS resolution
- Test P2P connectivity between nodes

**Certificate issues:**

- Verify domain validation key
- Check ACME configuration
- Ensure domain DNS is properly configured

### Debugging Commands

```bash
# Check configuration syntax
tau config validate --config /etc/tau/config.yaml

# Test network connectivity
tau tools p2p ping <peer-address>

# Verify DNS configuration
tau tools dns lookup enterprise.starships.ws

# Check service discovery
tau tools discovery list
```

This manual deployment process gives you full control and understanding of your Taubyte cloud infrastructure. For automated deployment, consider using [Spore Drive](spore-drive.md) for a simpler approach.
