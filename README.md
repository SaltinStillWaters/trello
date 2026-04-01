## 01. Getting Started

### Introduction

#### Overview

A Trello-clone using Vue.js, NestJS, and PostgreSQL.

#### Key Features

* Authentication
  The following credentials are provided:

  * **Username:** John
  * **Password:** a

* Board Management (CRUD)

* Column Management (CRUD)

* Card Management (CRUD)

* Drag and drop support

---

### Requirements

* Docker **or** PostgreSQL
* pnpm

---

### Installation

#### Step-by-step Instructions

Follow the steps below to set up and run the application.

---

### Task 1

#### Step 1: Repository Setup

```
git clone https://github.com/SaltinStillWaters/trello.git
cd trello
pnpm install
```

---

#### Step 2.A: Database Setup (Docker Way)

```
# Start Docker Engine first
docker compose up -d
pnpm seed
```

---

#### Step 2.B: Database Setup (Non-Docker Way)

```
# Provision a new PostgreSQL database

# Update environment variables
# File: apps/backend/.env

pnpm seed
```

---

#### Step 3: Run the Application

```
pnpm dev
```

---

### Important Note

The `.env` file was intentionally committed to facilitate a smoother setup process.

Typically, I provide a `.env.example` file, allowing developers to create their own `.env` configuration.
