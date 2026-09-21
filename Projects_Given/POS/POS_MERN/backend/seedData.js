const bcrypt = require('bcryptjs');

const seedAllData = async (models, force = false) => {
    try {
        const productCount = await models.Product.countDocuments();
        if (productCount > 0 && !force) {
            console.log('Database already has product data. Skipping auto-seed.');
            return { status: 'skipped', message: 'Data already exists' };
        }

        console.log('Seeding initial dummy data across all entities...');

        if (force) {
            await models.Category.deleteMany({});
            await models.Brand.deleteMany({});
            await models.Product.deleteMany({});
            await models.Customer.deleteMany({});
            await models.Vendor.deleteMany({});
            await models.ExpenseCategory.deleteMany({});
            await models.Expense.deleteMany({});
            await models.Sale.deleteMany({});
            await models.SaleItem.deleteMany({});
            await models.InventoryAdjustment.deleteMany({});
            await models.PurchaseOrder.deleteMany({});
            await models.PurchaseOrderItem.deleteMany({});
            await models.VendorPayment.deleteMany({});
        }

        // 1. Users / Employees
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password', salt);

        const usersData = [
            { name: 'Admin', email: 'admin@pos.com', password: hashedPassword, role: 'admin' },
            { name: 'Cashier John', email: 'cashier@pos.com', password: hashedPassword, role: 'cashier' },
            { name: 'Senior Cashier Maria', email: 'maria@pos.com', password: hashedPassword, role: 'cashier' },
            { name: 'Floor Manager Liam', email: 'liam@pos.com', password: hashedPassword, role: 'manager' },
            { name: 'Admin Legacy', email: 'admin@admin.com', password: hashedPassword, role: 'admin' }
        ];

        const users = [];
        for (const u of usersData) {
            let existing = await models.User.findOne({ email: u.email });
            if (!existing) {
                existing = await models.User.create(u);
            }
            users.push(existing);
        }

        const adminUser = users.find(u => u.email === 'admin@pos.com') || users[0];
        const cashierUser = users.find(u => u.email === 'cashier@pos.com') || users[1];

        // 2. Categories
        const categoriesData = [
            { name: "Men's Wear", description: "Shirts, Trousers, Jackets & Suits for Men" },
            { name: "Women's Wear", description: "Dresses, Tops, Kurtis & Ethnic Wear" },
            { name: "Kids & Infants", description: "Comfortable Wear & Outfits for Children" },
            { name: "Formal Suits & Blazers", description: "Premium Tailored Suits & Tuxedos" },
            { name: "Denim & Casual", description: "Jeans, Jackets & Everyday Casuals" },
            { name: "Footwear & Accessories", description: "Belts, Shoes & Fashion Accessories" },
            { name: "Activewear & Sports", description: "Gym Wear, Shorts & Athletic Tops" }
        ];

        const categories = [];
        for (const c of categoriesData) {
            const cat = await models.Category.create({
                ...c,
                slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            });
            categories.push(cat);
        }

        // 3. Brands
        const brandsData = [
            { name: "Vogue Signature", description: "In-house Premium Garment Line" },
            { name: "Zara Collection", description: "Modern Urban Street Style" },
            { name: "Levi Strauss & Co.", description: "Classic American Denim" },
            { name: "Nike Athletics", description: "Performance Sportswear" },
            { name: "Adidas Originals", description: "Iconic Sporty Apparel" },
            { name: "Gucci Luxury", description: "High-end Luxury Fashion & Belts" },
            { name: "H&M Essentials", description: "Affordable Everyday Fashion" }
        ];

        const brands = [];
        for (const b of brandsData) {
            const br = await models.Brand.create({
                ...b,
                slug: b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            });
            brands.push(br);
        }

        // 4. Products
        const productsData = [
            {
                category_id: categories[4]._id, // Denim & Casual
                brand_id: brands[2]._id, // Levi's
                name: 'Classic Slim Denim Jacket',
                sku: 'DEN-JKT-001',
                barcode: '8901001',
                description: 'Timeless indigo denim jacket with brass button details and chest pockets.',
                sizes: ['S', 'M', 'L', 'XL'],
                colors: ['Indigo Blue', 'Washed Black'],
                purchase_price: 45.00,
                selling_price: 89.99,
                quantity: 42,
                low_stock_warning: 10
            },
            {
                category_id: categories[3]._id, // Formal Suits
                brand_id: brands[0]._id, // Vogue Signature
                name: 'Italian Cut Wool Blazer',
                sku: 'BLZ-ITA-002',
                barcode: '8901002',
                description: 'Tailored 100% fine Italian wool blazer for corporate & evening wear.',
                sizes: ['38R', '40R', '42R'],
                colors: ['Charcoal Grey', 'Navy Blue'],
                purchase_price: 110.00,
                selling_price: 249.99,
                quantity: 4, // LOW STOCK ALERT
                low_stock_warning: 10
            },
            {
                category_id: categories[0]._id, // Men's Wear
                brand_id: brands[6]._id, // H&M Essentials
                name: 'Organic Cotton Crew Neck T-Shirt',
                sku: 'TSH-COT-003',
                barcode: '8901003',
                description: 'Ultra-soft 100% breathable organic cotton daily crewneck tee.',
                sizes: ['XS', 'S', 'M', 'L', 'XL'],
                colors: ['White', 'Black', 'Heather Grey'],
                purchase_price: 9.50,
                selling_price: 24.99,
                quantity: 115,
                low_stock_warning: 15
            },
            {
                category_id: categories[1]._id, // Women's Wear
                brand_id: brands[1]._id, // Zara
                name: 'Silk Floral Summer Maxi Dress',
                sku: 'DRS-SLK-004',
                barcode: '8901004',
                description: 'Flowy silk chiffon maxi dress with vibrant botanical floral prints.',
                sizes: ['S', 'M', 'L'],
                colors: ['Coral Pink', 'Emerald Green'],
                purchase_price: 38.00,
                selling_price: 84.99,
                quantity: 6, // LOW STOCK ALERT
                low_stock_warning: 10
            },
            {
                category_id: categories[5]._id, // Footwear & Accessories
                brand_id: brands[4]._id, // Adidas
                name: 'Ultra Boost Running Sneakers',
                sku: 'SNK-UB-005',
                barcode: '8901005',
                description: 'High-cushion responsive running sneakers for maximum comfort.',
                sizes: ['8', '9', '10', '11'],
                colors: ['Core Black', 'Triple White'],
                purchase_price: 75.00,
                selling_price: 159.99,
                quantity: 28,
                low_stock_warning: 8
            },
            {
                category_id: categories[0]._id, // Men's Wear
                brand_id: brands[6]._id, // H&M
                name: 'Classic Chino Trousers',
                sku: 'TRO-CHI-006',
                barcode: '8901006',
                description: 'Stretch-cotton twill chinos ideal for smart casual workwear.',
                sizes: ['30', '32', '34', '36'],
                colors: ['Khaki', 'Olive Green', 'Navy'],
                purchase_price: 20.00,
                selling_price: 49.99,
                quantity: 54,
                low_stock_warning: 12
            },
            {
                category_id: categories[1]._id, // Women's Wear
                brand_id: brands[0]._id, // Vogue
                name: 'Embroidered Cotton Kurti',
                sku: 'KRT-EMB-007',
                barcode: '8901007',
                description: 'Hand-embroidered neckband cotton kurti tunic with side slits.',
                sizes: ['S', 'M', 'L'],
                colors: ['Teal Blue', 'Blush Pink'],
                purchase_price: 22.00,
                selling_price: 54.99,
                quantity: 65,
                low_stock_warning: 10
            },
            {
                category_id: categories[2]._id, // Kids & Infants
                brand_id: brands[6]._id, // H&M
                name: 'Kids Cartoon Print Pajama Set',
                sku: 'KID-PAJ-008',
                barcode: '8901008',
                description: 'Snug-fitting two-piece cotton pajama set for toddlers.',
                sizes: ['2Y', '4Y', '6Y', '8Y'],
                colors: ['Sky Blue', 'Pastel Yellow'],
                purchase_price: 11.00,
                selling_price: 27.99,
                quantity: 38,
                low_stock_warning: 10
            },
            {
                category_id: categories[6]._id, // Activewear
                brand_id: brands[3]._id, // Nike
                name: 'Dry-Fit Athletic Gym Hoodie',
                sku: 'HOD-DRY-009',
                barcode: '8901009',
                description: 'Moisture-wicking fleece hoodie with athletic stretch panels.',
                sizes: ['M', 'L', 'XL'],
                colors: ['Dark Heather Grey', 'Crimson Red'],
                purchase_price: 29.00,
                selling_price: 64.99,
                quantity: 3, // LOW STOCK ALERT
                low_stock_warning: 8
            },
            {
                category_id: categories[5]._id, // Footwear & Accessories
                brand_id: brands[5]._id, // Gucci
                name: 'Genuine Leather Designer Belt',
                sku: 'BLT-LTH-010',
                barcode: '8901010',
                description: 'Full-grain Italian leather belt featuring silver monogram buckle.',
                sizes: ['Medium', 'Large'],
                colors: ['Mahogany Brown', 'Classic Black'],
                purchase_price: 65.00,
                selling_price: 149.99,
                quantity: 19,
                low_stock_warning: 5
            },
            {
                category_id: categories[4]._id, // Denim & Casual
                brand_id: brands[2]._id, // Levi's
                name: 'High-Waisted Distressed Jeans',
                sku: 'JNS-DIS-011',
                barcode: '8901011',
                description: 'Vintage high-rise straight leg jeans with subtle knee distressing.',
                sizes: ['26', '28', '30'],
                colors: ['Light Vintage Wash', 'Raw Black'],
                purchase_price: 32.00,
                selling_price: 79.99,
                quantity: 47,
                low_stock_warning: 10
            },
            {
                category_id: categories[2]._id, // Kids & Infants
                brand_id: brands[1]._id, // Zara
                name: 'Toddler Denim Overalls',
                sku: 'KID-OVR-012',
                barcode: '8901012',
                description: 'Adjustable strap denim dungarees with brass snap fasteners.',
                sizes: ['18M', '2Y', '3Y'],
                colors: ['Classic Denim'],
                purchase_price: 16.00,
                selling_price: 39.99,
                quantity: 5, // LOW STOCK ALERT
                low_stock_warning: 8
            }
        ];

        const products = [];
        for (const p of productsData) {
            const pr = await models.Product.create({
                ...p,
                slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            });
            products.push(pr);
        }

        // 5. Customers
        const customersData = [
            { name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', phone: '+1 (555) 234-5678', address: '742 Evergreen Terrace, Springfield', loyalty_points: 380 },
            { name: 'Michael Vance', email: 'm.vance@yahoo.com', phone: '+1 (555) 876-5432', address: '104 Pine Street, New York', loyalty_points: 150 },
            { name: 'Emma Watson', email: 'emma.w@outlook.com', phone: '+1 (555) 345-6789', address: '42 Wall Street, Manhattan', loyalty_points: 620 },
            { name: 'Alex Rivera', email: 'alex.rivera@techcorp.io', phone: '+1 (555) 987-6543', address: '88 Ocean Drive, Miami', loyalty_points: 95 },
            { name: 'David Miller', email: 'david.m@designstudio.com', phone: '+1 (555) 456-7890', address: '312 Broadway, Seattle', loyalty_points: 240 }
        ];

        const customers = [];
        for (const cust of customersData) {
            const c = await models.Customer.create(cust);
            customers.push(c);
        }

        // 6. Vendors
        const vendorsData = [
            { name: 'Textile Corp International', contact_person: 'Robert Chen', email: 'robert@textilecorp.com', phone: '+1 800-555-0100', address: 'Building 4, Industrial Zone, Chicago' },
            { name: 'Vogue Apparel Supply Co.', contact_person: 'Elena Rostova', email: 'elena@vogueapparel.com', phone: '+1 800-555-0240', address: '12 Fashion Way, Los Angeles' },
            { name: 'Global Threads Manufacturing', contact_person: 'James Miller', email: 'james@globalthreads.com', phone: '+1 800-555-0390', address: '88 Silk Road, Dallas' }
        ];

        const vendors = [];
        for (const v of vendorsData) {
            const ven = await models.Vendor.create(v);
            vendors.push(ven);
        }

        // 7. Expense Categories & Expenses
        const expenseCategoriesData = [
            { name: 'Shop Rent & Lease' },
            { name: 'Utility Bills & Power' },
            { name: 'Marketing & Advertisements' },
            { name: 'Store Maintenance & Repairs' },
            { name: 'Packaging & Supplies' }
        ];

        const expCats = [];
        for (const ec of expenseCategoriesData) {
            const cat = await models.ExpenseCategory.create(ec);
            expCats.push(cat);
        }

        const expensesData = [
            { expense_category_id: expCats[0]._id, amount: 2500.00, date: new Date(Date.now() - 3 * 24 * 3600 * 1000), description: 'Monthly lease for primary storefront floor' },
            { expense_category_id: expCats[1]._id, amount: 435.50, date: new Date(Date.now() - 7 * 24 * 3600 * 1000), description: 'Electricity & HVAC bill for current billing cycle' },
            { expense_category_id: expCats[2]._id, amount: 650.00, date: new Date(Date.now() - 12 * 24 * 3600 * 1000), description: 'Instagram & Local Google Ads seasonal promotion' },
            { expense_category_id: expCats[4]._id, amount: 195.00, date: new Date(Date.now() - 15 * 24 * 3600 * 1000), description: '500 Branded gift bags and garment hangers' },
            { expense_category_id: expCats[3]._id, amount: 180.00, date: new Date(Date.now() - 20 * 24 * 3600 * 1000), description: 'CCTV & Alarm Monitoring monthly subscription' }
        ];

        for (const exp of expensesData) {
            await models.Expense.create(exp);
        }

        // 8. Purchase Orders & Vendor Payments
        const po1 = await models.PurchaseOrder.create({
            vendor_id: vendors[0]._id,
            order_date: new Date(Date.now() - 14 * 24 * 3600 * 1000),
            status: 'received',
            total_amount: 1850.00,
            paid_amount: 1850.00,
            payment_status: 'completed'
        });
        await models.VendorPayment.create({
            vendor_id: vendors[0]._id,
            purchase_order_id: po1._id,
            payment_date: new Date(Date.now() - 12 * 24 * 3600 * 1000),
            amount: 1850.00,
            payment_method: 'bank_transfer',
            note: 'Full settlement for PO-1001'
        });

        const po2 = await models.PurchaseOrder.create({
            vendor_id: vendors[1]._id,
            order_date: new Date(Date.now() - 7 * 24 * 3600 * 1000),
            status: 'partial',
            total_amount: 3400.00,
            paid_amount: 2000.00,
            payment_status: 'partial'
        });
        await models.VendorPayment.create({
            vendor_id: vendors[1]._id,
            purchase_order_id: po2._id,
            payment_date: new Date(Date.now() - 5 * 24 * 3600 * 1000),
            amount: 2000.00,
            payment_method: 'cheque',
            note: 'Advance partial payment for PO-1002'
        });

        const po3 = await models.PurchaseOrder.create({
            vendor_id: vendors[2]._id,
            order_date: new Date(Date.now() - 2 * 24 * 3600 * 1000),
            status: 'pending',
            total_amount: 1200.00,
            paid_amount: 0.00,
            payment_status: 'unpaid'
        });

        // 9. Inventory Adjustments
        await models.InventoryAdjustment.create({
            product_id: products[0]._id,
            user_id: adminUser._id,
            type: 'in',
            quantity: 20,
            reason: 'Vendor delivery stock arrival (PO-1001)'
        });
        await models.InventoryAdjustment.create({
            product_id: products[2]._id,
            user_id: cashierUser._id,
            type: 'damaged',
            quantity: 2,
            reason: 'Fabric tear during fitting room session'
        });
        await models.InventoryAdjustment.create({
            product_id: products[4]._id,
            user_id: adminUser._id,
            type: 'returned',
            quantity: 1,
            reason: 'Customer return - exchanged for different color'
        });

        // 10. Generate Sales History across last 30 days & Today for realistic dashboards & reports
        const now = Date.now();
        const salesDataSeed = [
            { daysAgo: 28, custIdx: 0, items: [{ prodIdx: 0, qty: 1 }, { prodIdx: 2, qty: 2 }], payMethod: 'card' },
            { daysAgo: 25, custIdx: 1, items: [{ prodIdx: 4, qty: 1 }], payMethod: 'cash' },
            { daysAgo: 21, custIdx: 2, items: [{ prodIdx: 1, qty: 1 }, { prodIdx: 9, qty: 1 }], payMethod: 'card' },
            { daysAgo: 18, custIdx: 3, items: [{ prodIdx: 5, qty: 2 }], payMethod: 'card' },
            { daysAgo: 14, custIdx: 4, items: [{ prodIdx: 6, qty: 1 }, { prodIdx: 2, qty: 1 }], payMethod: 'cash' },
            { daysAgo: 10, custIdx: 0, items: [{ prodIdx: 10, qty: 1 }], payMethod: 'card' },
            { daysAgo: 7, custIdx: 1, items: [{ prodIdx: 7, qty: 2 }], payMethod: 'cash' },
            { daysAgo: 4, custIdx: 2, items: [{ prodIdx: 0, qty: 1 }, { prodIdx: 5, qty: 1 }], payMethod: 'card' },
            { daysAgo: 2, custIdx: 3, items: [{ prodIdx: 3, qty: 1 }, { prodIdx: 9, qty: 1 }], payMethod: 'cash' },
            { daysAgo: 0, custIdx: 0, items: [{ prodIdx: 0, qty: 1 }, { prodIdx: 2, qty: 1 }], payMethod: 'card' },
            { daysAgo: 0, custIdx: 4, items: [{ prodIdx: 4, qty: 1 }, { prodIdx: 6, qty: 2 }], payMethod: 'cash' }
        ];

        let invCounter = 1001;
        for (const s of salesDataSeed) {
            const saleDate = new Date(now - s.daysAgo * 24 * 3600 * 1000);
            const customer = customers[s.custIdx];

            let subtotal = 0;
            const itemsToSave = [];

            for (const item of s.items) {
                const product = products[item.prodIdx];
                const itemSubtotal = product.selling_price * item.qty;
                subtotal += itemSubtotal;
                itemsToSave.push({
                    product_id: product._id,
                    quantity: item.qty,
                    unit_price: product.selling_price,
                    subtotal: itemSubtotal
                });
            }

            const discount = s.daysAgo === 0 ? 10.00 : 0;
            const tax = Math.round((subtotal - discount) * 0.05 * 100) / 100;
            const total = subtotal - discount + tax;

            const sale = await models.Sale.create({
                customer_id: customer._id,
                user_id: cashierUser._id,
                invoice_number: `INV-${invCounter++}`,
                sale_date: saleDate,
                createdAt: saleDate,
                total_amount: subtotal,
                discount_amount: discount,
                tax_amount: tax,
                payable_amount: total,
                paid_amount: total,
                payment_method: s.payMethod,
                status: 'completed'
            });

            for (const item of itemsToSave) {
                await models.SaleItem.create({
                    sale_id: sale._id,
                    ...item
                });
            }
        }

        console.log('Successfully seeded rich demo data!');
        return { status: 'success', message: 'Demo data seeded successfully' };
    } catch (err) {
        console.error('Error seeding demo data:', err);
        return { status: 'error', message: err.message };
    }
};

if (require.main === module) {
    const mongoose = require('mongoose');
    const dotenv = require('dotenv');
    dotenv.config();
    const models = require('./models');

    mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/garment-pos').then(async () => {
        console.log('Connected to MongoDB for direct seeding...');
        await seedAllData(models, true);
        console.log('Direct seeding complete!');
        process.exit(0);
    }).catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
}

module.exports = { seedAllData };
