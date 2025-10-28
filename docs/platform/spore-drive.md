# Spore Drive - Automated Deployment

While [manual deployment](deployment.md) gives you complete control over the setup process, Spore Drive automates cloud deployment with just a few lines of code. It's designed to align with Taubyte's philosophy of simplification and developer-friendly tools.

## Why Spore Drive?

Traditional Infrastructure as Code (IaC) solutions often come with:

- 😫 Complex configuration languages to learn
- 🤯 Steep learning curves
- ⚡ Heavy dependencies and prerequisites
- 🗑️ Unnecessary features that add complexity

Spore Drive provides:

- ✨ A minimal, intuitive API that feels natural to developers
- 🎯 Just the features needed for Tau deployment
- 🔑 Agentless deployment using only SSH
- ⚡ Simple configuration through code

## How Spore Drive Works

Spore Drive is an RPC service that runs on your local machine. Unless used from a browser, your SDK will start it automatically.

![](/images/spore-drive-overview-dia.png)

### Architecture Components

1. **Configuration Management**: Creates instances either fully in memory or as Copy-On-Write backed by the filesystem
2. **Multi-Client Support**: Multiple clients can manipulate the same configuration without consistency concerns
3. **Planning**: Creates deployment plans before execution
4. **Agentless Deployment**: Uses SSH to connect and execute deployment on target hosts

### Workflow

1. **Create Configuration**: Define your cloud setup in code
2. **Create Drive**: Reference the configuration instance
3. **Plot Course**: Generate deployment plan (required before deployment)
4. **Displace**: Execute the deployment via SSH

## Language Support

While this guide uses TypeScript, Spore Drive supports:

- **Go** (native implementation)
- **TypeScript/JavaScript** (client library)
- **Python, Rust, etc.** (coming soon)

## Getting Started with TypeScript

### Project Setup

Create a new TypeScript project:

```bash
# Initialize project
npm init -y
npm install typescript tsx --save-dev
npx tsc --init
```

Configure TypeScript in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "outDir": "dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "lib": ["ES2020"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Add deployment script to `package.json`:

```json
{
  "scripts": {
    "deploy": "tsx src/deploy.ts"
  }
}
```

### Install Spore Drive

```bash
npm install @taubyte/spore-drive
```

## Writing Deployment Code

### Basic Imports

Create `src/deploy.ts`:

```typescript
import {
  Config,
  CourseConfig,
  Drive,
  TauLatest,
  Course,
} from "@taubyte/spore-drive";
```

### Configuration Setup

Initialize configuration:

```typescript
// Store config locally (recommended for version control)
const config: Config = new Config(`${__dirname}/../config`);
await config.init();

// Or use in-memory config (temporary)
// const config: Config = new Config();
// await config.init();
```

> 💡 **Best Practice**: Store configuration in a Git repository for version control and team collaboration.

### Cloud Configuration

```typescript
export const createConfig = async (config: Config) => {
  // Set domains (equivalent to manual setup)
  const domain = config.Cloud().Domain();
  await domain.Root().Set("enterprise.starships.ws");
  await domain.Generated().Set("e.ftll.ink");

  // Generate required keys
  await domain.Validation().Generate();
  await config.Cloud().P2P().Swarm().Generate();
```

### SSH Authentication

Configure SSH access for your hosts:

#### Using Password Authentication

```typescript
const mainAuth = config.Auth().Signer("main");
await mainAuth.Username().Set("root");
await mainAuth.Password().Set(process.env.HOST_PASSWORD!);
```

#### Using Key Authentication

```typescript
const mainAuth = config.Auth().Signer("main");
await mainAuth.Username().Set("root");
await mainAuth
  .Key()
  .Data()
  .Set(await fs.promises.readFile(process.env.HOST_KEY_PATH!));
```

### Service Shapes

Define service combinations that nodes will run:

```typescript
// Define a "compute" shape with all core services
const computeShape = config.Shapes().Shape("compute");
await computeShape
  .Services()
  .Set(["auth", "tns", "hoarder", "seer", "substrate", "patrick", "monkey"]);

// Configure network ports
await computeShape.Ports().Port("main").Set(BigInt(4242));
await computeShape.Ports().Port("lite").Set(BigInt(4247));
```

### Host Configuration

Define your infrastructure hosts:

```typescript
// Define your host list
const hostsList = [
  {
    ip: "34.133.173.124",
    id: "node-1",
    location: {
      lat: 41.8781,
      long: -87.6298,
    },
  },
  {
    ip: "34.130.131.76",
    id: "node-2",
    location: {
      lat: 43.6532,
      long: -79.3832,
    },
  },
  {
    ip: "35.235.122.141",
    id: "node-3",
    location: {
      lat: 34.0522,
      long: -118.2437,
    },
  },
];
```

