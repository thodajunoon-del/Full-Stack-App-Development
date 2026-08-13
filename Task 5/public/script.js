document.addEventListener("DOMContentLoaded", () => {
    fetchStudentsDropdown();
    fetchAllAnalytics();
    fetchBalances();
    
    document.getElementById('new-purchase-form').addEventListener('submit', handlePurchaseSubmit);
    document.getElementById('add-student-btn').addEventListener('click', handleAddStudent);
    document.getElementById('tx-form').addEventListener('submit', handleTxSubmit);
});

async function fetchStudentsDropdown() {
    try {
        const response = await fetch('/api/students');
        const students = await response.json();
        
        const select = document.getElementById('student-select');
        select.innerHTML = '<option value="">Select a student</option>'; // reset
        
        students.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error("Error fetching students:", error);
    }
}

function fetchAllAnalytics() {
    fetchRevenueByDept();
    fetchAboveAverageSpenders();
    fetchCompleteReport();
}

async function fetchRevenueByDept() {
    try {
        const res = await fetch('/api/revenue-by-dept');
        const data = await res.json();
        
        const grid = document.getElementById('dept-revenue-grid');
        grid.innerHTML = '';
        
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `
                <h3>${item.department}</h3>
                <div class="value">₹${Number(item.total_revenue).toFixed(2)}</div>
                <div class="sub-text">Total Department Revenue</div>
            `;
            grid.appendChild(card);
        });
        
    } catch (e) {
        console.error(e);
    }
}

async function fetchAboveAverageSpenders() {
    try {
        const res = await fetch('/api/above-average-spenders');
        const data = await res.json();
        
        const tbody = document.getElementById('spenders-table-body');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="2" style="text-align: center;">No above-average spenders yet.</td></tr>';
            return;
        }
        
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td class="amount">₹${Number(item.total_spent).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error(e);
    }
}

async function fetchCompleteReport() {
    try {
        const res = await fetch('/api/complete-report');
        const data = await res.json();
        
        const tbody = document.getElementById('report-table-body');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No data available.</td></tr>';
            return;
        }
        
        data.forEach(item => {
            const tr = document.createElement('tr');
            
            // Format score coloring
            let scoreColor = '#10b981';
            if(item.score < 80) scoreColor = '#f59e0b';
            if(item.score < 60) scoreColor = '#ef4444';
            
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.department}</td>
                <td style="color: ${scoreColor}; font-weight: 600;">${item.score}/100</td>
                <td class="amount">₹${Number(item.total_spent).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error(e);
    }
}

function showMessage(text, isError = false) {
    const msg = document.getElementById('form-message');
    msg.textContent = text;
    msg.className = isError ? 'error' : 'success';
    msg.classList.remove('hidden');
    setTimeout(() => {
        msg.classList.add('hidden');
    }, 3000);
}

async function handlePurchaseSubmit(e) {
    e.preventDefault();
    const student_id = document.getElementById('student-select').value;
    const amount = document.getElementById('amount-input').value;
    const btn = document.getElementById('create-purchase-btn');
    
    if (!student_id || !amount) return;
    
    btn.disabled = true;
    btn.textContent = 'Recording...';
    
    try {
        const res = await fetch('/api/purchases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id, amount })
        });
        const data = await res.json();
        
        if (data.success) {
            showMessage('Purchase recorded successfully!');
            document.getElementById('amount-input').value = '';
            fetchAllAnalytics(); // Instantly refresh dashboard
        } else {
            showMessage(data.error || 'Failed', true);
        }
    } catch (e) {
        showMessage('Network error', true);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Record';
    }
}

async function handleAddStudent(e) {
    e.preventDefault();
    const name = prompt("Enter new student name:");
    if (!name) return;
    const department = prompt("Enter student department:");
    if (!department) return;
    const scoreStr = prompt("Enter student performance score (0-100):");
    if (!scoreStr) return;
    const score = parseInt(scoreStr);
    
    if (isNaN(score)) {
        alert("Invalid score");
        return;
    }
    
    try {
        const res = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, department, score })
        });
        const data = await res.json();
        if (data.success) {
            showMessage('Student added successfully!');
            fetchStudentsDropdown(); // refresh dropdown
            fetchAllAnalytics(); // refresh report table
        } else {
            alert(data.error || 'Failed to add student');
        }
    } catch (e) {
        alert('Network error');
    }
}

async function fetchBalances() {
    try {
        const res = await fetch('/api/balances');
        const data = await res.json();
        
        if (data.user) {
            document.getElementById('user-balance').textContent = `₹${Number(data.user.balance).toFixed(2)}`;
        }
        if (data.merchant) {
            document.getElementById('merchant-balance').textContent = `₹${Number(data.merchant.balance).toFixed(2)}`;
        }
    } catch(e) {
        console.error(e);
    }
}

async function handleTxSubmit(e) {
    e.preventDefault();
    const amount = document.getElementById('tx-amount-input').value;
    const btn = document.getElementById('process-tx-btn');
    const msg = document.getElementById('tx-message');
    const status = document.getElementById('tx-status');
    
    if (!amount) return;
    
    btn.disabled = true;
    btn.textContent = 'Processing...';
    status.textContent = 'Transaction Started...';
    status.style.color = '#f59e0b';
    
    try {
        const res = await fetch('/api/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });
        const data = await res.json();
        
        msg.textContent = data.message;
        msg.classList.remove('hidden');
        
        if (data.action === 'COMMIT') {
            msg.className = 'success';
            status.textContent = 'COMMIT SUCCESS';
            status.style.color = '#10b981';
            status.style.borderColor = '#10b981';
            status.style.background = 'rgba(16, 185, 129, 0.1)';
        } else if (data.action === 'ROLLBACK') {
            msg.className = 'error';
            status.textContent = 'ROLLBACK INITIATED';
            status.style.color = '#ef4444';
            status.style.borderColor = '#ef4444';
            status.style.background = 'rgba(239, 68, 68, 0.1)';
        } else {
            msg.className = 'error';
            status.textContent = 'FAILED';
        }
        
        document.getElementById('tx-amount-input').value = '';
        fetchBalances(); // Refresh UI balances instantly
        
        setTimeout(() => {
            msg.classList.add('hidden');
        }, 5000);
        
    } catch (e) {
        msg.textContent = 'Network error during transaction';
        msg.className = 'error';
        msg.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Process Payment';
    }
}
