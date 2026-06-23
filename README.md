# Swagger-Editor app

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## Project Description

Swagger/OpenAPI UI is a web application for editing, visualizing, and testing REST APIs based on OpenAPI specifications.
It provides an interactive Swagger-like interface with request execution, history tracking, and analytics.

## Features

[TBC]

## Tech Stack

### Frontend

- **Framework:** React, Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Internationalization:** next-intl
- **Testing:** Vitest (V8 Coverage), Vitest UI

### Backend / BaaS

- Supabase

### Architecture & Tooling

- **Framework Architecture:** Next.js App Router (SSR + Server Components)
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

### Code Quality & DX
- **Linting & Formatting:** ESLint, Prettier, Tailwind CSS class sorting
- **Git Hooks:**
  - Husky (pre-commit, pre-push)
  - Lint-staged
  - Commitlint (Conventional Commits)

## Team

| Name   | Role | GitHub | Features |
|--------|------|--------|----------|
| Diana Dukhovskaya | Team Lead / Frontend | [dukhd](https://github.com/dukhd) | TBC |
| Diana Solovey | Frontend | [rustytrooper](https://github.com/rustytrooper) | TBC |
| Maria Makarova | Frontend | [whaleisajoy](https://github.com/whaleisajoy) | TBC |

## Deployment

[Deployment Link - TBC](link)

## Demo Video

[Demo Link - TBC](link)

## Local Setup & Installation

### Requirements
- Node.js >= 22
- NPM >= 11

### Installation

```bash
git clone https://github.com/git-push-and-pray/swagger-editor-app.git
cd swagger-editor-app
npm install
```

### Running the project

```bash
npm run dev
```

### Build

```bash
npm run build
npm start
```

## Available Scripts

| Command (npm)        | Description |
|---------------------|-------------|
| `npm run dev`         | Starts the local development server (Next.js App Router) |
| `npm run build`       | Builds the application for production |
| `npm start`       | Runs the built application in production mode |
| `npm run lint`        | Runs ESLint to check code quality |
| `npm run lint:fix`    | Automatically fixes lint issues |
| `npm run format:fix`  | Formats code using Prettier |
| `npm run test`        | Runs unit tests using Vitest |
| `npm run coverage`    | Runs Vitest with V8 coverage report |
| `npm run typecheck`   | Runs TypeScript type checking |

