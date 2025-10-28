---

title: Services

---

Taubyte's architecture allows nodes to host multiple services, with the exception of `gateway` and `substrate`. For a cloud to operate optimally, it requires at least one instance of each service, except for `gateway`.

### Auth
![](/images/auth-service-overview-dia.png)

The Auth service is the cornerstone of security, managing authentication, authorization, and secrets across the platform. It integrates with git providers to map repository access to projects and securely stores credentials for other services. Auth serves as the central authority for:

- Deployment keys
- WebHook secrets
- X509 certificates
- ACME challenges (e.g., Let's Encrypt)

Auth is a replicated service, utilizing CRDT for high throughput and seamless horizontal scaling.

### Seer
![](/images/seer-service-overview-dia.png)

Seer functions as the network's directory, maintaining a comprehensive record of all nodes. It stores data on services, usage, and metadata, sharing this information internally with services like `gateway` and, in a way, externally via DNS. Seer acts as a DNS service, facilitating discovery and load balancing. Seer nodes communicate through pub-sub and use CRDT to maintain consistency.

### TNS
![](/images/tns-service-overview-dia.png)

TNS, or Taubyte Name Service, is a powerful distributed registry that keeps track of all the projects hosted on the platform. It is designed to map GitHub branches and commits, ensuring version consistency across the board. This makes it incredibly easy to verify if a project has changed. TNS leverages CRDT (Conflict-free Replicated Data Type) for seamless replication, just like the Auth and Seer services, providing high reliability and consistency.

### Gateway
![](/images/gateway-service-overview-dia.png)

The Gateway service acts as the platform's load balancer. It identifies nodes running the `substrate` service and maintains multiplexed connections with healthy nodes. Requests are routed based on a scoring system that evaluates factors like cache status, resource availability, and latency.

### Patrick
![](/images/patrick-service-overview-dia.png)

Patrick orchestrates CI/CD jobs, listening for events from git providers over HTTPS. It validates requests, creates build jobs with appropriate attributes (e.g., commit ID), and manages job lifecycles, updating job statuses. Patrick, like other services, uses CRDT for replication.

### Monkey
![](/images/monkey-service-overview-dia.png)

Monkey is a worker service that competes for CI/CD jobs. Given that CI/CD jobs aren't executed immediately, a race-to-lock system is employed. Once a job is locked, it is executed, with status and logs sent to Patrick. Configuration is published to TNS, and assets are marked for replication by the `hoarder` service.

### Hoarder
![](/images/hoarder-service-overview-dia.png)

Hoarder manages the replication of assets, storage, and databases. Instances of Hoarder communicate asset and resource IDs, assigning rarity scores. Rare items prompt competition among Hoarder instances for storage.

### Substrate
![](/images/substrate-service-overview-dia.png)

Substrate is the powerhouse of event processing in Taubyte. It actively listens for events from various sources such as HTTP requests, Pub-Sub messages, and more.

