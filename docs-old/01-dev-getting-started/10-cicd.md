---

title: "CI/CD"

---

Taubyte has a built-in CI/CD system. Push events to the branch (see [work with branches](11-work-with-branches.md)) that the nodes are running on will trigger a build. The build process is defined in the `.taubyte` folder at the root of the codebase.

If you take a look at the code of any serverless function or website you'll find a `.taubyte` folder. See the examples below:
##### Go Function
![](/images/webconsole-new-func-cicd-def.png)

##### Rust Function
![](/images/webconsole-new-rust-func-cicd-def.png)

##### Website
![](/images/webconsole-website-cicd-def.png)


### The `.taubyte` folder
The `.taubyte` contains the configuration and any assets needed for the build process. In the examples shown above, it contains:

- `config.yaml`: Defines the build workflow.
- `build.sh`: Is a script executed by the build workflow.

#### `config.yaml`
The `config.yaml` file is used to define the build workflow and has a quite simple syntax:

- `enviroment`: defines the environment variables and the docker image to use.
- `workflow`: defines the steps to execute. Each step is a shell script to execute.

Example:
```yaml
version: 1.0
enviroment:
  image: node:16.18.0-alpine
  variables:
    - ENV: production
    - PUBSUB_TOPIC: "transactions"
workflow:
  - generate
  - test
  - build
```

### Artifacts
We've designed our CI/CD system to rely on conventions instead of complex configurations. If all the workflow steps excutes successfully, the `/out` folder will be archived and compressed and will be the published asset.

#### Serverless Functions
For serverless functions, Taubyte only supports webassembly as of today. We provide containers that makes it easy to build wasm modules for go, rust and assemblyscript. However, if you find yourself in a situation where these are not enough, the only requirement is that the build process outputs a `/out/main.wasm` file.

Here are the containers that we provide:

 - taubyte/go-wasi
 - taubyte/go-wasi-lib (for building with libraries - see [libraries](08-libraries.md))
 - taubyte/rust-wasi
 - taubyte/assembly-script-wasi

#### Websites
For websites, Taubyte only supports static websites and the only requirement is that the build process outputs all your files inside `/out`.

