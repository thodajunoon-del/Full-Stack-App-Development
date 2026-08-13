document.addEventListener("DOMContentLoaded", () => {
    fetchFeedback();
    
    // --- 1. Highlight fields on mouse hover ---
    const allInputs = document.querySelectorAll('input, textarea');
    
    allInputs.forEach(input => {
        // MOUSEOVER Event
        input.addEventListener('mouseover', function() {
            this.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.15)';
            this.style.borderColor = '#10b981';
        });
        
        // MOUSEOUT Event
        input.addEventListener('mouseout', function() {
            // Only remove highlight if it's not currently focused
            if (document.activeElement !== this) {
                this.style.boxShadow = 'none';
                this.style.borderColor = 'var(--border-color)';
            }
        });
        
        // Ensure focus state retains highlight
        input.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            this.style.borderColor = 'var(--primary-color)';
        });
        
        input.addEventListener('blur', function() {
            this.style.boxShadow = 'none';
            this.style.borderColor = 'var(--border-color)';
        });
    });

    // --- 2. Validate inputs on keypress (keyup) ---
    const nameInput = document.getElementById('fb-name');
    const emailInput = document.getElementById('fb-email');
    
    nameInput.addEventListener('keyup', function() {
        const isValid = validateName(this.value);
        toggleValidationIcon('name-icon', isValid);
    });

    emailInput.addEventListener('keyup', function() {
        const isValid = validateEmail(this.value);
        toggleValidationIcon('email-icon', isValid);
        
        const errorMsg = document.getElementById('email-error');
        if (!isValid && this.value.length > 0) {
            errorMsg.style.display = 'block';
        } else {
            errorMsg.style.display = 'none';
        }
    });

    // --- 3. Show confirmation on double-click submit ---
    const form = document.getElementById('feedback-form');
    const submitBtn = document.getElementById('submit-btn');
    let clickCount = 0;
    let clickTimer;
    
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clickCount++;
        
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                alert("Please DOUBLE-CLICK the submit button to confirm!");
                clickCount = 0;
            }, 1000);
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickCount = 0;
            
            // Run final validation
            if (!validateName(nameInput.value) || !validateEmail(emailInput.value)) {
                alert("Please fill out the form correctly before submitting.");
                return;
            }
            
            const rating = document.getElementById('fb-rating').value;
            const comments = document.getElementById('fb-comments').value;
            
            // Submit form
            const payload = {
                name: nameInput.value,
                email: emailInput.value,
                rating: rating,
                comments: comments
            };
            
            fetch('http://localhost:3007/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(res => res.json()).then(data => {
                if (data.success) {
                    // Show Success Confirmation
                    form.style.display = 'none';
                    document.getElementById('success-message').classList.remove('hidden');
                    fetchFeedback();
                } else {
                    alert("Submission failed!");
                }
            }).catch(e => alert("Network error"));
        }
    });

});

async function fetchFeedback() {
    try {
        const res = await fetch('http://localhost:3007/api/feedback');
        const data = await res.json();
        
        const tbody = document.getElementById('feedback-table-body');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 12px;">No feedback submitted yet.</td></tr>';
            return;
        }
        
        data.forEach(item => {
            const tr = document.createElement('tr');
            
            // Generate star rating string
            let stars = '';
            for(let i=0; i<item.rating; i++) stars += '★';
            
            tr.innerHTML = `
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${item.name}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color); color: #f59e0b;">${stars}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color); color: var(--text-secondary); font-size: 13px;">${item.comments}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch(e) {
        console.error("Error fetching feedback:", e);
    }
}

// --- 4. Reusable Validation Functions ---

function validateName(name) {
    // Name must be at least 3 characters and only contain letters/spaces
    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    return nameRegex.test(name.trim());
}

function validateEmail(email) {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

function toggleValidationIcon(iconId, isValid) {
    const icon = document.getElementById(iconId);
    if (isValid) {
        icon.classList.remove('hidden');
    } else {
        icon.classList.add('hidden');
    }
}
