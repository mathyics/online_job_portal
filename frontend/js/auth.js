// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    
    if (token && role) {
        const authLinks = document.getElementById('authLinks');
        const userLinks = document.getElementById('userLinks');
        
        if (authLinks) authLinks.style.display = 'none';
        if (userLinks) userLinks.style.display = 'flex';
        
        return { token, role, userId };
    }
    
    return null;
}

// Handle registration
async function handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = '';
    errorDiv.classList.remove('show');
    
    try {
        const response = await apiCall(API_ENDPOINTS.register, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.add('show');
    }
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = '';
    errorDiv.classList.remove('show');
    
    try {
        const response = await apiCall(API_ENDPOINTS.login, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        
        // Decode JWT to get user ID (simple base64 decode)
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        localStorage.setItem('userId', payload.id);
        
        alert('Login successful!');
        window.location.href = response.role === 'Employer' ? 'dashboard.html' : 'jobs.html';
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.add('show');
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
