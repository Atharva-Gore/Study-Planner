const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const subjectInput = document.getElementById("subject");
const goalInput = document.getElementById("goal");
const toggleBtn = document.getElementById("toggleMode");

// Load tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

// Add new task
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  const task = {
    subject: subjectInput.value,
    goal: goalInput.value,
    completed: false,
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
  subjectInput.value = "";
  goalInput.value = "";
});

// Render tasks to DOM
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `
      <span>${task.subject} - ${task.goal}</span>
      <button onclick="toggleComplete(${index})">✔️</button>
    `;
    taskList.appendChild(li);
  });
}

// Toggle task complete
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Dark mode toggle
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
