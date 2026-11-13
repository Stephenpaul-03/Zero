# AWS Global Infrastructure

- AWS global infrastructure is the physical foundation used to deliver services with appropriate availability, latency, scalability, and fault tolerance.
## AWS Regions
- A Region is a geographic area containing multiple Availability Zones.
- Many services and resources are Region-scoped, so confirm availability before designing around a service.
- Region names look like `us-east-1` and `eu-west-1`.
- Choose based on latency, regulatory requirements, available services, resilience goals, and pricing.
## AWS Availability Zones
- An Availability Zone is one or more discrete data centers with independent power, networking, and connectivity.
- Availability Zones within a Region are physically separate and connected with low-latency, high-bandwidth networking.
- Use multiple Availability Zones when the workload requires resilience to a single-zone failure.
## AWS Edge Locations / Points of Presence
- Used for providing content to end user with low latency
- Edge locations help deliver content and responses closer to end users, commonly through services such as CloudFront.
## AWS Regional Edge Caches
- Larger, centralized caching layer located between the Origin Server and Edge Locations.
