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
# === JWT Authentication ===
JWT_SECRET_KEY=supersecretjwtkey           # Secret key for signing and verifying JWTs

# === Database (PostgreSQL) ===
DATABASE_URL=postgresql://postgres:password@localhost:5432/mydb  # Main database connection URL

# === Email Configuration ===
MAIL_HOST=smtp.mailtrap.io                 # SMTP server host
MAIL_PORT=2525                             # SMTP server port
MAIL_USER=username                         # SMTP username
MAIL_PASSWORD=password                     # SMTP password

# === Cloudinary (File Storage) ===
CLOUDINARY_CLOUD_NAME=mycloud              # Cloudinary cloud name
CLOUDINARY_API_KEY=1234567890              # Cloudinary API key
CLOUDINARY_API_SECRET=abcdefg1234567       # Cloudinary API secret

# === Stripe (Payment Processing) ===
STRIPE_SECRET_KEY=sk_test_...              # Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...            # Stripe webhook signing secret

# === File Uploads ===
MAX_FILE_SIZE=5242880                      # Maximum file size allowed (in bytes)
MAX_FILES_IN_UPLOAD=5                      # Maximum number of files per upload

# === Application URL ===
BASE_URL=https://example.ngrok.io          # Public base URL (e.g. ngrok for development)

# === Environment Mode ===
NODE_ENV=development                       # Can be: development | test | production
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

### 4. Populate the database

```bash
$ npm run seed
```

### 5. Open Prisma Studio

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

# Populate DB
$ npm run seed

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

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe API Docs](https://stripe.com/docs/api)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

## 👤 Author

- [Erick Klendort Hualla Puelles](https://github.com/erickhuallaravn)

---
