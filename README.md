# Real Estate Booking UI

Minimal, fast, and type-safe front-end with atomic design for a real-estate appointment/booking workflow. Built with **Vue 3 + Vite + TypeScript**, state management powered by **Pinia**, and documented with **Histoire**.

---

## Features
- Appointment list, filtering, and pagination
- Airtable-compatible API client (env-driven)
- Pinia store with optimistic updates
- Histoire stories for components (`*.histoire.vue`)
- [Guide](https://atomicdesign.bradfrost.com/) for Atomic Design

---

## Requirements
- **Node.js** ≥ 23
- **Yarn** (or npm/pnpm)
- Docker & Buildx for container builds

---

## Environment Variables
Create a `.env` (or `.env.local`) at the project root:

```ini
VITE_AIRTABLE_KEY=your_airtable_api_key
VITE_AIRTABLE_BASE=appXXXXXXXXXXXXXX
VITE_API_URL=https://reb-api.kodbukucu.com/v0
```

## Run
For dev server
```bash
  yarn dev
```
For historie
```bash
  yarn historie
```

## Build
Project build and push to private registry
```
docker buildx build --platform linux/amd64 --push -t xxxx/reb-ui .
```
