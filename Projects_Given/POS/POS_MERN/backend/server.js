const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const models = require('./models');
const { seedAllData } = require('./seedData');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB & Auto Seed Initial Data if Empty
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/garment-pos').then(async () => {
    console.log('MongoDB connected');
    await seedAllData(models, false);
}).catch(err => console.error('MongoDB connection error:', err));

// Auth Middleware
const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await models.User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// ==========================================
// Public Routes
// ==========================================
app.post('/api/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const user = await models.User.findOne({ email: cleanEmail });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            status: 'success',
            data: {
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
}));

// ==========================================
// Protected Routes
// ==========================================
app.use('/api', protect);

app.post('/api/logout', (req, res) => {
    res.json({ status: 'success', message: 'Logged out successfully' });
});

app.get('/api/me', (req, res) => {
    res.json({ status: 'success', data: { user: req.user } });
});

app.post('/api/seed', asyncHandler(async (req, res) => {
    const result = await seedAllData(models, true);
    res.json(result);
}));

app.get('/api/dashboard', asyncHandler(async (req, res) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Sales today
    const todaySalesDocs = await models.Sale.find({ createdAt: { $gte: startOfToday } });
    const today_sales = todaySalesDocs.reduce((acc, s) => acc + (s.payable_amount || 0), 0);
    const today_profit = Math.round(today_sales * 0.45 * 100) / 100;

    // Monthly sales
    const monthlySalesDocs = await models.Sale.find({ createdAt: { $gte: thirtyDaysAgo } });
    const monthly_sales = monthlySalesDocs.reduce((acc, s) => acc + (s.payable_amount || 0), 0);

    // Low stock count & alerts
    const low_stock_count = await models.Product.countDocuments({ $expr: { $lte: ["$quantity", "$low_stock_warning"] } });
    const low_stock_alerts = await models.Product.find({ $expr: { $lte: ["$quantity", "$low_stock_warning"] } }).populate('category_id brand_id').limit(5);

    // Recent sales
    const recent_sales_raw = await models.Sale.find().populate('customer_id user_id').sort({ createdAt: -1 }).limit(5);
    const recent_sales = recent_sales_raw.map(s => ({
        id: s._id,
        invoice_number: s.invoice_number,
        customer: s.customer_id,
        payable_amount: s.payable_amount,
        status: s.status,
        sale_date: s.sale_date || s.createdAt
    }));

    // Top selling products
    const saleItemsAgg = await models.SaleItem.aggregate([
        { $group: { _id: "$product_id", total_qty: { $sum: "$quantity" } } },
        { $sort: { total_qty: -1 } },
        { $limit: 5 }
    ]);

    const top_selling = [];
    for (const item of saleItemsAgg) {
        if (item._id) {
            const prod = await models.Product.findById(item._id);
            if (prod) {
                top_selling.push({ name: prod.name, total_qty: item.total_qty });
            }
        }
    }

    // Sales trend chart for past 30 days
    const sales_chart = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().split('T')[0];

        const dayStart = new Date(d);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(d);
        dayEnd.setHours(23, 59, 59, 999);

        const daySalesDocs = await models.Sale.find({ createdAt: { $gte: dayStart, $lte: dayEnd } });
        const dayTotal = daySalesDocs.reduce((acc, s) => acc + (s.payable_amount || 0), 0);

        sales_chart.push({ date: dayStr, sales: Math.round(dayTotal * 100) / 100 });
    }

    res.json({
        status: 'success',
        data: {
            stats: {
                today_sales: Math.round(today_sales * 100) / 100,
                today_profit,
                monthly_sales: Math.round(monthly_sales * 100) / 100,
                low_stock_count: low_stock_count || 0
            },
            low_stock_alerts,
            recent_sales,
            top_selling,
            sales_chart
        }
    });
}));

// --- Categories ---
app.get('/api/categories', asyncHandler(async (req, res) => {
    const categories = await models.Category.find();
    res.json({ status: 'success', data: categories });
}));
app.post('/api/categories', asyncHandler(async (req, res) => {
    const category = await models.Category.create({ ...req.body, slug: req.body.name.toLowerCase().replace(/ /g, '-') });
    res.status(201).json({ status: 'success', data: category });
}));
app.put('/api/categories/:id', asyncHandler(async (req, res) => {
    const category = await models.Category.findByIdAndUpdate(req.params.id, { ...req.body, slug: req.body.name.toLowerCase().replace(/ /g, '-') }, { new: true });
    res.json({ status: 'success', data: category });
}));
app.delete('/api/categories/:id', asyncHandler(async (req, res) => {
    await models.Category.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Deleted' });
}));

