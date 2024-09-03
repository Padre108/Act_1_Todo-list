function createTask(task: string): HTMLLIElement {
  const listItem = document.createElement('li');
  const taskText = document.createElement('span');
  const removeButton = createRemoveButton();

  taskText.textContent = task;
  listItem.appendChild(taskText);

  listItem.addEventListener('click', () => handleTaskClick(taskText));
  removeButton.addEventListener('click', (event) => {
    event.stopPropagation(); 
    handleRemoveButtonClick(listItem);
  });

  listItem.appendChild(removeButton);

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
}

function handleTaskClick(taskText: HTMLSpanElement): void {
  taskText.classList.toggle('completed');
}

function addTask(taskInput: HTMLInputElement, taskList: HTMLElement): void {
  if (taskInput && taskList) {
    const task = taskInput.value;
    if (typeof task === 'string' && task.trim() !== '') {// if it is string e append the input task to the ul
      const listItem = createTask(task);
      taskList.appendChild(listItem);
      taskInput.value = '';
    } else {
      alert('Please enter a valid task');
    }
  } else {
    alert('Please enter a task');
  }
}

document.getElementById('task-button')?.addEventListener('click', () => {
  const taskInput = document.getElementById('task') as HTMLInputElement;
  const taskList = document.getElementById('task-list') as HTMLElement;
  addTask(taskInput, taskList);
});
