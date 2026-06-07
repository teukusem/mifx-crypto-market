# MIFX Crypto Market

A React authentication UI for the MIFX crypto market assignment. Includes login (email or phone) and OTP confirmation flows with client-side validation and responsive layout.

## Features

- **Login** — sign in with email or mobile number, with password visibility toggle
- **OTP** — 6-digit code entry screen after successful login validation
- **Form validation** — Zod schemas for email, phone, and password fields
- **Responsive auth layout** — split illustration panel and form on desktop, stacked on mobile
- **Accessible UI** — labels, `aria-invalid`, and keyboard-friendly inputs

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Zustand](https://zustand.docs.pmnd.rs/) — login state
- [Zod](https://zod.dev/) — form validation
- [Radix UI](https://www.radix-ui.com/) — select, label primitives
- [TanStack Query](https://tanstack.com/query) — wired for future API integration

## Project Structure

```
src/
├── api/              # Query client (API layer ready for extension)
├── components/       # Reusable UI building blocks
│   ├── AuthLayout/
│   ├── Button/
│   ├── Input/
│   ├── InputOTP/
│   ├── Label/
│   └── Select/
├── pages/            # Top-level route components
│   ├── Login/
│   └── Otp/
├── utils/            # Shared utilities
├── App.tsx
├── main.tsx
└── styles.css
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Environment

Copy the example env file:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app redirects to `/login`.

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/login` | Login | Email or phone sign-in |
| `/otp` | OTP | 6-digit confirmation code |
| `*` | — | Redirects to `/login` |

## Login Flow

1. User enters credentials on `/login` (email or phone + password).
2. Client-side validation runs via Zod.
3. On success, the app navigates to `/otp`.
4. User enters a 6-digit OTP and submits.

> **Note:** This is currently a UI prototype. Login and OTP do not call a backend yet.

## License

MIT
