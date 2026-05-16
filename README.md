# Lunio Massager - E-Commerce Web App

A modern e-commerce web application for Lunio massage products, built with React 19, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **Framework:** React 19 + TypeScript 5.9
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4 + Framer Motion
- **State Management:** Zustand (with persist middleware)
- **Authentication:** Firebase Auth (Google + LINE Login)
- **i18n:** Custom Zustand-based store (zh-TW / en)
- **Icons:** Lucide React + React Icons

## Features

- **Product Catalog** - Browse products with filtering and grid/list views
- **Product Detail** - Feature cards, massage modes, specs, and related products
- **Shopping Cart** - Drawer cart with quantity controls and checkout flow
- **Wishlist** - Save favorite products with localStorage persistence
- **Blog** - Articles with categories, detail pages, and comment section
- **Search Overlay** - Full-screen search with Cmd+K shortcut and real-time filtering
- **Dark Mode** - Toggle between light/dark/system themes
- **Authentication** - Google and LINE social login via Firebase Auth
- **Account Dashboard** - Profile, order tracking, address book, settings
- **i18n** - Full bilingual support (Traditional Chinese / English)
- **Responsive Design** - Mobile-first layout across all pages

## Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/products` | Product Listing |
| `/products/:slug` | Product Detail |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/blog` | Blog |
| `/blog/:slug` | Blog Detail |
| `/wishlist` | Wishlist |
| `/account` | Account (Login / Dashboard) |
| `/about` | About Us |
| `/support` | Support |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_LINE_CHANNEL_ID` | LINE Login Channel ID |
| `VITE_LINE_REDIRECT_URI` | LINE Login Redirect URI |

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
  components/
    blog/          # CommentSection
    cart/          # CartDrawer
    common/        # SearchOverlay, ThemeToggle
    home/          # Hero, Benefits, etc.
    layout/        # Header, Footer
    product/       # ProductCard
  data/            # Products, blog posts, comments (mock)
  i18n/            # Translations (zh-TW, en)
  lib/             # Firebase config
  pages/           # Route pages
  store/           # Zustand stores (auth, cart, i18n, search, theme, wishlist)
  types/           # TypeScript types
```
