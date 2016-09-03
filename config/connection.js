var Sequelize = require("sequelize");
var mysql = require('mysql');

var connection;

if (process.env.JAWSDB_URL){
	connection = newSequelize(process.env.JAWSDB_URL);
} else {
	connection = newSequelize({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'dreamuser2'
	})
}

module.exports = connection;