// --- Brands ---
app.get('/api/brands', asyncHandler(async (req, res) => {
    const brands = await models.Brand.find();
    res.json({ status: 'success', data: brands });
}));
app.post('/api/brands', asyncHandler(async (req, res) => {
    const brand = await models.Brand.create({ ...req.body, slug: req.body.name.toLowerCase().replace(/ /g, '-') });
    res.status(201).json({ status: 'success', data: brand });
}));
app.put('/api/brands/:id', asyncHandler(async (req, res) => {
    const brand = await models.Brand.findByIdAndUpdate(req.params.id, { ...req.body, slug: req.body.name.toLowerCase().replace(/ /g, '-') }, { new: true });
    res.json({ status: 'success', data: brand });
}));
app.delete('/api/brands/:id', asyncHandler(async (req, res) => {
    await models.Brand.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Deleted' });
}));

// --- Products ---
app.get('/api/products', asyncHandler(async (req, res) => {
    const products = await models.Product.find().populate('category_id').populate('brand_id');
    res.json({ status: 'success', data: { data: products, current_page: 1, total: products.length, per_page: 10 } });
}));
app.post('/api/products', asyncHandler(async (req, res) => {
    const product = await models.Product.create({ ...req.body, slug: req.body.name.toLowerCase().replace(/ /g, '-') });
    res.status(201).json({ status: 'success', data: product });
}));
app.get('/api/products/:id', asyncHandler(async (req, res) => {
    const product = await models.Product.findById(req.params.id).populate('category_id brand_id');
    res.json({ status: 'success', data: product });
}));
app.post('/api/products/:id', asyncHandler(async (req, res) => {
    const product = await models.Product.findByIdAndUpdate(req.params.id, { ...req.body, slug: req.body.name.toLowerCase().replace(/ /g, '-') }, { new: true });
    res.json({ status: 'success', data: product });
}));
app.put('/api/products/:id', asyncHandler(async (req, res) => {
    const product = await models.Product.findByIdAndUpdate(req.params.id, { ...req.body, slug: req.body.name.toLowerCase().replace(/ /g, '-') }, { new: true });
    res.json({ status: 'success', data: product });
}));
app.delete('/api/products/:id', asyncHandler(async (req, res) => {
    await models.Product.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Deleted' });
}));

// --- Customers ---
app.get('/api/customers', asyncHandler(async (req, res) => {
    const customers = await models.Customer.find();
    res.json({ status: 'success', data: customers });
}));
app.post('/api/customers', asyncHandler(async (req, res) => {
    const customer = await models.Customer.create(req.body);
    res.status(201).json({ status: 'success', data: customer });
}));
app.put('/api/customers/:id', asyncHandler(async (req, res) => {
    const customer = await models.Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ status: 'success', data: customer });
}));
app.delete('/api/customers/:id', asyncHandler(async (req, res) => {
    await models.Customer.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Deleted' });
}));

// --- Vendors ---
app.get('/api/vendors', asyncHandler(async (req, res) => {
    const vendors = await models.Vendor.find();
    const formatted = [];
    for (const v of vendors) {
        const poCount = await models.PurchaseOrder.countDocuments({ vendor_id: v._id });
        formatted.push({
            id: v._id,
            name: v.name,
            contact_person: v.contact_person,
            email: v.email,
            phone: v.phone,
            address: v.address,
            purchase_orders_count: poCount
        });
    }
    res.json({ status: 'success', data: formatted });
}));
app.post('/api/vendors', asyncHandler(async (req, res) => {
    const vendor = await models.Vendor.create(req.body);
    res.status(201).json({ status: 'success', data: vendor });
}));
app.put('/api/vendors/:id', asyncHandler(async (req, res) => {
    const vendor = await models.Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ status: 'success', data: vendor });
}));
app.delete('/api/vendors/:id', asyncHandler(async (req, res) => {
    await models.Vendor.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Deleted' });
}));

