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

## Consequences

- PostgreSQL must be included in local, staging, and production environments
- Development tooling (ORMs, migrations, seeds) will be PostgreSQL-compatible
- Backup and monitoring strategies need to be defined for PostgreSQL instances

---
