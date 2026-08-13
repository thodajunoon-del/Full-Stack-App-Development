// DOM Elements
const tableBody = document.getElementById('tableBody');
const totalStudentsEl = document.getElementById('totalStudents');
const filterDept = document.getElementById('filter-dept');
const sortBy = document.getElementById('sort-by');
const deptCountsContainer = document.getElementById('dept-counts-container');

// State
let allStudents = [];

// Initialize Dashboard
async function init() {
    try {
        const response = await fetch('http://localhost:3000/students');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // The API returns an array or an object depending on success
        if (data.success === false) {
             throw new Error(data.message || 'Failed to fetch');
        }

        allStudents = Array.isArray(data) ? data : (data.data || []);
        
        // Setup Department Dropdown
        setupDepartmentFilter();

        // Initial Render
        renderDashboard();

        // Event Listeners for Filters and Sorting
        filterDept.addEventListener('change', renderDashboard);
        sortBy.addEventListener('change', renderDashboard);

    } catch (error) {
        console.error("Error fetching students:", error);
        tableBody.innerHTML = `<tr><td colspan="6" style="color: red;">Error fetching data. Is Task 1 server running? (${error.message})</td></tr>`;
    }
}

function setupDepartmentFilter() {
    const departments = new Set(allStudents.map(s => s.department).filter(Boolean));
    
    // Clear existing options except 'All'
    filterDept.innerHTML = '<option value="All">All Departments</option>';
    
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        filterDept.appendChild(option);
    });
}

function renderDashboard() {
    const departmentFilter = filterDept.value;
    const sortOption = sortBy.value;

    // 1. Filter Data
    let filteredData = [...allStudents];
    if (departmentFilter !== 'All') {
        filteredData = filteredData.filter(student => student.department === departmentFilter);
    }

    // 2. Sort Data
    filteredData.sort((a, b) => {
        if (sortOption === 'name-asc') {
            return (a.name || "").localeCompare(b.name || "");
        } else if (sortOption === 'name-desc') {
            return (b.name || "").localeCompare(a.name || "");
        } else if (sortOption === 'date-asc') {
            return new Date(a.dob) - new Date(b.dob);
        } else if (sortOption === 'date-desc') {
            return new Date(b.dob) - new Date(a.dob);
        }
        return 0;
    });

    // 3. Render Table
    renderTable(filteredData);

    // 4. Render Stats
    renderStats(filteredData, departmentFilter);
}

function renderTable(data) {
    tableBody.innerHTML = ''; // Clear existing

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No students found matching the selected criteria.</td></tr>';
        return;
    }

    data.forEach(student => {
        const tr = document.createElement('tr');
        
        // Format Date nicely
        let formattedDate = student.dob;
        if (student.dob) {
            const dateObj = new Date(student.dob);
            if (!isNaN(dateObj)) {
                formattedDate = dateObj.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
        }

        tr.innerHTML = `
            <td><strong>${student.id}</strong></td>
            <td>${student.name || '-'}</td>
            <td>${student.email || '-'}</td>
            <td>${formattedDate || '-'}</td>
            <td>${student.department || '-'}</td>
            <td>${student.phone || '-'}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function renderStats(filteredData, activeFilter) {
    // Total Count based on current view
    totalStudentsEl.textContent = filteredData.length;

    // Department Counts based on ALL students (to show overview)
    const deptCounts = {};
    allStudents.forEach(student => {
        if(student.department) {
            deptCounts[student.department] = (deptCounts[student.department] || 0) + 1;
        }
    });

    deptCountsContainer.innerHTML = '';

    // If 'All' is selected, show all department cards.
    // Otherwise show just the selected department.
    let deptsToShow = activeFilter === 'All' ? Object.keys(deptCounts) : [activeFilter];

    deptsToShow.forEach(dept => {
        const count = deptCounts[dept] || 0;
        const card = document.createElement('div');
        card.className = 'dept-card';
        card.innerHTML = `
            <h3>${count}</h3>
            <p>${dept}</p>
        `;
        deptCountsContainer.appendChild(card);
    });
}

// Run init on load
document.addEventListener('DOMContentLoaded', init);
