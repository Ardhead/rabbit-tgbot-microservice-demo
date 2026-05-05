# Event Processing System

Nest.js + RabbitMQ + PostgreSQL Microservices Architecture

## Overview

A system consisting of three microservices designed for generating, processing, and notifying about events.

- **Producer Service**: API + Cron job that generates and publishes messages to RabbitMQ
- **Consumer Service**: Worker that processes messages and stores them in PostgreSQL
- **Notifier Service**: Telegram bot that sends notifications about processed messages

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- npm

## Setup Instructions

1. Clone the repository
2. Create root `.env` from example: `cp .env.example .env` and configure values
3. Start infrastructure: `docker compose up -d postgres rabbitmq`
4. Run migrations: `cd consumer-service && npm run migrate:up`
5. Start all services: `docker compose up --build`

## API Documentation (Swagger)

The Producer service exposes Swagger UI at `http://localhost:3000/api/docs` when running.

## Development Workflow

### Package Manager
npm is used as the package manager for all services.

### Running Services Locally

Each service can be run independently in development mode:

```bash
# Producer Service
cd producer-service
npm install
npm run start:dev

# Consumer Service
cd consumer-service
npm install
npm run start:dev

# Notifier Service
cd notifier-service
npm install
npm run start:dev
```

### Environment Variables
Single root `.env` file is used for all services. Copy the example and configure values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration (PostgreSQL, RabbitMQ, Telegram tokens, service ports, cron intervals).

### End-to-End Tests

E2E tests use Jest + Supertest. Currently available in `producer-service`:

```bash
# Run e2e tests for Producer service
cd producer-service
npm run test:e2e
```

Test files are located in `test/*.e2e-spec.ts`.

### Production
```bash
docker compose up --build
```

## Copyright

Copyright 2026. All rights reserved.

This project is made available for viewing purposes only. No modifications, distributions, or derivative works are permitted without explicit permission.
