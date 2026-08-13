document.addEventListener("DOMContentLoaded", () => {
    fetchEmployees();
    fetchAuditLog();
    fetchDailyReport();
    
    document.getElementById('add-employee-form').addEventListener('submit', handleAddEmployee);
    document.getElementById('update-employee-form').addEventListener('submit', handleUpdateEmployee);
});

async function fetchEmployees() {
    try {
        const res = await fetch('/api/employees');
        const data = await res.json();
        
        const select = document.getElementById('update-emp-select');
        select.innerHTML = '<option value="">Select Employee</option>';
        
        data.forEach(emp => {
            const opt = document.createElement('option');
            opt.value = emp.id;
            opt.textContent = `${emp.name} (₹${emp.salary})`;
            select.appendChild(opt);
        });
    } catch (e) { console.error(e); }
}

async function fetchAuditLog() {
    try {
        const res = await fetch('/api/audit-log');
        const data = await res.json();
        
        const tbody = document.getElementById('audit-table-body');
        tbody.innerHTML = '';
        
        if(data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">No logs yet. Try adding an employee!</td></tr>';
            return;
        }
        
        data.forEach(log => {
            const tr = document.createElement('tr');
            
            let badgeColor = log.action === 'INSERT' ? '#0284c7' : '#d97706';
            let badgeBg = log.action === 'INSERT' ? '#e0f2fe' : '#fef3c7';
            
            const actionBadge = `<span style="font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 4px; background: ${badgeBg}; color: ${badgeColor};">${log.action}</span>`;
            
            const timeStr = new Date(log.log_time).toLocaleString();
            
            tr.innerHTML = `
                <td>${actionBadge}</td>
                <td>Emp #${log.record_id}</td>
                <td style="font-size: 13px; color: var(--text-secondary);">${timeStr}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

async function fetchDailyReport() {
    try {
        const res = await fetch('/api/daily-report');
        const data = await res.json();
        
        const tbody = document.getElementById('daily-table-body');
        tbody.innerHTML = '';
        
        if(data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No activity today.</td></tr>';
            return;
        }
        
        data.forEach(day => {
            const tr = document.createElement('tr');
            const dateStr = new Date(day.activity_date).toLocaleDateString();
            
            tr.innerHTML = `
                <td style="font-weight: 500;">${dateStr}</td>
                <td style="font-weight: 600;">${day.total_actions}</td>
                <td style="color: #0284c7;">${day.inserts}</td>
                <td style="color: #d97706;">${day.updates}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

async function handleAddEmployee(e) {
    e.preventDefault();
    const name = document.getElementById('emp-name').value;
    const position = document.getElementById('emp-position').value;
    const salary = document.getElementById('emp-salary').value;
    const btn = document.getElementById('add-emp-btn');
    
    if(!name || !position || !salary) return;
    btn.disabled = true;
    btn.textContent = 'Adding...';
    
    try {
        const res = await fetch('/api/employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, position, salary })
        });
        
        if(res.ok) {
            document.getElementById('add-employee-form').reset();
            // Refresh data
            fetchEmployees();
            fetchAuditLog();
            fetchDailyReport();
        }
    } catch(e) { console.error(e); }
    finally {
        btn.disabled = false;
        btn.textContent = 'Add';
    }
}

async function handleUpdateEmployee(e) {
    e.preventDefault();
    const id = document.getElementById('update-emp-select').value;
    const salary = document.getElementById('update-emp-salary').value;
    const btn = document.getElementById('update-emp-btn');
    
    if(!id || !salary) return;
    btn.disabled = true;
    btn.textContent = 'Updating...';
    
    try {
        const res = await fetch(`/api/employees/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ salary })
        });
        
        if(res.ok) {
            document.getElementById('update-employee-form').reset();
            // Refresh data
            fetchEmployees();
            fetchAuditLog();
            fetchDailyReport();
        }
    } catch(e) { console.error(e); }
    finally {
        btn.disabled = false;
        btn.textContent = 'Update';
    }
}