// --- Employees ---
app.get('/api/employees', asyncHandler(async (req, res) => {
    const employees = await models.User.find();
    const formatted = employees.map(e => ({
        id: e._id,
        name: e.name,
        email: e.email,
        role: e.role,
        is_active: e.is_active,
        created_at: e.createdAt
    }));
    res.json({ status: 'success', data: formatted });
}));
app.post('/api/employees', asyncHandler(async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const employee = await models.User.create({ ...req.body, password: hashedPassword });
    res.status(201).json({ status: 'success', data: employee });
}));
app.put('/api/employees/:id', asyncHandler(async (req, res) => {
    const updateData = { ...req.body };
    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
        delete updateData.password;
    }
    const employee = await models.User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ status: 'success', data: employee });
}));
app.delete('/api/employees/:id', asyncHandler(async (req, res) => {
    await models.User.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Employee deleted' });
}));
app.post('/api/employees/:id/toggle-status', asyncHandler(async (req, res) => {
    const employee = await models.User.findById(req.params.id);
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    employee.is_active = !employee.is_active;
    await employee.save();
    res.json({ status: 'success', data: employee });
}));

// --- POS Checkout & Search ---
app.get('/api/pos/search', asyncHandler(async (req, res) => {
    const q = req.query.query || req.query.q || '';
    const products = await models.Product.find({ name: new RegExp(q, 'i') }).populate('category_id brand_id');
    const formatted = products.map(p => ({
        id: p._id,
        name: p.name,
        sku: p.sku,
        barcode: p.barcode,
        purchase_price: p.purchase_price,
        selling_price: p.selling_price,
        quantity: p.quantity,
        category: p.category_id,
        brand: p.brand_id,
        sizes: p.sizes,
        colors: p.colors,
        image_path: p.image_path
    }));
    res.json({ status: 'success', data: formatted });
}));

app.post('/api/pos/checkout', asyncHandler(async (req, res) => {
    const { items, customer_id, discount, tax, subtotal, total, payment_method, amount_paid } = req.body;

    const sale = await models.Sale.create({
        customer_id: customer_id || null,
        user_id: req.user._id,
        invoice_number: 'INV-' + Date.now(),
        total_amount: subtotal,
        discount_amount: discount || 0,
        tax_amount: tax || 0,
        payable_amount: total,
        paid_amount: amount_paid || total,
        payment_method: payment_method || 'cash',
        status: 'completed'
    });

    for (let item of items) {
        await models.SaleItem.create({
            sale_id: sale._id,
            product_id: item.product_id || item.id,
            quantity: item.quantity,
            unit_price: item.price,
            subtotal: item.price * item.quantity,
            size: item.size || 'M',
            color: item.color || 'Standard'
        });
        await models.Product.findByIdAndUpdate(item.product_id || item.id, { $inc: { quantity: -item.quantity } });
    }

    res.json({ status: 'success', data: sale, message: 'Checkout successful' });
}));

app.get('/api/pos/invoices', asyncHandler(async (req, res) => {
    const invs = await models.Sale.find().populate('customer_id user_id').sort({ createdAt: -1 });
    const formatted = invs.map(s => ({
        id: s._id,
        invoice_number: s.invoice_number,
        customer: s.customer_id,
        user: s.user_id,
        sale_date: s.sale_date || s.createdAt,
        payable_amount: s.payable_amount,
        paid_amount: s.paid_amount,
        payment_method: s.payment_method,
        status: s.status
    }));
    res.json({ status: 'success', data: { data: formatted, current_page: 1, last_page: 1, total: formatted.length, per_page: 10 } });
}));

app.get('/api/pos/invoices/:id', asyncHandler(async (req, res) => {
    const sale = await models.Sale.findById(req.params.id).populate('customer_id user_id');
    if (!sale) return res.status(404).json({ message: 'Invoice not found' });
    const items = await models.SaleItem.find({ sale_id: sale._id }).populate('product_id');
    const formattedItems = items.map(item => ({
        id: item._id,
        product: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        size: item.size || 'M',
        color: item.color || 'Standard'
    }));
    res.json({
        status: 'success',
        data: {
            id: sale._id,
            invoice_number: sale.invoice_number,
            sale_date: sale.sale_date || sale.createdAt,
            customer: sale.customer_id,
            user: sale.user_id,
            payable_amount: sale.payable_amount,
            paid_amount: sale.paid_amount,
            tax_amount: sale.tax_amount,
            discount_amount: sale.discount_amount,
            payment_method: sale.payment_method,
            status: sale.status,
            notes: sale.notes,
            items: formattedItems
        }
    });
}));

