//employee.js
/*
  {
  	"emp_name":"james bond",
    "username":"bond007",
    "role": "user",
    "password": "poi564W3"
    
  }
*/

var bcrypt = require('bcryptjs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('employee', {
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [4, 20]
			}
		},
		emp_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [4, 20]
			}
		},
		role: { // Role could be either user or Admin

			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [4, 10]
			}
		},
		password: {
				type: DataTypes.VIRTUAL,
				allowNull: false,
				validate: {
					len: [7, 100]
				},
				set: function(value) {
					var salt = bcrypt.genSaltSync(10);
					var hashedPassword = bcrypt.hashSync(value, salt);
					this.setDataValue('password', value);
					this.setDataValue('salt', salt);
					this.setDataValue('password_hash', hashedPassword);
				}
			},

			salt: {
				type: DataTypes.STRING
			},
			password_hash: {
				type: DataTypes.STRING
			}
	});
};