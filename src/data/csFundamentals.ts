import { CsFundTopic } from '../types';

export const initialCsFundTopics: CsFundTopic[] = [
  // Operating Systems
  {
    id: 'cs-os-1',
    category: 'OS',
    title: 'Process vs Thread & Context Switching',
    description: 'Process memory layout, PCB/TCB, user vs kernel space, context switch overhead.',
    completed: false,
  },
  {
    id: 'cs-os-2',
    category: 'OS',
    title: 'CPU Scheduling Algorithms',
    description: 'FCFS, SJF, Round Robin, Multi-level Feedback Queues, Preemptive vs Non-preemptive.',
    completed: false,
  },
  {
    id: 'cs-os-3',
    category: 'OS',
    title: 'Process Synchronization & Mutex/Semaphores',
    description: 'Critical Section Problem, Peterson solution, Mutex vs Counting Semaphore, Producer-Consumer.',
    completed: false,
  },
  {
    id: 'cs-os-4',
    category: 'OS',
    title: 'Deadlocks & Prevention/Avoidance',
    description: '4 Coffman conditions, Resource Allocation Graph, Banker algorithm, Deadlock detection & recovery.',
    completed: false,
  },
  {
    id: 'cs-os-5',
    category: 'OS',
    title: 'Memory Management & Paging',
    description: 'Logical vs Physical address, Paging, Page tables, TLB cache, Segmentation.',
    completed: false,
  },
  {
    id: 'cs-os-6',
    category: 'OS',
    title: 'Virtual Memory & Page Replacement',
    description: 'Demand paging, Page faults, LRU, FIFO, Optimal replacement, Belady anomaly, Thrashing.',
    completed: false,
  },

  // DBMS
  {
    id: 'cs-db-1',
    category: 'DBMS',
    title: 'ACID Properties & Transaction States',
    description: 'Atomicity, Consistency, Isolation levels (Read Uncommitted to Serializable), Durability, Write-Ahead Logging.',
    completed: false,
  },
  {
    id: 'cs-db-2',
    category: 'DBMS',
    title: 'Normalization (1NF to BCNF)',
    description: 'Functional dependencies, Anomalies (Insertion, Deletion, Update), 1NF, 2NF, 3NF, BCNF.',
    completed: false,
  },
  {
    id: 'cs-db-3',
    category: 'DBMS',
    title: 'B-Trees, B+ Trees & Database Indexing',
    description: 'Clustered vs Non-clustered indexes, B+ Tree search/insertion, Composite indexes, Covering indexes.',
    completed: false,
  },
  {
    id: 'cs-db-4',
    category: 'DBMS',
    title: 'Concurrency Control & 2-Phase Locking',
    description: 'Schedules (Serial, Serializable), Conflict vs View serializability, 2PL, Strict 2PL, Timestamp ordering.',
    completed: false,
  },
  {
    id: 'cs-db-5',
    category: 'DBMS',
    title: 'SQL Joins & Query Execution Plans',
    description: 'Inner, Left, Right, Full Outer, Cross joins, Hash Join vs Nested Loop vs Merge Join, EXPLAIN ANALYZE.',
    completed: false,
  },
  {
    id: 'cs-db-6',
    category: 'DBMS',
    title: 'NoSQL, CAP Theorem & PACELC',
    description: 'Consistency, Availability, Partition tolerance, Document vs Key-Value vs Columnar vs Graph, Eventual consistency.',
    completed: false,
  },

  // Computer Networks
  {
    id: 'cs-cn-1',
    category: 'CN',
    title: 'OSI vs TCP/IP 7-Layer Protocol Stack',
    description: 'Encapsulation, de-encapsulation, PDUs (Frame, Packet, Segment), physical to application layer.',
    completed: false,
  },
  {
    id: 'cs-cn-2',
    category: 'CN',
    title: 'TCP vs UDP & 3-Way Handshake / 4-Way Teardown',
    description: 'SYN, SYN-ACK, ACK, Connection termination, Flow control (sliding window), Congestion control (AIMD).',
    completed: false,
  },
  {
    id: 'cs-cn-3',
    category: 'CN',
    title: 'DNS Resolution Lifecycle & CDN Edge Caching',
    description: 'Root servers, TLD, Authoritative DNS, Recursive resolvers, Anycast routing, CDN edge caches.',
    completed: false,
  },
  {
    id: 'cs-cn-4',
    category: 'CN',
    title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3 & SSL/TLS Handshake',
    description: 'Head-of-line blocking, Multiplexing, QUIC over UDP, Asymmetric vs Symmetric encryption, Certificates.',
    completed: false,
  },
  {
    id: 'cs-cn-5',
    category: 'CN',
    title: 'WebSockets, SSE & Long Polling',
    description: 'Full-duplex bidirectional communication, HTTP upgrade headers, Server-Sent Events vs WebSockets trade-offs.',
    completed: false,
  },

  // Object-Oriented Programming (OOP)
  {
    id: 'cs-oop-1',
    category: 'OOP',
    title: '4 Core Pillars of OOP',
    description: 'Encapsulation, Abstraction, Inheritance, Polymorphism (Compile-time vs Runtime, Method Overloading/Overriding).',
    completed: false,
  },
  {
    id: 'cs-oop-2',
    category: 'OOP',
    title: 'SOLID Design Principles with Code Examples',
    description: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
    completed: false,
  },
  {
    id: 'cs-oop-3',
    category: 'OOP',
    title: 'Creational Patterns (Singleton, Factory, Builder)',
    description: 'Thread-safe Singleton, Factory Method, Abstract Factory, Fluent Builder pattern.',
    completed: false,
  },
  {
    id: 'cs-oop-4',
    category: 'OOP',
    title: 'Structural & Behavioral Patterns (Observer, Strategy, Decorator)',
    description: 'Pub-Sub vs Observer, Strategy pattern for swappable algorithms, Decorator pattern, Adapter.',
    completed: false,
  },

  // System Design Basics
  {
    id: 'cs-sd-1',
    category: 'System Design',
    title: 'Horizontal vs Vertical Scaling & Stateless Architecture',
    description: 'Scaling limitations, shared-nothing architecture, sticky sessions vs token-based distributed state.',
    completed: false,
  },
  {
    id: 'cs-sd-2',
    category: 'System Design',
    title: 'Load Balancing & Consistent Hashing',
    description: 'L4 vs L7 load balancers, Round Robin, Least Connections, Consistent Hashing ring & virtual nodes.',
    completed: false,
  },
  {
    id: 'cs-sd-3',
    category: 'System Design',
    title: 'Distributed Caching Patterns',
    description: 'Cache-Aside, Read-Through, Write-Through, Write-Behind, Cache stampede & Cache penetration defenses.',
    completed: false,
  },
  {
    id: 'cs-sd-4',
    category: 'System Design',
    title: 'Message Queues & Event-Driven Decoupling',
    description: 'Kafka / RabbitMQ, At-least-once vs Exactly-once semantics, Idempotency keys, Dead-letter queues.',
    completed: false,
  },
  {
    id: 'cs-sd-5',
    category: 'System Design',
    title: 'Rate Limiting Algorithms (Token Bucket, Leaky Bucket)',
    description: 'Token Bucket, Leaky Bucket, Fixed Window Counter, Sliding Window Log, Sliding Window Counter with Redis.',
    completed: false,
  },
];
