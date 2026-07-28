// ======================================
// SHOW SECTIONS
// ======================================

function showSection(sectionId, element) {

    const sections = document.querySelectorAll(".content-section");

    sections.forEach(section => {
        section.style.display = "none";
    });

    document.getElementById(sectionId).style.display = "block";

    const menuItems = document.querySelectorAll(".menu li");

    menuItems.forEach(item => {
        item.classList.remove("active");
    });

    if (element) {
        element.classList.add("active");
    }

}


// ======================================
// REGISTER STUDENT
// ======================================

function register() {

    const student = {

        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        dob: document.getElementById("dob").value,
        department: document.getElementById("department").value,
        phone: document.getElementById("phone").value.trim()

    };


    if (
        student.name === "" ||
        student.email === "" ||
        student.dob === "" ||
        student.department === "" ||
        student.phone === ""
    ) {

        alert("Please fill all fields.");

        return;

    }

    fetch("/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(student)

    })

    .then(res => res.json())

    .then(data => {

        alert(data.message);

        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("dob").value = "";
        document.getElementById("department").value = "";
        document.getElementById("phone").value = "";

        loadStudents();

    });

}



// ======================================
// LOAD STUDENTS
// ======================================

function loadStudents() {

    fetch("/students")

    .then(res => res.json())

    .then(data => {

        let rows = "";

        let updateOptions =
        '<option value="">Select Student</option>';

        let deleteOptions =
        '<option value="">Select Student</option>';


        data.forEach(student => {

            updateOptions +=
            `<option value="${student.id}">
                ${student.name} (ID:${student.id})
            </option>`;

            deleteOptions +=
            `<option value="${student.id}">
                ${student.name} (ID:${student.id})
            </option>`;

            rows += `

            <tr>

                <td>${student.id}</td>

                <td>${student.name}</td>

                <td>${student.email}</td>

                <td>${student.dob.substring(0,10)}</td>

                <td>${student.department}</td>

                <td>${student.phone}</td>

                <td>

                    <button class="edit-btn"
                    onclick="editStudent(${student.id})">

                    Edit

                    </button>

                    <button class="remove-btn"
                    onclick="deleteStudentFromTable(${student.id})">

                    Delete

                    </button>

                </td>

            </tr>

            `;

        });


        document.getElementById("tableBody").innerHTML = rows;

        document.getElementById("totalStudents").innerText = data.length;

        document.getElementById("updateId").innerHTML =
        updateOptions;

        document.getElementById("deleteId").innerHTML =
        deleteOptions;

    });

}
// ======================================
// LOAD SELECTED STUDENT
// ======================================

function loadSelectedStudent() {

    const id = document.getElementById("updateId").value;

    if (id === "") {

        document.getElementById("updateName").value = "";
        document.getElementById("updateEmail").value = "";
        document.getElementById("updateDepartment").value = "";
        document.getElementById("updatePhone").value = "";

        return;

    }

    fetch(`/student/${id}`)

    .then(res => res.json())

    .then(data => {

        if (data.length === 0) return;

        const student = data[0];

        document.getElementById("updateName").value = student.name;
        document.getElementById("updateEmail").value = student.email;
        document.getElementById("updateDepartment").value = student.department;
        document.getElementById("updatePhone").value = student.phone;

    });

}



// ======================================
// EDIT FROM TABLE
// ======================================
function editStudent(id){

    document.getElementById("updateId").value = id;

    loadSelectedStudent();

    document.querySelectorAll(".content-section").forEach(section=>{
        section.style.display="none";
    });

    document.getElementById("updateStudentSection").style.display="block";

    document.querySelectorAll(".menu li").forEach(item=>{
        item.classList.remove("active");
    });

    document.querySelectorAll(".menu li")[2].classList.add("active");

}



// ======================================
// UPDATE STUDENT
// ======================================

function updateStudent() {

    const id = document.getElementById("updateId").value;

    if (id === "") {

        alert("Please select a student.");

        return;

    }

    const student = {

        name: document.getElementById("updateName").value.trim(),

        email: document.getElementById("updateEmail").value.trim(),

        department: document.getElementById("updateDepartment").value,

        phone: document.getElementById("updatePhone").value.trim()

    };

    fetch(`/update/${id}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(student)

    })

    .then(res => res.json())
.then(data => {

    alert(data.message);

    document.getElementById("updateId").value = "";
    document.getElementById("updateName").value = "";
    document.getElementById("updateEmail").value = "";
    document.getElementById("updateDepartment").value = "";
    document.getElementById("updatePhone").value = "";

    loadStudents();

    // Automatically open View Students
    showSection("viewStudentSection", document.querySelectorAll(".menu li")[4]);

});

}
// ======================================
// DELETE STUDENT
// ======================================

function deleteStudent() {

    const id = document.getElementById("deleteId").value;

    if (id === "") {

        alert("Please select a student.");

        return;

    }

    if (!confirm("Are you sure you want to delete this student?")) {

        return;

    }

    fetch(`/delete/${id}`, {

        method: "DELETE"

    })

    .then(res => res.json())

    .then(data => {

        alert(data.message);

        document.getElementById("deleteId").value = "";

        loadStudents();

    });

}



// ======================================
// DELETE FROM TABLE
// ======================================

function deleteStudentFromTable(id) {

    if (!confirm("Delete this student?")) {

        return;

    }

    fetch(`/delete/${id}`, {

        method: "DELETE"

    })

    .then(res => res.json())

    .then(data => {

        alert(data.message);

        loadStudents();

    });

}



// ======================================
// PAGE LOAD
// ======================================

window.onload = function () {

    loadStudents();

    showSection("dashboardSection");

};