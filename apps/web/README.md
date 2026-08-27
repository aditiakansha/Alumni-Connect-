# Web (React + Vite + Tailwind)

Scaffold this with:
  pnpm create vite . --template react-ts
then add Tailwind:
  pnpm add -D tailwindcss postcss autoprefixer
  pnpm dlx tailwindcss init -p

Suggested route structure (React Router):
  /login, /register
  /directory
  /jobs, /jobs/:id
  /referrals
  /forum, /forum/:postId
  /events, /events/:id
  /admin/*  (protected: ADMIN role only)