app.post('/api/pos/invoices/:id/refund', asyncHandler(async (req, res) => {
    const sale = await models.Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Invoice not found' });
    if (sale.status === 'refunded') return res.status(400).json({ message: 'Invoice already refunded' });
    
    sale.status = 'refunded';
    await sale.save();

    const items = await models.SaleItem.find({ sale_id: sale._id });
    for (let item of items) {
        if (item.product_id) {
            await models.Product.findByIdAndUpdate(item.product_id, { $inc: { quantity: item.quantity } });
        }
    }

    res.json({ status: 'success', message: 'Invoice refunded and inventory restored' });
}));

app.delete('/api/pos/invoices/:id', asyncHandler(async (req, res) => {
    await models.Sale.findByIdAndDelete(req.params.id);
    await models.SaleItem.deleteMany({ sale_id: req.params.id });
    res.json({ status: 'success', message: 'Invoice deleted' });
}));

// --- Settings ---
app.get('/api/settings', asyncHandler(async (req, res) => {
    const sets = await models.Setting.find();
    res.json({ status: 'success', data: sets });
}));
app.post('/api/settings', asyncHandler(async (req, res) => {
    res.json({ status: 'success', message: 'Settings saved' });
}));
app.get('/api/backups', asyncHandler(async (req, res) => {
    res.json({ status: 'success', data: [] });
}));

// --- Expenses ---
app.get('/api/expenses/categories', asyncHandler(async (req, res) => {
    const cats = await models.ExpenseCategory.find();
    const formatted = cats.map(c => ({ id: c._id, name: c.name }));
    res.json({ status: 'success', data: formatted });
}));
app.post('/api/expenses/categories', asyncHandler(async (req, res) => {
    const cat = await models.ExpenseCategory.create(req.body);
    res.status(201).json({ status: 'success', data: { id: cat._id, name: cat.name } });
}));
app.put('/api/expenses/categories/:id', asyncHandler(async (req, res) => {
    const cat = await models.ExpenseCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ status: 'success', data: { id: cat._id, name: cat.name } });
}));
app.delete('/api/expenses/categories/:id', asyncHandler(async (req, res) => {
    await models.ExpenseCategory.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Deleted' });
}));

app.get('/api/expenses', asyncHandler(async (req, res) => {
    const expenses = await models.Expense.find().populate('expense_category_id').sort({ date: -1 });
    const formatted = expenses.map(e => ({
        id: e._id,
        expense_category: e.expense_category_id,
        amount: e.amount,
        date: e.date,
        description: e.description
    }));
    res.json({ status: 'success', data: { data: formatted, current_page: 1, last_page: 1, total: formatted.length, per_page: 10 } });
}));
app.post('/api/expenses', asyncHandler(async (req, res) => {
    const expense = await models.Expense.create(req.body);
    res.status(201).json({ status: 'success', data: expense });
}));
app.put('/api/expenses/:id', asyncHandler(async (req, res) => {
    const expense = await models.Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ status: 'success', data: expense });
}));
app.delete('/api/expenses/:id', asyncHandler(async (req, res) => {
    await models.Expense.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Deleted' });
}));

