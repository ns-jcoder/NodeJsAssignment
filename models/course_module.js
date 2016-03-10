/* 
 {
    "course_module_id": "cm001",
    "course_id": "cc1",
    "course_module_name": "Intro to Array"   
    
  }
  */
var _ = require('underscore');
var bcrypt = require('bcryptjs');



module.exports = function(sequelize, DataTypes) {
	var course_module = sequelize.define('course_module', {


		course_module_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [4, 25]
			}
		},
		course_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [4, 25]
			}
		}
	}, {
		classMethods: {
			findByModuleName: function(moduleName) {
				console.log('INSIDE module JS');
				return new Promise(function(reslove, reject) {
					if (typeof moduleName !== 'string') {
						return reject();
					}

					course_module.findOne({
						where: {
							course_module_name: moduleName
						}
					}).then(function(course_module) {
						if (!course_module) {
							return reject();
						}
						reslove(course_module);

					}, function(e) {
						reject();
					});
				});
			},
			findByModuleId: function(moduleId) {
				return new Promise(function(reslove, reject) {
					if (typeof moduleId !== 'number') {
						return reject();
					}

					course_module.findOne({
						where: {
							id: moduleId
						}
					}).then(function(module) {
						if (!course_module) {
							return reject();
						}
						reslove(course_module);

					}, function(e) {
						reject();
					});
				});
			}

		}
	});
	return course_module;
};