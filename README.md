# Weather Notification Service

A subscription-based weather notification service. Users can subscribe to receive weather updates for their selected city via email with a chosen frequency: **hourly** or **daily**. The service fetches live weather data from the WeatherAPI.com and sends formatted email updates using Nodemailer.

---

## Tech Stack

| Technology       | Purpose                                      |
|------------------|----------------------------------------------|
| Node.js + Express| RESTful API backend                          |
| PostgreSQL       | Relational database                          |
| Sequelize        | ORM for DB models and migrations             |
| Nodemailer       | Sending weather emails to subscribers        |
| WeatherAPI | Source for real-time weather information   |
| Docker + Docker Compose | Containerization and orchestration    |
| Render           | Deployment platform for production hosting   |

---

## Available API Endpoints

| Method | Endpoint                     | Description                         |
| ------ | ---------------------------- | ----------------------------------- |
| POST   | `/api/subscribe`             | Create new weather subscription     |
| GET    | `/api/confirm?email=...`     | Confirm a subscriber via email link |
| GET    | `/api/unsubscribe?email=...` | Cancel an existing subscription     |
| GET    | `/api/weather`          | Get current weather                 |

---

## Email Behavior
1. Upon subscribing, the user receives a confirmation email with a link.

2. After confirmation, the system starts sending weather updates based on the selected frequency (hourly or daily).

3. Users can unsubscribe anytime using a unique email link.

---

## 🔧 Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/StasNikonov/weather_api.git
cd weather_api
```
### 2. Create a .env File
```
Create a .env File

Use the following example:

PORT=3000
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=weather_db
DB_HOST=localhost
DB_PORT=5432
WEATHER_API_KEY=your_weatherapi_api_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
BASE_URL=http://localhost:3000
npm install
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Server
```bash
npm run dev
```

### 5. Manually Run Database Migration
```bash
npx sequelize-cli db:migrate
```

---
## 🐳 Docker Setup
### 1. Build the Docker Image
```bash
docker build -t weather-api
```

### 2. Run with Docker Compose
Make sure your .env file exists in the project root.
```bash
docker-compose up --build
```

### 3. Run the Migration Manually (Important)
Once the container is up and running, open a new terminal and run:
```bash
docker-compose exec api npx sequelize-cli db:migrate
```

## 🧪 Testing
This project uses Jest and Supertest for automated API testing.
Tests are located in the __tests__ directory and cover the core logic of the application.
### What is tested
1. POST /api/subscribe
* Subscribing with valid data returns confirmation message.
* Invalid email formats are rejected.
* Missing required fields return validation errors.
* Invalid city names return an error.

2. GET /api/confirm/:token
* Valid tokens confirm a subscription and redirect to the success page.
* Invalid tokens return a 404 error.

3. GET /api/unsubscribe/:token
* Valid tokens unsubscribe the user and redirect to the unsubscribe confirmation page.
* Invalid tokens return a 404 error.

4. GET /api/weather?city=...
* Valid city names return temperature, humidity, and description.
* Missing or incorrect city names return proper error messages.

### To run tests locally:

```bash
npm test
```

---

## Live Demo

🌍 **[Visit the deployed site on Render](https://weather-api-2ioq.onrender.com)**





