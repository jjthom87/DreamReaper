var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var _ = require('underscore');
var bcrypt = require('bcryptjs');
var db = require('./models/index.js');
var middleware = require('./middleware.js')(db);
var app = express();
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

var userInfo;
var enteredDreams;
var user = db.user
var dream = db.dream;
var data;


app.get('/', function(req,res){
	res.render('home');
})

app.get('/users', function(req,res){
	res.render('create');
});

app.get('/login', function(req,res){
	res.render('login');
});

app.get('/homepage', function(req,res){
	dream.findAll({where: {userId: userInfo.id}}).then(function(success){
		enteredDreams = success;
	})
	data = {
		name: username,
		dream: enteredDreams
	}
	res.render('home', { data: data });
});


app.post('/dreams', function(req,res){
	// var body = _.pick(req.body, 'description');

	user.findOne({where: {id: userInfo.id}}).then(function(){
		dream.create({
			description: req.body.dream
		}).then(function(dream){
			userInfo.addDream(dream).then(function(){
				dream.reload().then(function(dream){
					// res.redirect('/homepage');
				})
			})
		})
	});

	// db.dream.create({
	// 	description: req.body.dream
	// }).then(function(dream){
	// 	db.user.addDream(dream).then(function(){
	// 		return dream.reload();
	// 		// res.redirect('/homepage');
	// 	}).then(function(dream){
	// 		// res.redirect('/homepage');
	// 		res.json(dream.toJSON());
	// 	})
	// })

	// db.dream.create({
	// 	description: req.body.dream
	// }).then(function(success){
	// 	res.redirect('/homepage');
	// });
});

app.post('/users', function(req,res){ 
	var body = _.pick(req.body,'username','email', 'password');
	db.user.create(body).then(function(user){
		res.redirect('/login');
	}, function(e) {
		res.redirect('/users');
	});
});

app.post('/users/login', function(req,res) {
	var body = _.pick(req.body, 'email', 'password');

	if(typeof body.email !== 'string' || typeof body.password !== "string") {
		return res.status(400).send();
	}
	db.user.findOne({
		where: {
			email: body.email
		}
	}).then(function(user){ 
		if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
			res.redirect('/login');
			return res.status(401).send();
		}
		username = user.username;
		userInfo = user;
		res.redirect('/homepage');
	}, function(e){
		res.status(500).send();
	})
});


db.sequelize.sync().then(function(){
	app.listen(PORT, function(){
		console.log("listening on Port " + PORT);
	});
});