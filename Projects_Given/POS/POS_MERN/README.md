# Full-Stack Point of Sale (POS) System (MERN Stack)

A modern, full-stack enterprise Point-of-Sale (POS) application built for retail store operations, product catalog management, cashier checkout, vendor procurements, expense tracking, and real-time business intelligence analytics.

---

## 🚀 Key Features & Modules

### 1. 📊 Executive Dashboard
* **Real-time Overview**: Displays daily sales revenue, net profit, monthly totals, and low-stock warning banners.
* **Sales Analytics**: Interactive 30-day sales trend chart and top-performing products breakdown.
* **Audit Registry**: Live feed of recent sales transactions and cashier activities.

### 2. 🛒 POS Cashier Checkout Interface
* **Fast Barcode & SKU Search**: Instant product lookup via USB barcode scanner or keyword search.
* **Category Filtering**: Quick category tabs and dynamic item selection.
* **Cart & Pricing Engine**: Live shopping cart state with discount and tax calculations.
* **Flexible Payments**: Multi-method payment support (Cash, Credit/Debit Card, Mobile Wallet, Split Payment).
* **Hardware Printing**: Direct receipt printing via **QZ-Tray** integration (80mm thermal receipt & A4 invoice format).

### 3. 📦 Product Catalog & Barcode Management
* **Inventory Control**: Comprehensive product creation and management supporting SKUs, categories, brands, cost price, retail price, and low-stock warning thresholds.
* **Barcode Operations**: Barcode generation for new products and scanning validation.

### 4. 🚚 Vendors & Purchase Orders
* **Supplier Directory**: Full supplier profile management including contact information and address logs.
* **Procurement Workflow**: Purchase order creation, order tracking (Pending, Received, Partial), and stock auto-restock upon delivery.
* **Payment Tracking**: Record supplier payments and monitor outstanding vendor balances.

### 5. 🧾 Invoices & Sales History
* **Transaction History**: Searchable invoice directory with date-range filters and payment status.
* **Receipt Inspection**: Thermal receipt and A4 invoice view modal.
* **Refund Workflow**: Process returns and handle transaction cancellations.
* **Exporting**: CSV data export for external accounting tools.

### 6. 💸 Expenses Ledger
* **Categorized Expenses**: Track store overheads (Rent, Utilities, Maintenance, Supplies, Salaries).
* **Financial Auditing**: Categorized expense summaries and date-range filters.

### 7. 📈 Business Reports & Analytics
* **Profit & Loss Statements**: Comprehensive financial reports comparing sales revenue against product costs and store expenses.
* **Stock Valuation**: Real-time inventory asset valuation and stock movement audit logs.
* **Cashier Performance**: Cashier sales breakdown and audit summaries.

### 8. ⚙️ System Settings & Security
* **Role-Based Access Control (RBAC)**: Role permissions for **Admin** and **Cashier** users.
* **Database Utilities**: Demo data reset functionality and configuration management.

---

## 🛠️ Technology Stack

* **Frontend**: React.js, TailwindCSS / Vanilla CSS, Lucide Icons, Axios, React Router, Context API.
* **Backend**: Node.js, Express.js REST API, JSON Web Tokens (JWT), Bcrypt.js, Dotenv.
* **Database**: MongoDB, Mongoose ODM.
* **Hardware Integration**: QZ-Tray Desktop Printing Bridge (Thermal Printers & Barcode Scanners).
* **Development & Quality Assurance**: Postman, MongoDB Compass, Git/GitHub.

---

## ⚙️ Installation & Setup Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v16.x or higher)
* [MongoDB](https://www.mongodb.com/) (running locally on port 27017 or MongoDB Atlas URI)
* [Git](https://git-scm.com/)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Mohsin-Ali-Rana/Glaxit.git
cd POS_MERN
```

---

### Step 2: Backend Configuration & Execution
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create or verify the `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/garment-pos
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

---

### Step 3: Seed Demo Data (Optional)
To populate the database with realistic sample products, sales history, categories, and vendors for demonstration:
```bash
npm run seed
```

---

### Step 4: Frontend Configuration & Execution
1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web application in your browser at `http://localhost:5173`.

---

## 🔑 Default User Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@pos.com` | `password` |
| **Cashier** | `cashier@pos.com` | `password` |

---

## 📑 Core REST API Endpoints Summary

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/login` | User authentication & JWT token generation | Public |
| `GET` | `/api/dashboard` | Dashboard metrics & sales trend analytics | Protected |
| `GET` | `/api/products` | Retrieve all products in inventory | Protected |
| `POST` | `/api/products` | Create a new product record | Admin |
| `DELETE` | `/api/products/:id` | Remove a product from inventory | Admin |
| `POST` | `/api/pos/checkout` | Process a customer purchase & update stock | Protected |
| `GET` | `/api/pos/invoices` | Retrieve sales invoice directory | Protected |
| `POST` | `/api/vendors/purchase-orders` | Generate a new supplier purchase order | Admin |
| `GET` | `/api/reports/profit-loss` | Financial Profit & Loss aggregations | Admin |

---

## 📜 Acknowledgments

Developed as part of the **3-Month MERN Stack Internship Program at Glaxit SMC-Pvt. Ltd.**
