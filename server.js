//server.js
var express = require('express');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var employeeId = 1;
//var middleware = require('./middleware.js')(db);

var app = express();
var PORT = process.env.PORT || 3000;
var employees = [];


app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Assignment API Root');
});

// ============================================================  Employee Functions Starts here ============================================================ //
// POST /employees
app.post('/employees', function(req, res) {
	var body = _.pick(req.body, 'emp_name', 'username', 'emp_id', 'role', 'password');

	//body.id = employeeId++;
	console.log('UserName is ', body.username);

	db.employee.checkExistingEmp(body.emp_id).then(function(employee) {
		if (body.role == 'Admin') {
			db.employee.checkAdmin(body.role).then(function(employee) {
					db.employee.create(body).then(function(employee) {
						res.json(employee);
					}, function(e) {
						res.status(400).json(e);
					})
				},
				function(e) {
					res.status(400).json(e)
				})
		} else if (body.role == 'User') {
			db.employee.create(body).then(function(employee) {
				res.json(employee);
			});
		} else {
			res.status(400).json({
				'Rejection Reason': 'Role should either be Admin or User (case sensitive)'
			});
		}
	}, function(e) {
		res.status(400).json(e)
	});


	//console.log('UserName is ',body.username);

});

// GET /employees/:id
app.get('/employees/:id', function(req, res) {


	var employeeId = parseInt(req.params.id, 10);
	db.employee.findById(employeeId).then(function(employee) {
		if (!!employee) {
			res.json(employee.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});

});


// GET /employees
//GET /employees?role=User&q=bond
app.get('/employees', function(req, res) {

	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('role') && query.role === 'User') {
		where.role = 'User';
	} else if (query.hasOwnProperty('role') && query.role === 'User') {
		where.role = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.username = {
			$like: '%' + query.q + '%'
		};
	}

	db.employee.findAll({
			where: where
		}).then(function(employees) {
			res.json(employees);
		}, function(e) {
			res.status(500).send();
		})
		// var queryParams = req.query;

});

//PUT  /employees/:id
app.put('/employees/:id', function(req, res) {
	var employeeId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'emp_name', 'username');
	var attributes = {};

	if (body.hasOwnProperty('emp_name')) {
		attributes.emp_name = body.emp_name;
	}

	if (body.hasOwnProperty('username')) {
		attributes.username = body.username;
	}

	db.employee.findById(employeeId).then(function(employee) {
		if (employee) {
			employee.update(attributes).then(function(employee) {
				res.json(employee.toJSON());

			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	});


});


// Delete  /employees/:id
app.delete('/employees/:id', function(req, res) {
	var employeeId = req.params.id;
	console.log('emp id to be deleted us ', employeeId);
	db.employee.findByEmployeeId(employeeId).then(function(employee) {
		if (employee.role === 'Admin') {
			
			res.status(404).json('EmployeeId belongs to Admin User hence cannot be deleted');
			return
		}

		db.employee.destroy({
			where: {
				emp_id: employeeId
			}
		}).then(function(rowsDeleted) {
			if (rowsDeleted === 0) {
				res.status(404).json({
					error: 'No employee with given id'
				});
			} else {
				res.status(204).send();
			}
		}, function() {
			res.status(500).send();
		});

	}, function(e) {
		res.status(400).json(e)
	});


});

// ============================================================  Employee Functions Ends here ============================================================ //



// ============================================================  course Functions Starts here ============================================================ //

/*
  {
  	"course_name":"NodeJs",
    "subsection_id":"107",    
    "subsection_start_date": "poi564W3",
    "subsection_end_date": "poi564W3"
    
  }
*/


app.post('/addCourses', function(req, res) {
	var body = _.pick(req.body, 'course_name');


	console.log('Course Name is ', body.course_name);
	db.course.create(body).then(function(course) {
		res.json(course);
	}, function(e) {
		res.status(400).json(e);
	})


});


// ============================================================  course Functions Ends here ============================================================ //



// ============================================================  course_module Functions Starts here ============================================================ //

/*
  {
  	"course_module_name":"ES-6",
     
    "course_name": "NodeJs"
       
  }
*/


app.post('/addCourseModules', function(req, res) {
	var body = _.pick(req.body, 'course_module_name', 'course_name');


	console.log('course_module_name is ', body.course_module_name);

	db.course.findByCourseName(body.course_name).then(function(course) {
		db.course_module.create({
			course_module_name: body.course_module_name,
			courseId: course.id,
			course_name: body.course_name
		});
		res.status(200).send('Created Module Successfully');

	}, function(e) {
		res.status(400).json(e);
	});
});


// ============================================================  course_module_subsection Functions Ends here ============================================================ //



// ============================================================  course_module_subsection Functions Starts here ============================================================ //

/*
  {
  	"subsection_name":"Array",
    "subsection_id":"ss_007",    
    "course_module_id": "Intro to Node JS",
    "course_name": "121",
    "comment":" Understand Arrays" 
    "subsection_start_date": "poi564W3",
    "subsection_end_date": "poi564W3"
    
  }
*/

//POST
app.post('/addCourseModuleSubsections', function(req, res) {
	var body = _.pick(req.body, 'emp_id', 'subsection_name', 'subsection_start_date', 'subsection_end_date', 'course_module_name', 'course_name');

	console.log('subsection_name is ', body.subsection_name);
	console.log('body.emp_id is ', body.emp_id);
	// console.log('course_name is ', body.course_name);

	db.employee.findByEmployeeId(body.emp_id).then(function(employee) {
		console.log(employee.role)
		if (employee.role == 'Admin') {
			db.course.findByCourseName(body.course_name).then(function(course) {

					console.log('Module id is', course.id);
					db.course_module.findByModuleName(body.course_module_name)
						.then(function(module) {
							console.log('Module id is :', module.id);
							db.course_module_subsection.create({
								subsection_name: body.subsection_name,
								//courseId: course.id,
								courseModuleId: module.id,
								subsection_start_date: body.subsection_start_date,
								subsection_end_date: body.subsection_end_date
							}).then(function(course_module_subsection) {
								res.json(course_module_subsection);
							}, function(e) {
								res.status(400).json(e);
							});

						}, function(e) {
							res.status(400).json(e);
						});
				},
				function(e) {
					res.status(400).json(e);
				});
		} else {
			res.status(404).send('Not Authoriezed to Created Sub Section ');
		}

	}, function(e) {
		res.status(400).json(e);
	});


});
// ============================================================  course_module_subsection Functions Ends here ============================================================ //


db.sequelize.sync({
	//force: true
}).then(function() {
	app.listen(PORT, function() {
		console.log('Assignment Express listening on port ' + PORT);
	});
});