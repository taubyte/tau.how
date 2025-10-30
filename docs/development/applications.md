# Applications

<!-- Source: docs-old/01-dev-getting-started/09-applications.md -->


So far, every resource you created within your project has a global scope. You can organize your project into applications. Each application has access to its own resources and global resources. This will allow you to manage your project better and also create granular access.

For example, you can create per-application key/value databases with different settings.

### Create an application
Navigate to `Applications` in the side menu and click the `+` button.

![](/images/webconsole-new-app.png)

Enter a name and a description for your application, then validate.

![](/images/webconsole-new-app-modal.png)

Your application will now appear in the list.

![](/images/webconsole-new-app-listed.png)


Changes are currently only saved locally in your browser's virtual filesystem. Click on the green button on the bottom right corner. Applicatuion configuration and file system structure has been created in the config repo.

![](/images/webconsole-new-app-push-1.png)

Enter a commit message, then click on Finish to push your changes.

![](/images/webconsole-new-app-push-done.png)
> 💡 **Note**: You don't have to push immediately. You can keep working on your application and push when you're ready.

### Open your application
To open your application, click on the application name in the list.

![](/images/webconsole-new-app-open.png)

Within the application, you can define the same ressources you can define globally: functions, databases, websites, etc.

![](/images/webconsole-new-app-opened.png)

### Create a function
Let's create a function in our application. In the function tab, click on the `+` button. Then select the `ping_pong` template, ake sure we're using generated domain, and use `/backend/ping` as the path.

![](/images/webconsole-new-app-new-func-modal.png)
> 💡 **Note**: The path, here `/backend/ping`, does not have to include the application name. So feel free to use any path you'd like.

Switch to the code view and change the returned string then validate.

![](/images/webconsole-new-app-new-func-modal-code.png)

Your application now lists the new function and shows a `+1` change.

![](/images/webconsole-new-app-new-func-modal-listed.png)

Click on the green button on the bottom right corner to push your changes. Notice the function configuration is located inside the application's folder.
![](/images/webconsole-new-app-new-func-push-1.png)

The same applies to the code. This allows us to avoid name collisions.
![](/images/webconsole-new-app-new-func-push-2.png)

Enter a commit message, then click on Finish to push your changes.
![](/images/webconsole-new-app-new-func-push-done.png)


Since we're using dream, we need to trigger the build:
```bash
dream inject push-all
```

Onc the build is done, click on the thunder icon to open the function's HTTP endpoint in a tab.
![](/images/webconsole-new-app-new-func-exec.png)
> 💡 **Note**: If you experience any difficulty opening the endpoint make sure your generated domain is listed in your `/etc/hosts`(or equivalent) file.

The endpoint should return `BACKEND APP - PONG`.
![](/images/webconsole-new-app-new-func-exec-window.png)


Congratulations! You've just created your first application with a serverless function.