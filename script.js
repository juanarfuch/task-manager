// Element selectors
const taskForm = document.querySelector("#task-form");
const taskName = document.querySelector("#task-name");
const taskDescription = document.querySelector("#task-description");
const dateInput = document.querySelector("#task-due-date");
const taskPriorityInput = document.querySelector("#task-priority");
const addTaskButton = document.querySelector("#add-task-button");
const taskList = document.querySelector("#task-list");
const filterPriority = document.querySelector("#filter-priority");
const filterStatus = document.querySelector("#filter-status")
let tasks = []
// Task class
class Task {
  constructor(task, desc, date, priority) {
    this.task = task;
    this.desc = desc;
    this.date = date;
    this.priority = priority;
    this.completed = false;
  }
  toggleCompleted() {
    this.completed = !this.completed;
  }
}




//Create elements functions
function createTaskTitle(task) {
  const taskTitle = document.createElement('h3');
  taskTitle.classList.add("task-title")
  taskTitle.textContent = task;
  return taskTitle;
}
function createTaskDescription(desc) {
  const taskDesc = document.createElement('p');
  taskDesc.textContent = desc;
  taskDesc.classList.add('task-description');
  return taskDesc;
}
function createTaskDueDate(date) {
  const taskDueDate = document.createElement('span');
  taskDueDate.textContent = `Due by: ${date}`;
  taskDueDate.classList.add('task-due-date');
  return taskDueDate;
}
function createExpandButton() {
  const expandButton = document.createElement('button');
  expandButton.textContent = 'Show/Hide Details';
  expandButton.classList.add('expand-button');
  return expandButton;
}
function createEditButton(){
  const editButton = document.createElement("button");
  editButton.textContent="Edit task";
  editButton.classList.add("edit-button");
  return editButton;

}
function createDoneButton(){
  const doneButton = document.createElement("button");
  doneButton.classList.add("done-button")
  doneButton.textContent = 'Done';
  return doneButton
}
function createDeleteButton() {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");
  return deleteButton;
}


//Managing tasks Functions
function getValues(){
  task =taskName.value;
  taskDesc=taskDescription.value;
  taskDueDate=dateInput.value;
  taskPriority = taskPriorityInput.value;
  valuesArray = [task, taskDesc, taskDueDate, taskPriority]
  return valuesArray
}
function createTask(task, desc, date, priority){
  const newTask = new Task(task, desc, date, priority)
  tasks.push(newTask)
  return tasks
}
function createElements(tasks){
  taskList.innerHTML= ""
  tasks.forEach(element => {
    const {task, desc, date, priority} = element;
    //the main taskDiv container
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-container');
    taskDiv.classList.add(priority);
    taskDiv.setAttribute("data-priority", priority)
    taskDiv.setAttribute("data-status", "pending")
    
    // Append task title, description, due date, expand button, and edit button \
    const taskTitle = createTaskTitle(task)
    taskDiv.appendChild(taskTitle);
    const taskDescElement = createTaskDescription(desc);
    taskDiv.appendChild(taskDescElement);
    const taskDueDateElement = createTaskDueDate(date);
    taskDiv.appendChild(taskDueDateElement);
    const expandButton = createExpandButton();
    taskDiv.appendChild(expandButton);
    const editButton = createEditButton();
    taskDiv.appendChild(editButton)
    const doneButton=createDoneButton();
    taskDiv.appendChild(doneButton);
    const deleteButton = createDeleteButton();
    taskDiv.appendChild(deleteButton);
    // Append the taskDiv to the taskList
    taskList.appendChild(taskDiv);
    toggleDone(element, taskTitle, taskDescElement, taskDueDateElement, taskDiv, doneButton, true);

    // Add click event listener to the expand/collapse button
    expandButton.addEventListener('click', () => {
    taskDescElement.classList.toggle('show');
    taskDueDateElement.classList.toggle('show');
    })
    // Add click event listener to the expand/collapse button
    doneButton.addEventListener('click',()=>{
      toggleDone(element, taskTitle,taskDescElement, taskDueDateElement, taskDiv, doneButton)
    })     
    deleteButton.addEventListener('click',()=>{
      removeElements(taskList, taskDiv, element)
    })
      
    //Edit button 
    editButton.addEventListener('click', () => {
      const editForm=createEditForm(task, desc, date, priority)
      taskDiv.innerHTML="";
      taskDiv.appendChild(editForm)
      editTask(editForm, element)
    });
    
  });

}

