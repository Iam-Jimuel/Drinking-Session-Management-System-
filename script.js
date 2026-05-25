// script.js

const STORAGE_KEY_USERS = 'dsms_users';
const STORAGE_KEY_ITEMS = 'dsms_items';
const STORAGE_KEY_CURRENT_USER = 'dsms_current_user';
const STORAGE_KEY_DARK_MODE = 'dsms_dark_mode';
const STORAGE_KEY_DELETED_ITEMS = 'dsms_deleted_items';
const STORAGE_KEY_DELETED_USERS = 'dsms_deleted_users';
const STORAGE_KEY_BUDGET = 'dsms_budget';

const DEFAULT_ADMIN = {
    id: 'admin_001',
    name: 'System Admin',
    email: 'admin@drinksession.com',
    password: 'admin123',
    role: 'admin',
    profilePic: '',
    createdAt: new Date().toISOString(),
    requestAdmin: false,
};

const NEW_CATEGORIES = [
    'Liquor',
    'Pulutan na Chichirya',
    'Pulutan na May Sabaw',
    'Pulutan na Fried',
    'Pulutan na Inihaw',
    'Softdrinks and Juice',
    'Candys',
    'Others'
];

function initData() {
    if (!localStorage.getItem(STORAGE_KEY_USERS)) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([DEFAULT_ADMIN]));
    }
    if (!localStorage.getItem(STORAGE_KEY_ITEMS)) {
        const defaultItems = [
            { id: generateId(), name: 'Red Horse Beer', category: 'Liquor', quantity: 48, price: 65.00, description: 'Strong beer, 500ml bottle', addedBy: 'admin_001', dateAdded: new Date().toISOString() },
            { id: generateId(), name: 'San Miguel Pale Pilsen', category: 'Liquor', quantity: 36, price: 55.00, description: 'Classic Filipino beer', addedBy: 'admin_001', dateAdded: new Date().toISOString() },
            { id: generateId(), name: 'Tanduay Rum', category: 'Liquor', quantity: 24, price: 120.00, description: 'Filipino rum, 750ml', addedBy: 'admin_001', dateAdded: new Date().toISOString() },
            { id: generateId(), name: 'Sisig Plate', category: 'Pulutan na Fried', quantity: 15, price: 180.00, description: 'Sizzling pork sisig', addedBy: 'admin_001', dateAdded: new Date().toISOString() },
            { id: generateId(), name: 'Liempo BBQ', category: 'Pulutan na Inihaw', quantity: 20, price: 150.00, description: 'Grilled pork belly', addedBy: 'admin_001', dateAdded: new Date().toISOString() },
            { id: generateId(), name: 'Grilled Tilapia', category: 'Pulutan na Inihaw', quantity: 10, price: 130.00, description: 'Fresh grilled tilapia', addedBy: 'admin_001', dateAdded: new Date().toISOString() },
            { id: generateId(), name: 'Chicken Lollipop', category: 'Pulutan na Fried', quantity: 30, price: 95.00, description: 'Deep-fried chicken lollipops', addedBy: 'admin_001', dateAdded: new Date().toISOString() },
            { id: generateId(), name: 'Grilled Chicken Quarter', category: 'Pulutan na Inihaw', quantity: 25, price: 140.00, description: 'Quarter-cut grilled chicken', addedBy: 'admin_001', dateAdded: new Date().toISOString() },
            { id: generateId(), name: 'Fried Chicken Bucket', category: 'Pulutan na Fried', quantity: 18, price: 350.00, description: 'Crispy fried chicken bucket', addedBy: 'admin_001', dateAdded: new Date().toISOString() },
            { id: generateId(), name: 'Mixed Snacks Platter', category: 'Pulutan na Chichirya', quantity: 40, price: 200.00, description: 'Assorted chips and nuts', addedBy: 'admin_001', dateAdded: new Date().toISOString() },
        ];
        localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(defaultItems));
    }
    if (!localStorage.getItem(STORAGE_KEY_DELETED_ITEMS)) localStorage.setItem(STORAGE_KEY_DELETED_ITEMS, '[]');
    if (!localStorage.getItem(STORAGE_KEY_DELETED_USERS)) localStorage.setItem(STORAGE_KEY_DELETED_USERS, '[]');
    if (!localStorage.getItem(STORAGE_KEY_BUDGET)) localStorage.setItem(STORAGE_KEY_BUDGET, '0');
}

function generateId() { return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9); }
function generateUserId() { return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9); }

