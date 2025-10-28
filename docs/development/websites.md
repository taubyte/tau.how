# Websites

Taubyte provides built-in static website hosting with automatic HTTPS, global distribution, and seamless integration with your functions and other resources. Websites can serve HTML, CSS, JavaScript, and other static assets.

## Creating Websites

### Using the Web Console

1. Navigate to `Websites` in the side menu and click the `+` button

![](/images/webconsole-dreamland-create-new-website.png)

2. Configure your website:
   - **Name**: Enter a descriptive website name
   - **Repository**: Set to `generate` for automatic repository creation
   - **Visibility**: Toggle `private` if you want a private repository
   - **Domain**: Select the generated domain
   - **Path**: Add `/` as the root path (or specific paths like `/docs`)

![](/images/webconsole-dreamland-create-new-website-modal.png)

3. Select a template (e.g., HTML template) and click `Generate`

![](/images/webconsole-dreamland-create-new-website-template.png)

> 💡 **Note**: This creates a new repository on GitHub and pushes the generated code to it.

### Website Configuration

Websites are configured through YAML files with these key settings:

```yaml
id: ""
description: Static website hosting
tags: []
source: .
domains:
  - GeneratedDomain
paths:
  - /
branch: main
```

#### Configuration Options

**Source Options:**

- `source: .` - Inline content in the Web Console
- `source: github.com/username/website-repo` - External Git repository

**Domain Configuration:**

- Use `GeneratedDomain` for automatic domain creation
- Configure custom domains for production use

**Path Configuration:**

- `/` - Serve from root path
- `/docs` - Serve from specific subpath
- Multiple paths supported for complex routing

**Branch Selection:**

- `main` - Deploy from main branch
- `develop` - Deploy from development branch
- Any Git branch name for environment-specific deployments

## Managing Website Content

### Direct Repository Editing

After creating a website, you can edit content directly in the GitHub repository:

1. Click on the open icon next to your website to access the repository

![](/images/webconsole-dreamland-create-new-website-template-open-repo.png)

2. Edit files like `index.html` directly in GitHub

![](/images/webconsole-dreamland-create-new-website-open-index-edit-btn.png)

3. Make your changes and commit them

![](/images/webconsole-dreamland-create-new-website-open-index-edit-commit.png)

### Local Development

For more complex websites, you can:

1. Clone the website repository locally
2. Set up your preferred development environment
3. Build your static site (HTML, CSS, JavaScript, etc.)
4. Commit and push changes to trigger deployment

## Website Types and Examples

### Simple HTML Website

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Taubyte Website</title>
  </head>
  <body>
    <h1>Welcome to Taubyte</h1>
    <p>This is a static website hosted on Taubyte!</p>
  </body>
</html>
```

### Single Page Application (SPA)

For React, Vue, Angular, or other SPA frameworks:

1. Build your application (`npm run build`)
2. Copy the `dist` or `build` folder contents to your website repository
3. Ensure proper routing configuration for client-side routing

### Documentation Site

Perfect for hosting documentation using static site generators:

- **Jekyll** - Ruby-based site generator
- **Hugo** - Go-based static site generator
- **Gatsby** - React-based site generator
- **VuePress** - Vue-based documentation generator

### API Integration

Static websites can integrate with your Taubyte functions:

```javascript
// Fetch data from your Taubyte function
async function loadData() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    displayData(data);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}
```

## Deployment Process

### Automatic Deployment

1. **Push Configuration**: First, push website configuration changes through the Web Console

![](/images/webconsole-dreamland-create-new-website-push-config-changes.png)

2. **Trigger Build**: For local development with dream, manually trigger the build:

```bash
# Use the github.id and github.fullname from your website configuration
dream inject push-specific \
--rid 903606675 \
--fn taubyte0/tb_website_tau_how_new_website
```

3. **Monitor Build**: Check the builds page for completion status

![](/images/webconsole-dreamland-create-new-website-build-done.png)

### Production Deployment

In production environments:

1. Push changes to the monitored Git branch
2. CI/CD pipeline automatically builds and deploys
3. Website becomes available on configured domains

## Domain Configuration

### Development (Local)

1. Add the generated domain to your hosts file:

```bash
sudo vi /etc/hosts
```

2. Add the mapping:

```
127.0.0.1 gftxhd6h0.blackhole.localtau
```

3. Access your website directly or through the Web Console

![](/images/webconsole-dreamland-create-new-website-build-open.png)

### Production

1. Configure custom domains in your website configuration
2. Set up DNS records to point to your Taubyte cloud
3. Automatic HTTPS certificates are provisioned via Let's Encrypt

## Advanced Features

### Multiple Environments

Use Git branches for different environments:

```yaml
# staging.yaml
branch: develop
domains:
  - staging.yoursite.com

# production.yaml
branch: main
domains:
  - yoursite.com
  - www.yoursite.com
```

### Path-based Routing

Serve different content from different paths:

```yaml
paths:
  - /
  - /docs
  - /blog
```

### Asset Optimization

For optimal performance:

- **Minify** CSS and JavaScript files
- **Optimize images** (compress, use appropriate formats)
- **Use CDN-friendly** file naming for cache optimization
- **Enable compression** at the build level

## Integration with Functions

Websites work seamlessly with Taubyte functions:

### API Routes

Configure functions to handle API requests:

```yaml
# Function configuration
trigger:
  type: https
  method: GET
  paths:
    - /api/*
domains:
  - same-domain-as-website
```

### Form Handling

Handle form submissions with functions:

```html
<!-- Website form -->
<form action="/api/contact" method="POST">
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

### Real-time Features

Add real-time functionality using WebSocket functions:

```javascript
// Connect to WebSocket function
const ws = new WebSocket("wss://yoursite.com/ws/chat");
ws.onmessage = function (event) {
  displayMessage(JSON.parse(event.data));
};
```

## Best Practices

### Performance

- **Optimize assets** before deploying
- **Use appropriate caching** headers
- **Minimize HTTP requests** by bundling assets
- **Implement lazy loading** for images and content

### Security

- **Always use HTTPS** (automatic in Taubyte)
- **Validate user inputs** on the client and server side
- **Sanitize content** to prevent XSS attacks
- **Use CSP headers** for additional security

### SEO and Accessibility

- **Use semantic HTML** for better SEO
- **Implement proper meta tags** for social sharing
- **Ensure accessibility** with proper ARIA labels
- **Optimize for mobile** devices

### Development Workflow

- **Use version control** effectively with meaningful commit messages
- **Test locally** before pushing to production
- **Use environment-specific** configurations
- **Monitor website performance** and availability

## Troubleshooting

### Common Issues

**Website not updating:**

- Verify build completed successfully
- Check browser cache (hard refresh)
- Ensure correct branch is being deployed

**404 errors:**

- Verify path configuration matches file structure
- Check domain configuration
- Ensure files exist in repository

**Build failures:**

- Check build logs for specific errors
- Verify repository permissions
- Ensure build process is correctly configured

Websites in Taubyte provide a powerful, scalable solution for hosting static content with seamless integration into your serverless application ecosystem.
