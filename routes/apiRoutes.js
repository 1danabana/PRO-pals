var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/tasks", function(req, res) {
    db.Todos.findAll({}).then(function(dbTasks) {
      res.json(dbTasks);
    });
  });

  // Create a new example
  app.post("/api/tasks", function(req, res) {
    db.Todos.create(req.body).then(function(dbTasks) {
      res.json(dbTasks);
    });
  });

  // Delete an example by id
  app.delete("/api/tasks/:id", function(req, res) {
    db.Todos.destroy({ where: { id: req.params.id } }).then(function(dbTasks) {
      res.json(dbTasks);
    });
  });
};
