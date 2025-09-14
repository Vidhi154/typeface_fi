<h1 align="center">💰 Personal Finance Assistant</h1>

<p align="center">
A full-stack web application to track, manage, and visualize your financial activities.<br/>
Built with <b>React, Node.js, MongoDB, TailwindCSS, and JWT Auth</b>.
</p>

---

## ✨ Overview  

Managing finances can be confusing and time-consuming. This app simplifies money management by:  
- ✅ Tracking **income & expenses**  
- ✅ Extracting totals/dates from **uploaded receipts (OCR)**  
- ✅ Generating **charts & insights** to visualize spending  
- ✅ Supporting **secure multi-user authentication**  

> 🔥 Designed with **clean code, scalability, and modern web practices** — perfect for real-world use.  

---

## 🚀 Tech Stack  

**Frontend** 🎨  
- ⚛️ React (Hooks, Router, Context API for Auth)  
- 🎨 Tailwind CSS  
- 🔗 Axios  
- 📊 Chart.js / react-chartjs-2  

**Backend** 🖥️  
- 🟢 Node.js + Express (REST APIs)  
- 📦 Mongoose (MongoDB ODM)  
- 📤 Multer (file uploads)  
- 🔍 Tesseract.js / AWS Textract (OCR, optional)  

**Database** 🗄️  
- 🍃 MongoDB  

**Authentication & Security** 🔐  
- 🔑 JWT (JSON Web Tokens)  
- 🛡️ bcrypt (password hashing)  

**Dev Tools** 🛠️  
- 🔄 nodemon (backend auto-reload)  
- ⚙️ dotenv (env management)  

---
my-fullstack-app/
│── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # App pages (Dashboard, Login, Register)
│   │   ├── contexts/       # Context API (Auth, State Management)
│   │   └── api/            # Axios API utilities
│   └── public/
│
│── server/                 # Node + Express backend
│   ├── models/             # Mongoose models (User, Transaction, Receipt)
│   ├── routes/             # API routes (auth, transactions, receipts)
│   ├── controllers/        # API logic
│   ├── middleware/         # JWT auth middleware
│   └── uploads/            # Uploaded receipts
│
│── .env                    # Environment variables
│── package.json
│── README.md


## 🖼️ How It Works  

```mermaid
graph TD
    A[👤 User] -->|Registers / Logs In| B[🔑 Auth Service]
    A -->|Adds Income / Expense| C[📝 Transaction API]
    A -->|Uploads Receipt| D[🖼️ Multer + OCR]
    C --> E[🍃 MongoDB Database]
    D --> C
    E --> F[📊 Chart.js Visualizations]
    F --> A

