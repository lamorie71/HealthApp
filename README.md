# Nutrition Calculator

A free, client-side nutrition calculator. No backend required — runs entirely in the browser.

## Features
- BMR & TDEE calculation (Mifflin-St Jeor equation)
- Activity level and goal adjustments
- Customizable macro split with live validation
- Fully responsive (mobile-friendly)

## Project Structure

```
Health App/
├── index.html          ← Main page
├── css/
│   └── style.css       ← All styles
├── js/
│   ├── calculator.js   ← Pure math (BMR, TDEE, macros) — no DOM
│   └── app.js          ← UI logic (form handling, rendering)
└── README.md
```

## Running Locally

Just open `index.html` in a browser — no build step needed.

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `nutrition-calculator`).
2. Push this folder's contents to the `main` branch.
3. Go to **Settings → Pages**.
4. Under **Source**, select `Deploy from a branch` → `main` → `/ (root)`.
5. GitHub will give you a URL like `https://yourusername.github.io/nutrition-calculator`.

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. No build settings needed — Vercel detects it as a static site automatically.
4. Click **Deploy**.

## Adding New Features

The separation of `calculator.js` (math) and `app.js` (UI) makes expansion straightforward:

- **New calculator page** (e.g. body fat, water intake) → add a new `.html` file and a new module in `js/`.
- **Styling changes** → edit `css/style.css` (CSS variables at the top control the color scheme).
- **New form fields** → add HTML in `index.html`, read it in `app.js`, wire logic into `calculator.js`.
