/* eslint-disable prettier/prettier */
var db = require("../models");
var moment = require("../node_modules/moment");

module.exports = function(app) {
  // Get all tasks
  app.get("/api/tasks", function(req, res) {
    db.Todos.findAll({}).then(function(dbTasks) {
      res.json(dbTasks);
    });
  });

  // Create a new task
  app.post("/api/tasks", function(req, res) {
    db.Todos.create(req.body).then(function(dbTasks) {
      res.json(dbTasks);
    });
  });

  // Delete a task by id
  app.delete("/api/tasks/:id", function(req, res) {
    db.Todos.destroy({ where: { id: req.params.id } }).then(function(dbTasks) {
      res.json(dbTasks);
    });
  });

  app.put("/api/tasks/:id", function(req, res) {
    db.Todos.update(
      {
        completed: true,
        completedOn: moment().format("MMMM D, YYYY")
      },
      {
        where: {
          id: req.params.id
        }
      }
    ).then(function(dbTasks) {
      res.json(dbTasks);
    });
  });
};
