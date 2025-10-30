---

title: Platform Overview

---

> 💡 **Note**: Before you start digging deeper, it's important to note that because we wanted something that does not carry the baggage of the traditional cloud platforms, we built Taubyte from the ground up. So be reasured, Taubyte does not build nor depends on kubernetes!


Taubyte's goal is `Local Development = Global Production`. What this means for us is:

- **Great Developer Experience**: Developers should be self serving and they have the tools to build locally, as well as the abstractions for their code to scale globally.
- **Scalability**: It should scale both horizontally and vertically without a kluger of code and configuration, you know, the polar opposite of kubernetes.
- **Security**: Encryption and restricted/contained execution are core principles. All communication is encrypted, node identity and content is verified, and secure execution runtimes are preferred.

### Capabilities
As of the time of writing, these are the cloud computing capabilities that are available:

- Serverless Functions
- Websites Hosting
- Key/Value Databases
- Object Storage
- Messaging (Pub/Sub)
- CI/CD

> 💡 **Note**: We are working on adding more capabilities like unikernels, containers, and more to the platform, so this list is not final.

### Features

- **Git-Native**: Infrastructure changes through Git, with branch-based environments
- **Local Development**: Test locally with the same environment as production
- **P2P Architecture**: Secure peer-to-peer communication with automatic discovery
- **Advanced Storage**: Content-addressed system with automatic deduplication
- **Computing**: WebAssembly execution with edge capabilities
- **Security**: Zero-configuration HTTPS/TLS with automatic certificate management
- **Simple Deployment**: Single binary deployment with minimal configuration
- **Ready to Use**: Immediate developer access via Web Console, CLI, or manual configuration
- **Flexible Environments**: Create new environments by pointing nodes to different branches


<!-- 

 A slightly opinionated one to favor developer experience but one that is designed to be easy to use and understand. And as a platform is has a few key attributes.



Taubyte is an open-source, Git-native cloud computing platform that enables developers to build and maintain highly scalable cloud infrastructure with minimal configuration. It serves as an alternative to traditional cloud platforms like Vercel, Netlify, Cloudflare, and AWS services.

## Key Features

### For Developers
- **Git-Native**: Infrastructure changes through Git, with branch-based environments
- **Local Development**: Test locally with the same environment as production
- **P2P Architecture**: Secure peer-to-peer communication with automatic discovery
- **Advanced Storage**: Content-addressed system with automatic deduplication
- **Computing**: WebAssembly, unikernel & container execution with edge capabilities
- **Security**: Zero-configuration HTTPS/TLS with automatic certificate management

### For Platform Engineers
- **Simple Deployment**: Single binary deployment with minimal configuration
- **Ready to Use**: Immediate developer access via Web Console, CLI, or manual configuration
- **Flexible Environments**: Create new environments by pointing nodes to different branches

## Benefits
- Minimal configuration with auto-discovery
- Local development matches production
- Highly scalable distributed architecture
- No vendor lock-in
- Easy maintenance -->
