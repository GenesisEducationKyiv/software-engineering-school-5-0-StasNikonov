# ADR-002: Choosing Sequelize as the ORM

**Status:** Accepted  
**Date:** 2025-06-08  
**Author:** Stanislav Nikonov

**Context:**  
We need an Object-Relational Mapping (ORM) tool to manage database access in our Node.js application. The ORM should simplify interactions with the PostgreSQL database, support migrations, and provide a balance between abstraction and flexibility.

Key requirements:

- Full PostgreSQL support
- Active community and maintenance
- Support for model definitions, associations, transactions, and migrations
- Compatibility with Node.js and popular backend patterns
- Well-documented

**Considered Options:**

1. Sequelize
2. TypeORM
3. Prisma

---

## Decision
We will use **Sequelize** as the primary ORM for interacting with our PostgreSQL database.

---

## Rationale

- Mature and widely used in the Node.js ecosystem
- Full support for PostgreSQL, including data types, constraints, and transactions
- Easy to define models and associations (1:1, 1:N, N:M)
- Built-in support for migrations and seeders
- Clear separation between models, configurations, and logic
- Compatible with raw SQL queries when necessary
- Works with both JavaScript and TypeScript
- Active community and plugins/extensions available

---

## Drawbacks

- More boilerplate compared to Prisma
- Somewhat outdated documentation structure in parts
- Query syntax can be verbose for complex queries
- Migration tooling requires careful management to avoid drift

---

## Consequences

- We will structure our project according to Sequelize's conventions (models, migrations, seeders)
- We will need to define and maintain migration files
- Developers will need to be familiar with Sequelize’s syntax and lifecycle
- PostgreSQL-specific features will be accessed via Sequelize or raw queries as needed

---
