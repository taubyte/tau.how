# Websites

<!-- Source: docs-old/01-dev-getting-started/04-first-website.md -->


Now that you know how to create a serverless function, let's create a Website.

### Creating the Website

Navigate to `Websites` in the side menu and click the `+` button.
![](../images/webconsole-dreamland-create-new-website.png)

Input a website name. Ensure the repository is set to `generate`. Toggle `private` if you'd like the repository to be private. Select the generated domain, add `/` as a path, and validate.
![](../images/webconsole-dreamland-create-new-website-modal.png)

Select the HTML template, and click `Generate`.
![](../images/webconsole-dreamland-create-new-website-template.png)
> **Note**: This will create a new repository on Github and push the generated code to it.

Notice that now you have a new website in the list.
![](../images/webconsole-dreamland-create-new-website-template-done.png)

Click on the push button at the bottom right corner to push the configuration changes.
![](../images/webconsole-dreamland-create-new-website-push-config-changes.png)

Click on the `websites` folder, then on the YAML file for your new website. Copy `github.id` (903606675 in the example) and `github.fullname` (taubyte0/tb_website_tau_how_new_website in the example); we'll need them later.
![](../images/webconsole-dreamland-create-new-website-push-config-changes-modal-1.png)

Enter a commit message, and click `Push`.
![](../images/webconsole-dreamland-create-new-website-push-config-changes-modal-2.png)

### Editing the Website

Go back to `Websites` and click on the open icon on the right side of your website. This will open the website repository in a new tab.

![](../images/webconsole-dreamland-create-new-website-template-open-repo.png)

![](../images/webconsole-dreamland-create-new-website-github-repo.png)

Click on the `index.html` file to open it.
![](../images/webconsole-dreamland-create-new-website-open-index.png)

Click on the `Edit` button to edit the file.
![](../images/webconsole-dreamland-create-new-website-open-index-edit-btn.png)

Change the content of the file, and click on the `Commit Changes...` button.
![](../images/webconsole-dreamland-create-new-website-open-index-edit-diff.png)

Enter a commit message, and click on the `Commit Changes` button.
![](../images/webconsole-dreamland-create-new-website-open-index-edit-commit.png)

### Triggering the Build

Unlike a deployed `tau` cloud, `dream` is not able to trigger the build automatically, so we need to do it manually.

```bash
dream inject push-specific \
--rid 903606675 \
--fn taubyte0/tb_website_tau_how_new_website
```

> **Note**: Use the `github.id` for `--rid` and `github.fullname` for `--fn` you copied earlier.

Navigate to the builds page and wait for the build to complete.

![](../images/webconsole-dreamland-create-new-website-build-done.png)

### Opening the Website

First, if not done already while creating a function (see [Creating a function](../getting-started/first-function.md)), add the generated domain to your hosts file. On Unix-like systems (Linux/macOS), edit `/etc/hosts`:

```sh
sudo vi /etc/hosts
```

For me, the generated domain is `gftxhd6h0.blackhole.localtau`. So I add:

```
127.0.0.1 gftxhd6h0.blackhole.localtau
```

Then navigate to the `Websites` page and click on the thunder to open the website in a new tab.

![](../images/webconsole-dreamland-create-new-website-build-open-btn.png)

![](../images/webconsole-dreamland-create-new-website-build-open.png)

![](../images/webconsole-dreamland-create-new-website-build-open-stats.png)

Congratulations! You've successfully created a website!

## Using Custom Domains

By default, websites use generated domains under the `*.g.universe.localtau` pattern. However, you can configure your website to use your own custom domain (e.g., `example.com`) instead.

### Adding a Custom Domain

1. Navigate to the `Domains` section in the side menu and click the `+` button to add a new domain.

2. Fill in the domain details:
   - **Name**: Choose any name you want for this domain resource
   - **Description**: Add a description (optional)
   - **Tag**: Add tags for organization (optional)
   - **FQDN**: Enter the fully qualified domain name you want to use (e.g., `example.com`)

3. Click `Save` to create the domain resource.

### Pushing Domain Configuration to GitHub

After creating the domain, you need to push the configuration changes to GitHub:

1. Click on the push button at the bottom right corner of the screen.

2. Review the configuration changes in the modal. You should see a new domain entry in the `domains` folder.

3. Enter a commit message and click `Push` to commit and push the changes to GitHub.

### Getting DNS Records

After pushing the domain configuration, wait for the build to complete:

1. Navigate to the `Builds` page and wait for the build to finish.

2. Once the build completes, go to the `Domains` section in the side menu.

3. Find your newly added domain in the domains list.

4. Click the `Open` button next to your domain entry.

5. The domain details will show you the DNS records you need to configure:
   - **Wildcard Domain**: You'll see an entry like `*.example.com`
   - **TXT Record**: A JWT token value that looks like:
     ```
     eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiNWRySEdLb0tYTUZ0QWVDYWdXOXY0Q1E4ajVNaFNmIn0.LeH7FynI9TE6UsNB7Wpd36Df-r7u4t2FkYh3S94EmqTrLcn6oC99fX5MKqRyeX9OW43zNmgv4cTf4gvVUS2qlQ
     ```

### Configuring Your Domain Provider

To complete the custom domain setup, you need to add DNS records at your domain name provider. Here's how to configure them:

For a custom domain like `example.com`, add the following DNS records:

**1. CNAME Record:**
- **Type**: `CNAME`
- **Name/Host**: `substrate`
- **Value/Target**: `tau.example.com.` (replace `example.com` with your actual domain)
- **TTL**: Use default or 3600

**2. TXT Record:**
- **Type**: `TXT`
- **Name/Host**: `qmapay2m`
- **Value**: The JWT token value you copied from the domain details (the full token string)
- **TTL**: Use default or 3600

> **Note**: Make sure to include the trailing dot (`.`) after `tau.<your-domain>.` in the CNAME record value, as this indicates a fully qualified domain name.

#### General Pattern

For any custom domain, follow this pattern:

1. **CNAME Record**:
   - Name: `substrate`
   - Value: `tau.<your-domain>.` (replace `<your-domain>` with your actual domain)

2. **TXT Record**:
   - Name: `qmapay2m`
   - Value: The JWT token from the domain details page

After adding these DNS records, DNS propagation may take a few minutes to several hours. Once propagation is complete, your website will be accessible via your custom domain instead of the generated `*.g.universe.localtau` domain.

> **Note**: You can verify DNS propagation using tools like `dig` or online DNS checkers. Make sure both the CNAME and TXT records are properly configured before expecting your custom domain to work.