# ParkMate — Smart Parking Reservation Platform

ParkMate is a full-stack parking reservation platform that helps users find and book parking slots while allowing venue owners to manage their parking spaces efficiently.

Built with **production-grade authentication, role-based access control, CI/CD pipeline, and AWS cloud infrastructure**, ParkMate solves the real-world problem of urban parking unavailability.

---

## 🔗 Links

| | |
|--|--|
| **Live Application** | https://parkmate-ayush.duckdns.org |


---

##  Key Features

###  Authentication & Authorization
- **NextAuth.js** powered authentication with **Google OAuth** and **Credentials** provider
- Role-based access control — separate flows for **Users** and **Venue Owners**
- Secure session handling with **JWT strategy**
- Protected routes via Next.js middleware

###  Payments & Invoicing
- **Stripe Payment Gateway** with secure checkout flow
- Webhook validation for reliable payment confirmation
- Idempotent booking logic preventing duplicate slot allocation
- Automatic **PDF invoice generation** after successful payment
- Invoices stored persistently on **AWS S3** with secure pre-signed download URLs

###  Parking Management
- Real-time slot availability tracking
- Automatic slot assignment on payment confirmation
- Owner dashboard for venue and booking management
- Booking status tracking (Pending → Confirmed → Expired)

###  User Interface & UX
- Modern, responsive UI built with **Tailwind CSS** and **Shadcn**
- Smooth animations with **Framer Motion**
- Optimized for mobile and desktop
- Role-aware redirects after authentication

---

##  Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI**
- **Framer Motion**

### Backend
- **Node.js**
- **NextAuth.js** (Credentials + Google OAuth)
- **Prisma ORM**
- **PostgreSQL** (Supabase)
- **Stripe API** + Webhooks

### Cloud & DevOps
- **AWS EC2** — application hosting
- **AWS S3** — invoice PDF storage
- **GitHub Actions** — CI/CD pipeline 
- **Docker** — containerized deployment
- **UptimeRobot** — uptime monitoring

### Database
- **PostgreSQL** hosted on **Supabase**
- Prisma ORM with composite indexes for optimized queries

---

##  Project Setup
```bash
git clone https://github.com/AyushRai7/Parkmate.git
cd Parkmate
npm install
```

---

## 📝 License

MIT License — feel free to use this project for learning or inspiration.
