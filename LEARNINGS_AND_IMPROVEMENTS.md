# Learnings and Improvements from MOPlearn Project 💡✍️

This document highlights the mistakes I encountered during the development of MOPlearn and suggestions for improvement in future projects.

---

## 🖥️ Frontend (React)

- ⚙️ Consider using **Webpack** or **Vite** for faster builds and better project setup.
- 📐 Add consistent **global padding/margin** in the main CSS file to avoid layout inconsistencies.
- 🧩 In the `components/` folder, **separate primitive components** (like buttons, inputs) from complex components.
  - **Suggestion:** Create a `ui/` subfolder for all reusable UI elements.
- 🔄 Explore **React Query** or **SWR** for managing API state instead of relying solely on Redux.
- 🧠 Avoid using Redux unless necessary — not every project needs global state management.

---

## 🛠️ Backend (Laravel)

- 🗃️ Always name database tables in **plural form**.
  - Example: use `friendships` instead of `friendship`.
- 🖼️ Optimize images before storing them (e.g., compress size) to save storage and improve performance.
