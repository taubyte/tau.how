---
title: Creating a project
---

Now, let's create a project on this cloud. You have two options:

1. Using [tau-cli](https://github.com/taubyte/tau-cli) (recommended for CLI lovers)
2. Using the [Web Console](https://console.taubyte.com) (which we'll cover here)

> 💡 **Note**: The project creation process remains the same whether you're working in Dreamland (development) or production environments.

### Quick Setup Using Web Console

#### 1. Navigate to [console.taubyte.com](https://console.taubyte.com)

#### 2. Configure your login:

   - Enter your email
   - Select network: `Dreamland/blackhole`
   - Click `Login with GitHub`

![](/images/webconsole-dreamland-login-select-network.png)
![](/images/webconsole-dreamland-login-github.png)

> 💡 **Note**: The GitHub access is browser-local and is used to create project repositories that will be cloned into a browser-based virtual filesystem.

### Creating Your Project

#### 1. From the projects dashboard, click `Create project`

![](/images/webconsole-dreamland-new-project-btn.png)

#### 2. Configure your project:

   - Name: your-project-name
   - Description: A brief description
   - Visibility: private or public if you want open repositories

![](/images/webconsole-dreamland-new-project-modal.png)

### What Happens Behind the Scenes

The Web Console will create two repositories:

- **Config Repository**: Contains YAML configuration files
- **Code Repository**: Contains inline source code in various languages

Upon successful creation, you'll be redirected to the project dashboard:

![](/images/webconsole-dreamland-new-project-dashboard.png)

> 💡 **Pro Tip**: If you prefer CLI workflows, check out the [tau-cli documentation](https://github.com/taubyte/tau-cli) for command-line project creation.

