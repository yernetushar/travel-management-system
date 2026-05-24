# 🌍 Travel Management System

A full-stack **microservices-based** travel management platform built with 
Spring Boot and React, featuring real-time chat, booking management, 
analytics, and secure authentication.

---

## 🏗️ Architecture
🏗️ Architecture
!<img width="165" height="150" alt="travel_management_architecture" src="https://github.com/user-attachments/assets/172739ae-7fc2-4d66-9f27-c1aa31becd05" />

---

## 🛠️ Tech Stack

### Backend
- **Java 17** + **Spring Boot 3.2**
- **Spring Cloud Gateway** - API Gateway
- **Spring Cloud Netflix Eureka** - Service Discovery
- **Spring Security** + **JWT** - Authentication
- **Google OAuth2** - Social Login
- **Apache Kafka** - Event Streaming
- **MongoDB** - Database
- **Spring Mail** - Email Notifications

### Frontend
- **React 18** + **Vite**
- **Redux** - State Management
- **Axios** - HTTP Client

### DevOps
- **Docker** + **Docker Compose**
- **GitHub Actions** - CI/CD Pipeline
- **DockerHub** - Container Registry
- **Nginx** - Reverse Proxy

---

## 📦 Microservices

| Service | Port | Description |
|---------|------|-------------|
| api-gateway | 8181 | Single entry point, JWT validation, routing |
| eureka-server | 8761 | Service discovery and registration |
| auth-service | 8001 | Login, signup, Google OAuth2 |
| user-service | 8082 | User profiles and management |
| booking-service | 8084 | Travel bookings CRUD |
| site-service | 8083 | Travel destinations management |
| chat-service | 8085 | Real-time messaging with Kafka |
| analytics-service | 8086 | Usage analytics and reporting |
| image-service | 8087 | Image upload and management |
| notification-service | 8088 | Email notifications via Kafka |
| travel-frontend | 80 | React web application |

---

## 🚀 CI/CD Pipeline

Every push to `main` branch automatically:
Git Push → GitHub Actions → Maven Build →
Docker Build → Push to DockerHub ✅

- **GitHub Actions** workflow builds all 11 services
- **Docker images** published to DockerHub automatically
- **Zero manual deployment** steps required

---

## ⚡ Quick Start

### Prerequisites
- Docker Desktop
- Java 17
- Node.js 18

### Run with Docker
```bash
# Clone the repository
git clone https://github.com/yernetushar/travel-management-system.git

# Navigate to project
cd travel-management-system

# Create .env file with your credentials
cp .env.example .env

# Start all services
docker-compose up -d

# Check all containers
docker ps
```

### Access the Application
Frontend:      http://localhost:80
API Gateway:   http://localhost:8181
Eureka Dashboard: http://localhost:8761

---

## 🔑 Environment Variables

Create `.env` file at root:
```env
JWT_SECRET=your-jwt-secret
DB_URL=your-mongodb-url
EUREKA_URL=http://eureka-server:8761/eureka/
KAFKA_SERVERS=kafka:9092
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-email-app-password
```

---

## 🔄 Key Features

- ✅ **Microservices Architecture** - 11 independent services
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Google OAuth2** - Social login integration
- ✅ **Real-time Chat** - Kafka-powered messaging
- ✅ **Email Notifications** - Automated via Kafka events
- ✅ **Image Upload** - Multi-part file handling
- ✅ **Analytics Dashboard** - Usage tracking
- ✅ **API Gateway** - Centralized routing and security
- ✅ **Service Discovery** - Automatic service registration
- ✅ **CI/CD Pipeline** - Automated build and deploy
- ✅ **Dockerized** - One command startup

---

## 📁 Project Structure
travel-management-system/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions pipeline
├── analytics-service/         # Spring Boot
├── api-gateway/               # Spring Cloud Gateway
├── auth-service/              # Spring Security + OAuth2
├── booking-service/           # Spring Boot
├── chat-service/              # Spring Boot + Kafka
├── eureka-server/             # Spring Cloud Eureka
├── image-service/             # Spring Boot
├── notification-service/      # Spring Boot + Kafka + Mail
├── site-service/              # Spring Boot
├── user-service/              # Spring Boot
├── travel-frontend/           # React + Vite
├── nginx/
│   └── nginx.conf             # Reverse proxy config
├── docker-compose.yml         # Full stack orchestration
├── .env.example               # Environment template
└── .gitignore

---

## 🐳 DockerHub Images

All images available at:
docker pull yernetushar/eureka-server
docker pull yernetushar/api-gateway
docker pull yernetushar/auth-service
docker pull yernetushar/user-service
docker pull yernetushar/booking-service
docker pull yernetushar/site-service
docker pull yernetushar/chat-service
docker pull yernetushar/analytics-service
docker pull yernetushar/image-service
docker pull yernetushar/notification-service
docker pull yernetushar/travel-frontend

---

## 👨‍💻 Author

**Tushar Yerne**
- GitHub: [@yernetushar](https://github.com/yernetushar)
- LinkedIn: [your-linkedin-url]

---

## 📄 License
MIT License

Push to GitHub
bashcd ~/OneDrive/Desktop/travel_management_system

# Save above content as README.md
notepad README.md

git add README.md
git commit -m "docs: add professional readme"
git push origin main
<img width="1917" height="1041" alt="image" src="https://github.com/user-attachments/assets/ce5ccf29-d9d8-4143-a302-a1cce032c360" />
<img width="1918" height="1108" alt="image" src="https://github.com/user-attachments/assets/0f653606-529d-48cb-8e36-c1f4a7525a95" />
