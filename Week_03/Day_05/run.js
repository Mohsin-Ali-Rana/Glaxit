// ==============================
// Select Elements
// ==============================
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const taskCount = document.getElementById("taskCount");

// ==============================
// Task Array
// ==============================
let tasks = [];

// ==============================
// Add Task
// ==============================
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);
    taskInput.value = "";
    
    renderTasks();
}

// ==============================
// Render Tasks
// ==============================
function renderTasks() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    tasks.forEach(function(task) {
        const li = document.createElement("li");
        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.dataset.id = task.id;
        li.innerHTML = `
            <div class="task-left">
                <i class="fa-solid fa-circle-check"></i>
                <div>
                    <div class="task-title">${task.text}</div>
                    <div class="task-subtitle">
                        Click task to mark complete
                    </div>
                </div>
            </div>
            <i class="fa-solid fa-trash delete-btn"></i>
        `;

        taskList.appendChild(li);
    });

    updateStats();
}

// ==============================
// Update Statistics
// ==============================
function updateStats() {
    let completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
    pendingTasks.textContent = tasks.length - completed;
    taskCount.textContent = tasks.length + " Tasks";
}

// ==============================
// Button Click
// ==============================
addBtn.addEventListener("click", addTask);

// ==============================
// Enter Key
// ==============================
taskInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// ==============================
// Event Delegation
// ==============================
taskList.addEventListener("click", function(e) {
    const li = e.target.closest(".task");
    if (!li) return;

    const taskId = Number(li.dataset.id);

    // Delete Task
    if (e.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(function(task) {
            return task.id !== taskId;
        });
        
        renderTasks();
        return;
    }

    // Toggle Completed
    tasks.forEach(function(task) {
        if (task.id === taskId) {
            task.completed = !task.completed;
        }
    });

    renderTasks();
});

// ==============================
// Initial Render
// ==============================
renderTasks();