Add hosts to configuration:

```typescript
const bootstrapNodes = [];

for (const host of hostsList) {
  const hostname = `host-${host.id}-enterprise-starships`;

  if (!existingHosts.includes(hostname)) {
    const hostConfig = config.Hosts().Host(hostname);
    bootstrapNodes.push(hostname);

    // Network configuration
    await hostConfig.Addresses().Add([`${host.ip}/32`]);
    await hostConfig.SSH().Address().Set(`${host.ip}:22`);
    await hostConfig.SSH().Auth().Add(["main"]);

    // Geographic location
    await hostConfig.Location().Set(host.location);

    // Assign compute shape
    if (!(await hostConfig.Shapes().List()).includes("compute")) {
      await hostConfig.Shapes().Shape("compute").Instance().Generate();
    }
  }
}

// Configure bootstrap nodes for P2P discovery
await config
  .Cloud()
  .P2P()
  .Bootstrap()
  .Shape("compute")
  .Nodes()
  .Add(bootstrapNodes);

// Commit configuration changes
await config.Commit();
```

### Complete Configuration Function

```typescript
const createCloudConfig = async (config: Config) => {
  // Domain setup
  const domain = config.Cloud().Domain();
  await domain.Root().Set("enterprise.starships.ws");
  await domain.Generated().Set("e.ftll.ink");
  await domain.Validation().Generate();
  await config.Cloud().P2P().Swarm().Generate();

  // SSH authentication
  const mainAuth = config.Auth().Signer("main");
  await mainAuth.Username().Set("root");
  await mainAuth.Password().Set(process.env.HOST_PASSWORD!);

  // Service shape definition
  const computeShape = config.Shapes().Shape("compute");
  await computeShape
    .Services()
    .Set(["auth", "tns", "hoarder", "seer", "substrate", "patrick", "monkey"]);
  await computeShape.Ports().Port("main").Set(BigInt(4242));
  await computeShape.Ports().Port("lite").Set(BigInt(4247));

  // Host configuration
  const bootstrapNodes = [];
  for (const host of hostsList) {
    const hostname = `host-${host.id}-enterprise`;
    const hostConfig = config.Hosts().Host(hostname);
    bootstrapNodes.push(hostname);

    await hostConfig.Addresses().Add([`${host.ip}/32`]);
    await hostConfig.SSH().Address().Set(`${host.ip}:22`);
    await hostConfig.SSH().Auth().Add(["main"]);
    await hostConfig.Location().Set(host.location);
    await hostConfig.Shapes().Shape("compute").Instance().Generate();
  }

  await config
    .Cloud()
    .P2P()
    .Bootstrap()
    .Shape("compute")
    .Nodes()
    .Add(bootstrapNodes);
  await config.Commit();
};
```

## Deployment Execution

### Initialize Drive and Plot Course

```typescript
const deployCloud = async () => {
  // Create drive instance
  const drive: Drive = new Drive(config, TauLatest);
  await drive.init();

  // Plot deployment course
  const courseConfig = new CourseConfig(["compute"]); // Deploy compute shape
  const course: Course = await drive.plot(courseConfig);

  return course;
};
```

### Execute Deployment

```typescript
const executeDeploy = async (course: Course) => {
  console.log("Starting deployment...");

  // Start deployment process
  await course.displace();

  // Monitor deployment progress
  console.log("Monitoring deployment progress:");
  for await (const progress of await course.progress()) {
    console.log(`${progress.path}: ${progress.progress}%`);

    if (progress.error) {
      console.error(`Error on ${progress.path}: ${progress.error}`);
    }

    if (progress.progress === 100) {
      console.log(`✓ Completed: ${progress.path}`);
    }
  }

  console.log("Deployment completed!");
};
```

### Complete Deployment Script

```typescript
import { Config, Drive, TauLatest, CourseConfig } from "@taubyte/spore-drive";
import * as fs from "fs";

const main = async () => {
  try {
    // Initialize configuration
    const config = new Config(`${__dirname}/../config`);
    await config.init();

    // Create cloud configuration
    await createCloudConfig(config);

    // Initialize drive and deploy
    const drive = new Drive(config, TauLatest);
    await drive.init();

    const course = await drive.plot(new CourseConfig(["compute"]));

    // Execute deployment
    await course.displace();

    // Monitor progress
    for await (const progress of await course.progress()) {
      console.log(`${progress.path}: ${progress.progress}%`);
    }

    console.log("Cloud deployment successful!");
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
};

main();
```

