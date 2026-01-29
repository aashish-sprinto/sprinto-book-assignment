# Sprinto Library - Frontend

A modern, responsive web application for managing the Sprinto Books Library, built with Next.js 15, React 19, Tailwind CSS 4, and Apollo Client.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4, Glassmorphism design
- **State Management**: Apollo Client (GraphQL)
- **Icons**: Lucide React
- **Language**: TypeScript

## Features

- **Books Management**: Browse, search, filter, create, and delete books.
- **Authors Management**: Browse, search, and create authors.
- **Reviews System**: Rate and review books (stored in MongoDB).
- **Responsive Design**: Works seamlessly on desktop and mobile.
- **Real-time Updates**: Optimistic UI updates and refetching.

## Getting Started

### 1. Prerequisites

Ensure the backend is running on `http://localhost:4000`.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`.

## Project Structure

```
frontend/
├── app/
│   ├── authors/        # Author related pages
│   ├── books/          # Book related pages
│   ├── layout.tsx      # Root layout with Apollo Wrapper
│   └── page.tsx        # Homepage
├── components/
│   └── NavBar.tsx      # Navigation component
├── lib/
│   ├── apollo-client.ts # Apollo Client instance
│   ├── apollo-wrapper.tsx # Client-side provider wrapper
│   └── queries.ts      # GraphQL queries & mutations
└── public/
```

## Environment Variables

Create a `.env.local` file (already created):

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000
```
