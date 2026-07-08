// // const taskInput = document.getElementById("taskInput");
// // const addBtn = document.getElementById("addBtn");
// // const taskList = document.getElementById("taskList");

// // // Add new task
// // addBtn.addEventListener("click", function () {
// //     if (taskInput.value === "") return;

// //     const li = document.createElement("li");
// //     li.textContent = taskInput.value;

// //     taskList.appendChild(li);

// //     taskInput.value = "";
// // });

// // // Event Delegation
// // taskList.addEventListener("click", function (event) {
// //     if (event.target.tagName === "LI") {
// //         event.target.classList.toggle("completed");
// //     }
// // });







const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const total = document.getElementById("total");
const completed = document.getElementById("completed");
const pending = document.getElementById("pending");

function updateStats() {
    const tasks = taskList.children.length;
    const completedTasks = document.querySelectorAll(".completed").length;

    total.textContent = tasks;
    completed.textContent = completedTasks;
    pending.textContent = tasks - completedTasks;

    if (tasks === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }
}

addBtn.addEventListener("click", function() {
    const task = input.value.trim();

    if (task === "") {
        alert("Please enter a task.");
        return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
        <div class="task-header">
            <strong>${task}</strong>
            <i class="fa-solid fa-trash delete-btn"></i>
        </div>
        <small>Click the task to mark it as completed.</small>
    `;

    taskList.appendChild(li);
    input.value = "";
    
    updateStats();
});

input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addBtn.click();
    }
});

// Event Delegation
taskList.addEventListener("click", function (e) {
    // Delete task
    if (e.target.classList.contains("delete-btn")) {
        e.target.closest("li").remove();
        updateStats();
        return;
    }

    // Mark task completed
    if (e.target.closest("li")) {
        e.target.closest("li").classList.toggle("completed");
        updateStats();
    }
});

updateStats();