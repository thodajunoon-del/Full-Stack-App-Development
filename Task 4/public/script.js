document.addEventListener("DOMContentLoaded", () => {
    fetchHistory();
    fetchStats();
    fetchDropdowns();
    
    document.getElementById('new-order-form').addEventListener('submit', handleOrderSubmit);
    
    document.getElementById('add-customer-btn').addEventListener('click', handleAddCustomer);
    document.getElementById('add-product-btn').addEventListener('click', handleAddProduct);
});

async function fetchDropdowns() {
    try {
        const [custRes, prodRes] = await Promise.all([
            fetch('/api/customers'),
            fetch('/api/products')
        ]);
        
        const customers = await custRes.json();
        const products = await prodRes.json();
        
        const customerSelect = document.getElementById('customer-select');
        customers.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            customerSelect.appendChild(opt);
        });
        
        const productSelect = document.getElementById('product-select');
        products.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `${p.name} (₹${p.price})`;
            productSelect.appendChild(opt);
        });
    } catch (error) {
        console.error("Error fetching dropdowns:", error);
    }
}

function showMessage(type, text) {
    const msg = document.getElementById('order-message');
    msg.textContent = text;
    msg.className = `success ${type === 'error' ? 'error' : 'success'}`;
    msg.classList.remove('hidden');
    setTimeout(() => {
        msg.classList.add('hidden');
    }, 3000);
}

async function handleOrderSubmit(e) {
    e.preventDefault();
    
    const customer_id = document.getElementById('customer-select').value;
    const product_id = document.getElementById('product-select').value;
    const quantity = document.getElementById('quantity-input').value;
    const btn = document.getElementById('create-order-btn');
    
    if (!customer_id || !product_id || !quantity) {
        showMessage('error', 'Please fill all fields');
        return;
    }
    
    btn.disabled = true;
    btn.textContent = 'Placing...';
    
    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer_id, product_id, quantity })
        });
        
        const data = await res.json();
        if (data.success) {
            showMessage('success', 'Order placed successfully!');
            // Instantly refresh the UI
            fetchHistory();
            fetchStats();
        } else {
            showMessage('error', data.error || 'Failed to place order');
        }
    } catch (error) {
        showMessage('error', 'Network error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Place Order';
    }
}

async function fetchHistory() {
    try {
        const response = await fetch('/api/history');
        const data = await response.json();
        
        const tbody = document.getElementById('history-table-body');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No orders found.</td></tr>';
            return;
        }

        data.forEach(order => {
            const tr = document.createElement('tr');
            
            // Format date to local string
            const orderDate = new Date(order.order_date).toLocaleDateString();
            
            tr.innerHTML = `
                <td>#${order.order_id}</td>
                <td>${order.customer_name}</td>
                <td>${order.product_name}</td>
                <td>${order.quantity}</td>
                <td class="amount">₹${Number(order.total_amount).toFixed(2)}</td>
                <td class="date">${orderDate}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching history:", error);
        document.getElementById('history-table-body').innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--error-color);">Failed to load data.</td></tr>';
    }
}

async function fetchStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        
        // Populate Highest Order
        const highestCard = document.getElementById('highest-order-card');
        if (stats.highestOrder) {
            highestCard.querySelector('.value').textContent = `₹${Number(stats.highestOrder.total_amount).toFixed(2)}`;
            highestCard.querySelector('.sub-text').textContent = `Order #${stats.highestOrder.id} by ${stats.highestOrder.customer_name}`;
        } else {
            highestCard.querySelector('.value').textContent = 'N/A';
            highestCard.querySelector('.sub-text').textContent = 'No data';
        }
        
        // Populate Most Active Customer
        const activeCard = document.getElementById('active-customer-card');
        if (stats.mostActiveCustomer) {
            activeCard.querySelector('.value').textContent = stats.mostActiveCustomer.name;
            activeCard.querySelector('.sub-text').textContent = `${stats.mostActiveCustomer.order_count} total orders`;
        } else {
            activeCard.querySelector('.value').textContent = 'N/A';
            activeCard.querySelector('.sub-text').textContent = 'No data';
        }
        
    } catch (error) {
        console.error("Error fetching stats:", error);
        document.getElementById('highest-order-card').querySelector('.value').textContent = 'Error';
        document.getElementById('active-customer-card').querySelector('.value').textContent = 'Error';
    }
}

async function handleAddCustomer(e) {
    e.preventDefault();
    const name = prompt("Enter new customer name:");
    if (!name) return;
    
    try {
        const res = await fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        const data = await res.json();
        if (data.success) {
            showMessage('success', 'Customer added!');
            const opt = document.createElement('option');
            opt.value = data.id;
            opt.textContent = data.name;
            const select = document.getElementById('customer-select');
            select.appendChild(opt);
            select.value = data.id;
        } else {
            showMessage('error', data.error);
        }
    } catch (e) { showMessage('error', 'Network error'); }
}

async function handleAddProduct(e) {
    e.preventDefault();
    const name = prompt("Enter new product name:");
    if (!name) return;
    const priceStr = prompt("Enter price in ₹:");
    if (!priceStr) return;
    const price = parseFloat(priceStr);
    if (isNaN(price)) {
        showMessage('error', 'Invalid price');
        return;
    }
    
    try {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price })
        });
        const data = await res.json();
        if (data.success) {
            showMessage('success', 'Product added!');
            const opt = document.createElement('option');
            opt.value = data.id;
            opt.textContent = `${data.name} (₹${data.price})`;
            const select = document.getElementById('product-select');
            select.appendChild(opt);
            select.value = data.id;
        } else {
            showMessage('error', data.error);
        }
    } catch (e) { showMessage('error', 'Network error'); }
}
