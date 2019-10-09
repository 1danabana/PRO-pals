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
    db.Todos.create({
      text: req.body.text,
      description: req.body.text,
      complete: req.body.complete
    }).then(function(dbTasks) {
      res.json(dbTasks);
    });
  });

  // Delete an example by id
  app.delete("/api/tasks/:id", function(req, res) {
    db.Todos.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(function() {
        res.status(200).end();
      })
      .catch(function(err) {
        err.status(500).end();
      });
  });
  // PUT route for updating todos. We can get the updated todo data from req.body
  app.put("/api/tasks/:id", function(req, res) {
    // Use the sequelize update method to update a todo to be equal to the value of req.body
    // req.body will contain the id of the todo we need to update
    var updated = {};
    if (req.body.text) {
      updated.text = req.body.text;
    }
    if (req.body.complete) {
      updated.complete = req.body.complete;
    }
    console.log("updated", updated);
    console.log("req.params.id", req.params.id);
    db.Todos.update(updated, {
      where: {
        id: req.params.id
      }
    })
      .then(function(Tasks) {
        console.log("updated response", Tasks);
        res.json(Tasks);
      })
      .catch(function() {
        res.status(500).end();
      });
  });
};
