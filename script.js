const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const taskList = document.getElementById('taskList');
const toggleMode = document.getElementById('toggleMode');
const searchInput = document.getElementById('searchInput');

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";

if (darkMode) document.body.classList.add("dark");

toggleMode.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
};

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const filter = searchInput.value.toLowerCase();
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    if (!task.text.toLowerCase().includes(filter)) return;

    const li = document.createElement('li');
    li.className = task.done ? 'done' : '';

    const span = document.createElement('span');
    span.innerText = `${task.text} ${task.date ? `(Due: ${task.date})` : ''}`;

    const btns = document.createElement('div');
    btns.className = 'task-buttons';

    const doneBtn = document.createElement('button');
    doneBtn.innerText = '✅';
    doneBtn.onclick = () => {
      task.done = !task.done;
      saveTasks();
      renderTasks();
    };

    const editBtn = document.createElement('button');
    editBtn.innerText = '✏️';
    editBtn.onclick = () => {
      const newText = prompt('Edit task:', task.text);
      if (newText) {
        task.text = newText;
        saveTasks();
        renderTasks();
      }
    };

    const delBtn = document.createElement('button');
    delBtn.innerText = '❌';
    delBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    btns.append(doneBtn, editBtn, delBtn);
    li.append(span, btns);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const date = taskDate.value;

  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    date,
    done: false,
    notified: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = '';
  taskDate.value = '';
}

searchInput.addEventListener('input', renderTasks);
renderTasks();

// Optional: Notify user if task is due today
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

function checkDueTasks() {
  const today = new Date().toISOString().split("T")[0];
  tasks.forEach(task => {
    if (!task.notified && task.date === today) {
      new Notification("📌 Task Due Today!", { body: task.text });
      task.notified = true;
      saveTasks();
    }
  });
}
setInterval(checkDueTasks, 60 * 60 * 1000); // check every hour
