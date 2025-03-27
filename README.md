# MOPlearn
MOPlearn is a **responsive self-learning platform** that gathers **free and discounted courses** from educational platforms like **Udemy, Coursera, and more**. It operates on an **affiliate marketing model**, meaning it **does not host** the courses but redirects users to the **original platforms** to access them.  

MOPlearn was created to **break three major barriers** to self-learning:  
- 💸 **Financial Costs** – Quality education is often expensive.  
- 🌍 **Limited Awareness** – Many learners miss out on valuable opportunities.  
- 👥 **Lack of Motivation or a Learning Partner** – Learning alone can reduce engagement.

---

## 🔠 What's in the Name?  
**MOP** stands for:  
- **M**oney – Provide only **free and discounted** courses.  
- **O**pportunities – Show learners what they might **miss**.  
- **P**artner – Find **study partners** to stay motivated.  

---

## 🔧 Tech Stack  
### **Frontend:**  
- ⚛️ **React.js**  
- 🛠️ **Redux Toolkit**  
- 🌐 **Axios**  

### **Backend:**  
- 🐘 **Laravel (PHP)**  
- 🗄️ **MySQL Database**  

### **APIs:**  
- Planned to use **educational platform APIs**, but currently runs on a **dummy database** due to API unavailability.  

### **Authentication:**  
- 🔐 **SPA Authentication** using Laravel Sanctum  

### **Version Control:**  
- 🛠️ **Git + GitHub**  

---

## ⚙️ Prerequisites  
Before running the project locally, ensure you have:  
- ✅ **Node.js (v18+)** – For React frontend  
- ✅ **npm or yarn** – For package management  
- ✅ **PHP ≥ 8.2** – Required by Laravel 11  
- ✅ **Composer** – PHP package manager  
- ✅ **Local Server** (XAMPP, Valet, etc.) – For MySQL  

---

## 🛠️ Installation (Local Setup)  

### 1️⃣ **Database Setup**  
1. Open your **local server** and start **Apache & MySQL**.  
2. Open **phpMyAdmin**.  
3. **Create a new database** and configure it in your `.env` file.  

### 2️⃣ **Backend Setup (Laravel)**  
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

### 3️⃣ Frontend Setup (React)
```bash
cd frontend
npm install
npm start
```

---

## 📂 Project Structure

```bash
/moplearn
│
├── backend (Laravel)
│   └── app, routes, migrations, controllers, resources, requests, etc.
│
├── frontend (React App)
│   └── components, pages, redux, hooks, utils, assets
│
└── README.md
```

---

## 📺 Video Demo

[![Watch the demo](https://img.youtube.com/vi/7R354pl32zE/maxresdefault.jpg)](https://www.youtube.com/watch?v=7R354pl32zE)
