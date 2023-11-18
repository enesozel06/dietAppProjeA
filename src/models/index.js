const Dietician = require('./Dietician');
const DietMenu = require('./DietMenu');
const Post = require('./Post');
const Product = require('./Product');
const User = require('./User');

module.exports = () => {
  /** User-Post */
  User.hasMany(Post, { foreignKey: { name: 'userId' } });
  Post.belongsTo(User, { foreignKey: { name: 'userId' } });

  /** User-Dietician */
  User.belongsTo(Dietician, { foreignKey: { name: 'dieticianId' } });
  Dietician.hasMany(User, { foreignKey: { name: 'dieticianId' } });

  /** User-DietMenu */
  User.hasMany(DietMenu, { foreignKey: { name: 'userId' } });
  DietMenu.belongsTo(User, { foreignKey: { name: 'userId' } });
};
