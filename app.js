// --- 1. DATA & STATE MANAGEMENT ---
const CATEGORIES = [
    { id: 'all', name: 'ทั้งหมด', icon: 'fa-border-all' },
    { id: 'coffee', name: 'กาแฟ & เครื่องดื่ม', icon: 'fa-mug-hot' },
    { id: 'bakery', name: 'เบเกอรี่ & ขนม', icon: 'fa-bread-slice' },
    { id: 'food', name: 'อาหารจานเดียว', icon: 'fa-utensils' },
    { id: 'snack', name: 'ของทานเล่น', icon: 'fa-cookie-bite' }
];

const PRODUCTS = [
    { id: 101, name: 'อเมริกาโน่เย็น (Iced Americano)', category: 'coffee', price: 65, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop&q=80' },
    { id: 102, name: 'ลาเต้เย็น (Iced Latte)', category: 'coffee', price: 75, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&auto=format&fit=crop&q=80' },
    { id: 103, name: 'ชาไทยเย็น (Thai Iced Tea)', category: 'coffee', price: 60, image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=300&auto=format&fit=crop&q=80' },
    { id: 104, name: 'มัทฉะลาเต้ (Matcha Latte)', category: 'coffee', price: 85, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&auto=format&fit=crop&q=80' },
    { id: 201, name: 'ครัวซองต์เนยสด (Butter Croissant)', category: 'bakery', price: 65, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=80' },
    { id: 202, name: 'เค้กช็อกโกแลต (Chocolate Cake)', category: 'bakery', price: 110, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80' },
    { id: 203, name: 'ชีสเค้กหน้าไหม้ (Basque Cheesecake)', category: 'bakery', price: 125, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&auto=format&fit=crop&q=80' },
    { id: 301, name: 'ข้าวผัดกะเพราไข่ดาว', category: 'food', price: 89, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300&auto=format&fit=crop&q=80' },
    { id: 302, name: 'สปาเก็ตตี้คาโบนาร่า', category: 'food', price: 159, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&auto=format&fit=crop&q=80' },
    { id: 401, name: 'เฟรนช์ฟรายส์ (French Fries)', category: 'snack', price: 79, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=80' },
    { id: 402, name: 'นักเก็ตไก่ (Chicken Nuggets)', category: 'snack', price: 89, image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=300&auto=format&fit=crop&q=80' }
];

// Global State
let currentCategory = 'all';
let cart = []; // Array of { product, qty }
let salesLog = []; // Array of completed orders
let selectedPaymentMethod = 'cash';
let currentGrandTotal = 0;

// --- 2. INITIALIZATION & LISTENERS ---
window.onload = () => {
    startClock();
    renderCategoryChips();
    renderProducts();
    renderCart();
};

function startClock() {
    const updateTime = () => {
        const now = new Date();
        document.getElementById('live-clock').innerText = now.toLocaleTimeString('th-TH');
        document.getElementById('live-date').innerText = now.toLocaleDateString('th-TH', { 
            day: 'numeric', month: 'short', year: 'numeric' 
        });
    };
    updateTime();
    setInterval(updateTime, 1000);
}

// --- 3. CATEGORY & PRODUCT RENDERING ---
function renderCategoryChips() {
    const container = document.getElementById('category-chips');
    container.innerHTML = CATEGORIES.map(cat => `
        <button onclick="selectCategory('${cat.id}')" 
                class="chip-btn shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium transition text-xs sm:text-sm ${currentCategory === cat.id ? 'bg-slate-800 text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}">
            <i class="fa-solid ${cat.icon}"></i>
            <span>${cat.name}</span>
        </button>
    `).join('');
}

function selectCategory(catId) {
    currentCategory = catId;
    renderCategoryChips();
    filterProducts();
}

function filterProducts() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const filtered = PRODUCTS.filter(p => {
        const matchCat = currentCategory === 'all' || p.category === currentCategory;
        const matchQuery = p.name.toLowerCase().includes(query) || p.id.toString().includes(query);
        return matchCat && matchQuery;
    });
    renderProducts(filtered);
}

function renderProducts(productList = PRODUCTS) {
    const grid = document.getElementById('product-grid');
    const noProducts = document.getElementById('no-products');

    if (productList.length === 0) {
        grid.innerHTML = '';
        noProducts.classList.remove('hidden');
        noProducts.classList.add('flex');
        return;
    }

    noProducts.classList.add('hidden');
    noProducts.classList.remove('flex');

    grid.innerHTML = productList.map(p => `
        <div onclick="addToCart(${p.id})" 
             class="group bg-white border border-slate-200 rounded-2xl p-2.5 flex flex-col justify-between hover:shadow-md hover:border-emerald-500/50 cursor-pointer transition duration-200 select-none">
            <div class="relative w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-slate-100 mb-2">
                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                     onerror="this.src='https://placehold.co/300x300/e2e8f0/94a3b8?text=No+Image'">
                <span class="absolute top-2 right-2 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    #${p.id}
                </span>
            </div>
            <div>
                <h3 class="font-semibold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-600 transition">${p.name}</h3>
            </div>
            <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                <span class="font-bold text-sm sm:text-base text-slate-900">฿${p.price.toLocaleString()}</span>
                <button class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition">
                    <i class="fa-solid fa-plus text-xs"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// --- 4. CART SYSTEM (REAL-TIME) ---
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.product.id === productId);
    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({ product, qty: 1 });
    }

    renderCart();
    showToast(`เพิ่ม ${product.name} แล้ว`);
}

function updateCartQty(productId, change) {
    const index = cart.findIndex(item => item.product.id === productId);
    if (index === -1) return;

    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    renderCart();
}

function clearCart() {
    if (cart.length === 0) return;
    cart = [];
    document.getElementById('discount-input').value = 0;
    renderCart();
    showToast('ล้างตะกร้าสินค้าเรียบร้อย');
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('empty-cart-state');
    const itemCountBadge = document.getElementById('cart-item-count');

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    itemCountBadge.innerText = totalQty;

    if (cart.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        emptyState.classList.add('flex');
        updateCartSummary();
        return;
    }

    emptyState.classList.add('hidden');
    emptyState.classList.remove('flex');

    container.innerHTML = cart.map(item => `
        <div class="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-slate-100/50 transition">
            <div class="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                <img src="${item.product.image}" class="w-10 h-10 rounded-lg object-cover shrink-0" onerror="this.src='https://placehold.co/100x100/e2e8f0/94a3b8?text=IMG'">
                <div class="min-w-0">
                    <h4 class="font-medium text-xs sm:text-sm text-slate-800 truncate">${item.product.name}</h4>
                    <span class="text-xs text-slate-400">฿${item.product.price} / ชิ้น</span>
                </div>
            </div>

            <!-- Quantity Control -->
            <div class="flex items-center gap-2 shrink-0">
                <div class="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
                    <button onclick="updateCartQty(${item.product.id}, -1)" class="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600">
                        <i class="fa-solid fa-minus text-[10px]"></i>
                    </button>
                    <span class="w-7 text-center font-bold text-xs text-slate-700">${item.qty}</span>
                    <button onclick="updateCartQty(${item.product.id}, 1)" class="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600">
                        <i class="fa-solid fa-plus text-[10px]"></i>
                    </button>
                </div>
                <span class="font-bold text-xs sm:text-sm text-slate-800 w-16 text-right">
                    ฿${(item.product.price * item.qty).toLocaleString()}
                </span>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
    const discountInput = parseFloat(document.getElementById('discount-input').value) || 0;
    const discount = Math.min(discountInput, subtotal); // Discount can't exceed subtotal
    
    const isVatChecked = document.getElementById('vat-checkbox').checked;
    const taxableAmount = Math.max(0, subtotal - discount);
    const vat = isVatChecked ? (taxableAmount * 0.07) : 0;
    
    const grandTotal = taxableAmount + vat;
    currentGrandTotal = grandTotal;

    document.getElementById('summary-subtotal').innerText = `฿${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('summary-discount').innerText = `-฿${discount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('summary-vat').innerText = `฿${vat.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('summary-grand-total').innerText = `฿${grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // Checkout Button State
    const btnCheckout = document.getElementById('btn-checkout');
    btnCheckout.disabled = cart.length === 0;
}

// --- 5. PAYMENT SYSTEM ---
function openPaymentModal() {
    if (cart.length === 0) return;
    
    document.getElementById('modal-pay-amount').innerText = `฿${currentGrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('cash-received-input').value = '';
    document.getElementById('cash-change-display').innerText = '฿0.00';
    
    renderQuickCashButtons();
    selectPaymentMethod('cash');

    document.getElementById('payment-modal').classList.remove('hidden');
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.add('hidden');
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    const btnCash = document.getElementById('btn-pay-cash');
    const btnPromptPay = document.getElementById('btn-pay-promptpay');
    const cashSection = document.getElementById('cash-payment-section');
    const promptpaySection = document.getElementById('promptpay-payment-section');

    if (method === 'cash') {
        btnCash.className = "pay-method-btn flex items-center justify-center gap-2 p-3 border-2 border-emerald-500 bg-emerald-50/50 text-emerald-700 font-semibold rounded-xl text-sm transition";
        btnPromptPay.className = "pay-method-btn flex items-center justify-center gap-2 p-3 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl text-sm hover:border-slate-300 transition";
        cashSection.classList.remove('hidden');
        promptpaySection.classList.add('hidden');
        promptpaySection.classList.remove('flex');
    } else {
        btnPromptPay.className = "pay-method-btn flex items-center justify-center gap-2 p-3 border-2 border-emerald-500 bg-emerald-50/50 text-emerald-700 font-semibold rounded-xl text-sm transition";
        btnCash.className = "pay-method-btn flex items-center justify-center gap-2 p-3 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl text-sm hover:border-slate-300 transition";
        cashSection.classList.add('hidden');
        promptpaySection.classList.remove('hidden');
        promptpaySection.classList.add('flex');
    }
}

function renderQuickCashButtons() {
    const container = document.getElementById('quick-cash-buttons');
    const total = Math.ceil(currentGrandTotal);
    
    // Suggest exact, 100, 500, 1000 or rounded values
    const suggestions = Array.from(new Set([
        total,
        Math.ceil(total / 50) * 50,
        Math.ceil(total / 100) * 100,
        Math.ceil(total / 500) * 500,
        1000
    ])).filter(val => val >= total).slice(0, 4);

    container.innerHTML = suggestions.map(val => `
        <button type="button" onclick="setQuickCash(${val})" class="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition border border-slate-200">
            ฿${val.toLocaleString()}
        </button>
    `).join('');
}

function setQuickCash(amount) {
    document.getElementById('cash-received-input').value = amount;
    calculateChange();
}

function calculateChange() {
    const received = parseFloat(document.getElementById('cash-received-input').value) || 0;
    const change = received - currentGrandTotal;
    const display = document.getElementById('cash-change-display');

    if (change >= 0) {
        display.innerText = `฿${change.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        display.className = "text-xl font-bold text-emerald-600";
    } else {
        display.innerText = `ขาดอีก ฿${Math.abs(change).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        display.className = "text-sm font-bold text-rose-500";
    }
}

function processPayment() {
    const received = parseFloat(document.getElementById('cash-received-input').value) || 0;

    if (selectedPaymentMethod === 'cash' && received < currentGrandTotal) {
        showToast('จำนวนเงินที่รับมาไม่เพียงพอ', 'error');
        return;
    }

    // Create Order Object
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
    const discountInput = parseFloat(document.getElementById('discount-input').value) || 0;
    const discount = Math.min(discountInput, subtotal);
    const isVatChecked = document.getElementById('vat-checkbox').checked;
    const vat = isVatChecked ? ((subtotal - discount) * 0.07) : 0;

    const order = {
        id: 'INV-' + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date(),
        items: [...cart],
        subtotal,
        discount,
        vat,
        grandTotal: currentGrandTotal,
        paymentMethod: selectedPaymentMethod === 'cash' ? 'เงินสด' : 'PromptPay',
        paidAmount: selectedPaymentMethod === 'cash' ? received : currentGrandTotal,
        change: selectedPaymentMethod === 'cash' ? (received - currentGrandTotal) : 0
    };

    // Save Order to Sales Log
    salesLog.unshift(order);
    updateSalesSummaryBadge();

    // Open Receipt Modal & Close Payment Modal
    closePaymentModal();
    renderReceiptModal(order);
    
    // Clear Cart State
    cart = [];
    document.getElementById('discount-input').value = 0;
    renderCart();

    showToast('ทำรายการชำระเงินสำเร็จแล้ว');
}

// --- 6. RECEIPT & LOG MANAGEMENT ---
function renderReceiptModal(order) {
    document.getElementById('receipt-id').innerText = `#${order.id}`;
    document.getElementById('receipt-date').innerText = order.timestamp.toLocaleString('th-TH', {
        dateStyle: 'short', timeStyle: 'short'
    });

    // Items List
    const itemsContainer = document.getElementById('receipt-items-list');
    itemsContainer.innerHTML = order.items.map(item => `
        <div class="flex justify-between">
            <div>
                <div class="font-medium text-slate-800">${item.product.name}</div>
                <div class="text-slate-400 text-[11px]">${item.qty} x ฿${item.product.price.toLocaleString()}</div>
            </div>
            <span class="font-medium text-slate-800">฿${(item.product.price * item.qty).toLocaleString()}</span>
        </div>
    `).join('');

    // Summary Details
    document.getElementById('receipt-subtotal').innerText = `฿${order.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    
    const discountRow = document.getElementById('receipt-discount-row');
    if (order.discount > 0) {
        discountRow.classList.remove('hidden');
        document.getElementById('receipt-discount').innerText = `-฿${order.discount.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    } else {
        discountRow.classList.add('hidden');
    }

    const vatRow = document.getElementById('receipt-vat-row');
    if (order.vat > 0) {
        vatRow.classList.remove('hidden');
        document.getElementById('receipt-vat').innerText = `฿${order.vat.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    } else {
        vatRow.classList.add('hidden');
    }

    document.getElementById('receipt-grand-total').innerText = `฿${order.grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById('receipt-method').innerText = order.paymentMethod;

    const cashDetails = document.getElementById('receipt-cash-details');
    if (order.paymentMethod === 'เงินสด') {
        cashDetails.classList.remove('hidden');
        document.getElementById('receipt-paid').innerText = `฿${order.paidAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        document.getElementById('receipt-change').innerText = `฿${order.change.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    } else {
        cashDetails.classList.add('hidden');
    }

    document.getElementById('receipt-modal').classList.remove('hidden');
}

function closeReceiptModal() {
    document.getElementById('receipt-modal').classList.add('hidden');
}

function toggleSalesLogModal() {
    const modal = document.getElementById('sales-log-modal');
    if (modal.classList.contains('hidden')) {
        renderSalesLog();
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

function renderSalesLog() {
    const tbody = document.getElementById('sales-log-tbody');
    const noSales = document.getElementById('no-sales-log');
    
    const totalRevenue = salesLog.reduce((sum, o) => sum + o.grandTotal, 0);
    const totalOrders = salesLog.length;
    const avgOrder = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

    document.getElementById('log-total-revenue').innerText = `฿${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById('log-total-orders').innerText = totalOrders;
    document.getElementById('log-avg-order').innerText = `฿${avgOrder.toLocaleString(undefined, {minimumFractionDigits: 2})}`;

    if (salesLog.length === 0) {
        tbody.innerHTML = '';
        noSales.classList.remove('hidden');
        return;
    }

    noSales.classList.add('hidden');
    tbody.innerHTML = salesLog.map(o => `
        <tr class="hover:bg-slate-50 transition">
            <td class="py-2.5 font-medium text-xs text-slate-500">
                ${o.timestamp.toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}
            </td>
            <td class="py-2.5 font-semibold text-slate-800">#${o.id}</td>
            <td class="py-2.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${o.paymentMethod === 'เงินสด' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}">
                    ${o.paymentMethod}
                </span>
            </td>
            <td class="py-2.5 text-right font-bold text-slate-900">
                ฿${o.grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </td>
        </tr>
    `).join('');
}

function updateSalesSummaryBadge() {
    const totalRevenue = salesLog.reduce((sum, o) => sum + o.grandTotal, 0);
    document.getElementById('badge-total-sales').innerText = `฿${totalRevenue.toLocaleString()}`;
}

// --- 7. UTILITIES & TOAST ---
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const msg = document.getElementById('toast-msg');

    msg.innerText = message;
    if (type === 'error') {
        icon.className = "fa-solid fa-circle-exclamation text-rose-400 text-lg";
    } else {
        icon.className = "fa-solid fa-circle-check text-emerald-400 text-lg";
    }

    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 2500);
}
    
