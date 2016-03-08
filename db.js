//.js

var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'devlopment';
var sequelize;

if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/dev-assignment-api.sqlite'
	});

}
var db = {};
// loads sequelise model from diff files
db.employee = sequelize.import(__dirname + '/models/employees.js');
//db.user = sequelize.import(__dirname + '/models/user.js');
db.Sequelize = Sequelize;
db.sequelize = sequelize;
//db.todo.belongsTo(db.user);
//.user.hasMany(db.todo);

module.exports = db;