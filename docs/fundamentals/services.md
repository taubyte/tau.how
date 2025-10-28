# Services

Taubyte's distributed architecture consists of several core services that work together to provide cloud computing capabilities. Each service has a specific role and can be replicated across multiple nodes for high availability and scalability.

## Auth Service

![](/images/auth-service-overview-dia.png)

The Auth service is the cornerstone of security, managing authentication, authorization, and secrets across the platform. It integrates with Git providers to map repository access to projects and securely stores credentials for other services.

**Key Responsibilities:**

- Deployment keys management
- WebHook secrets storage
- X509 certificates handling
- ACME challenges (e.g., Let's Encrypt)
- Repository access mapping to projects

Auth is a replicated service, utilizing CRDT (Conflict-free Replicated Data Type) for high throughput and seamless horizontal scaling.

## Seer Service

![](/images/seer-service-overview-dia.png)

Seer functions as the network's directory, maintaining a comprehensive record of all nodes. It stores data on services, usage, and metadata, sharing this information internally with services like `gateway` and externally via DNS.

**Key Responsibilities:**

- Node discovery and registration
- Service availability tracking
- DNS service provision
- Load balancing information
- Network topology management

Seer nodes communicate through pub-sub and use CRDT to maintain consistency across replicas.

## TNS (Taubyte Name Service)

![](/images/tns-service-overview-dia.png)

TNS is a powerful distributed registry that keeps track of all projects hosted on the platform. It is designed to map GitHub branches and commits, ensuring version consistency across the board.

**Key Responsibilities:**

- Project registry management
- Git branch and commit mapping
- Configuration versioning
- Project change detection
- Distributed configuration storage

TNS leverages CRDT for seamless replication, providing high reliability and consistency across the network.

## Gateway Service

![](/images/gateway-service-overview-dia.png)

The Gateway service acts as the platform's load balancer. It identifies nodes running the `substrate` service and maintains multiplexed connections with healthy nodes.

**Key Responsibilities:**

- Layer 7 load balancing
- Health monitoring of substrate nodes
- Request routing and distribution
- Connection pooling and management
- Performance optimization

Requests are routed based on a scoring system that evaluates factors like cache status, resource availability, and latency.

## Patrick Service

![](/images/patrick-service-overview-dia.png)

Patrick orchestrates CI/CD jobs, listening for events from Git providers over HTTPS. It validates requests, creates build jobs with appropriate attributes, and manages job lifecycles.

**Key Responsibilities:**

- Git webhook event processing
- CI/CD job creation and scheduling
- Build job lifecycle management
- Job status tracking and updates
- Integration with version control systems

Patrick uses CRDT for replication, ensuring high availability of CI/CD orchestration.

## Monkey Service

![](/images/monkey-service-overview-dia.png)

Monkey is a worker service that competes for CI/CD jobs. It implements a race-to-lock system for job execution to prevent conflicts.

**Key Responsibilities:**

- CI/CD job execution
- Build environment provisioning
- Job competition and locking
- Status reporting to Patrick
- Asset publication to TNS
- Artifact marking for replication

Once a job is locked by a Monkey instance, it executes the build, sends status and logs to Patrick, publishes configuration to TNS, and marks assets for replication by the `hoarder` service.

## Hoarder Service

![](/images/hoarder-service-overview-dia.png)

Hoarder manages the replication of assets, storage, and databases across the network. It implements a distributed storage strategy based on content rarity and availability.

**Key Responsibilities:**

- Asset replication management
- Storage distribution coordination
- Database replication handling
- Content rarity assessment
- Distributed storage optimization

Instances of Hoarder communicate asset and resource IDs, assigning rarity scores. Rare items prompt competition among Hoarder instances for storage, ensuring high availability of critical content.

## Substrate Service

![](/images/substrate-service-overview-dia.png)

Substrate is the powerhouse of event processing in Taubyte. It actively listens for events from various sources and executes the corresponding functions or serves content.

**Key Responsibilities:**

- HTTP request processing
- WebSocket connection management
- Function execution
- Static content serving
- Event handling and routing
- Real-time communication support

Substrate nodes are the workhorses that actually run your applications, process requests, and deliver responses to users.

## Service Interaction

These services work together to provide a complete cloud platform:

1. **Auth** secures the platform and manages access control
2. **Seer** provides service discovery and network awareness
3. **TNS** maintains project configurations and version tracking
4. **Gateway** routes traffic efficiently to healthy nodes
5. **Patrick** orchestrates builds and deployments
6. **Monkey** executes the actual build and deployment work
7. **Hoarder** ensures data availability and replication
8. **Substrate** serves applications and processes user requests

This distributed service architecture provides resilience, scalability, and performance while maintaining security and ease of management.
