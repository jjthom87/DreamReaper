var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var _ = require('underscore');
var bcrypt = require('bcryptjs');
var db = require('./models/index.js');
var middleware = require('./middleware.js')(db);
var app = express();
var userArray = [];//should be in another file
var methodOverride = require('method-override');

var PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride('_method'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/static', express.static('public'));

var username;//should be in another file
var data;//should be in another file

app.get('/', function(req,res){
	res.render('mainpage');
})

app.get('/users', function(req,res){
	res.render('create');
});

app.get('/login', function(req,res){
	res.render('login');
});

app.get('/homepage', middleware.requireAuthentication, function(req,res){
	var query = req.query;
	var where = {
		userId: req.user.get('id')
	};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	for(var i = 0; i < userArray.length; i++){
		username = userArray[i].username;
	}
	res.render('home', { name: username});
})

app.post('/dreams', middleware.requireAuthentication, function(req,res){
	// var body = _.pick(req.body, 'description');
	db.dream.create({
		description: req.body.dream
	}).then(function(dream){
		req.user.addDream(dream).then(function(){
			return dream.reload();
			// res.redirect('/homepage');
		}).then(function(dream){
			// res.redirect('/homepage');
			res.json(dream.toJSON());
		})
	})
	// db.dream.create({
	// 	description: req.body.dream
	// }).then(function(success){
	// 	res.redirect('/homepage');
	// });
});

app.post('/users', function(req,res){ 
	var body = _.pick(req.body,'username','email', 'password');
	db.user.create(body).then(function(user){
		// res.json(user.toPublicJSON()).redirect('/login');
		res.redirect('/login');
	}, function(e) {
		res.redirect('/users');
		// res.render('create', "Username is taken")
		// res.status(400).json(e).redirect('/users');
	});
});

app.post('/users/login', function(req,res) {
	// db.user.authenticate(body).then(function(){
	// 	// res.render('home', { name: user.username});
	// 	console.log(body);
	// 	res.json(user.toPublicJSON());
	// }, function(){
	// 	// res.redirect('/users/login');
	// 	res.status(401).send();
	// });
// 	if(typeof body.email !== 'string' || typeof body.password !== "string") {
// 		return res.status(400).send();
// 	}
// 	db.user.findOne({
// 		where: {
// 			email: body.email
// 		}
// 	}).then(function(user){ 
// 		if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
// 			res.redirect('/users/login');
// 			return res.status(401).send();
// 		}
// 		userArray.push(user);
// 		// res.header('Auth', user.generateToken('authentication')).res.json(user);
// 		// res.header('Auth', user.generateToken('authentication')).json(user.toPublicJSON);
// 		res.header('Auth', user.generateToken('authentication'))
// 		// res.redirect('/homepage');
// 	}, function(e){
// 		// res.status(500).send();
// 		res.redirect('/homepage');
// 	})
// });
	var body = _.pick(req.body, 'email', 'password');
	var userInstance;

	db.user.authenticate(body).then(function (user) {
		var token = user.generateToken('authentication');
		userInstance = user;

		return db.token.create({
			token: token
		});
	}).then(function (tokenInstance) {
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
		// res.header('Auth', tokenInstance.get('token')).redirect('/homepage');
	}).catch(function () {
		res.status(401).send();
	});
});

db.sequelize.sync().then(function(){
	app.listen(PORT, function(){
		console.log("listening on Port " + PORT);
	});
});