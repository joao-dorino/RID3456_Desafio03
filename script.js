const form = document.getElementById("create-todo-form");
const inputTask = document.getElementById("description");
const inputTag = document.getElementById("description-2");
const tasksContainer = document.getElementById("tasks-container");
const completedCountEl = document.getElementById("completed-count");

let tasks = [
  { id: Date.now() + 1, title: "Estudar JavaScript", tag: "Front-ende", date: new Date(), completed: false },
  { id: Date.now() + 2, title: "Fazer aplicações", tag: "back-ende", date: new Date(), completed: true },
  { id: Date.now() + 3, title: "Ler documentação", tag: "Estudar", date: new Date(), completed: false }
];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  } else {
    tasks = [];
  }
}

const removeCompletedBtn = document.getElementById("remove-completed");
removeCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);

  saveTasks();
  renderTasks();
});

function updateCompletedCounter() {
  const completed = tasks.filter(t => t.completed).length;
  completedCountEl.textContent = completed;
}

function formatDate(date) {
  if (!(date instanceof Date)) date = new Date(date);
  return date.toLocaleDateString('pt-BR');
}

function renderTasks() {
  tasksContainer.innerHTML = "";

  const notDone = tasks.filter(t => !t.completed);
  const done = tasks.filter(t => t.completed);
  const ordered = [...notDone, ...done];

  ordered.forEach(task => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task" + (task.completed ? " completed" : "");
    taskDiv.dataset.id = task.id;

    const left = document.createElement("div");
    left.className = "task-left";

    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.title;

    const tag = document.createElement("span");
    tag.className = "task-tag";
    tag.textContent = task.tag || "Sem etiqueta";

    const dateEl = document.createElement("small");
    dateEl.className = "task-date";
    dateEl.textContent = formatDate(task.date);
    dateEl.textContent = `Criado em: ${new Date().toLocaleDateString()}`;
    

    left.appendChild(title);
    
    const infoContainer = document.createElement("div");
      infoContainer.className = "task-info";
      infoContainer.appendChild(tag);
      infoContainer.appendChild(dateEl);

      
      left.appendChild(infoContainer);

    const right = document.createElement("div");

    const btn = document.createElement("button");
    btn.className = "complete-btn";
    btn.setAttribute("aria-label", task.completed ? "Concluída" : "Concluir tarefa");

    if (task.completed) {

      btn.classList.add("icon");
      btn.innerHTML = "";
      btn.disabled = true;
    } else {
      btn.textContent = "Concluir";

      btn.addEventListener("click", () => handleComplete(task.id));
    }

    right.appendChild(btn);

    taskDiv.appendChild(left);
    taskDiv.appendChild(right);

    tasksContainer.appendChild(taskDiv);
  });

  updateCompletedCounter();
}

function handleComplete(taskId) {
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx === -1) return;

  if (tasks[idx].completed) return; 

  tasks[idx].completed = true;

  const [taskObj] = tasks.splice(idx, 1);
  tasks.push(taskObj);

  saveTasks()
  renderTasks();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = inputTask.value.trim();
  const tag = inputTag.value.trim();

  if (!title) {
    inputTask.focus();
    return;
  }

  const newTask = {
    id: Date.now(),
    title,
    tag: tag || "",
    date: new Date(),
    completed: false
  };

  tasks.unshift(newTask);

  inputTask.value = "";
  inputTag.value = "";

  saveTasks()
  renderTasks();

  inputTask.focus();
});


loadTasks(); 
renderTasks();