// --- Inventory Adjustments ---
app.get('/api/inventory/adjustments', asyncHandler(async (req, res) => {
    const adjs = await models.InventoryAdjustment.find().populate('product_id user_id').sort({ createdAt: -1 });
    const formatted = adjs.map(a => ({
        id: a._id,
        product: a.product_id,
        user: a.user_id,
        type: a.type,
        quantity: a.quantity,
        reason: a.reason,
        created_at: a.createdAt
    }));
    res.json({ status: 'success', data: { data: formatted, current_page: 1, last_page: 1, total: formatted.length, per_page: 10 } });
}));
app.post('/api/inventory/adjustments', asyncHandler(async (req, res) => {
    const { product_id, type, quantity, reason } = req.body;
    const adj = await models.InventoryAdjustment.create({ product_id, user_id: req.user._id, type, quantity, reason });
    const sign = (type === 'in' || type === 'returned') ? 1 : -1;
    await models.Product.findByIdAndUpdate(product_id, { $inc: { quantity: sign * quantity } });
    res.status(201).json({ status: 'success', data: adj });
}));
app.delete('/api/inventory/adjustments/:id', asyncHandler(async (req, res) => {
    await models.InventoryAdjustment.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Adjustment deleted' });
}));
app.get('/api/inventory/low-stock', asyncHandler(async (req, res) => {
    const products = await models.Product.find({ $expr: { $lte: ["$quantity", "$low_stock_warning"] } }).populate('category_id brand_id');
    const formatted = products.map(p => ({
        id: p._id,
        name: p.name,
        sku: p.sku,
        quantity: p.quantity,
        low_stock_warning: p.low_stock_warning,
        brand: p.brand_id
    }));
    res.json({ status: 'success', data: formatted });
}));

// --- Reports ---
app.get('/api/reports/sales', asyncHandler(async (req, res) => {
    const sales = await models.Sale.find().populate('customer_id user_id');
    const formatted = sales.map(s => ({
        id: s._id,
        invoice_number: s.invoice_number,
        customer: s.customer_id,
        user: s.user_id,
        sale_date: s.sale_date || s.createdAt,
        payable_amount: s.payable_amount,
        payment_method: s.payment_method,
        status: s.status
    }));
    res.json({ status: 'success', data: formatted });
}));

app.get('/api/reports/profit-loss', asyncHandler(async (req, res) => {
    const allSales = await models.Sale.find();
    const income = allSales.reduce((acc, s) => acc + (s.payable_amount || 0), 0);

    const allExpenses = await models.Expense.find();
    const expenseTotal = allExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);

    const cogs = Math.round(income * 0.50 * 100) / 100;
    const profit = Math.round((income - expenseTotal - cogs) * 100) / 100;

    res.json({
        status: 'success',
        data: {
            income: Math.round(income * 100) / 100,
            expenses: Math.round(expenseTotal * 100) / 100,
            cogs,
            profit
        }
    });
}));

app.get('/api/reports/expenses', asyncHandler(async (req, res) => {
    const exps = await models.Expense.find().populate('expense_category_id');
    const formatted = exps.map(e => ({
        id: e._id,
        category: e.expense_category_id?.name || 'General',
        amount: e.amount,
        date: e.date,
        description: e.description
    }));
    res.json({ status: 'success', data: formatted });
}));

app.get('/api/reports/inventory', asyncHandler(async (req, res) => {
    const inventory = await models.Product.find().populate('category_id brand_id');
    const formatted = inventory.map(p => ({
        id: p._id,
        name: p.name,
        sku: p.sku,
        category: p.category_id?.name || 'Uncategorized',
        brand: p.brand_id?.name || 'No Brand',
        quantity: p.quantity,
        purchase_price: p.purchase_price,
        selling_price: p.selling_price,
        total_cost_value: p.purchase_price * p.quantity,
        total_retail_value: p.selling_price * p.quantity
    }));
    res.json({ status: 'success', data: formatted });
}));

app.get('/api/reports/vendors', asyncHandler(async (req, res) => {
    const vendors = await models.Vendor.find();
    const formatted = [];
    for (const v of vendors) {
        const pos = await models.PurchaseOrder.find({ vendor_id: v._id });
        const totalBilled = pos.reduce((acc, p) => acc + (p.total_amount || 0), 0);
        const totalPaid = pos.reduce((acc, p) => acc + (p.paid_amount || 0), 0);
        formatted.push({
            id: v._id,
            name: v.name,
            contact_person: v.contact_person,
            total_orders: pos.length,
            total_billed: totalBilled,
            total_paid: totalPaid,
            balance_due: totalBilled - totalPaid
        });
    }
    res.json({ status: 'success', data: formatted });
}));

