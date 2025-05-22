# ThaThaShop

This repository contains a comprehensive microservice-based application, designed with a focus on modularity, scalability, and robust communication. It leverages Node.js for its services, Docker and Docker Compose for containerization, and Kafka for asynchronous messaging between services.
Table of Contents

    Project Overview
    Folder Structure
    Key Technologies
    Getting Started
        Prerequisites
        Installation
        Running the Services
    Service Descriptions
        API Gateway
        REST Services
        Kafka Services
    Configuration
    Logging
    Testing
    Contributing
    License

Project Overview

This project implements a microservice architecture for an e-commerce-like application. It separates core functionalities such as authentication, cart management, product handling, and order processing into independent services. Communication between these services is handled through a combination of RESTful APIs and Kafka message queues, ensuring a loosely coupled and highly scalable system.
Folder Structure

The project's backend is organized into distinc

├── backend

│   ├── apiGateway

│   │   ├── Dockerfile

│   │   ├── logging.js

│   │   ├── logs

│   │   │   ├── combined.log

│   │   │   └── error.log

│   │   ├── package.json

│   │   ├── package-lock.json

│   │   ├── public

│   │   │   ├── juice1.webp

│   │   │   └── juice2.webp

│   │   ├── server.js

│   │   ├── serviceConfig.yaml

│   │   ├── testing.js

│   │   └── utils

│   │       └── secretsLoader.js

│   ├── docker-compose.yaml

│   ├── Dockerfile

│   ├── kafkaServices

│   │   ├── email

│   │   │   ├── config

│   │   │   │   ├── kafka.js

│   │   │   │   └── mailer.js

│   │   │   ├── Dockerfile

│   │   │   ├── driver.js

│   │   │   ├── package.json

│   │   │   ├── package-lock.json

│   │   │   ├── testing

│   │   │   │   └── run.js

│   │   │   └── utils

│   │   │       ├── Mailsender.js

│   │   │       └── pipelineMsgHandler.js

│   │   └── logging

│   │       ├── config

│   │       │   ├── kafka.js

│   │       │   └── winstonLogger.js

│   │       ├── Dockerfile

│   │       ├── driver.js

│   │       ├── logs

│   │       │   └── authService

│   │       │       ├── error.log

│   │       │       ├── info.log

│   │       │       └── warn.log

│   │       ├── package.json

│   │       ├── package-lock.json

│   │       ├── testing

│   │       │   └── run.js

│   │       └── utils

│   │           └── pipelineMsgHandler.js

│   ├── logs

│   │   ├── authService

│   │   │   ├── error.log

│   │   │   ├── info.log

│   │   │   └── warn.log

│   │   └── cartService

│   │       ├── error.log

│   │       ├── info.log

│   │       └── warn.log

│   └── restServices

│       ├── authService

│       │   ├── config

│       │   │   ├── db.js

│       │   │   └── kafka.js

│       │   ├── controllers

│       │   │   └── authController.js

│       │   ├── Dockerfile

│       │   ├── models

│       │   │   └── userModel.js

│       │   ├── package.json

│       │   ├── package-lock.json

│       │   ├── routes

│       │   │   └── authRoutes.js

│       │   ├── service.js

│       │   └── utils

│       │       ├── emailHandler.js

│       │       ├── logging.js

│       │       └── vaultClient.js

│       ├── cartService

│       │   ├── config

│       │   │   ├── db.js

│       │   │   └── kafka.js

│       │   ├── controllers

│       │   │   └── cartController.js

│       │   ├── Dockerfile

│       │   ├── middleware

│       │   │   └── auth.js

│       │   ├── models

│       │   │   └── cartModel.js

│       │   ├── package.json

│       │   ├── package-lock.json

│       │   ├── routes

│       │   │   └── cartRoutes.js

│       │   ├── service.js

│       │   └── utils

│       │       ├── logging.js

│       │       └── vaultClient.js

│       ├── orderService

│       │   ├── config

│       │   │   ├── db.js

│       │   │   └── kafka.js

│       │   ├── controllers

│       │   │   └── orderController.js

│       │   ├── Dockerfile

│       │   ├── middleware

│       │   │   ├── adminAuth.js

│       │   │   └── userAuth.js

│       │   ├── models

│       │   │   ├── orderModel.js

│       │   │   └── user.js

│       │   ├── package.json

│       │   ├── package-lock.json

│       │   ├── routes

│       │   │   └── orderRoutes.js

│       │   ├── service.js

│       │   └── utils

│       │       ├── emailHandler.js

│       │       ├── logging.js

│       │       └── vaultClient.js

│       └── productService

│           ├── config

│           │   ├── db.js

│           │   └── kafka.js

│           ├── controllers

│           │   └── prodcutController.js

│           ├── Dockerfile

│           ├── middleware

│           │   └── auth.js

│           ├── models

│           │   ├── productModel.js

│           │   └── user.js

