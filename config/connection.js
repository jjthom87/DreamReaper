// var Sequelize = require("sequelize");

// var source = {

// 	localhost: {
// 		part: 3306,
// 		host: 'localhost',
// 		user: 'root',
// 		password: "",
// 		database: "dreamuser2"
// 	},
// 	jawsDB: {
// 		port: 3306,
// 		host: 'uoa25ublaow4obx5.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
// 		user: 'ejphf4ptfrzr9rq4',
// 		password: 'xedib3xkud77fdoe',
// 		database: 'h66tuvpi4nssri86'
// 	}
// }

// var selectedSource - source.jawsDB;

// var sequelize = new Sequelize(selectedSource.database, selectedSource.user, selectedSource.password, {
// 	host: selectedSource.host,
// 	dialect: 'mysql',

// 	pool: {
// 		max: 5,
// 		min: 0,
// 		idle: 10000
// 	},
// });

// module.exports = sequelize;

// var Sequelize = require("sequelize");
// var mysql = require('mysql');

// var connection;

// if (process.env.JAWSDB_URL){
// 	connection = new Sequelize(process.env.JAWSDB_URL);
// } else {
// 	connection = new Sequelize({
// 		host: 'localhost',
// 		user: 'root',
// 		password: '',
// 		database: 'dreamuser2'
// 	});
// };

// module.exports = connection;