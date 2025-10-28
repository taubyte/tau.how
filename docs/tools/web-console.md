# Web Console

The Taubyte Web Console is a browser-based interface that provides a visual way to manage projects, create resources, write code, and monitor deployments. It works with both development (dream) and production environments.

## Accessing the Console

### Development Environment

1. Start your local cloud with dream:

   ```bash
   dream new multiverse
   ```

2. Navigate to [console.taubyte.com](https://console.taubyte.com)

3. Select "Dreamland/blackhole" as your network

4. Login with GitHub to access your local development environment

### Production Environment

1. Navigate to [console.taubyte.com](https://console.taubyte.com)

2. Select "Custom" network

3. Enter your production cloud's FQDN (e.g., `enterprise.starships.ws`)

4. Login with your authentication method

## Interface Overview

### Main Navigation

The Web Console provides several main sections:

- **Projects**: Manage and switch between projects
- **Functions**: Create and manage serverless functions
- **Websites**: Static site hosting configuration
- **Databases**: Key-value storage management
- **Storage**: Object storage buckets
- **Messaging**: Pub/Sub channel configuration
- **Libraries**: Shared code libraries
- **Applications**: Resource organization
- **Builds**: CI/CD monitoring and logs
- **Network**: Cloud infrastructure visualization

### Project Dashboard

The project dashboard shows:

- **Resource Overview**: Count of functions, websites, databases, etc.
- **Recent Activity**: Latest builds, deployments, and changes
- **Quick Actions**: Fast access to common operations
- **Resource Status**: Health and status of deployed resources

## Project Management

### Creating Projects

1. Click "Create Project" from the projects dashboard
2. Configure project settings:
   - **Name**: Project identifier
   - **Description**: Project description
   - **Visibility**: Public or private repositories
3. The console creates two repositories:
   - **Config Repository**: YAML configuration files
   - **Code Repository**: Source code storage

### Importing Projects

1. Click "Import Project"
2. Select repositories to import:
   - Config repository (required)
   - Code repository (optional, auto-detected)
3. Console automatically matches related repositories

### Switching Projects

Use the project selector in the top navigation to switch between projects.

## Resource Management

### Functions

#### Creating Functions

1. Navigate to **Functions** → click **+**
2. Choose creation method:
   - **Template**: Use pre-built templates (Go, Rust, etc.)
   - **Manual**: Configure from scratch
3. Configure function properties:
   - **Name**: Function identifier
   - **Description**: Function purpose
   - **Runtime**: Language and execution settings
   - **Trigger**: HTTP, WebSocket, Pub/Sub, Timer
   - **Domains**: Where function is accessible
   - **Memory**: Resource allocation
   - **Timeout**: Maximum execution time

#### Code Editor

The built-in code editor provides:

- **Syntax Highlighting**: Language-specific highlighting
- **File Management**: Create, edit, delete files
- **Build Configuration**: Edit `.taubyte` folder contents
- **Version Control**: Commit and push changes

#### Configuration View

Switch between **Code** and **YAML** tabs to:

- **Edit Code**: Modify function source code
- **View Config**: See generated YAML configuration
- **Modify Settings**: Change function parameters

### Websites

#### Creating Websites

1. Navigate to **Websites** → click **+**
2. Configure website properties:
   - **Name**: Website identifier
   - **Repository**: Generate new or use existing
   - **Domain**: Website domain configuration
   - **Path**: URL path (e.g., `/`, `/docs`)
   - **Branch**: Git branch to deploy from

#### Template Selection

Choose from available templates:

- **HTML**: Basic HTML template
- **React**: React application template
- **Vue**: Vue.js application template
- **Static**: Generic static site template

### Databases

#### Creating Databases

1. Navigate to **Database** → click **+**
2. Configure database properties:
   - **Name**: Database identifier
   - **Matcher**: Path pattern (e.g., `/users`, `/data/[^/]+`)
   - **Size**: Storage allocation
   - **Replication**: Minimum and maximum replicas

#### Database Patterns

Use matcher patterns for different use cases:

- **Simple Path**: `/myapp/data` - Single database
- **User-specific**: `/users/[^/]+` - Database per user
- **Hierarchical**: `/tenant/[^/]+/data` - Multi-tenant databases

### Storage

#### Creating Storage Buckets

1. Navigate to **Storage** → click **+**
2. Configure storage properties:
   - **Name**: Bucket identifier
   - **Matcher**: Path pattern for bucket access
   - **Type**: Object bucket (file storage)
   - **Size**: Storage limit

### Messaging

#### Creating Pub/Sub Channels

1. Navigate to **Messaging** → click **+**
2. Configure messaging properties:
   - **Name**: Channel identifier
   - **Matcher**: Topic pattern
   - **WebSocket**: Enable real-time connections
   - **Authentication**: Access control settings

### Libraries

#### Creating Libraries

1. Navigate to **Libraries** → click **+**
2. Choose library options:
   - **Generate**: Create new repository
   - **Import**: Use existing repository
3. Select template and configure properties

#### Using Libraries

Libraries can be used in two ways:

- **As Source**: Entire library becomes function source
- **As Dependency**: Import specific functions from library

## Development Workflow

### Code Development

1. **Create Resource**: Use templates for quick setup
2. **Edit Code**: Use built-in editor for modifications
3. **Test Locally**: Changes reflected immediately in dream
4. **Push Changes**: Commit and push to Git repositories
5. **Monitor Builds**: Watch CI/CD progress in Builds section

### Version Control Integration

The console provides Git integration:

- **Commit Changes**: Bundle configuration and code changes
- **Push to GitHub**: Deploy changes to repositories
- **Branch Management**: Create and switch between branches
- **Change Review**: Review modifications before pushing

### Build Monitoring

The **Builds** section shows:

- **Build Status**: Success, failure, in progress
- **Build Logs**: Detailed execution logs
- **Job History**: Previous builds and their outcomes
- **Error Details**: Specific error messages and stack traces

## Visual Features

### Network Visualization

The **Network** section provides:

- **Interactive Graph**: Visual representation of cloud nodes
- **Service Discovery**: See all running services
- **Health Status**: Visual indicators of node health
- **Connection Mapping**: P2P connections between nodes

### Resource Execution

Execute resources directly from the console:

- **Function Execution**: Click ⚡ to test functions
- **Website Opening**: Click ⚡ to open websites
- **Performance Metrics**: View execution statistics

### Real-time Monitoring

Monitor your applications in real-time:

- **Live Logs**: Stream logs from running services
- **Performance Data**: CPU, memory, network usage
- **Request Tracing**: Follow requests through the system

## Advanced Features

### Applications

Organize resources into applications:

1. Navigate to **Applications** → click **+**
2. Create application with name and description
3. Add resources to applications for better organization
4. Manage application-specific permissions and settings

### Branch Management

Create and manage Git branches:

1. Click current branch name in top navigation
2. Click **+** to create new branch
3. Switch between branches for different environments
4. Each branch can have different configurations

### Environment Configuration

Configure environment-specific settings:

- **Development**: Use generated domains, debug settings
- **Staging**: Production-like settings with staging domains
- **Production**: Optimized settings with production domains

### Bulk Operations

Perform operations on multiple resources:

- **Bulk Deploy**: Deploy multiple resources simultaneously
- **Batch Configuration**: Apply configuration changes across resources
- **Mass Import**: Import multiple repositories at once

## Collaboration Features

### Team Management

- **Project Sharing**: Share projects with team members
- **Repository Access**: Control access to configuration and code repositories
- **Role-based Permissions**: Assign different roles and permissions

### Change Management

- **Change Review**: Review modifications before deployment
- **Approval Workflows**: Require approvals for production changes
- **Audit Trail**: Track all changes and who made them

## Mobile and Responsive Design

The Web Console is fully responsive:

- **Mobile Access**: Full functionality on mobile devices
- **Tablet Optimization**: Optimized interface for tablets
- **Touch Interface**: Touch-friendly controls and navigation

## Keyboard Shortcuts

Common keyboard shortcuts:

- **Ctrl+S**: Save current file (in code editor)
- **Ctrl+Shift+P**: Command palette
- **Ctrl+F**: Find in current file
- **Ctrl+Shift+F**: Find across project
- **F5**: Refresh build status

## Customization

### Theme Options

- **Dark Mode**: Dark theme for low-light environments
- **Light Mode**: Light theme for bright environments
- **Auto**: Automatically adjust based on system preferences

### Layout Preferences

- **Sidebar**: Collapsible navigation sidebar
- **Panel Layout**: Adjustable panel sizes and positions
- **Font Settings**: Customize editor font and size

## Troubleshooting

### Common Issues

**Console not loading:**

- Check internet connection
- Clear browser cache
- Try incognito/private mode
- Check if JavaScript is enabled

**Cannot connect to dream:**

- Verify dream is running: `dream status universe`
- Check network selection (should be "Dreamland/blackhole")
- Restart dream if necessary

**Build failures:**

- Check build logs in **Builds** section
- Verify repository access permissions
- Check `.taubyte` configuration files

**Function not executing:**

- Verify function is deployed and built successfully
- Check domain configuration and DNS
- Review function logs for errors

### Debug Tools

The console provides debugging tools:

- **Network Inspector**: Monitor network requests
- **Console Logs**: Browser console for debugging
- **Performance Monitor**: Track console performance
- **Error Reporting**: Automatic error reporting and diagnostics

## Best Practices

### Organization

- **Use Applications**: Group related resources into applications
- **Descriptive Names**: Use clear, descriptive names for resources
- **Consistent Structure**: Maintain consistent project organization
- **Documentation**: Document complex configurations and workflows

### Development

- **Template Usage**: Start with templates for faster development
- **Incremental Changes**: Make small, incremental changes
- **Test Locally**: Always test in dream before production deployment
- **Version Control**: Commit changes regularly with meaningful messages

### Security

- **Access Control**: Use appropriate repository permissions
- **Secret Management**: Don't store secrets in code or configuration
- **Regular Updates**: Keep dependencies and configurations updated
- **Audit Regularly**: Review access permissions and configurations

The Web Console provides a comprehensive, user-friendly interface for managing all aspects of Taubyte development and deployment, from initial project creation to production monitoring and maintenance.
