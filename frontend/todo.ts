import TodoAPI from './TodoAPI'

const addButton : HTMLButtonElement = document.getElementById("add-button") ;
const addInputArea : HTMLInputElement = document.getElementById("add-input");
const addArea : HTMLElement = document.querySelector(".background__white-area__add-area");

 let taskCounter : number;

 addButton.addEventListener('click', addTaskToList);
 addArea.addEventListener("submit", clearTextByPressEnter);

 interface Task {
   _id: string,
   text: string,
   checked: boolean
 }

async function addTaskToList()  {
  if (addInputArea.value === '') {
    return;
  }

  const task = {
    checked: false,
    text: addInputArea.value
  };

  try {
    const createdTask = await TodoAPI.createTask(task);

    renderTodo(createdTask);

    taskCounter++;
  } catch (error) {
    console.log("addTaskToList error " + error);
  }

}

function renderTodo(task : Task) : void {
  document.querySelector('.background__white-area__task-list').insertAdjacentHTML('beforeend', createHtmlBlockOfTask(task));
  document.getElementById(String(task._id)).addEventListener("click", () => taskDeleter(task));

  const checkboxContext : HTMLInputElement = document.getElementById(task._id).previousElementSibling.childNodes[1];
  const inputboxContext : HTMLInputElement = checkboxContext.nextElementSibling;

  inputboxContext.addEventListener("blur", () => updateTaskOnBlur(inputboxContext));

  renderCheckbox(checkboxContext, task.checked);
}
function renderCheckbox(checkboxContext : HTMLInputElement, isChecked) {
  checkboxContext.addEventListener("click", async () => {
    try {
      await updateTaskOnCheck(checkboxContext)
    } catch (error) {
      console.log("renderCheckbox error " + error)
    }
  });
  checkboxContext.checked = isChecked;
  changeTextStyle(checkboxContext);
}
async function taskDeleter(task : Task) {
  document.getElementById(task._id).parentElement.remove();
  try {
    await TodoAPI.deleteTask(task._id);
  } catch(error) {
    console.log(error)
  }
  taskCounter--;
}
function createHtmlBlockOfTask(task : Task) {
  return `<div class="background__white-area__task-list__task">\n` +
    '                            <div class="background__white-area__task-list__task__left-part">\n' +
    `                               <input type="checkbox" id="checkbox" class="background__white-area__task-list__task__checkbox checkbox">\n` +
    `                                <div class="background__white-area__task-list__task__text" contenteditable="true">${task.text}</div>\n` +
    '                            </div>\n' +
    `                            <button id="${task._id}" class="background__white-area__task-list__task__delete-button button-style">Delete</button>\n` +
    '                        </div>'
}
async function renderCounter() : Promise<number> {
  try {
    const tasks = await TodoAPI.getAllTasks();
    return document.getElementById("number-of-tasks").innerText = tasks.length;
  } catch(error) {
    console.log("getCount error " + error)
  }
}
function clearTextByPressEnter() {
  event.preventDefault();
  addButton.addEventListener('click', addTaskToList);
  addInputArea.value = '';
}
async function updateTaskOnBlur(inputContext : HTMLInputElement) {
  const checkboxContext : HTMLInputElement = inputContext.previousElementSibling;
  const buttonContext : HTMLButtonElement = inputContext.parentNode.parentNode.lastElementChild;
  const taskId = buttonContext.id;
  const taskText = inputContext.textContent;

  const isChecked = checkboxContext.checked;

  if (taskText.trim() === '') {
    return;
  }

  try {
    await TodoAPI.updateTasks(taskId, taskText, isChecked);
    changeTextStyle(inputContext);
  } catch (error) {
    console.log("updateTaskOnCheck error " + error)
  }
}
async function updateTaskOnCheck(context : HTMLInputElement) {
  try {
    const taskId = context.parentNode.parentNode.lastElementChild.id;
    const taskText = context.nextElementSibling.textContent
    await TodoAPI.updateTasks(taskId, taskText, context.checked);
    changeTextStyle(context);
  } catch (error) {
    console.log("updateTaskOnCheck error " + error)
  }

}
function changeTextStyle(element : HTMLInputElement) {
  const inputElement : HTMLInputElement = element.parentNode.lastElementChild
  if (element.checked) {
      inputElement.style.textDecoration = "line-through";
      inputElement.style.color = "gray";
  } else {
    inputElement.style.textDecoration = "none";
    inputElement.style.color = "black";
  }
}
async function loadTaskList() {
  try {
    const tasks = await TodoAPI.getAllTasks();
    tasks.forEach(task => renderTodo(task));
    taskCounter = await renderCounter();
    console.log(tasks)
  } catch (error) {
    console.log("loadTaskList error" + error)
  }
}
document.addEventListener("DOMContentLoaded", loadTaskList)