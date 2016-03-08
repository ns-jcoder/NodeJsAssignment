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


// POST /employees
app.post('/employees', function (req, res){
	var body = _.pick(req.body, 'username', 'role', 'password');

	body.id =  employeeId++;
	console.log('UserName is ',body.username);
	db.employee.create(body).then(function (employee){
		res.json(employee);
	}, function(e) {
		res.status(400).json(e);
	})

	//console.log('UserName is ',body.username);
	
});


// GET /employees/:id
app.get('/employees/:id', function (req, res) {


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
//GET /employees?role=user&q=bond
app.get('/employees', function(req, res) {

	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('role') && query.role === 'user') {
		where.role = 'user';
	} else if (query.hasOwnProperty('role') && query.role === 'user') {
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



db.sequelize.sync({force:true}).then(function() {
		app.listen(PORT,function(){
			 console.log('Assignment Express listening on port '+ PORT);
		});
});