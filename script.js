// Global variables
let currentUser = null;
let currentPage = 'home';
let items = [];
let pendingItems = [];
let users = [];

// API base URL
const API_BASE = 'http://localhost:5000/api';

// DOM elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const authLink = document.getElementById('auth-link');
const dashboardLink = document.getElementById('dashboard-link');
const addItemLink = document.getElementById('add-item-link');
const adminLink = document.getElementById('admin-link');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
    // Connect to Socket.IO
    socket = io('http://localhost:5000');
    socket.on('item:new', () => {
        console.log('[Socket.IO] Received item:new event');
        if (currentPage === 'browse' || currentPage === 'home') {
            console.log('[Socket.IO] Calling loadItems() for item:new');
            loadItems();
        }
    });
    socket.on('swap:requested', ({ itemId }) => {
        console.log('[Socket.IO] Received swap:requested event for item', itemId);
        if (currentPage === 'item-detail') {
            console.log('[Socket.IO] Calling showItemDetail() for swap:requested');
            showItemDetail(itemId);
        }
        if (currentPage === 'dashboard') {
            console.log('[Socket.IO] Calling loadDashboard() for swap:requested');
            loadDashboard();
        }
        if (currentPage === 'browse' || currentPage === 'home') {
            console.log('[Socket.IO] Calling loadItems() for swap:requested');
            loadItems();
        }
    });
    socket.on('swap:decision', ({ itemId }) => {
        console.log('[Socket.IO] Received swap:decision event for item', itemId);
        if (currentPage === 'item-detail') {
            console.log('[Socket.IO] Calling showItemDetail() for swap:decision');
            showItemDetail(itemId);
        }
        if (currentPage === 'browse' || currentPage === 'home') {
            console.log('[Socket.IO] Calling loadItems() for swap:decision');
            loadItems();
        }
    });
    socket.on('item:redeemed', ({ itemId }) => {
        console.log('[Socket.IO] Received item:redeemed event for item', itemId);
        if (currentPage === 'item-detail') {
            console.log('[Socket.IO] Calling showItemDetail() for item:redeemed');
            showItemDetail(itemId);
        }
        if (currentPage === 'browse' || currentPage === 'home') {
            console.log('[Socket.IO] Calling loadItems() for item:redeemed');
            loadItems();
        }
    });
});

function initializeApp() {
    // Load featured items on home page
    loadFeaturedItems();
    
    // Load items on browse page
    loadItems();
}

function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            
            if (page === 'logout') {
                handleLogout();
            } else {
                showPage(page);
            }
        });
    });

    // Auth tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            switchAuthTab(tab);
        });
    });

    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // Add item form
    document.getElementById('add-item-form').addEventListener('submit', handleAddItem);

    // Image preview
    document.getElementById('item-images').addEventListener('change', handleImagePreview);

    // Filters
    document.getElementById('category-filter').addEventListener('change', filterItems);
    document.getElementById('size-filter').addEventListener('change', filterItems);

    // Admin tabs
    const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
    adminTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            switchAdminTab(tab);
        });
    });
}

// Page navigation
function showPage(pageName) {
    // Hide all pages
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        
        // Load page-specific content
        switch(pageName) {
            case 'browse':
                loadItems();
                break;
            case 'dashboard':
                loadDashboard();
                break;
            case 'admin':
                loadAdminPanel();
                break;
        }
    }
}

function goBack() {
    if (currentPage === 'item-detail') {
        showPage('browse');
    }
}

