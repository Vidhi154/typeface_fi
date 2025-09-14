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



## ✨ Features

- 📊 **Track Income & Expenses** - Add and manage all your transactions
- 📈 **Beautiful Charts** - View spending patterns with interactive graphs
- 📷 **Receipt Scanner** - Upload receipts to automatically extract expense data
- 📑 **PDF Import** - Process bank statements and transaction history
- 👥 **Multi-User Support** - Secure login system for multiple users
- 📱 **Mobile Friendly** - Works great on all devices

## 🚀 Quick Setup

### 1. Clone the project
```bash
git clone <your-repo-url>
cd personal-finance-assistant
```

### 2. Setup Backend
```bash
cd backend
npm install

# Create .env file with:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance-db
JWT_SECRET=your-secret-key
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

### 4. Run the application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

Open http://localhost:3000 in your browser 🎉

## 📊 How the Charts Work

The app shows three main chart types:

1. **📈 Financial Trends** - Area chart showing income vs expenses over time
2. **📊 Monthly Comparison** - Bar chart comparing monthly income and expenses  
3. **🎯 Performance Cards** - Summary cards with key metrics

All charts are:
- Interactive with hover tooltips
- Responsive for mobile devices
- Styled with gradients and animations
- Real-time updated when you add transactions

## 📱 Main Pages

- **Dashboard** - Overview with charts and summary cards
- **Transactions** - List and add income/expense entries
- **Receipts** - Scan receipts or import PDF statements

## 🔧 API Endpoints

```
Authentication:
POST /api/auth/register
POST /api/auth/login

Transactions:
GET  /api/transactions
POST /api/transactions
PUT  /api/transactions/:id
DELETE /api/transactions/:id

Uploads:
POST /api/upload/receipt
POST /api/upload/pdf
```

## 📁 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Main pages
│   │   └── context/        # Auth context
├── backend/
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── controllers/        # Business logic
```

## 🎯 Key Features Explained

### Receipt Scanning 📷
1. Upload receipt image
2. OCR extracts text automatically  
3. AI finds amount, date, store name
4. Creates transaction with extracted data

### PDF Processing 📑
1. Upload bank statement PDF
2. Extract transaction table data
3. Parse each row into transactions
4. Bulk import to your account

### Charts & Analytics 📊
- **Income trends** over time
- **Expense breakdown** by category
- **Monthly comparisons** 
- **Savings rate** calculations