function getUsers() { return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]'); }
function saveUsers(users) { localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users)); }
function getItems() { return JSON.parse(localStorage.getItem(STORAGE_KEY_ITEMS) || '[]'); }
function saveItems(items) { localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items)); }
function getDeletedItems() { return JSON.parse(localStorage.getItem(STORAGE_KEY_DELETED_ITEMS) || '[]'); }
function saveDeletedItems(items) { localStorage.setItem(STORAGE_KEY_DELETED_ITEMS, JSON.stringify(items)); }
function getDeletedUsers() { return JSON.parse(localStorage.getItem(STORAGE_KEY_DELETED_USERS) || '[]'); }
function saveDeletedUsers(users) { localStorage.setItem(STORAGE_KEY_DELETED_USERS, JSON.stringify(users)); }
function getBudget() { return parseFloat(localStorage.getItem(STORAGE_KEY_BUDGET) || '0'); }
function saveBudget(value) { localStorage.setItem(STORAGE_KEY_BUDGET, value.toString()); }

function getCurrentUser() { const u = localStorage.getItem(STORAGE_KEY_CURRENT_USER); return u ? JSON.parse(u) : null; }
function setCurrentUser(user) { localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user)); }

// Toast
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
}

// Auth tabs
function switchAuthTab(tab) {
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (tab === 'login') {
        tabLogin.className = 'flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all bg-white dark:bg-gray-700 shadow-sm';
        tabRegister.className = 'flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all text-gray-500 dark:text-gray-400';
        loginForm.style.display = 'block'; registerForm.style.display = 'none';
    } else {
        tabRegister.className = 'flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all bg-white dark:bg-gray-700 shadow-sm';
        tabLogin.className = 'flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all text-gray-500 dark:text-gray-400';
        loginForm.style.display = 'none'; registerForm.style.display = 'block';
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!email || !password) { showToast('Please fill in all fields.', 'warning'); return; }
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
        setCurrentUser(user);
        showToast('Login successful! Welcome, ' + user.name + '!', 'success');
        showMainApp();
    } else {
        showToast('Invalid email or password.', 'error');
    }
}

function handleRegister() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const confirmPassword = document.getElementById('regConfirmPassword').value.trim();
    const requestAdmin = document.getElementById('requestAdminCheckbox').checked;

    if (!name || !email || !password || !confirmPassword) { showToast('Please fill in all fields.', 'warning'); return; }
    if (password !== confirmPassword) { showToast('Passwords do not match.', 'error'); return; }
    if (password.length < 6) { showToast('Password must be at least 6 characters.', 'warning'); return; }

    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        showToast('An account with this email already exists.', 'error');
        return;
    }

    const newUser = {
        id: generateUserId(),
        name, email, password,
        role: 'user',
        profilePic: '',
        createdAt: new Date().toISOString(),
        requestAdmin: requestAdmin,
    };
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    if (requestAdmin) {
        showToast('Account created! Your admin request is pending approval.', 'success');
    } else {
        showToast('Account created successfully! Welcome, ' + name + '!', 'success');
    }
    showMainApp();
}

function handleGoogleLogin() { document.getElementById('googleLoginModal').style.display = 'flex'; }
function closeGoogleModal() { document.getElementById('googleLoginModal').style.display = 'none'; }
function selectGoogleAccount(name, email, picUrl) {
    const users = getUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        user = {
            id: generateUserId(), name, email,
            password: 'google_oauth_' + Date.now(),
            role: 'user', profilePic: picUrl,
            createdAt: new Date().toISOString(),
            requestAdmin: false,
        };
        users.push(user);
        saveUsers(users);
    } else if (!user.profilePic && picUrl) {
        user.profilePic = picUrl;
        saveUsers(users.map(u => u.id === user.id ? user : u));
    }
    setCurrentUser(user);
    document.getElementById('googleLoginModal').style.display = 'none';
    showToast('Signed in with Google! Welcome, ' + name + '!', 'success');
    showMainApp();
}

function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
        showToast('Logged out successfully.', 'info');
        hideMainApp();
    }
}

