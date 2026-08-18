// State
let tasks = JSON.parse(localStorage.getItem('taskmaster_tasks')) || [];
let currentFilter = 'all';
let searchQuery = '';

// Elements
const taskTitle = document.getElementById('taskTitle');
const taskCategory = document.getElementById('taskCategory');
const taskPriority = document.getElementById('taskPriority');
const taskDueDate = document.getElementById('taskDueDate');
const addBtn = document.getElementById('addBtn');

const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const totalTasksElem = document.getElementById('totalTasks');
const completedTasksElem = document.getElementById('completedTasks');
const pendingTasksElem = document.getElementById('pendingTasks');

const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('themeToggle');

// Theme Switch
if (localStorage.getItem('taskmaster_theme') === 'dark') {
  document.body.setAttribute('data-theme', 'dark');
  if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

if (themeToggle) {
  themeToggle.addEventListener('click', function() {
    if (document.body.getAttribute('data-theme') === 'dark') {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('taskmaster_theme', 'light');
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('taskmaster_theme', 'dark');
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
  });
}

// Add Task
function addNewTask() {
  if (!taskTitle) return;
  const title = taskTitle.value.trim();
  if (title === '') {
    alert('Please enter a task name!');
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    title: title,
    category: taskCategory ? taskCategory.value : 'Work',
    priority: taskPriority ? taskPriority.value : 'medium',
    dueDate: taskDueDate ? taskDueDate.value : '',
    completed: false
  };

  tasks.unshift(newTask);
  saveAndRender();

  taskTitle.value = '';
  if (taskDueDate) taskDueDate.value = '';
  taskTitle.focus();
}

if (addBtn) addBtn.addEventListener('click', addNewTask);

if (taskTitle) {
  taskTitle.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewTask();
    }
  });
}

// Search
if (searchInput) {
  searchInput.addEventListener('input', function(e) {
    searchQuery = e.target.value.toLowerCase();
    renderTasks();
  });
}

// Filter Tabs
filterBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    filterBtns.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    renderTasks();
  });
});

// Render Function
function renderTasks() {
  if (!taskList) return;
  taskList.innerHTML = '';

  let filtered = tasks.filter(function(task) {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery);
    if (currentFilter === 'completed') return matchesSearch && task.completed;
    if (currentFilter === 'pending') return matchesSearch && !task.completed;
    return matchesSearch;
  });

  if (emptyState) {
    emptyState.style.display = (filtered.length === 0) ? 'block' : 'none';
  }

  filtered.forEach(function(task) {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');

    const dateHTML = task.dueDate ? '<span class="badge badge-date"><i class="fa-regular fa-clock"></i> ' + task.dueDate + '</span>' : '';
    const checkedAttr = task.completed ? 'checked' : '';

    li.innerHTML = 
      '<div class="task-left">' +
        '<input type="checkbox" class="task-checkbox" ' + checkedAttr + ' onchange="toggleTask(\'' + task.id + '\')">' +
        '<div class="task-details">' +
          '<span class="task-title">' + escapeHTML(task.title) + '</span>' +
          '<div class="task-badges">' +
            '<span class="badge badge-cat">' + task.category + '</span>' +
            '<span class="badge badge-priority ' + task.priority + '">' + task.priority.toUpperCase() + '</span>' +
            dateHTML +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="task-actions">' +
        '<button type="button" class="action-btn delete-btn" onclick="deleteTask(\'' + task.id + '\')" title="Delete"><i class="fa-regular fa-trash-can"></i></button>' +
      '</div>';

    taskList.appendChild(li);
  });

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(function(t) { return t.completed; }).length;
  const pending = total - completed;

  if (totalTasksElem) totalTasksElem.innerText = total;
  if (completedTasksElem) completedTasksElem.innerText = completed;
  if (pendingTasksElem) pendingTasksElem.innerText = pending;
}

function saveAndRender() {
  localStorage.setItem('taskmaster_tasks', JSON.stringify(tasks));
  renderTasks();
}

window.toggleTask = function(id) {
  tasks = tasks.map(function(t) {
    return t.id === id ? Object.assign({}, t, { completed: !t.completed }) : t;
  });
  saveAndRender();
};

window.deleteTask = function(id) {
  tasks = tasks.filter(function(t) { return t.id !== id; });
  saveAndRender();
};

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, function(tag) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag;
  });
}

// Initial Run
renderTasks();