## Advanced Configuration

### Multi-Region Deployment

```typescript
const regions = [
  {
    name: "us-east",
    hosts: [
      /* east coast hosts */
    ],
  },
  {
    name: "us-west",
    hosts: [
      /* west coast hosts */
    ],
  },
  {
    name: "eu-central",
    hosts: [
      /* european hosts */
    ],
  },
];

for (const region of regions) {
  for (const host of region.hosts) {
    const hostname = `host-${host.id}-${region.name}`;
    // Configure host with region-specific settings
  }
}
```

### Environment-Specific Configuration

```typescript
const createEnvironmentConfig = async (env: "dev" | "staging" | "prod") => {
  const config = new Config(`${__dirname}/../config-${env}`);

  // Environment-specific domains
  const domains = {
    dev: "dev.starships.ws",
    staging: "staging.starships.ws",
    prod: "enterprise.starships.ws",
  };

  await config.Cloud().Domain().Root().Set(domains[env]);
  // ... other env-specific config
};
```

### Custom Service Shapes

```typescript
// Edge nodes (minimal services)
const edgeShape = config.Shapes().Shape("edge");
await edgeShape.Services().Set(["substrate", "seer"]);

// Core nodes (full services)
const coreShape = config.Shapes().Shape("core");
await coreShape.Services().Set(["auth", "tns", "hoarder", "patrick", "monkey"]);

// Storage nodes (data-focused)
const storageShape = config.Shapes().Shape("storage");
await storageShape.Services().Set(["hoarder", "seer"]);
```

## Cloud Provider Integration

### DigitalOcean Example

For a complete example of integrating with cloud providers, see the [DigitalOcean displacement repository](https://github.com/taubyte/digitalocean-displacement).

```typescript
import { DigitalOcean } from "digitalocean-api";

const createDigitalOceanHosts = async (config: Config) => {
  const client = new DigitalOcean(process.env.DO_TOKEN!);

  // Create droplets
  const droplets = await client.droplets.create({
    names: ["tau-node-1", "tau-node-2", "tau-node-3"],
    region: "nyc3",
    size: "s-2vcpu-2gb",
    image: "ubuntu-20-04-x64",
  });

  // Configure hosts in Spore Drive
  for (const droplet of droplets) {
    const hostConfig = config.Hosts().Host(droplet.name);
    await hostConfig
      .Addresses()
      .Add([`${droplet.networks.v4[0].ip_address}/32`]);
    // ... additional configuration
  }
};
```

## Testing and Validation

### Pre-deployment Validation

```typescript
const validateConfig = async (config: Config) => {
  // Validate SSH connectivity
  for (const hostname of await config.Hosts().List()) {
    const host = config.Hosts().Host(hostname);
    const sshAddress = await host.SSH().Address().Get();

    console.log(`Testing SSH to ${hostname} at ${sshAddress}`);
    // Test SSH connection
  }

  // Validate DNS configuration
  const rootDomain = await config.Cloud().Domain().Root().Get();
  console.log(`Validating DNS for ${rootDomain}`);
  // DNS validation logic
};
```

### Post-deployment Testing

```typescript
const testDeployment = async () => {
  const rootDomain = await config.Cloud().Domain().Root().Get();

  // Test HTTP endpoint
  const response = await fetch(`https://${rootDomain}/health`);
  console.log(`Health check: ${response.status}`);

  // Test P2P connectivity
  // Additional validation tests
};
```

## Best Practices

### Configuration Management

- **Version Control**: Store configurations in Git repositories
- **Environment Separation**: Use separate configs for dev/staging/prod
- **Secrets Management**: Use environment variables for sensitive data
- **Documentation**: Document configuration decisions and dependencies

### Deployment Strategy

- **Gradual Rollout**: Deploy to subsets of nodes first
- **Health Checks**: Validate deployments before proceeding
- **Rollback Plan**: Maintain ability to rollback deployments
- **Monitoring**: Set up monitoring before deployment

### Security

- **SSH Key Management**: Use SSH keys instead of passwords when possible
- **Network Security**: Configure proper firewall rules
- **Access Control**: Limit deployment permissions to authorized users
- **Audit Logging**: Log all deployment activities

Spore Drive simplifies Taubyte cloud deployment while maintaining the flexibility and power needed for production environments. For more examples and advanced patterns, check out our [step-by-step tutorial](https://dev.to/samyfodil/build-your-cloud-2nmm).
