module.exports = function(sequelize, DataTypes) {
  var Todos = sequelize.define("Todos", {
    text: DataTypes.STRING,
    description: DataTypes.TEXT,
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  return Todos;
};
