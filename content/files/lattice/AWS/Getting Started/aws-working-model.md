# AWS Working Model

AWS is easiest to understand as a set of layers that work together:

```text
account → Region → Availability Zone → network → identity → service → workload
```

## Account and Organization

An AWS account is a security and billing boundary. Larger teams often use AWS Organizations to separate environments such as development, staging, and production while applying central governance.

## Regions and Availability Zones

A Region is a geographic area containing multiple isolated Availability Zones. Deploying across more than one Availability Zone can improve resilience, while choosing a Region involves latency, legal requirements, available services, and cost.

## Networking

Resources run inside networks such as a VPC. Subnets, route tables, security groups, load balancers, and connectivity services determine how workloads communicate with each other and with the internet.

## Identity and Access

IAM controls who or what can access AWS resources. Prefer temporary credentials and roles, least-privilege permissions, MFA for human access, and separate identities for workloads and people.

## Services and Workloads

AWS services are building blocks, not complete architectures by themselves. A workload combines services to meet requirements for availability, security, performance, operations, and cost.

## A Useful Design Sequence

1. Define the workload and its data.
2. Choose a Region and availability target.
3. Design the network boundaries.
4. Define identities and least-privilege access.
5. Select managed services that fit the workload.
6. Add monitoring, backups, deployment automation, and cost controls.
