# 🚗 ParkMate — Parking Reservation Platform

ParkMate is a full-stack parking reservation platform that allows users to search and book parking slots in advance, while enabling parking owners to manage venues and availability.  
The project solves a real-world urban problem, parking unavailability, and is built with production-grade authentication, payments, and booking workflows.

---

## 🔗 Live Demo

🌐 **Live Application:** [Demo Link](https://parkmate-ayush.vercel.app/)  

---

## ✨ Key Features

### 👤 Authentication & Authorization
- Secure **JWT-based authentication**
- Role-based access control:
  - **Users** → Book parking slots
  - **Owners/Admins** → Manage venues & slots

---

### 🚘 Parking Booking System
- Search parking locations by name 
- Real-time slot availability check
- Prevents double booking

---

### 💳 Payments & Invoicing
- Integrated **Stripe Payment Gateway**
- Secure checkout flow
- **Automatic invoice generation** after successful payment
- Stores payment and booking references for tracking

---

### 🏢 Owner/Admin Management
- Add parking venues and slots post-registration
- Update or delete parking listings
- Control slot availability

---

### 🎨 User Interface
- Responsive and modern UI using **Next.js**
- Clean design with **Tailwind CSS**

---

## 🛠️ Tech Stack

**Frontend**
- Next.js
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Stripe API

**Deployment**
- Vercel

---

## ⚙️ Project Setup (Local Development)

```bash
git clone https://github.com/AyushRai7/Parkmate.git
cd Parkmate
npm install
npm run dev
