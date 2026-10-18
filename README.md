# AI Study Buddy - Frontend

Modern Decoupled Single Page Application (SPA) built with **React 19**, **Vite**, **React Router v7**, **Tailwind CSS**, **DaisyUI**, **Zustand**, and **TanStack Query**.

---

## Folder Structure

```plaintext
frontend/
├── public/                     # Static assets (logos, icons, favicons)
│   └── logo.svg                # Brand logo
├── src/
│   ├── assets/                 # Component assets
│   ├── components/             # Reusable UI & Layout components
│   │   └── MainLayout.tsx      # Global layout with fixed Navbar and Footer
│   ├── pages/                  # Page routes
│   │   ├── DashboardPage.tsx   # Route '/' (Dashboard & PDF Upload)
│   │   ├── SummaryPage.tsx     # Route '/summary/:docId' (Summary & Flashcards)
│   │   └── QuizPage.tsx        # Route '/quiz/:docId' (Interactive Quiz)
│   ├── services/               # API clients & types
│   │   └── api.ts              # Fetch wrappers for /api/upload and /api/documents
│   ├── stores/                 # Zustand client state management
│   │   └── useStudyStore.ts    # Flashcard index, selected quiz answers, active doc
│   ├── index.css               # Tailwind CSS v4 & DaisyUI v5 plugin directives
│   ├── main.tsx                # QueryClientProvider & RouterProvider bootstrap
│   └── router.tsx              # React Router v7 createBrowserRouter config
├── index.html                  # HTML template entry
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite + Tailwind + DaisyUI & backend proxy
```

---

## Setup & Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The app will run at `http://localhost:5173` with automatic reverse-proxying for `/api` requests to the backend server running at `http://localhost:5000`.

### 3. Build for Production
```bash
npm run build
```
Generates optimized static bundles in `dist/`.

---

## Routes Wrapped in `MainLayout`
- `/` - **Dashboard / Upload Page**
- `/summary/:docId` - **Summary & Flashcards View**
- `/quiz/:docId` - **Interactive Practice Quiz Interface**
