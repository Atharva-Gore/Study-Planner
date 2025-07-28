let taskList = document.getElementById("taskList");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    let li = document.createElement("li");
    li.innerHTML = `<span>${task}</span>
    <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>`;
    taskList.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("taskInput");
  if (input.value.trim()) {
    tasks.push(input.value.trim());
    input.value = "";
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

renderTasks();