// Authentication functions
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(`${API_BASE}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const user = await response.json();
                currentUser = user;
                updateAuthUI(true);
            } else {
                localStorage.removeItem('token');
                updateAuthUI(false);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            updateAuthUI(false);
        }
    } else {
        updateAuthUI(false);
    }
}

function updateAuthUI(isLoggedIn) {
    if (isLoggedIn && currentUser) {
        authLink.textContent = 'Logout';
        authLink.setAttribute('data-page', 'logout');
        dashboardLink.style.display = 'inline-block';
        addItemLink.style.display = 'inline-block';
        
        // Show points display
        const pointsDisplay = document.getElementById('points-display');
        const userPointsNav = document.getElementById('user-points-nav');
        if (pointsDisplay && userPointsNav) {
            pointsDisplay.style.display = 'inline-block';
            userPointsNav.textContent = currentUser.points || 0;
        }
        
        if (currentUser.role === 'admin') {
            adminLink.style.display = 'inline-block';
        }
    } else {
        authLink.textContent = 'Login';
        authLink.setAttribute('data-page', 'login');
        dashboardLink.style.display = 'none';
        addItemLink.style.display = 'none';
        adminLink.style.display = 'none';
        
        // Hide points display
        const pointsDisplay = document.getElementById('points-display');
        if (pointsDisplay) {
            pointsDisplay.style.display = 'none';
        }
        
        currentUser = null;
    }
}

function switchAuthTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(tab + '-form').classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        console.log('Attempting login for:', email);
        
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        console.log('Login response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            currentUser = data;
            updateAuthUI(true);
            showPage('dashboard');
            showSuccess('Login successful!');
        } else {
            const error = await response.json();
            console.error('Login error:', error);
            showError(error.message || `Login failed (Status: ${response.status})`);
        }
    } catch (error) {
        console.error('Login network error:', error);
        showError(`Login failed: ${error.message}. Please check if the backend server is running on port 5000.`);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    try {
        console.log('Attempting registration for:', email);
        
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        console.log('Registration response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            currentUser = data;
            updateAuthUI(true);
            showPage('dashboard');
            showSuccess('Registration successful!');
        } else {
            const error = await response.json();
            console.error('Registration error:', error);
            showError(error.message || `Registration failed (Status: ${response.status})`);
        }
    } catch (error) {
        console.error('Registration network error:', error);
        showError(`Registration failed: ${error.message}. Please check if the backend server is running on port 5000.`);
    }
}

// Item management
async function loadItems() {
    try {
        const response = await fetch(`${API_BASE}/items`);
        if (response.ok) {
            const data = await response.json();
            items = data.items || data; // Handle both object with items property and direct array
            displayItems(items);
        }
    } catch (error) {
        console.error('Failed to load items:', error);
        showError('Failed to load items');
    }
}

async function loadFeaturedItems() {
    try {
        const response = await fetch(`${API_BASE}/items`);
        if (response.ok) {
            const data = await response.json();
            const allItems = data.items || data; // Handle both object with items property and direct array
            const featured = allItems.slice(0, 5); // Show first 5 items as featured
            displayFeaturedItems(featured);
        }
    } catch (error) {
        console.error('Failed to load featured items:', error);
    }
}

function displayItems(itemsToShow) {
    const grid = document.getElementById('items-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (itemsToShow.length === 0) {
        grid.innerHTML = '<div class="loading">No items found</div>';
        return;
    }
    
    itemsToShow.forEach(item => {
        const card = createItemCard(item);
        grid.appendChild(card);
    });
}

function displayFeaturedItems(featuredItems) {
    const carousel = document.getElementById('featured-carousel');
    if (!carousel) return;
    
    carousel.innerHTML = '';
    
    featuredItems.forEach(item => {
        const card = createItemCard(item);
        card.style.minWidth = '250px';
        carousel.appendChild(card);
    });
}

function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.onclick = () => showItemDetail(item._id);
    
    card.innerHTML = `
        <img src="${item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}" 
             alt="${item.title}" class="item-image">
        <div class="item-info">
            <div class="item-title">${item.title}</div>
            <div class="item-category">${item.category}</div>
            <span class="item-size">${item.size}</span>
        </div>
    `;
    
    return card;
}

async function showItemDetail(itemId) {
    try {
        const response = await fetch(`${API_BASE}/items/${itemId}`);
        if (response.ok) {
            const item = await response.json();
            displayItemDetail(item);
            showPage('item-detail');
        }
    } catch (error) {
        showError('Failed to load item details');
    }
}

function displayItemDetail(item) {
    const container = document.getElementById('item-detail-content');
    const isOwner = currentUser && item.listedBy && (item.listedBy._id === currentUser._id || item.listedBy === currentUser._id);
    let swapRequestsSection = '';
    
    if (isOwner && item.swapRequests && item.swapRequests.length > 0) {
        const pendingRequests = item.swapRequests.filter(req => req.status === 'pending');
        const otherRequests = item.swapRequests.filter(req => req.status !== 'pending');
        
        swapRequestsSection = `
            <div class="swap-requests">
                <h4>Swap Requests (${item.swapRequests.length})</h4>
                ${pendingRequests.length > 0 ? `
                    <div class="pending-requests">
                        <h5>Pending Requests (${pendingRequests.length})</h5>
                        <ul>
                            ${pendingRequests.map((req, idx) => `
                                <li class="swap-request-item pending">
                                    <div class="request-info">
                                        <span class="user-name">${req.user?.name || 'Unknown User'}</span>
                                        <span class="request-date">${new Date(req.requestedAt || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                    <div class="request-actions">
                                        <button class="btn btn-approve" onclick="handleSwapDecision('${item._id}', '${req.user?._id || req.user}', 'accept')">Accept</button>
                                        <button class="btn btn-reject" onclick="handleSwapDecision('${item._id}', '${req.user?._id || req.user}', 'reject')">Reject</button>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${otherRequests.length > 0 ? `
                    <div class="other-requests">
                        <h5>Other Requests</h5>
                        <ul>
                            ${otherRequests.map((req, idx) => `
                                <li class="swap-request-item ${req.status}">
                                    <div class="request-info">
                                        <span class="user-name">${req.user?.name || 'Unknown User'}</span>
                                        <span class="status">${req.status}</span>
                                        <span class="request-date">${new Date(req.requestedAt || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }
    container.innerHTML = `
        <div class="item-detail-grid">
            <div class="item-detail-images">
                ${item.images && item.images.length > 0 ? 
                    item.images.map(img => `<img src="${img}" alt="${item.title}" class="item-detail-image">`).join('') :
                    '<img src="https://via.placeholder.com/400x300?text=No+Image" alt="No Image" class="item-detail-image">'
                }
            </div>
            <div class="item-detail-info">
                <h2>${item.title}</h2>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Type:</strong> ${item.type}</p>
                <p><strong>Size:</strong> ${item.size}</p>
                <p><strong>Condition:</strong> ${item.condition}</p>
                <p><strong>Description:</strong></p>
                <p>${item.description}</p>
                ${item.tags && item.tags.length > 0 ? 
                    `<p><strong>Tags:</strong> ${item.tags.join(', ')}</p>` : ''
                }
                <p><strong>Status:</strong> ${item.availability}</p>
                ${swapRequestsSection}
                <div class="item-actions">
                    ${!isOwner && item.availability === 'available' ? `
                        <button class="btn btn-primary" onclick="requestSwap('${item._id}')">Request Swap</button>
                        <button class="btn btn-secondary" onclick="redeemWithPoints('${item._id}')">Redeem with Points</button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function filterItems() {
    const categoryFilter = document.getElementById('category-filter').value;
    const sizeFilter = document.getElementById('size-filter').value;
    
    let filteredItems = items;
    
    if (categoryFilter) {
        filteredItems = filteredItems.filter(item => item.category === categoryFilter);
    }
    
    if (sizeFilter) {
        filteredItems = filteredItems.filter(item => item.size === sizeFilter);
    }
    
    displayItems(filteredItems);
}

// Dashboard functions
async function loadDashboard() {
    if (!currentUser) return;
    
    try {
        // Load user profile
        const profileResponse = await fetch(`${API_BASE}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (profileResponse.ok) {
            const profile = await profileResponse.json();
            displayProfileInfo(profile);
        }
        
        // Load user's items
        const itemsResponse = await fetch(`${API_BASE}/user/my-items`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (itemsResponse.ok) {
            const myItems = await itemsResponse.json();
            displayMyItems(myItems);
        }
        
        // Load swap history
        const swapsResponse = await fetch(`${API_BASE}/user/swaps`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (swapsResponse.ok) {
            const swaps = await swapsResponse.json();
            displaySwapHistory(swaps);
        }
        
    } catch (error) {
        console.error('Failed to load dashboard:', error);
        showError('Failed to load dashboard data');
    }
}

// Update dashboard profile info to show points
function displayProfileInfo(profile) {
    const container = document.getElementById('profile-info');
    container.innerHTML = `
        <p><strong>Name:</strong> ${profile.name}</p>
        <p><strong>Email:</strong> ${profile.email}</p>
        <p><strong>Role:</strong> ${profile.role}</p>
        <p><strong>Points:</strong> <span id="user-points">${profile.points ?? 0}</span></p>
        <p><strong>Member since:</strong> ${new Date(profile.createdAt).toLocaleDateString()}</p>
    `;
}

function displayMyItems(myItems) {
    const container = document.getElementById('my-items');
    
    if (myItems.length === 0) {
        container.innerHTML = '<p>You haven\'t listed any items yet.</p>';
        return;
    }
    
    container.innerHTML = myItems.map(item => `
        <div class="item-card" onclick="showItemDetail('${item._id}')">
            <img src="${item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}" 
                 alt="${item.title}" class="item-image">
            <button class="delete-item-btn" title="Delete item" onclick="event.stopPropagation(); handleDeleteItem('${item._id}')">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="8" width="1.5" height="6" rx="0.75" fill="#ff4757"/>
                  <rect x="9.25" y="8" width="1.5" height="6" rx="0.75" fill="#ff4757"/>
                  <rect x="13" y="8" width="1.5" height="6" rx="0.75" fill="#ff4757"/>
                  <rect x="4" y="5" width="12" height="2" rx="1" fill="#222"/>
                  <rect x="7" y="2" width="6" height="2" rx="1" fill="#222"/>
                  <rect x="2" y="7" width="16" height="1.5" rx="0.75" fill="#ff4757"/>
                </svg>
            </button>
            <div class="item-info">
                <div class="item-title">${item.title}</div>
                <div class="item-category">${item.category}</div>
                <span class="item-size">${item.size}</span>
                <p><strong>Status:</strong> ${item.moderationStatus}</p>
            </div>
        </div>
    `).join('');
}

async function handleDeleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item? This cannot be undone.')) return;
    try {
        const response = await fetch(`${API_BASE}/items/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            showSuccess(data.message || 'Item deleted successfully.');
            loadDashboard();
        } else {
            showError(data.message || 'Failed to delete item.');
        }
    } catch (error) {
        showError('Failed to delete item.');
    }
}

function displaySwapHistory(swaps) {
    const container = document.getElementById('swap-history');
    
    if (swaps.length === 0) {
        container.innerHTML = '<p>No swap history yet.</p>';
        return;
    }
    
    container.innerHTML = swaps.map(swap => `
        <div class="swap-item">
            <p><strong>Item:</strong> ${swap.itemTitle}</p>
            <p><strong>Status:</strong> ${swap.status}</p>
            <p><strong>Date:</strong> ${new Date(swap.createdAt).toLocaleDateString()}</p>
        </div>
    `).join('');
}

// Add item functions
function handleImagePreview(e) {
    const files = e.target.files;
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';
    
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}

async function handleAddItem(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showError('Please login to list an item');
        return;
    }
    
    const formData = new FormData();
    formData.append('title', document.getElementById('item-title').value);
    formData.append('description', document.getElementById('item-description').value);
    formData.append('category', document.getElementById('item-category').value);
    formData.append('type', document.getElementById('item-type').value);
    formData.append('size', document.getElementById('item-size').value);
    formData.append('condition', document.getElementById('item-condition').value);
    
    const tags = document.getElementById('item-tags').value;
    if (tags) {
        formData.append('tags', tags);
    }
    
    const imageFiles = document.getElementById('item-images').files;
    for (let file of imageFiles) {
        formData.append('image', file);
    }
    
    try {
        const response = await fetch(`${API_BASE}/items`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        
        if (response.ok) {
            showSuccess('Item listed successfully! It will be reviewed by admin.');
            e.target.reset();
            document.getElementById('image-preview').innerHTML = '';
            showPage('dashboard');
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to list item');
        }
    } catch (error) {
        showError('Failed to list item. Please try again.');
    }
}

// Admin functions
async function loadAdminPanel() {
    if (!currentUser || currentUser.role !== 'admin') {
        showError('Access denied');
        return;
    }
    
    try {
        // Load pending items
        const pendingResponse = await fetch(`${API_BASE}/admin/pending-items`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (pendingResponse.ok) {
            pendingItems = await pendingResponse.json();
            displayPendingItems(pendingItems);
        }
        
        // Load users
        const usersResponse = await fetch(`${API_BASE}/admin/users`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (usersResponse.ok) {
            users = await usersResponse.json();
            displayUsers(users);
        }
        
    } catch (error) {
        console.error('Failed to load admin panel:', error);
        showError('Failed to load admin data');
    }
}

function displayPendingItems(pendingItems) {
    const container = document.getElementById('pending-items-list');
    
    if (pendingItems.length === 0) {
        container.innerHTML = '<p>No pending items for approval.</p>';
        return;
    }
    
    container.innerHTML = pendingItems.map(item => `
        <div class="pending-item">
            <div class="pending-item-info">
                <h4>${item.title}</h4>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Size:</strong> ${item.size}</p>
                <p><strong>Listed by:</strong> ${item.listedBy.name}</p>
            </div>
            <div class="pending-item-actions">
                <button class="btn-approve" onclick="approveItem('${item._id}')">Approve</button>
                <button class="btn-reject" onclick="rejectItem('${item._id}')">Reject</button>
            </div>
        </div>
    `).join('');
}

function displayUsers(users) {
    const container = document.getElementById('users-list');
    
    container.innerHTML = users.map(user => `
        <div class="user-item">
            <h4>${user.name}</h4>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Joined:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
    `).join('');
}

function switchAdminTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Update tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tab + '-tab').classList.add('active');
}

async function approveItem(itemId) {
    try {
        const response = await fetch(`${API_BASE}/admin/approve-item/${itemId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            showSuccess('Item approved successfully');
            loadAdminPanel();
        } else {
            showError('Failed to approve item');
        }
    } catch (error) {
        showError('Failed to approve item');
    }
}

async function rejectItem(itemId) {
    try {
        const response = await fetch(`${API_BASE}/admin/reject-item/${itemId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            showSuccess('Item rejected successfully');
            loadAdminPanel();
        } else {
            showError('Failed to reject item');
        }
    } catch (error) {
        showError('Failed to reject item');
    }
}

// Utility functions
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Logout function
function handleLogout() {
    localStorage.removeItem('token');
    currentUser = null;
    updateAuthUI(false);
    showPage('home');
    showSuccess('Logged out successfully');
}

// Replace placeholder swap/points functions with real implementations
async function requestSwap(itemId) {
    if (!currentUser) {
        showError('Please login to request a swap.');
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/items/${itemId}/request-swap`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            showSuccess(data.message || 'Swap request sent!');
        } else {
            showError(data.message || 'Failed to request swap.');
        }
    } catch (error) {
        showError('Failed to request swap.');
    }
}

async function redeemWithPoints(itemId) {
    if (!currentUser) {
        showError('Please login to redeem with points.');
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/items/${itemId}/redeem`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            showSuccess(data.message || 'Item redeemed with points!');
            // Update points display
            const userPointsNav = document.getElementById('user-points-nav');
            if (userPointsNav && currentUser) {
                currentUser.points = Math.max(0, (currentUser.points || 0) - 30);
                userPointsNav.textContent = currentUser.points;
            }
            // Optionally refresh dashboard/profile to update points
            if (currentPage === 'dashboard') loadDashboard();
        } else {
            showError(data.message || 'Failed to redeem item.');
        }
    } catch (error) {
        showError('Failed to redeem item.');
    }
} 

// Accept/reject swap decision
async function handleSwapDecision(itemId, userId, decision) {
    if (!currentUser) {
        showError('Please login.');
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/items/${itemId}/swap-decision`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, decision })
        });
        const data = await response.json();
        if (response.ok) {
            if (decision === 'accept') {
                showSuccess('Swap successful! The item has been swapped.');
            } else {
                showSuccess(data.message || 'Swap request rejected.');
            }
            // Refresh item detail
            showItemDetail(itemId);
            // Also refresh dashboard if on dashboard
            if (currentPage === 'dashboard') {
                loadDashboard();
            }
        } else {
            showError(data.message || 'Failed to update swap decision.');
        }
    } catch (error) {
        showError('Failed to update swap decision.');
    }
} 