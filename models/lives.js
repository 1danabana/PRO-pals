module.exports = function(sequelize, DataTypes) {
  var Lives = sequelize.define("Lives", {
    lives: {
      type: DataTypes.INTEGER,
      defaultValue: 9
    }
  });
  return Lives;
};
