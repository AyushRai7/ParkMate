# ParkMate — Smart Parking Reservation Platform

ParkMate is a full-stack parking reservation platform that helps users easily find and book parking slots while allowing parking owners to manage venues and availability efficiently.

Built with **production-grade authentication, role-based access control, and scalable backend architecture**, ParkMate solves the real-world problem of urban parking unavailability.

---

## Live Demo

**Live Application:** https://parkmate-ayush.vercel.app/

---

## Key Features

### Authentication & Authorization
- **NextAuth.js** powered authentication
- Role-based access control:
- Secure session handling with **JWT strategy**

---

### Payments & Invoicing
- Integrated **Stripe Payment Gateway**
- Secure checkout flow
- Automatic invoice generation after successful payment
- Booking & payment reference tracking

---

### User Interface & UX
- Modern, responsive UI
- Optimized for mobile and desktop
- Smooth auth flow with role-aware redirects

---

## Tech Stack

### Frontend
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- Shadcn

### Backend
- **Node.js**
- **NextAuth.js** (Credentials + Google OAuth)
- **Prisma ORM**
- **PostgreSQL (Supabase)**
- **Stripe API**

### Deployment
- **Vercel** 

---

## Project Setup 

```bash
git clone https://github.com/AyushRai7/Parkmate.git
cd Parkmate
npm install
npm run dev
