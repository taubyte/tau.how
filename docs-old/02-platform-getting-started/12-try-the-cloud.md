---

title: "Take it for a spin!"

---

Congratulations, your very own cloud infrastructure is now operational, poised to compete with giants like Cloudflare, Netlify, Vercel, and Fastly. Let's walk through a hands-on tour to see it in action.

### Login Procedure
Embark on your cloud journey by navigating to [console.taubyte.com](https://console.taubyte.com) in your web browser, Chrome recommended for optimal experience. Follow these steps to login:

1. **Select Network**: Click on the dropdown list under the email input field, then select `Custom`.

   ![](/images/webconsole-select-custom-network.png)

2. **Enter Your Domain**: In the modal that appears, type your domain (in this example, `enterprise.starships.ws`) and confirm by clicking the check mark button.

   ![](/images/webconsole-select-custom-network-modal.png)

3. **Login with GitHub**: With your domain now recognized, enter your email and click on `Login with Github`.

   ![](/images/webconsole-select-custom-network-login.png)

   > This action will redirect you to GitHub, where you'll need to authorize the web application to access your repositories. Rest assured, the token generated during this process is securely stored in your web browser only.



### Create a Project
Once logged in, you'll land on the projects page. Here, (1) click on the "+" button to initiate a new project creation.

![](/images/webconsole-select-custom-network-projects-empty.png)

In the modal that appears, you're prompted to define your project: (1) Enter the project's name, (2) provide a description, (3) decide whether the repositories related to this project should be private, and finally, (4) click on "Create project" to seal the deal.

![](/images/webconsole-select-custom-network-new-project.png)

Successfully doing so will generate two repositories on GitHub for you—one for configuration and another for what we term as inline code.

Following a successful creation, you'll be navigated to the dashboard showcasing:
  1. Project Dashboard
  2. Node locations
  3. Commit history
  4. Git Branch

![](/images/webconsole-select-custom-network-new-project-dashboard.png)

For more details, (1) click on your avatar icon then (2) select Project Details.

![](/images/webconsole-select-custom-network-new-project-dashboard-details-menu.png)

This modal provides essential details such as:
  1. Your GitHub token, handy for CLI usage
  2. Your project ID
  3. The repository holding configuration files
  4. The repository for inline function code

![](/images/webconsole-select-custom-network-new-project-dashboard-details-modal.png)

### Create a Serverless Function
With the modal closed, navigate to the left side menu, (1) click on Functions, then (2) hit the "+" button to concoct a new function.

![](/images/webconsole-select-custom-network-new-project-dashboard-new-func.png)

To expedite the process, (1) press the "Template Select" button.

![](/images/webconsole-select-custom-network-new-project-dashboard-new-func-modal-sel-tmpl.png)

In the subsequent modal, positioned centrally at the top, (1) pick a programming language—Rust, in this instance, (2) select a template—opting for ping pong, and (3) dismiss the modal.

![](/images/webconsole-select-custom-network-new-project-dashboard-new-func-modal-sel-tmpl-rust-pingpong.png)

> Compiling Rust takes time. For a swifter test, Go is recommended.

Back in the function creation modal, nearly all fields should be prefilled except for the domain. (1) Click on Select Domain, then (2) choose GeneratedDomain, automatically provisioning a domain resource.

![](/images/webconsole-select-custom-network-new-project-dashboard-new-func-modal-use-generated.png)

Prior to proceeding, (1) review the code, which should process an HTTP request and return "pong". Feel free to adjust the message, then (2) confirm the creation of the function by clicking the checkmark button.

![](/images/webconsole-select-custom-network-new-project-dashboard-new-func-modal-check-rust-code.png)

Your dashboard will now illustrate your newly minted function.

![](/images/webconsole-select-custom-network-new-project-dashboard-new-func-before-push.png)

Unlike conventional clouds, Taubyte leverages Git as the sole source of truth for resource creation. It's time to commit your changes by clicking the green button located at the bottom right.

![](/images/webconsole-select-custom-network-new-project-dashboard-new-func-push-btn.png)

The initial screen presents the diff in the configuration repository. (1) Examine the `ping_pong.yaml` for function configuration details, then (2) proceed to the next step.

![](/images/webconsole-select-custom-network-new-project-dashboard-new-func-push-diff-modal-config.png)

The following screen showcases code changes. By selecting `lib.rs`, you can inspect your code. Once reviewed, (2) move forward.

![](/images/webconsole-select-custom-network-new-project-dashboard-new-func-push-diff-modal-code.png)

Finally, (1) encapsulate your efforts in a commit message, then (2) click on Finish to complete the process.

![](/images/webconsole-select-custom-network-new-project-dashboard-new-func-push-diff-modal-commit-message.png)



### CI/CD
After successfully pushing your changes, these are mirrored in your GitHub repositories. This step initiates CI/CD processes, crucial for deploying and testing your configurations and code. In the Taubyte console, (1) navigate to the Builds section to monitor the progress. Here, you'll observe two pivotal jobs: (2) one for the configuration build and (3) another for compiling the code. Configuration builds conclude swiftly, whereas code compilation, especially for languages like Rust, will takes some time.

![](/images/webconsole-select-custom-network-new-project-dashboard-new-func-builds.png)

For those with access to their nodes, a `top` command execution is enlightening. It allows you to witness firsthand which node is executing the build job, identifiable by the `cargo` process's appearance at the forefront of system resource consumption.

![](/images/top-on-node-new-func-builds.png)

### Test the Function
With the build phase complete, it's time to put your function to the test. From the Taubyte console's left sidebar, (1) select Functions, then (2) click the thunderbolt icon adjacent to your newly created function.

![](/images/webconsole-open-function-url.png)

A new browser tab springs to life, presenting the function's URL. Key observations include:
  1. The URL features the generated domain and the `/ping` endpoint.
  2. The swift response from the function, echoing back the intended message.
  3. The impressively brief response time, clocking in at just 36ms.

![](/images/tab-open-function-url.png)

### TLS Certificate
The icing on the cake is the seamless handling of TLS certificates by the Taubyte cloud, automatically procured from Let's Encrypt. This ensures your function endpoints are not only operational but secure. To appreciate this automated security enhancement, (1) click on the padlock icon located to the left of the URL, then (2) verify the connection's security status.

![](/images/tab-open-function-url-secured-https.png)


