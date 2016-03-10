//course_module_subsection.js
/*
  {
  	"subsection_name":"Array",
    "subsection_id":"ss_007",    
    "course_module_id": "Intro to Node JS",
    "course_id": "121",
    "comment":" Understand Arrays" 
    "subsection_start_date": "poi564W3",
    "subsection_end_date": "poi564W3"
    
  }
*/
var _ = require('underscore');


module.exports = function(sequelize, DataTypes) {
	return sequelize.define('course_module_subsection', {

		// subsection_id: {
		// 	type: DataTypes.INTEGER,
		// 	allowNull: false,
		// 	primaryKey : true
		// },
		subsection_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [4, 20]
			}
		},
		// course_name: {
		// 	type: DataTypes.STRING,
		// 	allowNull: false,
		// 	validate: {
		// 		len: [4, 20]
		// 	}
		// },
		// module_name: {
		// 	type: DataTypes.STRING,
		// 	allowNull: false,
		// 	validate: {
		// 		len: [4, 20]
		// 	}
		// },
		// course_module_id: {
		// 	type: DataTypes.INTEGER,
		// 	allowNull: false
		// },
		// course_id: {
		// 	type: DataTypes.INTEGER,
		// 	allowNull: false
		// },
		subsection_start_date: {
			type: DataTypes.DATE,
			default: new Date()
		},
		subsection_end_date: {
			type: DataTypes.DATE,
			default: new Date()
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: true,
			validate: {
				len: [4, 250]
			}
		}


	});
};