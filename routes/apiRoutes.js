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

  //Get one task
  app.get("/api/tasks/:id", function(req, res) {
    db.Todos.findOne({ where: {id: req.params.id } }).then(function(dbTasks) {
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

  // Mark task complete by id
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

  // Get current lives count
  app.get("/api/lives", function(req, res) {
    db.Lives.findAll({}).then(function(dbLives) {
      res.json(dbLives);
    });
  });

  // Update lives count
  app.put("/api/lives/:id", function(req, res) {
    db.Lives.update(
      {lives: req.body.lives}, {where: {id: req.params.id}}
    ).then(function(dbLives) {
      res.json(dbLives);
    });
  });

};