app.get('/api/reports/cashiers', asyncHandler(async (req, res) => {
    const cashiers = await models.User.find();
    const formatted = [];
    for (const c of cashiers) {
        const sales = await models.Sale.find({ user_id: c._id });
        const totalSales = sales.reduce((acc, s) => acc + (s.payable_amount || 0), 0);
        formatted.push({
            id: c._id,
            name: c.name,
            email: c.email,
            role: c.role,
            total_transactions: sales.length,
            total_sales_amount: totalSales
        });
    }
    res.json({ status: 'success', data: formatted });
}));

// --- Purchase Orders ---
app.get('/api/vendors/purchase-orders', asyncHandler(async (req, res) => {
    const pos = await models.PurchaseOrder.find().populate('vendor_id').sort({ createdAt: -1 });
    const formatted = pos.map(p => ({
        id: p._id,
        vendor: p.vendor_id,
        vendor_id: p.vendor_id?._id,
        order_date: p.order_date ? new Date(p.order_date).toISOString().split('T')[0] : '',
        status: p.status,
        total_amount: p.total_amount,
        paid_amount: p.paid_amount,
        payment_status: p.payment_status
    }));
    res.json({ status: 'success', data: { data: formatted, current_page: 1, last_page: 1, total: formatted.length, per_page: 10 } });
}));

app.post('/api/vendors/purchase-orders', asyncHandler(async (req, res) => {
    const { vendor_id, order_date, items } = req.body;
    let total_amount = 0;
    if (items && Array.isArray(items)) {
        total_amount = items.reduce((acc, it) => acc + ((it.quantity || 0) * (it.unit_price || 0)), 0);
    }
    const po = await models.PurchaseOrder.create({
        vendor_id,
        order_date: order_date || new Date(),
        status: 'pending',
        total_amount,
        paid_amount: 0,
        payment_status: 'unpaid'
    });

    if (items && Array.isArray(items)) {
        for (let item of items) {
            await models.PurchaseOrderItem.create({
                purchase_order_id: po._id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: (item.quantity || 0) * (item.unit_price || 0)
            });
        }
    }

    res.status(201).json({ status: 'success', data: po });
}));

app.post('/api/vendors/purchase-orders/:id/status', asyncHandler(async (req, res) => {
    const { status } = req.body;
    const po = await models.PurchaseOrder.findById(req.params.id);
    if (!po) return res.status(404).json({ message: 'PO not found' });
    
    po.status = status;
    await po.save();

    // If marked received, restock inventory items
    if (status === 'received') {
        const items = await models.PurchaseOrderItem.find({ purchase_order_id: po._id });
        for (let item of items) {
            if (item.product_id) {
                await models.Product.findByIdAndUpdate(item.product_id, { $inc: { quantity: item.quantity } });
            }
        }
    }

    res.json({ status: 'success', data: po });
}));

app.delete('/api/vendors/purchase-orders/:id', asyncHandler(async (req, res) => {
    await models.PurchaseOrder.findByIdAndDelete(req.params.id);
    await models.PurchaseOrderItem.deleteMany({ purchase_order_id: req.params.id });
    await models.VendorPayment.deleteMany({ purchase_order_id: req.params.id });
    res.json({ status: 'success', message: 'PO deleted' });
}));

app.post('/api/vendors/payments', asyncHandler(async (req, res) => {
    const { vendor_id, purchase_order_id, amount, payment_date, payment_method, note } = req.body;
    const payment = await models.VendorPayment.create({
        vendor_id,
        purchase_order_id,
        payment_date: payment_date || new Date(),
        amount: parseFloat(amount) || 0,
        payment_method,
        note
    });

    if (purchase_order_id) {
        const po = await models.PurchaseOrder.findById(purchase_order_id);
        if (po) {
            po.paid_amount = (po.paid_amount || 0) + (parseFloat(amount) || 0);
            if (po.paid_amount >= po.total_amount) {
                po.payment_status = 'paid';
            } else if (po.paid_amount > 0) {
                po.payment_status = 'partial';
            }
            await po.save();
        }
    }

    res.json({ status: 'success', data: payment });
}));

// --- Settings Page Button Action for Re-seeding Dummy Data ---
app.post('/api/reset-demo-data', asyncHandler(async (req, res) => {
    const result = await seedAllData(models, true);
    res.json(result);
}));

// --- Error Handler ---
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
