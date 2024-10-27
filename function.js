document.addEventListener("DOMContentLoaded", function () {
    const addTaskInput = document.getElementById("addtasks");
    const taskDateInput = document.getElementById("taskDate");
    const taskCategoryInput = document.getElementById("taskCategory");
    const addButton = document.getElementById("btn");
    const clearButton = document.getElementById("clearBtn");
    const searchInput = document.getElementById("search");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const taskList = document.getElementById("tasks");

    // Load tasks from Local Storage when the page loads
    loadTasks();

    // Add event listener to the "Add Task" button
    addButton.addEventListener("click", function () {
        const taskText = addTaskInput.value.trim();
        const taskDate = taskDateInput.value;
        const taskCategory = taskCategoryInput.value;

        if (taskText && taskDate) {
            addTaskToList(taskText, taskDate, taskCategory);
            saveTask(taskText, taskDate, taskCategory);
            addTaskInput.value = "";
            taskDateInput.value = "";
            taskCategoryInput.value = "";
        } else {
            alert("Please enter a task and select a date.");
        }
    });

    // Add event listener to the "Clear Tasks" button
    clearButton.addEventListener("click", function () {
        clearTasks();
    });

    // Add event listener for the search input
    searchInput.addEventListener("input", function () {
        filterTasks(searchInput.value);
    });

    // Add event listener for dark mode toggle
    darkModeToggle.addEventListener("change", function () {
        document.body.classList.toggle("dark-mode", darkModeToggle.checked);
    });

    // Function to add a task to the list in the DOM
    function addTaskToList(taskText, taskDate, taskCategory) {
        const newTask = document.createElement("li");

        // Create a checkbox for completion
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", function () {
            newTask.classList.toggle("completed", checkbox.checked);
            notifyDueDate(taskDate); // Notify when the task is completed
        });

        // Create a heading for the task
        const taskHeading = document.createElement("h5");
        taskHeading.textContent = `${taskText} (Category: ${taskCategory})`;

        // Create a span for the task date
        const taskDueDate = document.createElement("span");
        taskDueDate.textContent = ` (Due: ${taskDate})`;

        // Calculate the days left until the due date
        const daysLeft = calculateDaysLeft(taskDate);
        const daysLeftText = document.createElement("span");
        daysLeftText.textContent = ` - ${daysLeft} day(s) left`;

        // Append the checkbox, heading, date, and days left to the new task
        newTask.appendChild(checkbox);
        newTask.appendChild(taskHeading);
        newTask.appendChild(taskDueDate);
        newTask.appendChild(daysLeftText);

        // Append the new task to the task list
        taskList.appendChild(newTask);
    }

    // Function to calculate days left until the due date
    function calculateDaysLeft(dueDate) {
        const today = new Date();
        const due = new Date(dueDate);
        const timeDiff = due - today; // Difference in milliseconds
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days
        return daysLeft >= 0 ? daysLeft : 0; // Return 0 if the due date is past
    }

    // Function to save a task to Local Storage
    function saveTask(taskText, taskDate, taskCategory) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push({ text: taskText, date: taskDate, category: taskCategory });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Function to load tasks from Local Storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            addTaskToList(task.text, task.date, task.category);
        });
    }

    // Function to clear all tasks
    function clearTasks() {
        taskList.innerHTML = "";
        localStorage.removeItem("tasks");
    }

    // Function to filter tasks based on search input
    function filterTasks(searchTerm) {
        const tasks = taskList.getElementsByTagName("li");
        for (let task of tasks) {
            const text = task.textContent.toLowerCase();
            task.style.display = text.includes(searchTerm.toLowerCase()) ? "" : "none";
        }
    }

    // Function to notify user of task completion and due dates
    function notifyDueDate(dueDate) {
        const today = new Date();
        const due = new Date(dueDate);
        if (due.toDateString() === today.toDateString()) {
            alert("This task is due today!");
        }
    }
});
