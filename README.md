# Product Reviews service

Architecture for managing products and reviews with real-time average rating calculations and intelligent caching.

## 🏗️ Architecture Overview

This application consists of two services working together:

### **Product Service** (Port 3000)

- **RESTful API** for products and reviews management
- **Event Publisher** - publishes review events to RabbitMQ
- **Caching Layer** - caches products and reviews for fast responses
- **Database Operations** - handles all CRUD operations

### **Review Processing Service** (2 Instances)

- **Event Consumer** - listens to review events from RabbitMQ
- **Average Rating Calculator** - calculates and updates product average ratings
- **Cache Manager** - updates Redis cache with fresh data
- **Concurrent Processing** - handles multiple events simultaneously

### **Infrastructure**

- **PostgreSQL** - primary database
- **Redis** - caching layer
- **RabbitMQ** - message broker for event-driven communication

## 🔄 How It Works

### **1. Product Management**

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+

### Setup Commands

```bash
# 1. Install dependencies
cd product-service
npm install

cd ../review-processing-service
npm install

# 2. Start all services
docker-compose up --build

# 3. Setup database
docker-compose exec product-service npm run db:push
docker-compose exec product-service npm run db:seed
```

## �� API Endpoints

### Products

```http
GET    /api/products          # Get all products with average ratings
GET    /api/products/{id}     # Get product by ID
POST   /api/products          # Create product
PUT    /api/products/{id}     # Update product
DELETE /api/products/{id}     # Delete product
```

### Reviews

```http
GET    /api/reviews/product/{productId}  # Get product reviews
GET    /api/reviews/{id}                # Get review by ID
POST   /api/reviews                     # Create review (triggers event)
PUT    /api/reviews/{id}                # Update review (triggers event)
DELETE /api/reviews/{id}                # Delete review (triggers event)
```

## �� Caching Strategy

### Cache Keys

- **`product:{id}`** - Individual product with average rating (1 hour)
- **`reviews:{id}`** - Product reviews (30 minutes)
- **`products:all`** - All products with average ratings (15 minutes)

### Cache Invalidation

When any review event occurs (CREATE/UPDATE/DELETE):

1. Individual product cache updated
2. Product reviews cache updated
3. All products cache refreshed with new average ratings

## �� Event Processing

### Event Types

- **`REVIEW_CREATED`** - New review added
- **`REVIEW_UPDATED`** - Review modified
- **`REVIEW_DELETED`** - Review removed

## 🔧 Environment Variables

Create a `.env` file in the root directory with:

- `DATABASE_URL` - PostgreSQL connection string
- `RABBITMQ_URL` - RabbitMQ connection string
- `REDIS_URL` - Redis connection string
- `NODE_ENV` - Environment mode
- `PORT` - Service port
- `POSTGRES_DB` - Postgres database
- `POSTGRES_USER` - Postgres user
- `POSTGRES_PASSWORD` - Postgres password
- `RABITMQ_USER` - Rabitmq user
- `RABITMQ_PASS` - Rabitmq password
