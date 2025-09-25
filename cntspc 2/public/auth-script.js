// Real Authentication JavaScript

const API_BASE = 'http://localhost:3000/api';

// Handle real registration
async function handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: password,
        userType: selectedUserType
    };
    
    const btn = event.target.querySelector('button');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Store authentication data
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userData', JSON.stringify(result.user));
            
            alert(`Account created successfully! Welcome ${result.user.firstName}!`);
            
            if (result.user.userType === 'landlord') {
                window.location.href = 'list-property.html';
            } else {
                window.location.href = 'search.html';
            }
        } else {
            alert('Registration failed: ' + result.error);
        }
    } catch (error) {
        alert('Registration failed: ' + error.message);
    } finally {
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    }
}

// Handle real login
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    const btn = event.target.querySelector('button');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Store authentication data
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userData', JSON.stringify(result.user));
            
            alert(`Welcome back, ${result.user.firstName}!`);
            
            if (result.user.userType === 'landlord') {
                window.location.href = 'list-property.html';
            } else {
                window.location.href = 'search.html';
            }
        } else {
            alert('Login failed: ' + result.error);
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    } finally {
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
    }
}

// Check if user is authenticated
function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    return token && userData;
}

// Get current user data
function getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = 'auth.html';
}

// Get auth token for API calls
function getAuthToken() {
    return localStorage.getItem('authToken');
}