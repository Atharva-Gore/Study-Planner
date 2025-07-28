const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const taskList = document.getElementById('taskList');
const toggleMode = document.getElementById('toggleMode');
const searchInput = document.getElementById('searchInput');

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let tasks = [];
let darkMode = localStorage.getItem('darkMode') === 'true';

if (darkMode) document.body.classList.add('dark');

toggleMode.onclick = () => {
  darkMode = !darkMode;
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', darkMode);
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
      db.ref('tasks/' + task.id).set(task);
      renderTasks();
    };

    const editBtn = document.createElement('button');
    editBtn.innerText = '✏️';
    editBtn.onclick = () => {
      const newTask = prompt('Edit Task:', task.text);
      if (newTask) {
        task.text = newTask;
        saveTasks();
        db.ref('tasks/' + task.id).set(task);
        renderTasks();
      }
    };

    const delBtn = document.createElement('button');
    delBtn.innerText = '❌';
    delBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      db.ref('tasks/' + task.id).remove();
      renderTasks();
    };

    btns.append(doneBtn, editBtn, delBtn);
    li.append(span, btns);
    taskList.appendChild(li);
  });
}

function addTask() {
  if (!taskInput.value.trim()) return;
  const newTask = {
    id: Date.now(),
    text: taskInput.value.trim(),
    date: taskDate.value,
    done: false,
    notified: false
  };
  tasks.push(newTask);
  taskInput.value = '';
  taskDate.value = '';
  saveTasks();
  db.ref('tasks/' + newTask.id).set(newTask);
  renderTasks();
}

searchInput.addEventListener('input', renderTasks);

firebase.database().ref('tasks').on('value', snapshot => {
  tasks = [];
  snapshot.forEach(child => tasks.push(child.val()));
  saveTasks();
  renderTasks();
});

if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}
function checkDueTasks() {
  const today = new Date().toISOString().split("T")[0];
  tasks.forEach(task => {
    if (!task.notified && task.date === today) {
      new Notification("Due Today!", { body: task.text });
      task.notified = true;
      saveTasks();
      db.ref('tasks/' + task.id).set(task);
    }
  });
}
setInterval(checkDueTasks, 60 * 60 * 1000);
