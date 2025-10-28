---

title: "Manually deploy tau"

---

## Introduction

Every Taubyte-based Cloud is associated with a Fully Qualified Domain Name (FQDN). You can use any domain or sub-domain you control. For instance, I've chosen `enterprise.starships.ws` for Starship Enterprise's Web Services.

Developers often require a temporary sub-domain for testing. You can use a sub-domain of your main domain or a different one. While `g.enterprise.starships.ws` or `el.starships.ws` are valid, my passion for Sci-Fi inspires me to select `e.ftll.ink` (Enterprise's Faster Than Light Link).

> 💡 **Note**: The domain can be local, but it must resolve on the hosts where `tau` is installed.

## Infrastructure Setup

Choose your infrastructure. The only requirement is hosts (bare metal or VMs) running Ubuntu.

For this example, I provisioned 3 VMs:

| Name                           | Location     | IP             |
| ------------------------------ | ------------ | -------------- |
| host-001-enterprise-starships-ws | Iowa         | 34.133.173.124 |
| host-002-enterprise-starships-ws | Toronto      | 34.130.131.76  |
| host-003-enterprise-starships-ws | Los Angeles  | 35.235.122.141 |

> 💡 **Note**: This setup is temporary and will be decommissioned eventually. It remains accessible for testing while operational.

## Firewall Configuration

Ensure the following ports are open:

| Ports        | Protocols | Description                                          |
| ------------ | --------- | ---------------------------------------------------- |
| 4242, 4247, 4252 | TCP       | For Peer-to-peer communication and IPFS.             |
| 80, 443      | TCP       | For HTTP and HTTPS - serving APIs and hosted resources. |
| 53, 953      | TCP, UDP  | For DNS resolution.                                   |

## Preparing the Hosts

### Installing curl & vim

Ensure `curl` and `vim` (or your preferred text editor) are installed:

```sh
sudo apt update
sudo apt install curl vim
```

> 💡 **Tip**: If you're unfamiliar with `vim`, try [vim-adventures](https://vim-adventures.com/) for a fun introduction.

### Freeing Up DNS Ports

Adjust DNS settings for the seer service:

```sh
sudo vim /etc/systemd/resolved.conf
```

In edit mode (`:i`), configure:

```ini
DNS=1.1.1.1
DNSStubListener=no
```

Apply the changes:

```sh
sudo systemctl restart systemd-resolved.service
sudo ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
```

### Docker Installation

Install Docker:

```sh
curl -fsSL https://get.docker.com | sh
```

## Setting Up the First Host

The initial host, `host-001-enterprise-starships-ws`, will generate our cloud's secrets.

### Installing Tau

Install `tau`:

```sh
curl https://get.tau.link/tau | sh
```

> 💡 **Note**: A single host can support multiple nodes if ports do not overlap. For this guide, we use a one-node-per-host configuration.

Upon successful installation, you should see:

```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  3982  100  3982    0     0   3962      0  0:00:01  0:00:01 --:--:--  3966
Downloading release: v1.1.2
From: https://github.com/taubyte/tau/releases/download/v1.1.2/tau_1.1.2_linux_amd64.tar.gz
######################################################################## 100.0%
Installation complete
```

### Configuring Your Node

Configure the node with:

```sh
sudo tau config generate -n enterprise.starships.ws \
      -s compute --services all --ip 34.133.173.124 \
      --dv --swarm 
```

Here's a quick rundown of the options used:
- `--services all` activates all available services.
- `-n` specifies the domain name (or network name) for the node.
- `-s` assigns a name to this configuration, often referred to as a "shape."
- `--ip` indicates the IP address the node should use for announcements.
- `--dv` generates a domain validation key pair.
- `--swarm` creates a swarm key for network clustering.

> 💡 **Note**: Enabling all protocols on a single node is not advisable in deployments with meaninful workloads. You should be mindful of not having services like `substrate` or `monkey` eating up all the resources.

Upon successful configuration, you'll receive the node's ID:

```
[INFO] ID: 12D3KooWKv5oNF2a6h9sYzRUPEAaYe6feTbBbcLYZYVFrMDDCHzY
```

#### Fine-tuning the Configuration

Adjust the configuration for optimal performance:

```sh
sudo vi /tb/config/compute.yaml
```

Update the `generated` domain to match your preferred domain, e.g., `e.ftll.ink`:

```yaml
generated: e.ftll.ink
```

Remove the `gateway` protocol since `gateway` and `substrate` cannot coexist:

```yaml
privatekey: <redacted>
swarmkey: keys/swarm.key
services:
    - auth
    - patrick
    - monkey
    - tns
    - hoarder
    - substrate
    - seer
p2p-listen:
    - /ip4/0.0.0.0/tcp/4242
p2p-announce:
    - /ip4/34.133.173.124/tcp/4242
ports:
    main: 4242
    lite: 4247
    ipfs: 4252
location:
    lat: 40.076897
    long: -109.33771
network-fqdn: enterprise.starships.ws
domains:
    key:
        private: keys/dv_private.pem
        public: keys/dv_public.pem
    generated: e.ftll.ink
plugins: {}
```

> 💡 **Tip**: Correct the location manually if inaccurately determined.

Validate the configuration:

```sh
sudo tau conf validate -s compute
```

No error messages indicate a correct configuration.

## Manually Starting the Node

Start the node manually:

```sh
sudo tau start -s compute
```

Verify the node is active by navigating to [slimdig.com](https://slimdig.com) and performing a check with `seer.tau.<your domain>`, your server's public IP, and clicking the `A` button.

![](/images/slimdig-seer-tau-ent-starships-ws.png)

Seeing your server's IP address verifies the node is operational.

## Transitioning to a Systemd Service

Convert the manually started service into a systemd service for resilience:

1. Stop the service with CTRL-C.
2. Create a systemd service file:

```sh
sudo vim /lib/systemd/system/tau@.service
```

Add the following configuration:

```ini
[Unit]
Description=Taubyte Tau Service Running %i

[Service]
Type=simple
ExecStart=/tb/bin/tau start -s %i
StandardOutput=journal
User=root
Group=root

LimitAS=infinity
LimitRSS=infinity
LimitCORE=infinity
LimitNOFILE=65536

Restart=always
RestartSec=1

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```sh
sudo systemctl enable tau@compute
sudo systemctl start tau@compute
```

Check the service status:

```sh
sudo systemctl status tau@compute
```

You should see:

```
● tau@compute.service - Taubyte Tau Service Running compute
     Loaded: loaded (/lib/systemd/system/tau@.service; enabled; vendor preset: enabled)
     Active: active (running) since Fri 2024-02-09 22:43:52 UTC; 1min 5s ago
   Main PID: 4588 (tau)
      Tasks: 14 (limit: 38492)
     Memory: 202.0M
        CPU: 53.521s
     CGroup: /system.slice/system-tau.slice/tau@compute.service
             └─4588 /tb/bin/tau start -s compute

Feb 09 22:43:52 host-001-enterprise-starships-ws systemd[1]: Started Taubyte Tau Service Running compute.
```

This ensures your node remains operational across restarts and updates.

## Configuring DNS for Load Balancing

The Seer protocol enables DNS load balancing within the your cloud, translating protocols into valid IP addresses using the `<protocol>.tau.<domain>` convention. This allows efficient load balancing with a simple CNAME (or ALIAS) record.

### Delegating the `tau` Subdomain

Delegate the `tau` subdomain to nodes running the Seer protocol. Here's how with Namecheap for `starships.ws`:

Add the Node as an A Record:

   - Select the A record type.
   - Name it `seer.<domain>`.
   - Enter the node's IP address.
   - Validate the entry.

   ![](/images/add-a-seer-entry-node-1-enterprise-starships-ws.png)

Delegate with an NS Record:

   - Choose the NS record type.
   - Label it `tau.<domain>`.
   - Set its value to `seer.<domain>`.
   - Validate the entry.

   ![](/images/add-ns-entry-enterprise-starships-ws.png)

### Verifying the Configuration

Use a tool like slimdig to verify the DNS configuration:

- Enter `<protocol>.tau.<domain>` (e.g., `tns.tau.enterprise.starships.ws`).
- Set the query to a public DNS server like 8.8.8.8.
- Click the `A` button to perform the lookup.

![](/images/slimdig-tau-entry-enterprise-starships-ws.png)

> 💡 **Note**: DNS propagation can delay effectiveness, requiring multiple attempts over several minutes.

Congratulations, your cloud is operational! If you'd like to try it out right away, check out [Take it for a spin!](../12-try-the-cloud).

## Adding the Other Nodes

To expand your Taubyte-based Cloud, add more hosts.

### Exporting the Configuration Template

Create a configuration template to replicate the setup across additional hosts:

```sh
sudo tau config export -s compute --protect
```

Enter a password for encryption:

```txt
Password?
```

The exported configuration will look like this (omit `location` for other nodes):

The exported configuration will resemble the following (omit the `location` to let it be automatically determined for the other nodes):
```yaml
origin:
  shape: compute
  host: host-001-enterprise-starships-ws
  time: 2024-02-12T05:41:25.218338331Z
  protected: true
source:
  swarmkey: PZuGcV96BbfM...2RE8ZEfR2pZoM29z8
  services:
  - auth
  - patrick
  - monkey
  - tns
  - hoarder
  - substrate
  - seer
  p2p-listen:
  - /ip4/0.0.0.0/tcp/4242
  p2p-announce:
  - /ip4/34.133.173.124/tcp/4242
  ports:
    main: 4242
    lite: 4247
    ipfs: 4252
  network-fqdn: enterprise.starships.ws
  domains:
    key:
      private: BDN9SEUFsolg...25pUUrUpFxSFhjlCv
      public: cmS5kmov/cJ9...NezzWwcYVj4YVNOg
    generated: e.ftll.ink
  plugins: {}
```

Retrieve the first node's [multi-address](https://docs.libp2p.io/concepts/fundamentals/addressing/):

```sh
sudo tau config show -s compute | grep Announce
```

The output provides the address for peer connections:

```txt
│ P2PAnnounce │ /ip4/34.133.173.124/tcp/4242/p2p/12D3KooWKv5oNF2a6h9sYzRUPEAaYe6feTbBbcLYZYVFrMDDCHzY │
```

### Preparing the Additional Hosts

SSH into the remaining hosts, prepare them as described in the [Preparing the Hosts](#preparing-the-hosts) section. Transfer the `compute.tmpl.yaml` template and the systemd service file to each.

### Installing Tau

Install `tau` on each new host:

```sh
curl https://get.tau.link/tau | sh
```

### Configuring the Additional Hosts

For the Second Host:

    ```sh
    $ sudo tau config gen --ip 34.130.131.76 --use compute.tmpl.yaml  --bootstrap /ip4/34.133.173.124/tcp/4242/p2p/12D3KooWKv5oNF2a6h9sYzRUPEAaYe6feTbBbcLYZYVFrMDDCHzY
    ```

For the Third Host:

    ```sh
    $ sudo tau config gen --ip 35.235.122.141 --use compute.tmpl.yaml  --bootstrap /ip4/34.133.173.124/tcp/4242/p2p/12D3KooWKv5oNF2a6h9sYzRUPEAaYe6feTbBbcLYZYVFrMDDCHzY
    ```


### Systemd Setup

Ensure the `tau` service starts automatically on each host:

```sh
sudo cp ~/tau@.service /lib/systemd/system/tau@.service
sudo systemctl enable tau@compute
sudo systemctl start tau@compute
```

Verify the service status:

```sh
sudo systemctl status tau@compute
```

### DNS Verification

Ensure all nodes are registered and operational using DNS queries:

1. Enter `<protocol>.tau.<domain>` and select `A` to perform the query.

![](/images/slimdig-all-three-nodes-running-enterprise-starships-ws.png)

All three servers should be listed, indicating successful integration.

## Final Adjustments

### DNS Adjustments

**Main Domain:** Add `A` records for each new host.

![](/images/add-for-all-a-seer-tau-entry-enterprise-starships-ws.png)

A DNS lookup should reflect all active hosts:

![](/images/slimdig-all-seer-tau-ent-starships-ws.png)

**Generated Domain:** Delegate the subdomain to your cloud by adding an `NS` entry.

![](/images/add-ns-entry-s-ftll-ink.png)

### Bootstrapping for Recovery and Expansion

Ensure all nodes are aware of each other:

1. Collect and share multi-addresses among nodes.
2. Update the `peers` section in each node's configuration.

```yaml
peers:
  - /ip4/34.133.173.124/tcp/4242/p2p/12D3KooWKv5oNF2a6h9sYzRUPEAaYe6feTbBbcLYZYVFrMDDCHzY
  - /ip4/34.130.131.76/tcp/4242/p2p/12D3KooWHrp2t9npN2TW4dv47uEvJh6qfs6U2ymhkiVVNpcR3cWE
  - /ip4/35.235.122.141/tcp/4242/p2p/12D3KooWKQJfLU74VJzsvhAKUJ8KQidBr1CowMo1e1YRrSb2vTZd
```

Validate the configuration:

```sh
sudo tau config check -s compute
```

No error messages indicate readiness.

### Restart?

No manual restarts are needed. Discovered peers are maintained in a persistent database, ensuring automatic recognition after recovery or reconfiguration.

