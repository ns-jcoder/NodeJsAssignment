//course_id.js


/*
  {
  	"course_name":"node js",
    "course_id": "121"
        
  }
*/

var bcrypt = require('bcryptjs');
var _ = require('underscore');



module.exports = function(sequelize, DataTypes) {
	var course = sequelize.define('course', {

		course_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [4, 20]
			}
		}
	}, {
		classMethods: {
			findByCourseName: function(courseName) {
				return new Promise(function(reslove, reject) {
					if (typeof courseName !== 'string') {
						return reject();
					}

					course.findOne({
						where: {
							course_name: courseName
						}
					}).then(function(course) {
						if (!course) {
							return reject();
						}
						reslove(course);

					}, function(e) {
						reject();
					});
				});
			},
			findByCourseId: function(courseId) {
				return new Promise(function(reslove, reject) {
					if (typeof courseId !== 'number') {
						return reject();
					}

					course.findOne({
						where: {
							id: courseId
						}
					}).then(function(course) {
						if (!course) {
							return reject();
						}
						reslove(course);

					}, function(e) {
						reject();
					});
				});
			}

		}
	});


	return course;
}