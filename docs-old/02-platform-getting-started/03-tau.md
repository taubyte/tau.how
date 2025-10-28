---

title: Tau

---


Tau is at the core of the platform. It implements all the services that are discussed in [Services](../02-services). It is a **dependency-free single binary** that can be run on most popular operating systems (Linux, MacOS, Windows) and architectures (x86, ARM).
> 💡 **Note**: Tau is meant to be deployed, not run locally for the prupose of development. If you'd like to develop locally, check out [Dream](../04-dream).

### Identity

### Root
Tau takes a root, defaulting to `/tau`, directory as an argument. This is the directory that contains configuration files and data. Tau will expect the following structure:
```
<root>
├── cache
├── storage 
├── config
│   └── keys
└── plugins
```

### Shape
Services on Taubyte run on virtual sterams thanks to the multiplexing capabilities of the transport layer. This allows you to run any set of services you want within a given node. So we decied to make it so our binary can be configured with a set of services to run. Initially we named Tau, "Odo", the shapeshifer caracter in StarTrek DS-9, because of this capability. And yes, this was why we named the set of services a "shape".

Tau takes the shape as an argument and will look for `config/<shape>.yaml` in the root directory.



### Configuration
Tau's configuration is stored in the `config` directory and is kept to a minimum. Here's an example of what a configuration file looks like:
```yaml
privatekey: <redacted>
swarmkey: keys/swarm.key
services:
    - auth
    - patrick
    - tns
    - seer
p2p-listen:
    - /ip4/0.0.0.0/tcp/4242
p2p-announce:
    - /ip4/1.2.3.4/tcp/4242
ports:
    main: 4242
    lite: 4247
location:
    lat: 40.076897
    long: -109.33771
network-fqdn: enterprise.starships.ws
domains:
    key:
        private: keys/dv_private.pem
        public: keys/dv_public.pem
    generated: e.ftll.ink
peers:
  - /ip4/4.3.2.1/tcp/4242/p2p/<PeerID>
plugins: {}
```

Most of the time you will be able to generate this configuration either with tau or using spore-drive (recommended).

### Deployment
You can deploy tau in a few different ways.

#### Using spore-drive
If you'd rather use code to deploy and maintain tau, you can use spore-drive. 

=== "Typescript"

    ```bash
    npm install @taubyte/spore-drive
    ```

=== "Go"

    ```bash
    go get github.com/taubyte/spore-drive
    ```

For a quick start, check [Deploy with spore-drive]().

#### Using the install script
If you'd rather deploy tau from the command line, you can use the install script, which will download the latest version of Tau and install it:
```bash
curl https://get.tau.link/tau | sh
```
> 💡 **Note**: This script is designed for Linux systems and has been extensively tested on Ubuntu.


#### Manual
Another way to go is to manually download the latest version of Tau from the [releases page](https://github.com/taubyte/tau/releases).

#### From Source
The [taubyte/tau](https://github.com/taubyte/tau) project focuses on not having any dependency the go toolchain can't build. So you can build it with the following command:
```bash
go install github.com/taubyte/tau
```

### Requirements
#### System
Tau is dependency free, but some services will have some requirements:

 - Monkey will require a container runtime, like docker or podman.
 - Once unikernels are supported, Substrate will require qemu to be installed.
 - Once containers are supported, Substrate will also require a container runtime.

#### Network
- Port 80 and 443 must be free.
- Port 53 and 953 must be free, if you're running Seer.

#### Hardware
Tau's hardware requirements are flexible and scale with your needs. While there are no strict minimum specifications, the system's performance and capacity to handle load will directly correlate with the underlying hardware capabilities.

> 💡 **Note**: We've successfully tested Tau across a wide range of devices, from resource-constrained environments like Raspberry Pi 3, 4 & 5 to high-performance servers.