│           ├── package.json

│           ├── package-lock.json

│           ├── routes

│           │   └── prodcutRoutes.js

│           ├── service.js

│           └── utils

│               ├── logging.js

│               ├── pipelineMsgHandler.js

│               └── vaultClient.js 


Each microservice typically follows a similar internal structure, including:

    config/: Configuration files (database, Kafka, etc.)
    controllers/: Business logic for API endpoints
    models/: Database schemas
    routes/: API route definitions
    service.js or driver.js: Main service entry point
    utils/: Helper functions and utilities
    Dockerfile: Containerization instructions for the specific service
    package.json: Node.js dependencies

Key Technologies

    Node.js: Asynchronous event-driven JavaScript runtime for backend services.
    Express.js: Web application framework for building RESTful APIs.
    Kafka: Distributed streaming platform for building real-time data pipelines and streaming applications.
    MongoDB: NoSQL database for flexible data storage (used by REST services).
    Docker: Platform for developing, shipping, and running applications in containers.
    Docker Compose: Tool for defining and running multi-container Docker applications.
    Winston: A versatile logging library for Node.js.
    Vault (Client): Integration for secure secret management (indicated by vaultClient.js).

Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.
Prerequisites

Before you begin, ensure you have the following installed:

    Docker Desktop: Includes Docker Engine and Docker Compose.
        Install Docker Desktop
    Node.js and npm (optional, for local development/testing without Docker for individual services):
        Install Node.js

Installation

    Clone the repository:
    Bash

git clone <your-repository-url>
cd <your-repository-name>/backend

Build and run the Docker containers:

Navigate to the backend directory and run:
Bash

    docker-compose up --build

    This command will:
        Build Docker images for all services defined in docker-compose.yaml (API Gateway, all REST services, and all Kafka services).
        Start all containers, including Kafka, MongoDB, and the custom services.

    It might take some time for all services to start, especially Kafka and MongoDB.

Running the Services

Once docker-compose up --build completes, the services will be running:

    API Gateway: Accessible typically on http://localhost:3000 (check apiGateway/serviceConfig.yaml and docker-compose.yaml for exact port mapping).
    REST Services: These services communicate internally and are not directly exposed outside the Docker network unless specified in docker-compose.yaml.
    Kafka Services: These services consume messages from Kafka topics.

Service Descriptions
API Gateway

    Location: backend/apiGateway
    Description: The central entry point for all client requests. It routes incoming requests to the appropriate backend REST services and handles common concerns like logging.
    Key Files:
        server.js: Main server file.
        serviceConfig.yaml: Configuration for routing requests to downstream services.
        logging.js: Handles request logging.

REST Services

Located under backend/restServices/, these are the core business logic services. Each service exposes a set of RESTful APIs.

    Auth Service (authService): Manages user registration, login, and authentication tokens.
    Cart Service (cartService): Handles adding, removing, and managing items in a user's shopping cart.
    Order Service (orderService): Manages the creation, status, and history of customer orders.
    Product Service (productService): Handles product information, including listing, adding, and updating products.

Kafka Services

Located under backend/kafkaServices/, these services consume messages from Kafka topics to perform background tasks.

    Email Service (email): Consumes messages from a Kafka topic (e.g., for order confirmations, password resets) and sends emails.
    Logging Service (logging): Consumes structured log messages from various services via Kafka and processes them (e.g., stores them, sends to a log aggregation system).

Configuration

Configuration for each service is typically found in its respective config/ directory. This includes database connection strings, Kafka broker addresses, and other service-specific settings.

Important: Sensitive information like API keys and database credentials should ideally be managed through a secret management system (like HashiCorp Vault, indicated by vaultClient.js in some services) and not hardcoded. For local development, environment variables or .env files can be used in conjunction with docker-compose.yaml.
Logging

Each service is configured with a logging utility (often Winston). Logs are typically written to logs/ directories within each service or centrally processed by the Kafka logging service.

    API Gateway Logs: backend/apiGateway/logs/
    Centralized Backend Logs: backend/logs/ (for REST services that might log directly)
    Kafka Logging Service Output: backend/kafkaServices/logging/logs/

Testing

Individual services may have their own testing/ directories.

    API Gateway: apiGateway/testing.js (for API gateway specific tests).
    Kafka Services: driver.js files within kafkaServices often contain logic to simulate messages for testing the consumer's functionality. For example, backend/kafkaServices/email/testing/run.js and backend/kafkaServices/logging/testing/run.js might contain scripts to send test messages to their respective Kafka topics.

To run these tests, you might need to execute specific commands within the respective service containers or locally if dependencies are installed.
Contributing

Contributions are welcome! Please follow these steps:

    Fork the repository.
    Create a new branch for your feature or bug fix.
    Make your changes.
    Write clear commit messages.
    Submit a pull request.

License

This project is licensed under the MIT License - see the LICENSE file (if present) for details.
