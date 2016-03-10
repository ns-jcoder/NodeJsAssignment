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
db.course = sequelize.import(__dirname + '/models/course.js');
db.course_module = sequelize.import(__dirname + '/models/course_module.js');
db.course_module_subsection = sequelize.import(__dirname + '/models/course_module_subsection.js');


/*

{foreignKey: 'fk_companyname', targetKey: 'name'}
	Each course has many module 
	Each module should belong to a cousre 
*/
//db.course_module.belongsTo(db.course,{foreignKey: 'course_id', targetKey: 'course_id'});
db.course_module.belongsTo(db.course);
db.course.hasMany(db.course_module);

/*
	Each module has many subsection 
	Each subsection should belong to a cousre module
*/
db.course_module_subsection.belongsTo(db.course_module);
db.course_module.hasMany(db.course_module_subsection);


// db.course_module_subsection.belongsTo(db.course);
// db.course.hasMany(db.course_module_subsection);


db.Sequelize = Sequelize;
db.sequelize = sequelize;
//db.todo.belongsTo(db.user);
//.user.hasMany(db.todo);

module.exports = db;