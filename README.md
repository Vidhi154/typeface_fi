# 💰 Personal Finance Assistant  

A **full-stack web application** to track, manage, and visualize your financial activities. Users can log income & expenses, upload receipts (with OCR support), and gain insights from interactive charts.  

---

## 🚀 Tech Stack  

### 🎨 Frontend  
- ⚛️ **React** (Hooks, Router, Context API for Auth)  
- 🎨 **Tailwind CSS** (utility-first styling)  
- 🔗 **Axios** (API communication)  
- 📊 **Chart.js / react-chartjs-2** (financial graphs & insights)  

### 🖥️ Backend  
- 🟢 **Node.js + Express** (REST API)  
- 📦 **Mongoose** (MongoDB ODM)  
- 📤 **Multer** (file uploads for receipts)  
- 🔍 *(Optional)* **Tesseract.js / AWS Textract** (OCR for receipt scanning)  

### 🗄️ Database  
- 🍃 **MongoDB**  

### 🔐 Authentication & Security  
- 🔑 **JWT (JSON Web Tokens)**  
- 🛡️ **bcrypt** (password hashing)  

### 🛠️ Dev Tools  
- 🔄 **nodemon** (backend auto-reload)  
- ⚙️ **dotenv** (environment variables)  

---

## ✨ Features  

✅ Add / Edit / Delete **Income & Expense entries**  
✅ View transactions by **date range**  
✅ **Graphs & Charts**: Spending trends, expenses by category, income vs expenses  
✅ Upload receipts & auto-extract expenses via **OCR**  
✅ Multi-user support with **JWT Auth**  
✅ Bonus: Import transaction history from **PDF**  
✅ Bonus: Pagination for large transaction lists  

---

## 📊 How It Works  

```mermaid
graph TD
    A[👤 User] -->|Logs In / Registers| B[🔑 Auth Service]
    A -->|Adds Expense / Income| C[📝 Transaction API]
    A -->|Uploads Receipt| D[🖼️ Multer + OCR]
    C --> E[🍃 MongoDB Database]
    D --> C
    E --> F[📊 Chart.js Visualizations]
    F --> A


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
my-fullstack-app/
│── frontend/                 # Frontend (React)
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Routes/pages
│   │   ├── contexts/       # AuthContext, Global State
│   │   └── api/            # Axios setup
│   └── public/
│
│── backend/                 # Backend (Node + Express)
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes (auth, receipts, transactions)
│   ├── middleware/         # JWT auth middleware
│   └── uploads/            # Receipt uploads
│
│── .env                    # Environment variables
│── package.json
│── README.md


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






