type Task = {
  id: string;
  text: string;
  deadlineDate: Date;
  isCompleted: boolean;
};

// Tracks the current sorting order: true for ascending, false for descending
let isAscending = true;

function createTask(task: Task): HTMLLIElement {
  const listItem = document.createElement('li');
  const taskText = document.createElement('span');
  const deadlineText = document.createElement('span');
  const removeButton = createRemoveButton();

  taskText.textContent = task.text;
  deadlineText.textContent = ` (Due: ${task.deadlineDate.toLocaleString()})`;
  taskText.classList.toggle('completed', task.isCompleted);

  listItem.appendChild(taskText);
  listItem.appendChild(deadlineText);
  listItem.appendChild(removeButton);

  listItem.addEventListener('click', () => handleTaskClick(task, listItem));
  removeButton.addEventListener('click', (event) => {
    event.stopPropagation();
    handleRemoveButtonClick(listItem);
  });

  checkAndMarkOverdueTask(listItem, task.deadlineDate);
  return listItem;
}

function createRemoveButton(): HTMLButtonElement {
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.style.background = 'red';

  return removeButton;
}

function handleRemoveButtonClick(listItem: HTMLLIElement): void {
  listItem.remove();
  updateLocalStorage();
  updateCompletedCount();
}

function handleTaskClick(task: Task, listItem: HTMLLIElement): void {
  task.isCompleted = !task.isCompleted;
  listItem.querySelector('span')?.classList.toggle('completed', task.isCompleted);
  updateLocalStorage();
  updateCompletedCount();
}

function addTask(taskInput: HTMLInputElement, deadlineInput: HTMLInputElement, taskList: HTMLElement): void {
  const text = taskInput.value;
  const deadlineDate = new Date(deadlineInput.value);
  if (text.trim() !== '' && !isNaN(deadlineDate.getTime())) {
    const task: Task = {
      id: Date.now().toString(),
      text,
      deadlineDate,
      isCompleted: false,
    };
    const listItem = createTask(task);
    taskList.appendChild(listItem);
    taskInput.value = '';
    deadlineInput.value = '';

    updateLocalStorage();
    updateCompletedCount();
  } else {
    alert('Please enter a valid task and deadline date');
  }
}

function updateLocalStorage(): void {//stores the data in a local storage
  const tasks = Array.from(document.querySelectorAll('#task-list li')).map((listItem) => {
    const taskText = listItem.querySelector('span')?.textContent || '';
    const deadlineText = listItem.querySelector('span:nth-child(2)')?.textContent || '';
    const isCompleted = listItem.querySelector('span')?.classList.contains('completed') || false;
    const deadlineDate = new Date(deadlineText.replace(' (Due: ', '').replace(')', ''));
    return {
      id: Date.now().toString(),
      text: taskText,
      deadlineDate,
      isCompleted,
    };
  });
  localStorage.setItem('dataList', JSON.stringify(tasks));
}

function renderTasks(): void {
  const taskList = document.getElementById('task-list') as HTMLElement;
  taskList.innerHTML = '';
  const storedTasks: Task[] = JSON.parse(localStorage.getItem('dataList') || '[]');

  // Sort tasks by deadline date
  storedTasks.sort((a, b) => {
    const dateA = new Date(a.deadlineDate).getTime();
    const dateB = new Date(b.deadlineDate).getTime();
    return isAscending ? dateA - dateB : dateB - dateA;
  });

  storedTasks.forEach((task) => {
    const listItem = createTask(task);
    taskList.appendChild(listItem);
  });
  checkAllTasksForOverdue();
  checkExpiredTasks();
  updateCompletedCount();
}

function checkAndMarkOverdueTask(listItem: HTMLLIElement, deadlineDate: Date): void {
  const now = new Date();
  if (deadlineDate < now) {
    listItem.style.color = 'red';
  }
}

function checkExpiredTasks(): void {//checks if the task is expired or not
  const tasks = Array.from(document.querySelectorAll('#task-list li'));
  const now = new Date();

  tasks.forEach((listItem) => {
    const deadlineText = listItem.querySelector('span:nth-child(2)')?.textContent || '';
    const deadlineDate = new Date(deadlineText.replace(' (Due: ', '').replace(')', ''));

    if (deadlineDate < now) {
      const expiredText = document.createElement('span');
      expiredText.textContent = 'Expired';
      
      expiredText.style.color = 'red';
      listItem.appendChild(expiredText);
    }
  });
}

function checkAllTasksForOverdue(): void {
  const tasks = Array.from(document.querySelectorAll('#task-list li'));
  tasks.forEach((listItem) => {
    const deadlineText = listItem.querySelector('span:nth-child(2)')?.textContent || '';
    const deadlineDate = new Date(deadlineText.replace(' (Due: ', '').replace(')', ''));
    checkAndMarkOverdueTask(listItem, deadlineDate);
  });
}

function updateCompletedCount(): void {//counter for the completed task
  const tasks = Array.from(document.querySelectorAll('#task-list li span.completed'));
  const completedCount = tasks.length;
  document.getElementById('completed-count')!.textContent = completedCount.toString();
}

// event listenr for add task button
document.getElementById('task-button')?.addEventListener('click', () => {
  const taskInput = document.getElementById('task') as HTMLInputElement;
  const deadlineInput = document.getElementById('deadline') as HTMLInputElement;
  const taskList = document.getElementById('task-list') as HTMLElement;
  addTask(taskInput, deadlineInput, taskList);
});

// Sort button event listener 
document.getElementById('sort-button')?.addEventListener('click', () => {
  isAscending = !isAscending;
  renderTasks();

  // Update button text to reflect current sort order to near deadline or far deadlien
  const sortButton = document.getElementById('sort-button') as HTMLButtonElement;
  sortButton.textContent = `Sort by Due Date (${isAscending ? 'near deadline' : 'far deadline'})`;
});

window.addEventListener('load', renderTasks);
