// Load tasks & dark mode
window.onload = function () {
    loadTasks();
    updateProgress();

    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark");
    }
};

// Enter key support
document.getElementById("taskInput").addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
});

// Search filter
document.getElementById("searchInput").addEventListener("input", function() {
    const search = this.value.toLowerCase();
    document.querySelectorAll("#taskList li").forEach(li => {
        const text = li.querySelector("span").textContent.toLowerCase();
        li.style.display = text.includes(search) ? "flex" : "none";
    });
});

// Drag and drop
let draggedItem = null;
document.addEventListener('dragstart', e => { if (e.target.tagName === 'LI') draggedItem = e.target; });
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => {
    if (e.target.tagName === 'LI' && draggedItem) {
        const list = document.getElementById("taskList");
        const children = Array.from(list.children);
        const dropIndex = children.indexOf(e.target);
        list.insertBefore(draggedItem, children[dropIndex]);
        saveTasks();
        draggedItem = null;
    }
});

// Add task
function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();
    const priority = document.getElementById("prioritySelect").value;

    if (!text) {
        alert("Enter a task!");
        return;
    }

    const dueDate = prompt("Enter due date (YYYY-MM-DD):");

    createTask(text, false, dueDate, priority);
    saveTasks();
    updateProgress();

    input.value = "";
    input.focus();
}

// Create task
function createTask(text, completed, dueDate, priority) {
    const li = document.createElement("li");
    li.draggable = true;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;

    const span = document.createElement("span");
    span.textContent = text;
    if (completed) span.classList.add("completed");

    const badge = document.createElement("span");
    badge.classList.add("badge", priority);
    badge.textContent = priority.toUpperCase();

    checkbox.onchange = function () {
        span.classList.toggle("completed");
        saveTasks();
        updateProgress();
    };

    const date = document.createElement("small");
    date.textContent = dueDate ? `📅 ${dueDate}` : "";

    const today = new Date().toISOString().split("T")[0];
    if (dueDate === today) setTimeout(() => alert(`Task due today: ${text}`), 500);

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.classList.add("edit-btn");
    editBtn.onclick = function () {
        const newText = prompt("Edit task:", span.textContent);
        if (newText) {
            span.textContent = newText.trim();
            saveTasks();
        }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = function () {
        li.remove();
        saveTasks();
        updateProgress();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(badge);
    li.appendChild(date);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    document.getElementById("taskList").appendChild(li);
}

// Save tasks
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").textContent,
            completed: li.querySelector("input").checked,
            dueDate: li.querySelector("small").textContent.replace("📅 ", ""),
            priority: li.querySelector(".badge").classList[1]
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTask(task.text, task.completed, task.dueDate, task.priority));
}

// Update progress bar
function updateProgress() {
    const total = document.querySelectorAll("#taskList li").length;
    const completed = document.querySelectorAll("#taskList input:checked").length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    document.getElementById("progressBar").style.width = percent + "%";
}

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
}