// App navigation
function showMainApp() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    updateUserUI();
    navigateTo('dashboard');
    applyDarkMode();
}
function hideMainApp() {
    document.getElementById('authPage').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

function updateUserUI() {
    const user = getCurrentUser();
    if (!user) return;
    document.getElementById('currentUserName').textContent = user.name;
    document.getElementById('adminBadge').style.display = user.role === 'admin' ? 'inline-block' : 'none';
    document.getElementById('userBadge').style.display = user.role === 'user' ? 'inline-block' : 'none';

    document.getElementById('navUsers').style.display = user.role === 'admin' ? 'block' : 'none';
    document.getElementById('navReports').style.display = user.role === 'admin' ? 'block' : 'none';
    document.getElementById('navTrash').style.display = user.role === 'admin' ? 'block' : 'none';
    document.getElementById('navAdminSettings').style.display = user.role === 'admin' ? 'block' : 'none';

    const topPic = document.getElementById('topProfilePic');
    if (user.profilePic) {
        topPic.src = user.profilePic;
    } else {
        const initial = user.name.charAt(0).toUpperCase();
        topPic.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%238B1F36'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='16' font-family='Arial'%3E${initial}%3C/text%3E%3C/svg%3E`;
    }
}

function navigateTo(page) {
    const user = getCurrentUser();
    if (!user) return;

    document.querySelectorAll('.sidebar-link').forEach(el => el.classList.remove('active'));
    const navMap = {
        'dashboard': 'navDashboard', 'inventory': 'navInventory', 'addItem': 'navAddItem',
        'users': 'navUsers', 'reports': 'navReports', 'trash': 'navTrash', 'adminSettings': 'navAdminSettings', 'profile': 'navProfile'
    };
    if (navMap[page]) document.getElementById(navMap[page]).classList.add('active');

    document.getElementById('pageTitle').textContent = {
        'dashboard': 'Dashboard', 'inventory': 'Inventory Management', 'addItem': 'Add New Item',
        'users': 'User Management', 'reports': 'Reports', 'trash': 'Trash', 'adminSettings': 'Admin Settings', 'profile': 'My Profile'
    }[page] || 'Page';
    document.getElementById('pageSubtitle').textContent = {
        'dashboard': 'Overview of your inventory', 'inventory': 'Manage all your items', 'addItem': 'Add a new item',
        'users': 'Manage user accounts', 'reports': 'Contribution reports', 'trash': 'Restore deleted items/users', 'adminSettings': 'Configure budget', 'profile': 'Manage your account'
    }[page] || '';

    const contentDiv = document.getElementById('pageContent');
    switch (page) {
        case 'dashboard': contentDiv.innerHTML = renderDashboard(); break;
        case 'inventory': contentDiv.innerHTML = renderInventory(); break;
        case 'addItem': contentDiv.innerHTML = renderAddItem(); break;
        case 'users': if (user.role === 'admin') contentDiv.innerHTML = renderUserManagement(); else { contentDiv.innerHTML = renderDashboard(); showToast('Access denied.', 'error'); } break;
        case 'reports': if (user.role === 'admin') contentDiv.innerHTML = renderReports(); else { contentDiv.innerHTML = renderDashboard(); showToast('Access denied.', 'error'); } break;
        case 'trash': if (user.role === 'admin') contentDiv.innerHTML = renderTrash(); else { contentDiv.innerHTML = renderDashboard(); showToast('Access denied.', 'error'); } break;
        case 'adminSettings': if (user.role === 'admin') contentDiv.innerHTML = renderAdminSettings(); else { contentDiv.innerHTML = renderDashboard(); showToast('Access denied.', 'error'); } break;
        case 'profile': contentDiv.innerHTML = renderProfile(); break;
        default: contentDiv.innerHTML = renderDashboard();
    }
    if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

// Dark mode
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(STORAGE_KEY_DARK_MODE, isDark ? 'dark' : 'light');
    updateDarkModeUI();
}
function applyDarkMode() {
    if (localStorage.getItem(STORAGE_KEY_DARK_MODE) === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    updateDarkModeUI();
}
function updateDarkModeUI() {
    const isDark = document.documentElement.classList.contains('dark');
    document.getElementById('darkModeIcon').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    document.getElementById('darkModeText').textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

// Dashboard with budget
function renderDashboard() {
    const user = getCurrentUser();
    const items = getItems();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const budget = getBudget();

    let budgetHTML = '';
    if (user.role === 'user') {
        const remaining = budget - totalValue;
        budgetHTML = `
        <div class="card">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center"><i class="fas fa-coins text-xl text-purple-600"></i></div>
                <div>
                    <p class="text-sm opacity-60">Total Budget</p>
                    <p class="text-2xl font-bold">₱${budget.toFixed(2)}</p>
                </div>
            </div>
            <p class="text-sm mt-2">Remaining: <strong class="${remaining < 0 ? 'text-red-500' : 'text-green-600'}">₱${remaining.toFixed(2)}</strong></p>
        </div>`;
    }

    let catStats = '';
    NEW_CATEGORIES.forEach(cat => {
        const catItems = items.filter(item => item.category === cat);
        const count = catItems.reduce((s, i) => s + i.quantity, 0);
        catStats += `<div class="card p-4 text-center"><p class="text-xs font-semibold opacity-60 uppercase">${cat}</p><p class="text-2xl font-bold mt-1" style="color: var(--maroon);">${count}</p></div>`;
    });

    const lowStockItems = items.filter(item => item.quantity <= 10);
    let lowStockHTML = lowStockItems.length === 0
        ? '<p class="text-sm opacity-60 text-center py-4"><i class="fas fa-check-circle text-green-500 mr-2"></i>All items well-stocked!</p>'
        : lowStockItems.map(item => `<div class="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl mb-2"><span class="badge badge-admin">${item.category}</span><span class="font-semibold text-sm">${item.name}</span><span class="text-red-600 font-bold text-sm">Qty: ${item.quantity}</span></div>`).join('');

    return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="card"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-maroon-100 dark:bg-maroon-900/40 rounded-xl flex items-center justify-center"><i class="fas fa-box text-xl" style="color: var(--maroon);"></i></div><div><p class="text-sm opacity-60">Total Stock</p><p class="text-2xl font-bold">${totalItems}</p></div></div></div>
        <div class="card"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center"><i class="fas fa-peso-sign text-xl text-green-600"></i></div><div><p class="text-sm opacity-60">Total Value</p><p class="text-2xl font-bold">₱${totalValue.toLocaleString('en-PH', {minimumFractionDigits: 2})}</p></div></div></div>
        <div class="card"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center"><i class="fas fa-cubes text-xl text-blue-600"></i></div><div><p class="text-sm opacity-60">Total Items</p><p class="text-2xl font-bold">${items.length}</p></div></div></div>
        <div class="card"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 rounded-xl flex items-center justify-center"><i class="fas fa-exclamation-triangle text-xl text-yellow-600"></i></div><div><p class="text-sm opacity-60">Low Stock Alerts</p><p class="text-2xl font-bold">${lowStockItems.length}</p></div></div></div>
        ${budgetHTML}
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">${catStats}</div>
    <div class="card"><h3 class="font-bold text-lg mb-3"><i class="fas fa-bell mr-2" style="color: var(--maroon);"></i>Low Stock Alerts</h3>${lowStockHTML}</div>`;
}

// Inventory
function renderInventory() {
    const items = getItems();
    const filterOptions = ['All', ...NEW_CATEGORIES].map(cat => `<option value="${cat}">${cat}</option>`).join('');
    let rows = items.map(item => `
        <tr class="border-b border-[var(--border-light)] hover:bg-[var(--hover-light)]">
            <td class="py-3 px-3 text-sm font-semibold">${item.name}</td>
            <td class="py-3 px-3"><span class="badge badge-admin">${item.category}</span></td>
            <td class="py-3 px-3 text-center font-bold ${item.quantity <= 10 ? 'text-red-500' : ''}">${item.quantity}</td>
            <td class="py-3 px-3 text-right">₱${item.price.toFixed(2)}</td>
            <td class="py-3 px-3 text-right font-semibold">₱${(item.quantity * item.price).toFixed(2)}</td>
            <td class="py-3 px-3 text-center">
                <button class="text-blue-500 hover:text-blue-700 mr-2 p-1" onclick="openEditModal('${item.id}')"><i class="fas fa-edit"></i></button>
                <button class="text-red-500 hover:text-red-700 p-1" onclick="openDeleteModal('${item.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`).join('') || `<tr><td colspan="6" class="py-8 text-center opacity-50">No items found.</td></tr>`;

    return `
    <div class="card mb-4">
        <div class="flex flex-wrap gap-3 items-center justify-between">
            <select class="input-field w-auto py-2" id="categoryFilter" onchange="filterInventory()">${filterOptions}</select>
            <div class="flex gap-2">
                <input type="text" id="searchInput" class="input-field w-48 py-2" placeholder="Search..." oninput="filterInventory()">
                <button class="btn-maroon btn-sm" onclick="navigateTo('addItem')"><i class="fas fa-plus"></i> Add</button>
            </div>
        </div>
    </div>
    <div class="card overflow-x-auto">
        <table class="w-full text-sm">
            <thead><tr class="border-b-2 border-[var(--border-light)]"><th class="py-3 px-3 text-left font-bold">Name</th><th class="py-3 px-3 text-left font-bold">Category</th><th class="py-3 px-3 text-center font-bold">Qty</th><th class="py-3 px-3 text-right font-bold">Price</th><th class="py-3 px-3 text-right font-bold">Subtotal</th><th class="py-3 px-3 text-center font-bold">Actions</th></tr></thead>
            <tbody id="inventoryTableBody">${rows}</tbody>
        </table>
    </div>`;
}

function filterInventory() {
    const filter = document.getElementById('categoryFilter')?.value || 'All';
    const search = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    const items = getItems();
    let filtered = filter === 'All' ? items : items.filter(item => item.category === filter);
    if (search) filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    let rows = filtered.map(item => `
        <tr class="border-b border-[var(--border-light)] hover:bg-[var(--hover-light)]">
            <td class="py-3 px-3 text-sm font-semibold">${item.name}</td>
            <td class="py-3 px-3"><span class="badge badge-admin">${item.category}</span></td>
            <td class="py-3 px-3 text-center font-bold ${item.quantity <= 10 ? 'text-red-500' : ''}">${item.quantity}</td>
            <td class="py-3 px-3 text-right">₱${item.price.toFixed(2)}</td>
            <td class="py-3 px-3 text-right font-semibold">₱${(item.quantity * item.price).toFixed(2)}</td>
            <td class="py-3 px-3 text-center">
                <button class="text-blue-500 hover:text-blue-700 mr-2 p-1" onclick="openEditModal('${item.id}')"><i class="fas fa-edit"></i></button>
                <button class="text-red-500 hover:text-red-700 p-1" onclick="openDeleteModal('${item.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`).join('') || `<tr><td colspan="6" class="py-8 text-center opacity-50">No matching items.</td></tr>`;
    document.getElementById('inventoryTableBody').innerHTML = rows;
}

// Add Item
function renderAddItem() {
    const catOptions = NEW_CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    return `
    <div class="card max-w-2xl">
        <h3 class="text-lg font-bold mb-4"><i class="fas fa-plus-circle mr-2" style="color: var(--maroon);"></i>Add New Item</h3>
        <div class="space-y-4">
            <div><label class="text-sm font-semibold block mb-1">Item Name *</label><input type="text" id="addItemName" class="input-field" placeholder="e.g., Red Horse Beer"></div>
            <div><label class="text-sm font-semibold block mb-1">Category *</label><select id="addItemCategory" class="input-field"><option value="">Select category...</option>${catOptions}</select></div>
            <div class="grid grid-cols-2 gap-4"><div><label class="text-sm font-semibold block mb-1">Quantity *</label><input type="number" id="addItemQuantity" class="input-field" value="0" min="0"></div><div><label class="text-sm font-semibold block mb-1">Price (₱) *</label><input type="number" id="addItemPrice" class="input-field" value="0.00" min="0" step="0.01"></div></div>
            <div><label class="text-sm font-semibold block mb-1">Description</label><textarea id="addItemDescription" class="input-field" rows="3"></textarea></div>
            <button class="btn-maroon w-full justify-center text-base py-3" onclick="addNewItem()"><i class="fas fa-save"></i> Save Item</button>
        </div>
    </div>`;
}

function addNewItem() {
    const user = getCurrentUser();
    const name = document.getElementById('addItemName').value.trim();
    const category = document.getElementById('addItemCategory').value;
    const quantity = parseInt(document.getElementById('addItemQuantity').value) || 0;
    const price = parseFloat(document.getElementById('addItemPrice').value) || 0;
    if (!name || !category) { showToast('Please fill all required fields.', 'warning'); return; }
    if (quantity < 0 || price < 0) { showToast('Quantity and price must be non-negative.', 'warning'); return; }
    const newItem = { id: generateId(), name, category, quantity, price, description: document.getElementById('addItemDescription').value, addedBy: user.id, dateAdded: new Date().toISOString() };
    const items = getItems();
    items.push(newItem);
    saveItems(items);
    showToast(`"${name}" added!`, 'success');
    document.getElementById('addItemName').value = '';
    document.getElementById('addItemCategory').value = '';
    document.getElementById('addItemQuantity').value = '0';
    document.getElementById('addItemPrice').value = '0.00';
    document.getElementById('addItemDescription').value = '';
}

// Edit & Delete
function openEditModal(itemId) {
    const items = getItems();
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    document.getElementById('editItemId').value = item.id;
    document.getElementById('editItemName').value = item.name;
    const select = document.getElementById('editItemCategory');
    select.innerHTML = NEW_CATEGORIES.map(cat => `<option value="${cat}" ${item.category === cat ? 'selected' : ''}>${cat}</option>`).join('');
    document.getElementById('editItemQuantity').value = item.quantity;
    document.getElementById('editItemPrice').value = item.price;
    document.getElementById('editItemDescription').value = item.description || '';
    document.getElementById('editItemModal').style.display = 'flex';
}
function closeEditModal() { document.getElementById('editItemModal').style.display = 'none'; }
function saveEditItem() {
    const id = document.getElementById('editItemId').value;
    const name = document.getElementById('editItemName').value.trim();
    const category = document.getElementById('editItemCategory').value;
    const quantity = parseInt(document.getElementById('editItemQuantity').value) || 0;
    const price = parseFloat(document.getElementById('editItemPrice').value) || 0;
    if (!name || !category) { showToast('Name and category are required.', 'warning'); return; }
    const items = getItems();
    const idx = items.findIndex(i => i.id === id);
    if (idx !== -1) {
        items[idx] = { ...items[idx], name, category, quantity, price, description: document.getElementById('editItemDescription').value };
        saveItems(items);
        showToast('Item updated!', 'success');
    }
    closeEditModal();
    navigateTo('inventory');
}
function openDeleteModal(itemId) {
    const items = getItems();
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    document.getElementById('deleteItemId').value = item.id;
    document.getElementById('deleteItemName').textContent = item.name;
    document.getElementById('deleteConfirmModal').style.display = 'flex';
}
function closeDeleteModal() { document.getElementById('deleteConfirmModal').style.display = 'none'; }
function confirmDeleteItem() {
    const id = document.getElementById('deleteItemId').value;
    const items = getItems();
    const item = items.find(i => i.id === id);
    if (!item) return;
    const deleted = getDeletedItems();
    deleted.push({ ...item, deletedAt: new Date().toISOString() });
    saveDeletedItems(deleted);
    const filtered = items.filter(i => i.id !== id);
    saveItems(filtered);
    showToast(`"${item.name}" moved to trash.`, 'info');
    closeDeleteModal();
    navigateTo('inventory');
}

// User Management
function renderUserManagement() {
    const users = getUsers();
    const pendingRequests = users.filter(u => u.requestAdmin && u.role === 'user');
    let reqHTML = '';
    if (pendingRequests.length > 0) {
        reqHTML = `<div class="card mb-4"><h3 class="font-bold text-lg mb-3"><i class="fas fa-user-clock mr-2" style="color: var(--maroon);"></i>Pending Admin Requests</h3><div class="space-y-2">` +
            pendingRequests.map(u => `
                <div class="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                    <span class="font-semibold text-sm">${u.name} (${u.email})</span>
                    <div class="flex gap-2">
                        <button class="btn-maroon btn-sm" onclick="approveAdminRequest('${u.id}')"><i class="fas fa-check"></i> Approve</button>
                        <button class="btn-outline btn-sm" onclick="denyAdminRequest('${u.id}')"><i class="fas fa-times"></i> Deny</button>
                    </div>
                </div>`).join('') + `</div></div>`;
    }

    let rows = users.map(user => {
        const avatarUrl = user.profilePic || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%238B1F36'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='white' font-size='12' font-family='Arial'%3E${user.name.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
        return `<tr class="border-b border-[var(--border-light)] hover:bg-[var(--hover-light)]">
            <td class="py-3 px-3"><div class="flex items-center gap-2"><img src="${avatarUrl}" class="w-8 h-8 rounded-full"><span class="font-semibold text-sm">${user.name}</span></div></td>
            <td class="py-3 px-3 text-sm">${user.email}</td>
            <td class="py-3 px-3"><span class="badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}">${user.role}</span></td>
            <td class="py-3 px-3 text-sm opacity-60">${new Date(user.createdAt).toLocaleDateString()}</td>
            <td class="py-3 px-3 text-center">${user.role !== 'admin' ? `<button class="text-red-500 hover:text-red-700 p-1" onclick="deleteUser('${user.id}')"><i class="fas fa-user-minus"></i></button>` : '<span class="text-xs opacity-40">Protected</span>'}</td>
        </tr>`;
    }).join('');

    return reqHTML + `<div class="card overflow-x-auto"><h3 class="text-lg font-bold mb-4"><i class="fas fa-users-cog mr-2" style="color: var(--maroon);"></i>All Users</h3><table class="w-full text-sm"><thead><tr class="border-b-2 border-[var(--border-light)]"><th class="py-3 px-3 text-left font-bold">User</th><th class="py-3 px-3 text-left font-bold">Email</th><th class="py-3 px-3 text-left font-bold">Role</th><th class="py-3 px-3 text-left font-bold">Joined</th><th class="py-3 px-3 text-center font-bold">Action</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function approveAdminRequest(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (user && user.requestAdmin && user.role === 'user') {
        user.role = 'admin';
        user.requestAdmin = false;
        saveUsers(users);
        showToast(`${user.name} is now an admin.`, 'success');
        navigateTo('users');
    }
}
function denyAdminRequest(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (user && user.requestAdmin) {
        user.requestAdmin = false;
        saveUsers(users);
        showToast(`Admin request from ${user.name} denied.`, 'info');
        navigateTo('users');
    }
}
function deleteUser(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (!user || user.role === 'admin') { showToast('Cannot delete admin.', 'warning'); return; }
    if (confirm(`Remove ${user.name}? They will be moved to trash.`)) {
        const filtered = users.filter(u => u.id !== userId);
        saveUsers(filtered);
        const deleted = getDeletedUsers();
        deleted.push({ ...user, deletedAt: new Date().toISOString() });
        saveDeletedUsers(deleted);
        showToast(`User ${user.name} moved to trash.`, 'info');
        navigateTo('users');
    }
}

// Trash
function renderTrash() {
    const deletedItems = getDeletedItems();
    const deletedUsers = getDeletedUsers();

    let itemRows = deletedItems.map(item => `
        <tr class="border-b border-[var(--border-light)]">
            <td class="py-3 px-3 text-sm font-semibold">${item.name}</td>
            <td class="py-3 px-3"><span class="badge badge-admin">${item.category}</span></td>
            <td class="py-3 px-3">${new Date(item.deletedAt).toLocaleDateString()}</td>
            <td class="py-3 px-3 text-center"><button class="btn-maroon btn-sm" onclick="restoreItem('${item.id}')"><i class="fas fa-undo"></i> Restore</button></td>
        </tr>`).join('') || '<tr><td colspan="4" class="py-8 text-center opacity-50">No deleted items.</td></tr>';

    let userRows = deletedUsers.map(u => `
        <tr class="border-b border-[var(--border-light)]">
            <td class="py-3 px-3 font-semibold text-sm">${u.name}</td>
            <td class="py-3 px-3 text-sm">${u.email}</td>
            <td class="py-3 px-3">${new Date(u.deletedAt).toLocaleDateString()}</td>
            <td class="py-3 px-3 text-center"><button class="btn-maroon btn-sm" onclick="restoreUser('${u.id}')"><i class="fas fa-undo"></i> Restore</button></td>
        </tr>`).join('') || '<tr><td colspan="4" class="py-8 text-center opacity-50">No deleted users.</td></tr>';

    return `
    <div class="card mb-4"><h3 class="text-lg font-bold mb-3"><i class="fas fa-trash-restore mr-2" style="color: var(--maroon);"></i>Deleted Items</h3><table class="w-full text-sm"><thead><tr class="border-b-2 border-[var(--border-light)]"><th class="py-3 px-3 text-left font-bold">Name</th><th class="py-3 px-3 text-left font-bold">Category</th><th class="py-3 px-3 text-left font-bold">Deleted On</th><th class="py-3 px-3 text-center font-bold">Action</th></tr></thead><tbody>${itemRows}</tbody></table></div>
    <div class="card"><h3 class="text-lg font-bold mb-3"><i class="fas fa-user-slash mr-2" style="color: var(--maroon);"></i>Deleted Users</h3><table class="w-full text-sm"><thead><tr class="border-b-2 border-[var(--border-light)]"><th class="py-3 px-3 text-left font-bold">Name</th><th class="py-3 px-3 text-left font-bold">Email</th><th class="py-3 px-3 text-left font-bold">Deleted On</th><th class="py-3 px-3 text-center font-bold">Action</th></tr></thead><tbody>${userRows}</tbody></table></div>`;
}

function restoreItem(itemId) {
    const deleted = getDeletedItems();
    const item = deleted.find(i => i.id === itemId);
    if (!item) return;
    const newItem = { ...item };
    delete newItem.deletedAt;
    const items = getItems();
    items.push(newItem);
    saveItems(items);
    saveDeletedItems(deleted.filter(i => i.id !== itemId));
    showToast(`"${item.name}" restored!`, 'success');
    navigateTo('trash');
}
function restoreUser(userId) {
    const deleted = getDeletedUsers();
    const user = deleted.find(u => u.id === userId);
    if (!user) return;
    const newUser = { ...user };
    delete newUser.deletedAt;
    const users = getUsers();
    users.push(newUser);
    saveUsers(users);
    saveDeletedUsers(deleted.filter(u => u.id !== userId));
    showToast(`${user.name} restored!`, 'success');
    navigateTo('trash');
}

// Reports
function renderReports() {
    const items = getItems();
    const users = getUsers();
    const contributions = {};
    items.forEach(item => {
        if (item.addedBy) {
            contributions[item.addedBy] = (contributions[item.addedBy] || 0) + 1;
        }
    });
    const sorted = Object.entries(contributions).sort((a, b) => b[1] - a[1]);
    const max = sorted.length > 0 ? sorted[0][1] : 1;

    let bars = sorted.map(([userId, count]) => {
        const user = users.find(u => u.id === userId) || { name: 'Unknown' };
        const percent = (count / max) * 100;
        return `<div class="flex items-center gap-3 mb-3">
            <span class="w-32 text-sm font-medium truncate">${user.name}</span>
            <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-5">
                <div class="bg-maroon-800 h-5 rounded-full text-xs text-white flex items-center justify-end pr-2" style="width: ${percent}%">${count}</div>
            </div>
        </div>`;
    }).join('') || '<p class="text-sm opacity-50">No contribution data yet.</p>';

    return `<div class="card"><h3 class="text-lg font-bold mb-4"><i class="fas fa-chart-bar mr-2" style="color: var(--maroon);"></i>Top Contributors</h3>${bars}</div>`;
}

// Admin Settings (Budget)
function renderAdminSettings() {
    const budget = getBudget();
    return `
    <div class="card max-w-md">
        <h3 class="text-lg font-bold mb-4"><i class="fas fa-cog mr-2" style="color: var(--maroon);"></i>Budget Settings</h3>
        <div class="space-y-4">
            <div><label class="text-sm font-semibold block mb-1">Total Budget (₱)</label><input type="number" id="budgetInput" class="input-field" value="${budget}" min="0" step="0.01"></div>
            <button class="btn-maroon w-full justify-center" onclick="saveBudgetSetting()"><i class="fas fa-save"></i> Save Budget</button>
        </div>
    </div>`;
}
function saveBudgetSetting() {
    const val = parseFloat(document.getElementById('budgetInput').value) || 0;
    saveBudget(val);
    showToast(`Budget set to ₱${val.toFixed(2)}`, 'success');
}

// ==================== PROFILE (RESTORED & COMPLETE) ====================
function renderProfile() {
    const user = getCurrentUser();
    if (!user) return '';
    const picSrc = user.profilePic || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%238B1F36'/%3E%3Ctext x='50' y='65' text-anchor='middle' fill='white' font-size='40' font-family='Arial'%3E${user.name.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
    return `
    <div class="max-w-2xl mx-auto space-y-6">
        <div class="card text-center">
            <img src="${picSrc}" alt="Profile" class="profile-pic mx-auto mb-3" id="profilePicLarge" onclick="openProfilePicModal()">
            <h2 class="text-xl font-bold">${user.name}</h2>
            <p class="text-sm opacity-60">${user.email}</p>
            <span class="badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'} mt-2">${user.role.toUpperCase()}</span>
            <p class="text-xs opacity-40 mt-2">Member since ${new Date(user.createdAt).toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'})}</p>
            <button class="btn-outline btn-sm mt-3" onclick="openProfilePicModal()"><i class="fas fa-camera"></i> Change Photo</button>
        </div>
        <div class="card">
            <h3 class="font-bold text-lg mb-4"><i class="fas fa-user-edit mr-2" style="color: var(--maroon);"></i>Edit Profile</h3>
            <div class="space-y-4">
                <div><label class="text-sm font-semibold block mb-1">Full Name</label><input type="text" id="profileName" class="input-field" value="${user.name}"></div>
                <div><label class="text-sm font-semibold block mb-1">Email Address</label><input type="email" id="profileEmail" class="input-field" value="${user.email}" readonly disabled><p class="text-xs opacity-50 mt-1">Email cannot be changed.</p></div>
                <div><label class="text-sm font-semibold block mb-1">New Password (leave blank to keep current)</label><input type="password" id="profilePassword" class="input-field" placeholder="Enter new password"></div>
                <button class="btn-maroon" onclick="saveProfile()"><i class="fas fa-save"></i> Save Changes</button>
            </div>
        </div>
    </div>`;
}

function saveProfile() {
    const user = getCurrentUser();
    if (!user) return;
    const name = document.getElementById('profileName').value.trim();
    const password = document.getElementById('profilePassword').value.trim();
    if (!name) { showToast('Name cannot be empty.', 'warning'); return; }

    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index].name = name;
        if (password && password.length >= 6) users[index].password = password;
        else if (password && password.length < 6) showToast('Password must be at least 6 characters. Password not changed.', 'warning');
        saveUsers(users);
        setCurrentUser(users[index]);
        updateUserUI();
        showToast('Profile updated successfully!', 'success');
        navigateTo('profile');
    }
}

function openProfilePicModal() {
    const user = getCurrentUser();
    if (!user) return;
    const preview = document.getElementById('profilePicPreview');
    preview.src = user.profilePic || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%238B1F36'/%3E%3Ctext x='50' y='65' text-anchor='middle' fill='white' font-size='40' font-family='Arial'%3E${user.name.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
    document.getElementById('profilePicModal').style.display = 'flex';
    window._tempProfilePic = null;
}
function closeProfilePicModal() { document.getElementById('profilePicModal').style.display = 'none'; window._tempProfilePic = null; }
function previewProfilePic(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePicPreview').src = e.target.result;
            window._tempProfilePic = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}
function saveProfilePic() {
    const user = getCurrentUser();
    if (!user || !window._tempProfilePic) return;
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index].profilePic = window._tempProfilePic;
        saveUsers(users);
        setCurrentUser(users[index]);
        updateUserUI();
        showToast('Profile picture updated!', 'success');
    }
    closeProfilePicModal();
    navigateTo('profile');
}

// ============ MODAL CLICK OUTSIDE ============
document.addEventListener('click', function(e) {
    if (e.target.id === 'editItemModal') closeEditModal();
    if (e.target.id === 'deleteConfirmModal') closeDeleteModal();
    if (e.target.id === 'profilePicModal') closeProfilePicModal();
    if (e.target.id === 'googleLoginModal') closeGoogleModal();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeEditModal(); closeDeleteModal(); closeProfilePicModal(); closeGoogleModal();
    }
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.getElementById('authPage').style.display !== 'none') {
        const loginFormVisible = document.getElementById('loginForm').style.display !== 'none';
        if (loginFormVisible) handleLogin();
        else handleRegister();
    }
});

window.addEventListener('resize', function() {
    if (window.innerWidth > 768) document.getElementById('sidebar').classList.remove('open');
});

// Start
function init() {
    initData();
    applyDarkMode();
    const currentUser = getCurrentUser();
    if (currentUser) showMainApp();
    else hideMainApp();
}
init();