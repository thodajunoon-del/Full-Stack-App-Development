const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const messageBox = document.getElementById('message-box');
const togglePassword = document.getElementById('toggle-password');
const btnText = document.getElementById('btn-text');
const submitBtn = document.getElementById('submit-btn');

// Toggle Password Visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    if (type === 'password') {
        togglePassword.classList.remove('fa-eye-slash');
        togglePassword.classList.add('fa-eye');
    } else {
        togglePassword.classList.remove('fa-eye');
        togglePassword.classList.add('fa-eye-slash');
    }
});

// Show Message Helper
function showMessage(type, text) {
    messageBox.className = `message-box ${type}`;
    
    const icon = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
    messageBox.innerHTML = `<i class="fa-solid ${icon}"></i> ${text}`;
    
    // Auto hide success message
    if (type === 'success') {
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }
}

// Set Loading State Helper
function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
    } else {
        submitBtn.disabled = false;
    }
}

// Handle Form Submit
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Client-side Validation
    if (!username) {
        showMessage('error', 'Username is required');
        usernameInput.focus();
        return;
    }
    
    if (!password) {
        showMessage('error', 'Password is required');
        passwordInput.focus();
        return;
    }
    
    // API Call
    setLoading(true);
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('success', data.message);
            // Optionally redirect here
            // window.location.href = '/dashboard.html';
        } else {
            showMessage('error', data.message || 'Login failed');
        }
    } catch (error) {
        showMessage('error', 'Network error. Please try again later.');
    } finally {
        setLoading(false);
    }
});
