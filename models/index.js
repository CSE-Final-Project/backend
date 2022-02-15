const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.User = require('./user')(sequelize, Sequelize);
// db.Study = require('./study')(sequelize, Sequelize);
// db.StudyTime = require('./studytime')(sequelize, Sequelize);

// /* user -> studytime: 1->N */
// db.User.hasMany(db.StudyTime, { foreignKey: 'user_id', sourceKey: 'id'});
// /* studytime -> user: N->1 */
// db.StudyTime.belongsTo(db.User, { foriegnKey: 'user_id', targetKey: 'id'});
// /* study -> studytime: 1->N */
// db.Study.hasMany(db.StudyTime, { foriegnKey: 'study_id', sourceKey: 'id'})
// /* studytime -> study: N->1 */
// db.StudyTime.belongsTo(db.Study, { foriegnKey: 'study_id', targetKey: 'id'})

module.exports = db;
