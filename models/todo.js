module.exports = function(sequelize, DataTypes) {
  var Todos = sequelize.define("Todos", {
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },

    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    completeBy: DataTypes.DATEONLY,

    completedOn: DataTypes.DATEONLY
  });
  return Todos;
};
