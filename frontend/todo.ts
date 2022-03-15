import TodoAPI from './TodoAPI'

const addButton : HTMLElement | null = document.getElementById("add-button") ;
const addInputArea = document.getElementById("add-input");
const addArea : HTMLElement | null = document.querySelector(".background__white-area__add-area");

 let taskCounter : number;

 addButton.addEventListener('click', addTaskToList);
 addArea.addEventListener("submit", clearTextByPressEnter);

 interface Task {
   _id: Number,
   text: String,
   checked: Boolean
 }

async function addTaskToList()  {
  if (addInputArea.nodeValue === '') {
    return;
  }

  const task = {
    checked: false,
    text: addInputArea.value
  };

  try {
    const createdTask = await TodoAPI.createTask(task);
    console.log(createdTask)

    renderTodo(createdTask);
    taskCounter++;
  } catch (error) {
    console.log("addTaskToList error " + error);
  }

}

function renderTodo(task : Task) : void {
  document.querySelector('.background__white-area__task-list').insertAdjacentHTML('beforeend', createHtmlBlockOfTask(task));
  document.getElementById(String(task._id)).addEventListener("click", () => taskDeleter(task._id));

  const checkboxContext = document.getElementById(task._id).previousElementSibling.childNodes[1];
  const inputboxContext = checkboxContext.nextElementSibling;

  inputboxContext.addEventListener("blur", () => updateTaskOnBlur(inputboxContext));

  renderCheckbox(checkboxContext, task.checked);
}
// function renderCheckbox(context, isChecked) {
//   context.addEventListener("click", async () => {
//     try {
//       await updateTaskOnCheck(context)
//     } catch (error) {
//       console.log("renderCheckbox error " + error)
//     }
//   });
//   context.checked = isChecked;
//   changeTextStyle(context);
// }
// async function taskDeleter(taskId) {
//   document.getElementById(taskId).parentElement.remove();
//   try {
//     await TodoAPI.deleteTask(taskId);
//   } catch(error) {
//     console.log(error)
//   }
//   taskCounter--;
// }
// function createHtmlBlockOfTask(task) {
//   return `<div class="background__white-area__task-list__task">\n` +
//     '                            <div class="background__white-area__task-list__task__left-part">\n' +
//     `                               <input type="checkbox" id="checkbox" class="background__white-area__task-list__task__checkbox checkbox">\n` +
//     `                                <div class="background__white-area__task-list__task__text" contenteditable="true">${task.text}</div>\n` +
//     '                            </div>\n' +
//     `                            <button id="${task._id}" class="background__white-area__task-list__task__delete-button button-style">Delete</button>\n` +
//     '                        </div>'
// }
// async function renderCounter() {
//   try {
//     const tasks = await TodoAPI.getAllTasks();
//     document.getElementById("number-of-tasks").innerText = tasks.length;
//   } catch(error) {
//     console.log("getCount error " + error)
//   }
// }
// function clearTextByPressEnter() {
//   event.preventDefault();
//   addButton.addEventListener('click', addTaskToList);
//   addInputArea.value = '';
// }
// async function updateTaskOnBlur(context) {
//   const taskId = context.parentNode.parentNode.lastElementChild.id;
//   const taskText = context.textContent;
//   const taskChecked = context.previousElementSibling.checked;
//
//   if (taskText.trim() === '') {
//     return;
//   }
//
//   try {
//     await TodoAPI.updateTasks(taskId, taskText, taskChecked);
//     changeTextStyle(context);
//   } catch (error) {
//     console.log("updateTaskOnCheck error " + error)
//   }
// }
// async function updateTaskOnCheck(context) {
//   try {
//     const taskId = context.parentNode.parentNode.lastElementChild.id;
//     const taskText = context.nextElementSibling.textContent
//     await TodoAPI.updateTasks(taskId, taskText, context.checked);
//     changeTextStyle(context);
//   } catch (error) {
//     console.log("updateTaskOnCheck error " + error)
//   }
//
// }
// function changeTextStyle(element) {
//   if (element.checked) {
//     element.parentNode.childNodes[3].style.textDecoration = "line-through";
//     element.parentNode.childNodes[3].style.color = "gray";
//   } else {
//     element.parentNode.lastElementChild.style.textDecoration = "none";
//     element.parentNode.childNodes[3].style.color = "black";
//   }
// }
// async function loadTaskList() {
//   try {
//     const tasks = await TodoAPI.getAllTasks();
//     tasks.forEach(task => renderTodo(task));
//     taskCounter = await renderCounter();
//     console.log(tasks)
//   } catch (error) {
//     console.log("loadTaskList error" + error)
//   }
// }
// document.addEventListener("DOMContentLoaded", loadTaskList)