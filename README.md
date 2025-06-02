<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

---

## 📦 Description

This project is a fully functional API built with [NestJS](https://nestjs.com), TypeScript, and Prisma ORM. It includes authentication with JWT, file uploads via Cloudinary, email support, and payment processing using Stripe. It follows a modular architecture and is suitable for scalable applications.

---

## 🚀 Features

- Modular architecture using NestJS
- PostgreSQL database via Prisma ORM
- Cloudinary integration for image uploads
- Stripe integration for payments and webhooks
- Authentication with JWT
- Email service configuration
- Environment-based configuration management

---

## 🔧 Project Setup

### 1. Clone the repo

```bash
$ git clone https://github.com/erickhuallaravn/NerderyFinalChallenge.git
$ cd NerderyFinalChallenge
```

### 2. Install dependencies

```bash
$ npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root with the following structure:

```env
# JWT
JWT_SECRET_KEY=your_jwt_secret

# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# Mail Configuration
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASSWORD=your_password

# File Upload Config
MAX_FILE_SIZE=5000000
MAX_FILES_IN_UPLOAD=5

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
BASE_URL=ngrook_generated_url
```

---

## ⚙️ Prisma Setup

### 1. Initialize Prisma (already done)

```bash
$ npx prisma init
```

### 2. Generate Prisma Client

```bash
$ npx prisma generate
```

### 3. Migrate the database

```bash
$ npx prisma migrate dev --name init
```

### 4. Open Prisma Studio

```bash
$ npx prisma studio
```

---

## 💳 Stripe Setup

### 1. Create a Stripe account

Go to [Stripe Dashboard](https://dashboard.stripe.com/) and create an account.

### 2. Create API keys

- Go to Developers > API Keys
- Copy the **Secret Key** into `STRIPE_SECRET_KEY`

### 3. Create webhook endpoint

- Go to Developers > Webhooks > Add endpoint
- Set the endpoint to your public URL (see ngrok below)
- Events to send: `checkout.session.completed`, `payment_intent.succeeded`, etc.
- Copy the **Signing Secret** into `STRIPE_WEBHOOK_SECRET`

### 4. Run webhook with Ngrok (for local testing)

```bash
$ npx ngrok http 3000
```

> Use the HTTPS URL provided by ngrok as your webhook endpoint in Stripe

---

## 📦 Scripts

### Development

```bash
$ npm run start:dev
```

### Production

```bash
$ npm run build
$ npm run start:prod
```

### Watch mode

```bash
$ npm run start:watch
```

### Prisma

```bash
# Generate Prisma Client
$ npx prisma generate

# Migrate DB
$ npx prisma migrate dev --name <migration-name>

# Open Prisma Studio
$ npx prisma studio
```

### Testing

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

---

## 📡 Stripe Webhook Endpoint

Make sure your `PaymentController` is properly configured to handle the following:

```
POST /payment/webhook
```

The request must include the raw body and `stripe-signature` header.

---

## 🧪 Sample .env File

```env
JWT_SECRET_KEY=supersecretjwtkey
DATABASE_URL=postgresql://postgres:password@localhost:5432/mydb
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=username
MAIL_PASSWORD=password
MAX_FILE_SIZE=5242880
MAX_FILES_IN_UPLOAD=5
CLOUDINARY_CLOUD_NAME=mycloud
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=abcdefg1234567
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe API Docs](https://stripe.com/docs/api)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

## 👤 Author

- [Erick Klendort Hualla Puelles](https://github.com/erickhuallaravn)

---
