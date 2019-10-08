var db = require("../models");
var moment = require("moment");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Todos.findAll({}).then(function(dbTasks) {
      res.render("index", {
        tasks: dbTasks,

        helpers: {
          formatDate: function(date) {
            return moment(date).format("MMMM D, YYYY");
          }
        }
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
