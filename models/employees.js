//employee.js
/*
  {
  	"emp_name":"james bond",
    "username":"bond007",
    "emp_id": "A111",
    "role": "User",
    "password": "poi564W3"
    
  }
*/

var bcrypt = require('bcryptjs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes) {
	var employee = sequelize.define('employee', {
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
		emp_id: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [4, 20]
			}
		},
		role: { // Role could be either user or Admin

			type: DataTypes.ENUM('Admin', 'User')

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
	}, {
		classMethods: {
			findByEmployeeName: function(employeeName) {
				console.log('INSIDE module JS');
				return new Promise(function(reslove, reject) {
					if (typeof employeeName !== 'string') {
						return reject();
					}

					employee.findOne({
						where: {
							emp_name: employeeName
						}
					}).then(function(employee) {
						if (!employee) {
							return reject('No employee found with given id');
						}
						reslove(employee);

					}, function(e) {
						reject();
					});
				});
			},
			findByEmployeeId: function(employeeId) {
				console.log('INSIDE emp Id JS');

				return new Promise(function(reslove, reject) {
					if (typeof employeeId !== 'string') {
						return reject();
					}

					employee.findOne({
						where: {
							emp_id: employeeId
						}
					}).then(function(employee) {
						console.log("Emp object " + employee);
						if (!employee) {
							return reject('No employee found with given id');
						}
						reslove(employee);

					}, function(e) {
						reject();
					});
				});
			},
			checkAdmin: function(in_role) {
				console.log('Checking if user Exists with Admin role')
				return new Promise(function(reslove, reject) {
					//if (typeof in_role !=='')
					employee.findOne({
						where: {
							role: in_role
						}
					}).then(function(employee) {
						if (!employee) {
							return reslove('No employee found with Admin role');
						}
						console.log('Employee already Exists with Admin role, Cannot have more than one Admin!');
						reject('Employee already Exists with Admin role, Cannot have more than one Admin!');
					}, function(e) {
						reject();
					})
				});
			},

			checkExistingEmp: function(employeeId) {
				console.log('Check if user already exists with given emp_id')
				return new Promise(function(reslove, reject) {
					if (typeof employeeId !== 'string') {
						return reject();
					}

					employee.findOne({
						where: {
							emp_id: employeeId
						}
					}).then(function(employee) {
						if (!employee) {
							return reslove('No employee found with given id');
						}
						//reslove(employee);

						console.log('Employee already Exists with given employeeId, Cannot have more than one User with same employeeId!');
						reject('Employee already Exists with given employeeId, Cannot have more than one User with same employeeId!');
					}, function(e) {
						reject();
					})

				});
			},
			checkDeletion: function(employeeId) {
				// Admin cannot be deleted
				console.log('Checking if user Exists And is not Admin role')
				return new Promise(function(reslove, reject) {
					//if (typeof in_role !=='')

					if (typeof employeeId !== 'string') {
						return reject('Please pass proper AlphaNumeric employeeId');
					}

					employee.findOne({
						where: {
							role: in_role
						}
					}).then(function(employee) {
						if (!employee) {
							return reslove('No employee found with Admin role');
						}
						console.log('Employee already Exists with Admin role, Cannot have more than one Admin!');
						reject('Employee already Exists with Admin role, Cannot have more than one Admin!');
					}, function(e) {
						reject();
					})
				});
			}

		}
	});
	return employee
};