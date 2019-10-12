// Get references to page elements
var $taskTitle = $("#task-title");
var $taskDescription = $("#task-description");
var $taskCompleteBy = $("#datetimepicker");
var $submitBtn = $("#submit");
var $taskList = $("#task-list");
var $taskCount = $("#task-count");
var $livesCount = $("#lives-count");

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
  getTasks: function() {
    return $.ajax({
      url: "api/tasks",
      type: "GET"
    });
  },
  getTask: function(id) {
    return $.ajax({
      url: "api/tasks/" + id,
      type: "GET"
    });
  },
  deleteTask: function(id) {
    return $.ajax({
      url: "api/tasks/" + id,
      type: "DELETE"
    });
  },
  completeTask: function(id) {
    return $.ajax({
      url: "api/tasks/" + id,
      type: "PUT"
    });
  },
  getLives: function() {
    return $.ajax({
      url: "api/lives",
      type: "GET"
    });
  },
  updateLives: function() {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      url: "api/lives/1",
      type: "PUT",
      data: JSON.stringify(updatedLives)
    });
  }
};

// refreshTasks gets new Tasks from the db and repopulates the list
var refreshTasks = function() {
  API.getTasks().then(function(data) {
    var $tasks = data.map(function(task) {
      if (!task.completed) {
        var $spanTitle = $("<span>").text(task.text);
        var $spanDate = $("<span>")
          .text(
            "Complete by: " + moment(task.completeBy).format("MMMM D, YYYY")
          )
          .attr({ class: "float-right" });
        var $spanDescription = $("<span>").text(task.description);
        var $br = $("<br>");

        var $li = $("<li>")
          .attr({
            class: "list-group-item",
            "data-id": task.id
          })
          .append($spanTitle)
          .append($spanDate)
          .append($br)
          .append($spanDescription);

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
      } else {
        var $spanTitle = $("<span>")
          .text(task.text)
          .css("text-decoration", "line-through");
        var $spanDate = $("<span>")
          .text(
            "Complete by: " + moment(task.completeBy).format("MMMM D, YYYY")
          )
          .attr({ class: "float-right" })
          .css("text-decoration", "line-through");
        var $spanDescription = $("<span>")
          .text(task.description)
          .css("text-decoration", "line-through");
        var $br = $("<br>");

        var $li = $("<li>")
          .attr({
            class: "list-group-item",
            "data-id": task.id
          })
          .append($spanTitle)
          .append($spanDate)
          .append($br)
          .append($spanDescription);

        var $compDate = $("<span>")
          .addClass("float-right")
          .text("Completed on: " + moment().format("MMMM D, YYYY"));

        $li.append($compDate);

        return $li;
      }
    });

    $taskList.empty();
    $taskList.append($tasks);
    displayTaskCount();
    displayLives();
  });
};

// handleFormSubmit is called whenever we submit a new Task
// Save the new Task to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var task = {
    text: $taskTitle.val().trim(),
    description: $taskDescription.val().trim(),
    completeBy: $taskCompleteBy.val().trim()
  };

  if (!task.text) {
    alert("You must enter a task!");
    return;
  } else if (!task.completeBy) {
    alert("You must enter a completion date!");
  }

  API.saveTask(task).then(function() {
    refreshTasks();
  });

  $taskTitle.val("");
  $taskDescription.val("");
  $taskCompleteBy.val("");
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

var handleCompBtnClick = function() {
  var taskID = $(this)
    .parent()
    .attr("data-id");

  API.completeTask(taskID).then(function() {
    API.getTask(taskID).then(function(task) {
      if (moment(task.completeBy).isBefore(task.completedOn)) {
        API.getLives().then(function(data) {
          var lives = data[0].lives;
          lives--;
          updatedLives = {
            lives: lives
          };
          API.updateLives(updatedLives).then(function() {
            displayLives();
          });
        });
      }
    });
    refreshTasks();
  });
};

var handleEditBtnClick = function() {
  console.log("BUTTON CLICKED!");
};

var displayTaskCount = function() {
  var taskCount = 0;
  API.getTasks().then(function(data) {
    for (var i = 0; i < data.length; i++) {
      if (!data[i].completed) {
        taskCount++;
      }
    }
    $taskCount.text("Tasks Remaining: " + taskCount);
  });
};

var displayLives = function() {
  API.getLives().then(function(data) {
    var lives = data[0].lives;
    $livesCount.text("Lives Remaining: " + lives + "/9");
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$taskList.on("click", ".delete", handleDeleteBtnClick);
$taskList.on("click", ".completed", handleCompBtnClick);
$taskList.on("click", ".edit", handleEditBtnClick);

displayTaskCount();
displayLives();
