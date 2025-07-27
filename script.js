const subjectInput = document.getElementById("subject");
const goalInput = document.getElementById("goal");
const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const toggleBtn = document.getElementById("toggleMode");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `
      <span>${task.subject} - ${task.goal}</span>
      <div>
        <button onclick="toggleComplete(${index})">✔️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add task
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  const task = {
    subject: subjectInput.value.trim(),
    goal: goalInput.value.trim(),
    completed: false
  };
  if (task.subject && task.goal) {
    tasks.push(task);
    saveTasks();
    renderTasks();
    subjectInput.value = "";
    goalInput.value = "";
  }
});

// Toggle complete
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Dark mode
function applyDarkMode(state) {
  document.body.classList.toggle("dark-mode", state);
  localStorage.setItem("darkMode", state);
}

toggleBtn.addEventListener("click", () => {
  darkMode = !darkMode;
  applyDarkMode(darkMode);
});

// Initial load
renderTasks();
applyDarkMode(darkMode);
