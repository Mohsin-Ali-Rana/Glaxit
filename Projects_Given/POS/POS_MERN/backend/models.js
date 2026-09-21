const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String }
}, { timestamps: true });

const BrandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    barcode: { type: String, unique: true, sparse: true },
    description: { type: String },
    sizes: [String],
    colors: [String],
    purchase_price: { type: Number, required: true },
    selling_price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    low_stock_warning: { type: Number, default: 10 },
    image_path: { type: String }
}, { timestamps: true });

const VendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact_person: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String }
}, { timestamps: true });

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    loyalty_points: { type: Number, default: 0 }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'cashier', enum: ['admin', 'manager', 'cashier'] },
    is_active: { type: Boolean, default: true }
}, { timestamps: true });

// Inventory Adjustment
const InventoryAdjustmentSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String }, // 'in', 'out', 'adjustment', 'damaged', 'returned'
    quantity: { type: Number },
    reason: { type: String }
}, { timestamps: true });

// Sales
const SaleSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    invoice_number: { type: String, unique: true },
    sale_date: { type: Date, default: Date.now },
    total_amount: { type: Number },
    discount_amount: { type: Number, default: 0 },
    tax_amount: { type: Number, default: 0 },
    payable_amount: { type: Number },
    paid_amount: { type: Number },
    payment_method: { type: String },
    status: { type: String },
    notes: { type: String }
}, { timestamps: true });

const SaleItemSchema = new mongoose.Schema({
    sale_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale' },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    unit_price: { type: Number },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    subtotal: { type: Number },
    size: { type: String },
    color: { type: String }
}, { timestamps: true });

// Expenses
const ExpenseCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
}, { timestamps: true });

const ExpenseSchema = new mongoose.Schema({
    expense_category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ExpenseCategory' },
    amount: { type: Number },
    date: { type: Date },
    description: { type: String }
}, { timestamps: true });

// Settings
const SettingSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: String }
}, { timestamps: true });

const AuditLogSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String },
    description: { type: String },
    ip_address: { type: String },
    user_agent: { type: String }
}, { timestamps: true });

// Purchase Orders
const PurchaseOrderSchema = new mongoose.Schema({
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    order_date: { type: Date },
    status: { type: String },
    total_amount: { type: Number },
    paid_amount: { type: Number, default: 0 },
    payment_status: { type: String }
}, { timestamps: true });

const PurchaseOrderItemSchema = new mongoose.Schema({
    purchase_order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    unit_price: { type: Number },
    total_price: { type: Number }
}, { timestamps: true });

const VendorPaymentSchema = new mongoose.Schema({
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    purchase_order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' },
    payment_date: { type: Date },
    amount: { type: Number },
    payment_method: { type: String },
    note: { type: String }
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);
const Brand = mongoose.model('Brand', BrandSchema);
const Product = mongoose.model('Product', ProductSchema);
const Vendor = mongoose.model('Vendor', VendorSchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const User = mongoose.model('User', UserSchema);
const InventoryAdjustment = mongoose.model('InventoryAdjustment', InventoryAdjustmentSchema);
const Sale = mongoose.model('Sale', SaleSchema);
const SaleItem = mongoose.model('SaleItem', SaleItemSchema);
const ExpenseCategory = mongoose.model('ExpenseCategory', ExpenseCategorySchema);
const Expense = mongoose.model('Expense', ExpenseSchema);
const Setting = mongoose.model('Setting', SettingSchema);
const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
const PurchaseOrder = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
const PurchaseOrderItem = mongoose.model('PurchaseOrderItem', PurchaseOrderItemSchema);
const VendorPayment = mongoose.model('VendorPayment', VendorPaymentSchema);

module.exports = {
    Category, Brand, Product, Vendor, Customer, User,
    InventoryAdjustment, Sale, SaleItem, ExpenseCategory, Expense,
    Setting, AuditLog, PurchaseOrder, PurchaseOrderItem, VendorPayment
};
