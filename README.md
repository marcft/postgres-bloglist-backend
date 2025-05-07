# Postgres BlogList Backend

A full-featured blog list API built with Node.js, Express, Sequelize, and PostgreSQL.

## 🚨 Warning

**This repository includes the `.env` file for ease of use with the local Docker setup.**

The `.env` file contains:

- Database URL pointing to a local Docker container
- JWT secret for development

In a real production environment, you should **never commit your `.env` file**. If you fork or use this project for your own purposes, please remember to add `.env` to your `.gitignore` file.

## 🌟 Features

- RESTful API for blogs and users
- PostgreSQL database with Sequelize ORM
- Authentication with JWT
- Server-side session management
- Reading list functionality
- Blog search and filtering
- Author statistics
- Database migrations using Umzug

## 🛠️ Technical Implementation

### Database Models

- **Blog**: Stores blog posts with title, author, URL, likes, and year
- **User**: Manages user accounts with email validation and password hashing
- **Reading**: Many-to-many relationship between users and blogs for reading lists
- **ActiveSession**: Handles server-side session management for improved security

### Authentication & Security

- JWT-based authentication
- Server-side session tracking
- Password hashing with bcrypt
- User account disabling capability
- Protected routes with middleware

### API Features

- Full CRUD operations for blogs
- User management
- Reading list functionality (add/mark as read)
- Blog searching and filtering
- Author statistics aggregation

### Database Migrations

Sequential migrations implemented with Umzug:

1. Initialize blogs and users tables
2. Add year field to blogs
3. Add reading list functionality
4. Add server-side session management

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js

### Installation

1. Clone the repository
2. Start the PostgreSQL database
3. Run the project with `npm run dev`
