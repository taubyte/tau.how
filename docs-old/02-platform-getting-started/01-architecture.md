---

title: Architecture

---

At it's core Taubyte is a distributed peer-to-peer network of nodes providing services that make up the platform. Each node has it's own unique identity and can provide one or many services.

![](/images/taubyte-based-cloud-iso-p2p-image.png)

### Discovery & Routing
Within the cloud, node will advertise services and data to other nodes. The gathered information is stored in a specialized type known as a Kademlia Distributed Hash Table (DHT). This enables the cloud to keep an active directory of nodes and resources without relying on a central service, thereby enhancing the platform's resilience.

However because of downsides like, Uneven Key Distribution and Stale Entries, we only rely on the DHT for low-level information.

### Transport
The transport layer builds an overlay over TCP offering secure communication, resiliency and efficient usage of the network ressources thanks to multiplexing.

### Tunneling
In the case where nodes might be in different networks, public nodes acting as relay will facilitate communication between nodes by establishing a dynamic tunnels. Basically freeing you from ever having to deal with VPNs!

### Data
Data is stored in a content-addressed system with automatic deduplication. This means that each piece of data is identified by its content, rather than its location in the network. This approach enhances data integrity, reduces storage overhead, and improves scalability. A mechanism known as Bitswap is used to exchange data between nodes allowing efficient and fast data transfer.

### Services
Services are what turns the peer-to-peer into a cloud computing platform. They are discussed in [Services](../02-services).