// Define variables for HTML elements
var taskInput = document.getElementById("new-task");
var addButton = document.getElementById("add-task");
var taskList = document.getElementById("task-list");
var taskCounter = 0;

// Define event listener for "Add" button
addButton.addEventListener("click", function(e) {
    // Prevent form submission
    e.preventDefault();

    // Get task description
    var taskDescription = taskInput.value.trim();

    // Check for empty task description
    if (!taskDescription) {
        alert("Task description cannot be empty.");
        return;
    }

    // Check for task description length
    if (taskDescription.length > 30) {
        alert("Task description cannot exceed 30 characters.");
        return;
    }

    // Increment task counter
    taskCounter++;

    // Create new task list item
    var newTask = document.createElement("li");
    // Add task description and buttons to list item
    newTask.innerHTML = `
        <span>${taskCounter}. ${taskDescription}</span>
        <button class="delete">Delete</button>
        <button class="up">Up</button>
        <button class="down">Down</button>
    `;
    // Add new task to task list
    taskList.appendChild(newTask);
    // Clear input field
    taskInput.value = "";

    // Bind event listeners to buttons
    var deleteButton = newTask.querySelector(".delete");
    var upButton = newTask.querySelector(".up");
    var downButton = newTask.querySelector(".down");
    deleteButton.addEventListener("click", deleteTask);
    upButton.addEventListener("click", moveUp);
    downButton.addEventListener("click", moveDown);

    // Update task numbering
    updateTaskNumbering();
});

// Define function to delete task
function deleteTask(e) {
    // Get the parent task list item
    var taskItem = e.target.parentNode;
    // Remove the task list item
    taskList.removeChild(taskItem);
    // Update task numbering
    updateTaskNumbering();
}

// Define function to move task up
function moveUp(e) {
    // Get the parent task list item
    var taskItem = e.target.parentNode;
    // Get the previous task list item
    var prevTaskItem = taskItem.previousSibling;
    // If there is a previous task item
    if (prevTaskItem) {
        // Move the task item before the previous task item
        taskList.insertBefore(taskItem, prevTaskItem);
        // Update task numbering
        updateTaskNumbering();
    }
}

// Define function to move task down
function moveDown(e) {
    // Get the parent task list item
    var taskItem = e.target.parentNode;
    // Get the next task list item
    var nextTaskItem = taskItem.nextSibling;
    // If there is a next task item
    if (nextTaskItem) {
        // Move the task item after the next task item
        taskList.insertBefore(nextTaskItem, taskItem);
        // Update task numbering
        updateTaskNumbering();
    }
}


function updateTaskNumbering() {
    var tasks = taskList.getElementsByTagName("li");
    for (var i = 0; i < tasks.length; i++) {
        tasks[i].querySelector("span").textContent = (i + 1) + ". " + tasks[i].querySelector("span").textContent.substr(2);
    }
}