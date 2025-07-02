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

## Detailed Analysis of Options

| ORM        | Advantages                                                       | Disadvantages                                                             | Fit to Requirements                         |
|------------|------------------------------------------------------------------|---------------------------------------------------------------------------|---------------------------------------------|
| **Sequelize** | Mature and widely adopted in the Node.js ecosystem              | More boilerplate code compared to Prisma                                 | Highly suitable for PostgreSQL projects with flexibility |
|             | Comprehensive PostgreSQL support including advanced data types, constraints, transactions | - Documentation can feel outdated or inconsistent in some parts          | Supports complex relations and transactions well |
|             | Intuitive model and association definitions (1:1, 1:N, N:M)     | Query syntax can be verbose and complex for advanced queries             | Good balance of flexibility and power      |
|             | Built-in migration and seeding support                          | Migration tooling requires discipline to avoid schema drift              |                                           |
|             | Clear separation of models, configuration, and logic            |                                                                           |                                           |
|             | Supports raw SQL queries when needed                            |                                                                           |                                           |
|             | Works smoothly with both JavaScript and TypeScript              |                                                                           |                                           |
|             | Active community, plugins, and ecosystem                        |                                                                           |                                           |
| **TypeORM** | Strong TypeScript integration and decorators support            | Can be complex to configure and maintain                                 | Better suited for TypeScript-heavy projects |
|             | Supports multiple databases including PostgreSQL                | Some reported issues with stability and performance                      |                                           |
|             | Active development and good community support                   | Migration system less mature than Sequelize                              |                                           |
| **Prisma** | Modern and developer-friendly API                               | Less mature migration support; some features require manual handling     | Great for rapid development and clean syntax |
|             | Automatic type generation for TypeScript                        | Smaller ecosystem compared to Sequelize                                  |                                           |
|             | Concise and expressive query syntax                             | Less control over raw SQL and complex queries                            |                                           |
|             | Excellent developer experience and documentation                |                                                                           |                                           |

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

- Compared to Prisma, Sequelize requires more boilerplate and can be verbose, especially for complex queries.
- Some parts of Sequelize’s documentation are outdated or inconsistent, which may require developers to rely on community resources.
- Migration tooling demands careful management to prevent inconsistencies between code and database schema.

---

## Expanded Rationale for Choosing Sequelize

### Why Sequelize over Prisma?

- **More mature and battle-tested:** Sequelize has been in the ecosystem longer, with proven stability in large projects.
- **Comprehensive PostgreSQL support:** Supports full range of PostgreSQL features including transactions and complex associations out of the box.
- **Flexible raw SQL access:** Easier integration of raw queries for performance-critical or complex database operations.
- **Migration and seeding built-in:** Sequelize’s migration system is more established and widely used.

### Why Sequelize over TypeORM?

- **Better documentation and community support:** Sequelize has a larger user base and more community-driven plugins/extensions.
- **Simplicity in JavaScript projects:** Sequelize works well both with JS and TS; TypeORM’s complexity is sometimes unnecessary.
- **More mature migration tooling:** Helps avoid schema drift with disciplined migration management.

---

## Consequences

- We will structure our project according to Sequelize's conventions (models, migrations, seeders)
- We will need to define and maintain migration files
- Developers will need to be familiar with Sequelize’s syntax and lifecycle
- PostgreSQL-specific features will be accessed via Sequelize or raw queries as needed

---
