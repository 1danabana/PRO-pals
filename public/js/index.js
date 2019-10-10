// Get references to page elements
var $taskTitle = $("#task-title");
var $taskDescription = $("#task-description");
var $submitBtn = $("#submit");
var $taskList = $("#task-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveTask: function(task) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/tasks",
      data: JSON.stringify(task)
    });
  },
  updateTask: function(task) {
    return $.ajax({
      url: "/api/tasks/" + task.id,
      method: "UPDATE",
      // data: task
      data: JSON.stringify(task)
    });
  },
  completedTask: function() {
    console.log("here");
  },
  getTasks: function() {
    return $.ajax({
      url: "api/tasks",
      type: "GET"
    });
  },
  deleteTask: function(id) {
    return $.ajax({
      url: "api/tasks/" + id,
      type: "DELETE"
    });
  }
};

// refreshTasks gets new Tasks from the db and repopulates the list
var refreshTasks = function() {
  API.getTasks().then(function(data) {
    var $tasks = data.map(function(task) {
      var $p = $("<p>").text(task.text);
      var $span = $("<span>").text(task.description);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": task.id
        })
        .append($p)
        .append($span);

      var $delbutton = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      var $compbutton = $("<button>")
        .addClass("btn btn-success float-right completed")
        .html("&#10003;");

      var $edbutton = $("<button>")
        .addClass("btn btn-info float-right edit")
        .html("&#9998;");

      $li.append($delbutton);
      $li.append($compbutton);
      $li.append($edbutton);

      return $li;
    });

    $taskList.empty();
    $taskList.append($tasks);
  });
};

// handleFormSubmit is called whenever we submit a new Task
// Save the new Task to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var task = {
    text: $taskTitle.val().trim(),
    description: $taskDescription.val().trim()
  };

  if (!task.text) {
    alert("You must enter a task!");
    return;
  }

  API.saveTask(task).then(function() {
    refreshTasks();
  });

  $taskTitle.val("");
  $taskDescription.val("");
};

// handleDeleteBtnClick is called when an Task's delete button is clicked
// Remove the Task from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteTask(idToDelete).then(function() {
    refreshTasks();
  });
};

// eslint-disable-next-line no-unused-vars
var handleCompletedBtnClick = function() {
  console.log(this);
  // eslint-disable-next-line no-unused-vars
  var idToCompleted = $(this)
    .parent()
    .attr("data-id");

  // API.updateTask({
  //   id,
  //   complete: true
  // }).then(function(res) {
  //   console.log('COMPLETED TASK UPDATE');
  //   refreshTasks();
  API.completedTask(idToCompleted).then(function() {
    refreshTasks();
  });
  // });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$taskList.on("click", ".delete", handleDeleteBtnClick);
$taskList.on("click", ".completed", handleCompletedBtnClick);
