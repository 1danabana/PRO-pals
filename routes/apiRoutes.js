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
    }).then(function(result) {
      res.status(200).end();
    })
    .catch(function(err){
      res.status(500).end();
    })
  });
 // PUT route for updating todos. We can get the updated todo data from req.body
 app.put("/api/tasks", function(req, res) {
  // Use the sequelize update method to update a todo to be equal to the value of req.body
  // req.body will contain the id of the todo we need to update
  db.Todo.update({
    text: req.body.text,
    complete: req.body.complete,
  },{
    where: {
      id: req.body.id,
    }
  }).then(function(Tasks){
    res.json(Tasks);
  }).catch(function(err){
    res.status(500).end();
  })
});
};
  