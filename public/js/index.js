// Get references to page elements
var $taskTitle = $("#task-title");

var $taskCompleteBy = $("#datetimepicker");
var $submitBtn = $("#submit");
var $taskList = $("#task-list");
var $taskCount = $("#task-count");

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
        
        var $br = $("<br>");

        var $li = $("<li>")
          .attr({
            class: "list-group-item",
            "data-id": task.id
          })
          .append($spanTitle)
          .append($spanDate)
          .append($br)
         

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
        
        var $br = $("<br>");

        var $li = $("<li>")
          .attr({
            class: "list-group-item",
            "data-id": task.id
          })
          .append($spanTitle)
          .append($spanDate)
          .append($br)
          

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
  });
};

// handleFormSubmit is called whenever we submit a new Task
// Save the new Task to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var task = {
    text: $taskTitle.val().trim(),
    
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
  
  $taskCompleteBy.val("");
};

//Edit an existing task
var editTask = function(){
  console.log("Edit task...");


  var listItem = this.parentNode;
  var editInput = listItem.querySelector("input[type=text]");
  var label = listItem.querySelector("label");

  var containsClass = listItem.classList.contains("editMode");


      //if the class pf parent is .editmode
  if (containsClass){
    //label text become the input's value  
    label.innerText = editInput.value;

  } else {
      //switch to .editmode
      //input value becomes the label's text
    editInput.vaule = label.innerText;
  }

  listItem.classList.toggle("editMode"); //toggle .editmode on the parent

}

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

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$taskList.on("click", ".delete", handleDeleteBtnClick);
$taskList.on("click", ".completed", handleCompBtnClick);
$taskList.on("click", ".edit", handleEditBtnClick);

displayTaskCount();
