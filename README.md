# GeniusLab – Vue.js Frontend

## ℹ️ Overview

GeniusLab is a learning platform frontend that allows users to:

- Browse available lessons
- Search by subject, location, price, spaces or description
- Sort lessons by subject, location, price, or available spaces
- Add lessons to a basket and adjust quantities
- Proceed to checkout and submit an order

The frontend is built with **Vue 3**, and it communicates with an **Express + MongoDB** backend hosted on Render.


- **Live App (GitHub Pages):**  
  `https://zeel2103.github.io/Frontend1/`

## 🔗 Backend API Integration

The frontend uses a base API URL constant:

```js
const API_BASE = 'https://backend1-so5u.onrender.com'
```

## ⬇️ Installation & Local Development

1. **Clone the repository**

```bash
git clone https://github.com/Zeel2103/Frontend1.git
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. Open the app in your browser (Vite default):

```text
http://localhost:5173
```

## 🌐 Deployment (GitHub Pages)

This project is deployed using **GitHub Pages**.

Typical steps:

1. Build the project:

```bash
npm run build
```

2. Deploy

The live app is available at:

```text
<your-github-pages-url>
```
