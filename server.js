var express = require('express');
var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var _ = require('underscore');
var bcrypt = require('bcryptjs');
// var passport = require('passport');
// var session = require('express-session');
// var SequelizeStore = require('connect-session-sequelize')(session.Store);
// var LocalStrategy = require('passport-local').Strategy;

var db = require('./models/index.js');

var app = express();

var PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// passport.use('local', new LocalStrategy(
// 	function(username, password, done){
// 		console.log('hi')
// 		User.findOne( {where: { username: username} } ).then(function(user){
// 			if (!user) {
// 				return done(null, false);
// 			}
// 			if (!user.username){
// 				return done(null, false);
// 			}
// 			bcrypt.compare(password, user.password, function(err, result){
// 				if (result){
// 					return done(null, false);
// 				}
// 			})
// 			return done(null, user);
// 		})
// 		.catch(function(err){
// 			throw err;
// 		})
// 	}
// ));

// passport.serializeUser(function(user, cb){
// 	console.log("hi there", user.id)
// 	cb(null, user.id);
// });

// passport.deserializeUser(function(id, cb){
// 	User.findOne( { where: {id: id} }).then(function(user){
// 		cb(null, user);
// 	}).catch(function(err){
// 		if (err){
// 			return cb(err);
// 		}
// 	});
// });

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(session({
// 	secret: 'keyboard cat',
// 	store: new SequelizeStore({
// 		db: db
// 	}),
// 	resave: false,
// 	saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// app.get('/', function(req,res){
// 	if (req.user){
// 	console.log(req.user);
// 	console.log(req.user.email);
// 	res.render('home', { name: req.user.username});
//     } else {
//     res.redirect('/users');
// 	}
// });

app.get('/', function(req,res){
	res.render('mainpage');
})

app.get('/users', function(req,res){
	res.render('create');
});

app.get('/users/login', function(req,res){
	res.render('login');
});

// // app.post('/login', passport.authenticate('local', { 
// 	successRedirect: '/', 
// 	failureRedirect: '/login'}));

app.post('/users', function(req,res){ 
	var body = _.pick(req.body,'username','email', 'password');
	db.user.create(body).then(function(user){
		// res.json(user.toPublicJSON());
		res.redirect('/users/login');
	}, function(e) {
		res.redirect('/users');
		// res.render('create', "Username is taken")
		// res.status(400).json(e);
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
			res.redirect('/users/login');
			return res.status(401).send();
		}
		res.render('home', { name: user.username});
		// res.json(user.toPublicJSON);
	}, function(e){
		res.status(500).send();
	})
});

db.sequelize.sync().then(function(){
	app.listen(PORT, function(){
		console.log("listening on Port " + PORT);
	});
});