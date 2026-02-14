#  Smart E-Commerce Web Application
### Django REST Framework + React + Cython

---

##   Project Overview
This project is a **full-stack E-Commerce web application** developed using
**Django REST Framework (Backend)** and **React.js (Frontend)**.

The main objective of this project is not only to build a functional e-commerce system
but also to **optimize backend performance** using **Cython** for computation-heavy logic
like product recommendation scoring.

---

##   Tech Stack

###   Backend
- Python
- Django
- Django REST Framework
- JWT Authentication
- **Cython (for performance optimization)**

###   Frontend
- React.js
- React Router
- Context API
- Axios

### 🗄️ Database
- SQLite (Development)
- PostgreSQL (Production ready)

---

##   Core Features
- User Authentication (JWT based)
- Product Listing & Product Details
- Cart Management (Add / Remove items)
- API-based architecture
- **Score-based Product Recommendation System**
- **Optimized backend logic using Cython**
- Clean & modular code structure

---
##  Asynchronous Task Processing

This project uses **Celery** with **Redis** as a message broker for handling background tasks.

### Use Cases:
- Order confirmation email sending
- Heavy operations processing
- Background job execution

### Why Celery?
- Improves performance
- Non-blocking API response
- Scalable architecture

---

##  Recommendation System (Important Part)

The recommendation system suggests products based on a **custom scoring algorithm**.
Each product gets a score calculated using factors like:
- Category similarity
- Price proximity
- Product relevance score

To improve performance, the **scoring logic is implemented using Cython** instead of
pure Python.

### Why Cython?
- Recommendation logic runs on every product detail request
- Pure Python becomes slower as product count increases
- **Cython converts Python-like code into C-level code**, making execution faster

This shows how **low-level optimization** can be integrated into a real-world Django project.

---

##  Cython Implementation Overview

- Cython file is created inside the recommendations module
- Core scoring function is written in `.pyx`
- Compiled using `setup.py`
- Imported and used directly inside Django views

This approach improves response time and demonstrates **performance-oriented backend development**.

---
---
🔒 Concurrency-Safe Stock Reservation

To prevent overselling during simultaneous orders, a production-style stock reservation system has been implemented.

✅ Key Concepts Used:

transaction.atomic() → Ensures database consistency (all-or-nothing execution)

select_for_update() → Applies row-level locking to prevent concurrent stock modification

F() expressions → Performs safe atomic database-level increments

reserved_stock field → Handles pending payment reservations before final confirmation

💡 How It Works:

Products are locked using select_for_update()

Available stock is validated (stock - reserved_stock)

Reserved stock is increased safely using F() expressions

All operations run inside a single atomic transaction

🚀 Result:

No overselling

Concurrency-safe transactions

Production-ready inventory handling
---

##  Installation & Setup

### Backend Setup
```bash
git clone <your-github-repo>
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


##  Setup Celery & Redis

1. Install Redis
2. Start Redis server:
   redis-server

3. Run Celery worker:
   celery -A project_name worker --loglevel=info

4. Run Django server:
   python manage.py runserver
