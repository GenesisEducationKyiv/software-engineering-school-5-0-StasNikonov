# ADR-001: Choosing PostgreSQL as the Database

**Status:** Accepted  
**Date:** 2025-06-08  
**Author:** Stanislav Nikonov

**Context:**  
We are building a new application that requires a reliable, scalable, and well-supported relational database. The database must support complex queries, data integrity, transactional safety, and should be compatible with modern development tools and deployment environments. The main criteria for selection include:

- Stability and maturity
- Full SQL support and ACID compliance
- Support for relational constraints (foreign keys, joins, etc.)
- Horizontal and vertical scalability
- Free and open-source licensing
- Active development community and documentation
- Good integration with backend languages (Node.js)

**Considered Options:**

1. PostgreSQL
2. MySQL
3. SQLite
4. MongoDB

---

## Detailed Analysis of Options

| DBMS          | Advantages                                                          | Disadvantages                                                    | Fit to Requirements                      |
|---------------|--------------------------------------------------------------------|------------------------------------------------------------------|-----------------------------------------|
| **PostgreSQL**| Full SQL standards support (CTEs, window functions, transactions)  | More complex initial setup compared to SQLite                   | High, suitable for complex, scalable systems |
|               | ACID-compliant transactions, referential integrity                 | Steeper learning curve for beginners                            | Ensures data reliability and integrity  |
|               | JSON/JSONB support for hybrid data models                          | Requires tuning for optimal performance                         | Well suited for mixed structured and semi-structured data |
|               | Open-source with permissive license                                | Higher resource requirements than SQLite                        | Supports scalability and high availability |
|               | Active community, extensive ORM support (Sequelize, Prisma, TypeORM) |                                                                  |                                         |
| **MySQL**     | Widely used, easier for beginners                                  | Limited support for complex SQL constructs (CTEs added only in recent versions) | Suitable for medium complexity projects but less powerful for complex queries |
|               | Good performance in read-heavy workloads                           | Some configurations lack full ACID compliance                   | Data integrity guarantees can be weaker |
|               | Large ecosystem and cloud support                                  | Scaling can be complex and requires additional tools            |                                         |
| **SQLite**    | Lightweight, embedded, no server required                          | Not suitable for multi-user or distributed systems requiring scaling | Does not meet 99.9% uptime requirement due to limited scalability |
|               | Perfect for small projects and prototyping                         | Limited concurrent write support                                |                                         |
|               | Simple integration without server setup                            | Size and performance limitations                                |                                         |
| **MongoDB**   | Flexible schema, ideal for JSON-like documents                     | No SQL support; complex joins difficult                         | Suitable for NoSQL use cases but not for relational requirements |
|               | Good horizontal scalability                                        | Transactions support less mature than relational DBs            | Can compromise data integrity            |
|               | Active community, modern features                                  | Limited support for complex analytical queries                  |                                         |

---

## Decision
We will use **PostgreSQL** as the primary relational database for this project.

---

## Rationale

- Open-source with a permissive license (PostgreSQL License)
- Full support for SQL standards including window functions, CTEs, stored procedures
- Supports ACID-compliant transactions and referential integrity
- Advanced indexing and performance optimization options
- JSON/JSONB support for semi-structured data
- Seamless integration with ORM libraries (Sequelize, Prisma, TypeORM, etc.)
- Active community and abundant learning resources

---

## Drawbacks

- Slightly more complex to set up compared to SQLite
- Steeper learning curve for beginners than MySQL
- Might require tuning for optimal performance in read-heavy scenarios

---

## Expanded Rationale for Choosing PostgreSQL

### Why not MySQL?

- **Limited support for advanced SQL features:** Until recently, MySQL lacked support for CTEs (WITH queries), window functions, which are critical for analytical queries in our project.
- **ACID compliance is partial:** While InnoDB engine improves reliability, MySQL still falls short compared to PostgreSQL for complex transactional workloads.
- **Scaling challenges:** Scaling MySQL often requires external solutions (sharding, replication), adding operational complexity.

### Why not SQLite?

- **Lack of scalability:** SQLite is designed for embedded use, not for multi-user, high-load environments.
- **Limited concurrent write capabilities:** Only one write transaction at a time is supported, which conflicts with our 99.9% availability requirement.
- **No client-server architecture:** No centralized management, backup, or monitoring capabilities.

### Why not MongoDB?

- **No relational data model:** Our project requires strict data consistency, relationships, and transactional support best handled by a relational DB.
- **Immature transactional guarantees:** Although improving, MongoDB transactions are still less reliable than PostgreSQL.
- **Limited support for complex queries:** Lack of SQL makes writing advanced analytical queries more difficult.

---

## Consequences

- PostgreSQL must be included in local, staging, and production environments
- Development tooling (ORMs, migrations, seeds) will be PostgreSQL-compatible
- Backup and monitoring strategies need to be defined for PostgreSQL instances

---