function updateTask(editForm, element){
  editForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const updatedTask = editForm.querySelector('#edit-task-name').value;
    const updatedDesc = editForm.querySelector('#edit-task-description').value;
    const updatedDate = editForm.querySelector('#edit-task-due-date').value;
    const updatedPriority = editForm.querySelector('#edit-task-priority').value;
    element.task = updatedTask;
    element.desc = updatedDesc;
    element.date = updatedDate;
    element.priority = updatedPriority;
    saveTasks()
    return createElements(tasks)
  })
}

function editTask(editForm, element){
  updateTask(editForm, element) 
}
function manageTasks(){
  const values = getValues()
  createTask(...values)
  createElements(tasks)
  taskForm.reset()
  filterPriority.value = "all"
  filterStatus.value = "all"
  saveTasks()
}


function removeElements(taskList, taskDiv, element){
  taskList.removeChild(taskDiv);
  const index = tasks.indexOf(element)
  tasks.splice(index,1)
  saveTasks()
}



//Edit Form
function createEditForm(task, desc, date, priority) {
  const form = document.createElement('form');
  form.classList.add('edit-form');
  form.innerHTML = `
    <label for="edit-task-name">Task Name:</label>
    <input type="text" id="edit-task-name" value="${task}" required>
    <label for="edit-task-description">Description:</label>
    <textarea id="edit-task-description" required>${desc}</textarea>
    <label for="edit-task-due-date">Due Date:</label>
    <input type="date" id="edit-task-due-date" value="${date}" required>
    <label for="edit-task-priority">Priority:</label>
    <select id="edit-task-priority" required>
      <option value="low" ${priority === 'low' ? 'selected' : ''}>Low</option>
      <option value="medium" ${priority === 'medium' ? 'selected' : ''}>Medium</option>
      <option value="high" ${priority === 'high' ? 'selected' : ''}>High</option>
    </select>
    <button type="submit">Update Task</button>
  `;
  return form;
}
// Funciones para alternar estado "done"
function toggleDone(element, title, desc, dueby, divTask, doneButton,applyOnly = false) {
  if(!applyOnly){
    element.toggleCompleted();
  }
  // Alternar clases y atributos en función del estado de "completed"
  const isCompleted = element.completed;
  const statusText = isCompleted ? "Undone" : "Done";
  const statusValue = isCompleted ? "completed" : "pending";

  title.classList.toggle("completed", isCompleted);
  desc.classList.toggle("completed", isCompleted);
  dueby.classList.toggle("completed", isCompleted);
  divTask.classList.toggle("completed", isCompleted);
  doneButton.classList.toggle("completed", isCompleted);

  doneButton.textContent = statusText;
  divTask.setAttribute("data-status", statusValue);

  if(!applyOnly){
  saveTasks();
  }
}
// Función de filtrado
function filter(){
  const priorityFilterValue = filterPriority.value;
  const statusFilterValue = filterStatus.value;
  const taskDiv = document.querySelectorAll(".task-container");


  taskDiv.forEach((taskItem)=>{
    const taskPriority = taskItem.getAttribute("data-priority")
    const taskStatus = taskItem.getAttribute("data-status")

  let display = true;

  if (priorityFilterValue !== "all" && priorityFilterValue !== taskPriority) {
    display = false;
  }
  if (statusFilterValue !== "all" && statusFilterValue !== taskStatus) {
    display = false;
  }
  taskItem.style.display = display ? "block" : "none";
})
}

// Funciones para guardar y cargar tareas del localStorage

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks.length = 0;
    const parsedTasks = JSON.parse(savedTasks);
    parsedTasks.forEach(taskObj => {
    const task = new Task(taskObj.task, taskObj.desc, taskObj.date, taskObj.priority);
    task.completed = taskObj.completed;
    tasks.push(task);
    });
  }
  createElements(tasks); // Llama a createElements() después de cargar las tareas del localStorage
}

//Event Listener
taskForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission behavior
  manageTasks();
  saveTasks()
});
filterPriority.addEventListener("change", filter)
filterStatus.addEventListener("change",filter)

loadTasks()



