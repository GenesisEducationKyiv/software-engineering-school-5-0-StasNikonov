# Test Running Instructions

---

## Prerequisites

- Docker and Docker Compose installed
- `.env.test` file with environment variables for the test environment (can be copied from `.env.example`)

---

## Step 1. Build Docker images

To prepare the test environment, run:

```bash
docker-compose -f docker-compose.test.yml build
```

---

## Step 2. Run tests

- The project has npm scripts configured to run different types of tests inside Docker containers:

### Unit tests:

```bash
npm run test:unit:docker
```

### Integration tests:

```bash
npm run test:integration:docker
```

### e2e tests:

```bash
npm run test:e2e:docker
```

---

## Cleaning up test environment
- To stop all test-related containers and remove associated volumes (data), run:

```bash
npm run test:clean
```

---

