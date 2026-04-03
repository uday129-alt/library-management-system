# 📖 Library Management System

A full-stack Library Management System built with **Spring Boot** (backend) and **React** (frontend).

---

## 🗂️ Project Structure

```
library-management-system/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/library/
│   │   ├── config/             # Security & data initializer
│   │   ├── controller/         # REST controllers
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── entity/             # JPA entities
│   │   ├── exception/          # Custom exceptions & global handler
│   │   ├── repository/         # Spring Data JPA repositories
│   │   ├── security/           # JWT filter & UserDetailsService
│   │   └── service/            # Business logic
│   └── pom.xml
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── api/                # Axios API layer
│   │   ├── components/         # Reusable components
│   │   ├── context/            # AuthContext (global auth state)
│   │   ├── pages/              # All page components
│   │   └── styles/             # Global CSS
│   └── package.json
│
└── README.md
```

---

## 🛠️ Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Backend    | Java 17, Spring Boot 3.2, Spring Security, JWT  |
| ORM        | Spring Data JPA / Hibernate                     |
| Database   | MySQL 8.x                                       |
| Frontend   | React 18, React Router v6, Axios                |
| Auth       | JWT (JSON Web Tokens)                           |

---

## 🗄️ Database Setup

1. **Install MySQL** (version 8+) and start the MySQL service.

2. **Create the database:**

```sql
CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Create a user** (optional but recommended):

```sql
CREATE USER 'library_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON library_db.* TO 'library_user'@'localhost';
FLUSH PRIVILEGES;
```

4. **Update credentials** in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/library_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root          # change if needed
spring.datasource.password=root          # change to your password
```

> ✅ Tables are auto-created by Hibernate (`ddl-auto=update`).  
> ✅ Sample data (users + books) is seeded automatically on first run.

---

## 🚀 Running the Backend

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+ running

### Steps

```bash
cd backend

# Build the project
mvn clean install -DskipTests

# Run the application
mvn spring-boot:run
```

The API will be available at: **http://localhost:8080**

### Default Credentials (seeded automatically)

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@library.com   | admin123  |
| User  | john@example.com    | user123   |
| User  | jane@example.com    | user123   |

---

## 🌐 Running the Frontend

### Prerequisites
- Node.js 16+
- npm or yarn

### Steps

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at: **http://localhost:3000**

> The frontend proxies API calls to `http://localhost:8080` automatically via the `"proxy"` field in `package.json`.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint              | Description         | Access  |
|--------|-----------------------|---------------------|---------|
| POST   | /api/auth/register    | Register new user   | Public  |
| POST   | /api/auth/login       | Login + get JWT     | Public  |

### Books
| Method | Endpoint                    | Description       | Access     |
|--------|-----------------------------|-------------------|------------|
| GET    | /api/books                  | List all books    | Auth       |
| GET    | /api/books/{id}             | Get book by ID    | Auth       |
| GET    | /api/books/search?q=...     | Search books      | Auth       |
| POST   | /api/books                  | Add new book      | Admin only |
| PUT    | /api/books/{id}             | Update book       | Admin only |
| DELETE | /api/books/{id}             | Delete book       | Admin only |

### Transactions
| Method | Endpoint                          | Description             | Access     |
|--------|-----------------------------------|-------------------------|------------|
| POST   | /api/transactions/issue           | Issue a book            | Auth       |
| PUT    | /api/transactions/{id}/return     | Return a book           | Auth       |
| GET    | /api/transactions/user/{userId}   | User's transactions     | Auth       |
| GET    | /api/transactions                 | All transactions        | Admin only |
| GET    | /api/transactions/overdue         | Overdue transactions    | Admin only |

---

## 💰 Fine Calculation

- Loan period: **14 days**
- Fine rate: **₹5.00 per day** overdue
- Fine = `max(0, overdueDays × 5.0)`
- Configurable in `application.properties`:  
  `app.fine.per-day=5.0`

---

## 🔐 Role-Based Access

| Feature                   | USER | ADMIN |
|---------------------------|------|-------|
| Browse/search books       | ✅   | ✅    |
| Borrow books              | ✅   | ✅    |
| Return books              | ✅   | ✅    |
| View own transactions     | ✅   | ✅    |
| Add/Edit/Delete books     | ❌   | ✅    |
| View all transactions     | ❌   | ✅    |
| View overdue reports      | ❌   | ✅    |

---

## 🏗️ Production Build

```bash
# Frontend
cd frontend && npm run build

# Backend JAR
cd backend && mvn clean package -DskipTests
java -jar target/library-management-1.0.0.jar
```

---

## 📝 Notes

- CORS is configured to allow `http://localhost:3000`. Update `SecurityConfig.java` for production domains.
- JWT token expires in 24 hours (configurable via `app.jwt.expiration`).
- All passwords are BCrypt-hashed.
